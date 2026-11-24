import { network } from "hardhat";

const DIRECCION_CONTRATO = "0x08E6059F3e26A41ebDEc5C9e727EaeA0ca0FCD35";

const { viem } = await network.connect();
const publicClient = await viem.getPublicClient();
const contrato = await viem.getContractAt("TrazabilidadLotes", DIRECCION_CONTRATO);

console.log("Creando lote...");
const hash1 = await contrato.write.crearLote([
  "Cerezas de exportacion - Lote 001",
  "Huerto en Rancagua, Chile",
]);
await publicClient.waitForTransactionReceipt({ hash: hash1 });
console.log("Lote creado. Transaccion: https://testnet.snowtrace.io/tx/" + hash1);

console.log("Registrando etapa...");
const hash2 = await contrato.write.registrarEtapa([
  1n,
  "Packing Rancagua",
  "Empaque terminado y control de calidad aprobado",
  "0x0000000000000000000000000000000000000000000000000000000000000000",
]);
await publicClient.waitForTransactionReceipt({ hash: hash2 });
console.log("Etapa registrada. Transaccion: https://testnet.snowtrace.io/tx/" + hash2);