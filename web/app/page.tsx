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
      <header className="app-header">
        <div className="eyebrow">Avalanche Fuji Testnet · Cadena de Custodia</div>
        <h1>Trazabilidad de lotes</h1>
        <p className="sub">
          Registro verificable en blockchain · Contrato{" "}
          <a href={addressUrl(CONTRACT_ADDRESS)} target="_blank" rel="noreferrer" className="mono">
            {corto(CONTRACT_ADDRESS)}
          </a>
        </p>
      </header>

      {/* 1. Wallet */}
      <section className="card">
        <div className="card-header">
          <h2>Conexión de wallet</h2>
          <span className="step-tag">Paso 01</span>
        </div>
        {!isConnected ? (
          <div className="row">
            <button disabled={conectando} onClick={() => connect({ connector: connectors[0] })}>
              Conectar wallet
            </button>
            <span className="meta">Compatible con Core o MetaMask. Puedes consultar lotes sin conectar wallet.</span>
          </div>
        ) : (
          <div className="row">
            <span className="pill mono">{corto(address)}</span>
            <button className="sec" onClick={() => disconnect()}>Desconectar</button>
          </div>
        )}
      </section>

      {redIncorrecta && (
        <div className="banner">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span>Estás en una red distinta. Esta demo opera en Avalanche Fuji (Chain ID 43113).</span>
            <button disabled={cambiando} onClick={() => switchChain({ chainId: avalancheFuji.id })}>
              Cambiar a Fuji
            </button>
          </div>
        </div>
      )}

      {/* 2. Consulta */}
      <section className="card">
        <div className="card-header">
          <h2>Consultar un lote</h2>
          <span className="step-tag">Paso 02 · Lectura</span>
        </div>
        <div className="row" style={{ marginBottom: 14 }}>
          <div style={{ width: 150 }}>
            <label htmlFor="lote-id-input">N.º de lote</label>
            <input
              id="lote-id-input"
              value={loteIdTxt}
              onChange={(e) => setLoteIdTxt(e.target.value)}
              inputMode="numeric"
            />
          </div>
          <span className="meta">Lotes creados en total: <strong>{total.data?.toString() ?? "…"}</strong></span>
        </div>

        {!idValido && <p className="bad">Ingresa un número de lote válido (1 o más).</p>}
        {idValido && lote.isError && <p className="warn">Ese lote no existe todavía.</p>}

        {lote.data && (
          <>
            <div className="lote-summary">
              <div className="lote-summary-top">
                <div className="lote-title">
                  Lote #{idValido ? loteIdTxt : ""} · {lote.data.producto}
                </div>
                {lote.data.cerrado ? (
                  <span className="status-badge status-closed">Cerrado</span>
                ) : (
                  <span className="status-badge status-active">En tránsito</span>
                )}
              </div>

              <div className="kv">
                <div>Producto</div>
                <div>{lote.data.producto}</div>
                <div>Origen</div>
                <div>{lote.data.origen}</div>
                <div>Creado por</div>
                <div className="mono">{lote.data.creador}</div>
                <div>Custodio actual</div>
                <div className="mono">
                  {lote.data.custodio}
                  {esCustodio && <span className="custodian-badge">Eres tú</span>}
                </div>
              </div>
            </div>

            <h3 className="timeline-section-title">Historial inmutable de eventos</h3>
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
      </section>

      {/* 3. Crear lote */}
      <section className="card">
        <div className="card-header">
          <h2>Crear un lote nuevo</h2>
          <span className="step-tag">Paso 03 · Alta</span>
        </div>
        <div className="grid">
          <div>
            <label htmlFor="producto-input">Producto</label>
            <input
              id="producto-input"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              placeholder="Cerezas de exportación"
            />
          </div>
          <div>
            <label htmlFor="origen-input">Origen</label>
            <input
              id="origen-input"
              value={origen}
              onChange={(e) => setOrigen(e.target.value)}
              placeholder="Huerto en Rancagua, Chile"
            />
          </div>
          <div>
            <button disabled={!puedeOperar || !producto} onClick={() => enviar("crearLote", [producto, origen])}>
              Crear lote (queda a tu nombre)
            </button>
          </div>
        </div>
      </section>

      {/* 4. Operar */}
      <section className="card">
        <div className="card-header">
          <h2>Operar sobre el lote #{idValido ? loteIdTxt : "?"}</h2>
          <span className="step-tag">Paso 04 · Movimiento</span>
        </div>
        {lote.data && !esCustodio && isConnected && (
          <p className="warn">Solo el custodio actual puede operar este lote. Cambia de cuenta en tu wallet.</p>
        )}
        <div className="grid">
          <div>
            <label htmlFor="accion-select">Acción</label>
            <select
              id="accion-select"
              value={accion}
              onChange={(e) => setAccion(e.target.value as Accion)}
            >
              <option value="etapa">Registrar una etapa</option>
              <option value="traspaso">Traspasar la custodia</option>
              <option value="incidencia">Reportar una incidencia</option>
              <option value="cierre">Cerrar el lote (entrega final)</option>
            </select>
          </div>

          {accion === "etapa" && (
            <div>
              <label htmlFor="ubicacion-input">Lugar</label>
              <input
                id="ubicacion-input"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="Puerto de Valparaíso"
              />
            </div>
          )}
          {accion === "traspaso" && (
            <div>
              <label htmlFor="destino-input">Dirección del nuevo custodio (0x…)</label>
              <input
                id="destino-input"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                placeholder="0x…"
              />
            </div>
          )}
          <div>
            <label htmlFor="detalle-input">Detalle</label>
            <input
              id="detalle-input"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              placeholder="Qué pasó en esta etapa"
            />
          </div>

          {(accion === "etapa" || accion === "incidencia") && (
            <div>
              <label htmlFor="evidencia-input">Evidencia (opcional): se guarda solo la huella SHA-256 del archivo</label>
              <input
                id="evidencia-input"
                type="file"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  setHuella(f ? await huellaDeArchivo(f) : zeroHash);
                }}
              />
              {huella !== zeroHash && <div className="meta mono">huella: {huella}</div>}
            </div>
          )}

          <div>
            <button disabled={!puedeOperar || !idValido || !detalle} onClick={ejecutarAccion}>
              Enviar transacción
            </button>
          </div>
        </div>

        {/* Estado de la transacción */}
        {firmando && (
          <div className="tx-box">
            <span className="meta">Confirma la transacción en tu wallet…</span>
          </div>
        )}
        {hash && recibo.isLoading && (
          <div className="tx-box">
            <span className="meta">Esperando confirmación en la red…</span>
          </div>
        )}
        {hash && recibo.isSuccess && (
          <div className="tx-box">
            <span className="ok">Transacción confirmada.</span>{" "}
            <a href={txUrl(hash)} target="_blank" rel="noreferrer">Ver en Snowtrace</a>
            <br />
            <span className="mono meta">{hash}</span>
          </div>
        )}
        {error && (
          <div className="tx-box">
            <span className="bad">
              No se pudo enviar: {"shortMessage" in error ? String(error.shortMessage) : error.message}
            </span>
          </div>
        )}
      </section>

      <footer className="footer-note">
        Nota: la blockchain garantiza que el registro no se altera, no que lo registrado sea verdad.
        Las wallets y fondos de esta demo son de prueba (testnet) y no tienen valor real.
      </footer>
    </main>
  );
}