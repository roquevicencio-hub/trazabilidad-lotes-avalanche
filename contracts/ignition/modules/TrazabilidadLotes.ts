import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TrazabilidadLotesModule", (m) => {
  const trazabilidad = m.contract("TrazabilidadLotes");
  return { trazabilidad };
});