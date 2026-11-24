import { createConfig, http, injected } from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import type { Address } from "viem";

// La dirección del contrato viene de una variable de entorno pública (no es un secreto).
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;

export const config = createConfig({
  chains: [avalancheFuji],
  connectors: [injected()],
  transports: { [avalancheFuji.id]: http() },
  ssr: true,
});

export const SNOWTRACE = "https://testnet.snowtrace.io";
export const txUrl = (hash: string) => `${SNOWTRACE}/tx/${hash}`;
export const addressUrl = (addr: string) => `${SNOWTRACE}/address/${addr}`;
