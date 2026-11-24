# Trazabilidad de lotes en Avalanche Fuji

Prototipo del proyecto final del curso **Aplicaciones de Blockchain y Criptomonedas**
(Hackathon Avalanche, Open Beauchef, Universidad de Chile, 27 de noviembre de 2026).

## Qué hace

Cualquier empresa de una cadena de suministro puede registrar cada etapa de un lote
(producción, empaque, transporte, aduana, entrega) y traspasar su custodia a la siguiente.
El smart contract garantiza, sin necesitar un tercero de confianza, que:

- el historial **no se puede borrar ni alterar**;
- **solo el custodio actual** puede agregar etapas, reportar incidencias, traspasar o cerrar el lote;
- un lote **cerrado** no admite más cambios.

## Qué problema resuelve

Hoy, la información de un lote (por ejemplo, fruta de exportación) vive en los sistemas de cada
actor y se concilia a mano. Cuando hay un problema, como una cadena de frío cortada, es difícil
saber quién tenía el lote y qué se registró en ese momento. Con un registro compartido e
inalterable, cada actor responde por lo que reportó mientras tuvo la custodia.

## Datos del despliegue

| Dato | Valor |
| --- | --- |
| Red | Avalanche Fuji C-Chain (testnet), Chain ID 43113 |
| Contrato | `0x08E6059F3e26A41ebDEc5C9e727EaeA0ca0FCD35` |
| Ver en Snowtrace | https://testnet.snowtrace.io/address/0x08E6059F3e26A41ebDEc5C9e727EaeA0ca0FCD35 |
| Tx: crear lote | https://testnet.snowtrace.io/tx/0x1db55bf164b9c000358e97224275160f07f191cab37a7003ad77746c7bdcb2ae |
| Tx: registrar etapa | https://testnet.snowtrace.io/tx/0xcf81b88da860420a8affb7b7e6b1dc334a04f19bd387b7f68de221410afdc8f3 |
| Demo en vivo | https://trazabilidad-lotes-avalanche.vercel.app |

## Cómo funciona el contrato

`contracts/contracts/TrazabilidadLotes.sol`

| Función | Quién la puede llamar | Qué hace |
| --- | --- | --- |
| `crearLote` | Cualquiera | Abre un lote; quien lo crea es su primer custodio |
| `registrarEtapa` | Custodio actual | Agrega una etapa (lugar, detalle y huella opcional de evidencia) |
| `traspasarCustodia` | Custodio actual | Entrega el lote a otra dirección |
| `reportarIncidencia` | Custodio actual | Deja constancia de un problema |
| `cerrarLote` | Custodio actual | Entrega final; el lote queda sellado |
| `obtenerLote`, `cantidadEventos`, `obtenerEvento` | Cualquiera (lectura gratuita) | Consultan el estado y el historial |

Los documentos de respaldo (fotos, certificados) **no se guardan en la blockchain**: solo su huella
SHA-256 (`bytes32`). Si el archivo cambia después, la huella ya no coincide.

## Límites conocidos y siguientes pasos

- La blockchain garantiza que el registro no se altera, **no que lo registrado sea verdad**. En
  producción se complementaría con sensores o auditores.
- El traspaso es de un solo paso; una versión real pediría que el receptor lo acepte.
- Cualquiera puede crear lotes; faltaría una lista de empresas autorizadas.
- Pendientes: dividir un lote en varios, y permisos por rol.

## Estructura del repositorio

```
contracts/   Hardhat 3 + viem: contrato, pruebas y despliegue en Fuji
web/         Next.js + wagmi + viem: interfaz de una pantalla
```

## Cómo correrlo localmente

Requisitos: Node.js 22 o superior.

**Contrato (opcional, ya está desplegado)**

```bash
cd contracts
npm install
npx hardhat test
```

Para desplegar uno propio hace falta una wallet de pruebas con AVAX de Fuji y definir la clave con
`npx hardhat keystore set FUJI_PRIVATE_KEY`. La clave nunca se escribe en archivos del repositorio.

**Web**

```bash
cd web
npm install
cp .env.example .env.local   # y pon la dirección del contrato
npm run dev
```

Abre http://localhost:3000. Para operar necesitas Core o MetaMask en la red Fuji.

## Tecnologías

Solidity 0.8, Hardhat 3, viem, wagmi, Next.js, Avalanche Fuji, Vercel.
