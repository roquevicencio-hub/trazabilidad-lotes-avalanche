"use client";

import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useReadContracts,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { useQueryClient } from "@tanstack/react-query";
import { zeroHash, type Hex } from "viem";
import { abi } from "@/lib/abi";
import { CONTRACT_ADDRESS, addressUrl, txUrl } from "@/lib/config";

const TIPOS = ["Creación", "Etapa", "Traspaso", "Incidencia", "Cierre"];

const corto = (a?: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "");
const fecha = (s: bigint) => new Date(Number(s) * 1000).toLocaleString("es-CL");

// Huella SHA-256 de un archivo (32 bytes): lo único que se guarda en la blockchain.
async function huellaDeArchivo(file: File): Promise<Hex> {
  const buf = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buf);
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `0x${hex}` as Hex;
}

type Accion = "etapa" | "traspaso" | "incidencia" | "cierre";

export default function Page() {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending: conectando } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: cambiando } = useSwitchChain();
  const queryClient = useQueryClient();

  const redIncorrecta = isConnected && chainId !== avalancheFuji.id;

  // ---- Lectura del contrato (gratis, no necesita wallet) ----
  const [loteIdTxt, setLoteIdTxt] = useState("1");
  const idValido = /^\d+$/.test(loteIdTxt) && BigInt(loteIdTxt) > 0n;
  const loteId = idValido ? BigInt(loteIdTxt) : 0n;

  const total = useReadContract({
    address: CONTRACT_ADDRESS, abi, functionName: "totalLotes", chainId: avalancheFuji.id,
  });
  const lote = useReadContract({
    address: CONTRACT_ADDRESS, abi, functionName: "obtenerLote", args: [loteId],
    chainId: avalancheFuji.id, query: { enabled: idValido },
  });
  const cantidad = useReadContract({
    address: CONTRACT_ADDRESS, abi, functionName: "cantidadEventos", args: [loteId],
    chainId: avalancheFuji.id, query: { enabled: idValido && !!lote.data },
  });
  const n = Number(cantidad.data ?? 0n);
  const eventos = useReadContracts({
    contracts: Array.from({ length: n }, (_, i) => ({
      address: CONTRACT_ADDRESS, abi, functionName: "obtenerEvento" as const,
      args: [loteId, BigInt(i)] as const, chainId: avalancheFuji.id,
    })),
    query: { enabled: n > 0 },
  });

  const esCustodio =
    !!address && !!lote.data && lote.data.custodio.toLowerCase() === address.toLowerCase();

  // ---- Escritura (cada acción es una transacción firmada con la wallet) ----
  const { writeContract, data: hash, isPending: firmando, error, reset } = useWriteContract();
  const recibo = useWaitForTransactionReceipt({ hash });
  useEffect(() => {
    if (recibo.isSuccess) queryClient.invalidateQueries();
  }, [recibo.isSuccess, queryClient]);

  const enviar = (functionName: string, args: unknown[]) => {
    reset();
    writeContract({ address: CONTRACT_ADDRESS, abi, functionName, args, chainId: avalancheFuji.id } as never);
  };

  const [producto, setProducto] = useState("");
  const [origen, setOrigen] = useState("");
  const [accion, setAccion] = useState<Accion>("etapa");
  const [ubicacion, setUbicacion] = useState("");
  const [detalle, setDetalle] = useState("");
  const [destino, setDestino] = useState("");
  const [huella, setHuella] = useState<Hex>(zeroHash);

  const ocupado = firmando || recibo.isLoading;
  const puedeOperar = isConnected && !redIncorrecta && !ocupado;

  const ejecutarAccion = () => {
    if (accion === "etapa") enviar("registrarEtapa", [loteId, ubicacion, detalle, huella]);
    if (accion === "traspaso") enviar("traspasarCustodia", [loteId, destino, detalle]);
    if (accion === "incidencia") enviar("reportarIncidencia", [loteId, detalle, huella]);
    if (accion === "cierre") enviar("cerrarLote", [loteId, detalle]);
  };

  return (
    <main>
      <h1>Trazabilidad de lotes</h1>
      <p className="sub">
        Cadena de custodia en blockchain · Avalanche Fuji (testnet) · contrato{" "}
        <a href={addressUrl(CONTRACT_ADDRESS)} target="_blank" rel="noreferrer" className="mono">
          {corto(CONTRACT_ADDRESS)}
        </a>
      </p>

      {/* 1. Wallet */}
      <div className="card">
        <h2>1. Wallet</h2>
        {!isConnected ? (
          <div className="row">
            <button disabled={conectando} onClick={() => connect({ connector: connectors[0] })}>
              Conectar wallet
            </button>
            <span className="meta">Necesitas Core o MetaMask. Para leer el lote no hace falta conectarse.</span>
          </div>
        ) : (
          <div className="row">
            <span className="pill">{corto(address)}</span>
            <button className="sec" onClick={() => disconnect()}>Desconectar</button>
          </div>
        )}
      </div>

      {redIncorrecta && (
        <div className="banner">
          Estás en una red equivocada. Esta demo funciona solo en Avalanche Fuji (Chain ID 43113).{" "}
          <button disabled={cambiando} onClick={() => switchChain({ chainId: avalancheFuji.id })}>
            Cambiar a Fuji
          </button>
        </div>
      )}

      {/* 2. Consulta */}
      <div className="card">
        <h2>2. Consultar un lote</h2>
        <div className="row" style={{ marginBottom: 12 }}>
          <div style={{ width: 140 }}>
            <label>N.º de lote</label>
            <input value={loteIdTxt} onChange={(e) => setLoteIdTxt(e.target.value)} inputMode="numeric" />
          </div>
          <span className="meta">Lotes creados en total: {total.data?.toString() ?? "…"}</span>
        </div>

        {!idValido && <p className="bad">Ingresa un número de lote válido (1 o más).</p>}
        {idValido && lote.isError && <p className="warn">Ese lote no existe todavía.</p>}

        {lote.data && (
          <>
            <div className="kv">
              <div>Producto</div><div>{lote.data.producto}</div>
              <div>Origen</div><div>{lote.data.origen}</div>
              <div>Creado por</div><div className="mono">{lote.data.creador}</div>
              <div>Custodio actual</div>
              <div className="mono">
                {lote.data.custodio} {esCustodio && <span className="pill ok">eres tú</span>}
              </div>
              <div>Estado</div>
              <div>{lote.data.cerrado ? <span className="pill">Cerrado</span> : <span className="pill ok">En tránsito</span>}</div>
            </div>

            <h2 style={{ marginTop: 18 }}>Historial (no se puede borrar ni editar)</h2>
            <ul className="timeline">
              {eventos.data?.map((r, i) => {
                if (r.status !== "success") return null;
                const e = r.result;
                return (
                  <li key={i}>
                    <div className="t">
                      {TIPOS[e.tipo]}
                      {e.ubicacion && ` · ${e.ubicacion}`}
                    </div>
                    <div>{e.detalle}</div>
                    <div className="meta">
                      {fecha(e.fecha)} · por {corto(e.autor)}
                      {e.destinatario !== "0x0000000000000000000000000000000000000000" && ` → entrega a ${corto(e.destinatario)}`}
                    </div>
                    {e.evidencia !== zeroHash && (
                      <div className="meta mono">huella de evidencia: {e.evidencia}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {/* 3. Crear lote */}
      <div className="card">
        <h2>3. Crear un lote nuevo</h2>
        <div className="grid">
          <div><label>Producto</label>
            <input value={producto} onChange={(e) => setProducto(e.target.value)} placeholder="Cerezas de exportación" /></div>
          <div><label>Origen</label>
            <input value={origen} onChange={(e) => setOrigen(e.target.value)} placeholder="Huerto en Rancagua, Chile" /></div>
          <div><button disabled={!puedeOperar || !producto} onClick={() => enviar("crearLote", [producto, origen])}>
            Crear lote (queda a tu nombre)
          </button></div>
        </div>
      </div>

      {/* 4. Operar */}
      <div className="card">
        <h2>4. Operar sobre el lote #{idValido ? loteIdTxt : "?"}</h2>
        {lote.data && !esCustodio && isConnected && (
          <p className="warn">Solo el custodio actual puede operar este lote. Cambia de cuenta en tu wallet.</p>
        )}
        <div className="grid">
          <div><label>Acción</label>
            <select value={accion} onChange={(e) => setAccion(e.target.value as Accion)}>
              <option value="etapa">Registrar una etapa</option>
              <option value="traspaso">Traspasar la custodia</option>
              <option value="incidencia">Reportar una incidencia</option>
              <option value="cierre">Cerrar el lote (entrega final)</option>
            </select></div>

          {accion === "etapa" && (
            <div><label>Lugar</label>
              <input value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} placeholder="Puerto de Valparaíso" /></div>
          )}
          {accion === "traspaso" && (
            <div><label>Dirección del nuevo custodio (0x…)</label>
              <input value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="0x…" /></div>
          )}
          <div><label>Detalle</label>
            <input value={detalle} onChange={(e) => setDetalle(e.target.value)} placeholder="Qué pasó en esta etapa" /></div>

          {(accion === "etapa" || accion === "incidencia") && (
            <div><label>Evidencia (opcional): se guarda solo la huella SHA-256 del archivo</label>
              <input type="file" onChange={async (e) => {
                const f = e.target.files?.[0];
                setHuella(f ? await huellaDeArchivo(f) : zeroHash);
              }} />
              {huella !== zeroHash && <div className="meta mono">huella: {huella}</div>}
            </div>
          )}

          <div><button disabled={!puedeOperar || !idValido || !detalle} onClick={ejecutarAccion}>Enviar transacción</button></div>
        </div>

        {/* Estado de la transacción */}
        {firmando && <p className="meta">Confirma la transacción en tu wallet…</p>}
        {hash && recibo.isLoading && <p className="meta">Esperando confirmación en la red…</p>}
        {hash && recibo.isSuccess && (
          <p className="ok">
            Transacción confirmada.{" "}
            <a href={txUrl(hash)} target="_blank" rel="noreferrer">Ver en Snowtrace</a>
            <br /><span className="mono meta">{hash}</span>
          </p>
        )}
        {error && <p className="bad">No se pudo enviar: {"shortMessage" in error ? String(error.shortMessage) : error.message}</p>}
      </div>

      <p className="meta">
        Nota: la blockchain garantiza que el registro no se altera, no que lo registrado sea verdad.
        Las wallets y fondos de esta demo son de prueba (testnet) y no tienen valor real.
      </p>
    </main>
  );
}
