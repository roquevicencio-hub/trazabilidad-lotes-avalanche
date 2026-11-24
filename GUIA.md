# Guía Hackathon Avalanche Fuji: de la idea al prototipo en vivo

Nov 19, 2026 · @Vinny

## Qué es esto y cómo usarlo

Este hackathon es una **evaluación del curso** Aplicaciones de Blockchain y Criptomonedas (IN3863). Lo trabajas con el mismo equipo que formaste al inicio del semestre.

### Primero: reúnete con tu equipo esta semana

- [ ] Retomen la conversación del equipo y agenden una reunión antes del 27 de noviembre.
- [ ] Elijan la idea (pueden continuar la del ideathon).
- [ ] Cada integrante se inscribe en el evento con "Request to Join" en Luma.
- [ ] Repartan roles: quién despliega el contrato, quién arma la web, quién prepara el pitch y el video.
- [ ] Trabajen en una sola carpeta de proyecto y un solo repositorio por equipo.
- [ ] Cada integrante hace la preparación de la sección "Antes del día".

### Cómo usar esta guía con tu asistente de IA

Funciona con cualquier asistente que trabaje en tu computador: Claude Code, Codex (OpenAI), Gemini CLI, Cursor u otro.

1. Crea una carpeta para el proyecto, por ejemplo `hackathon-avalanche`.
2. Guarda este archivo dentro de esa carpeta con el nombre `GUIA.md`.
3. Abre la terminal en esa carpeta e inicia tu asistente (`claude`, `codex` o `gemini`), o abre la carpeta en Cursor.
4. Escríbele este mensaje:

```text
Lee el archivo GUIA.md completo. Es la guía de mi hackathon del curso de blockchain.
Actúa como mi tutor: explícame todo con lenguaje simple y analogías de negocio.
Guíame un paso a la vez y espera mi confirmación antes de seguir.
Si algo falla, pídeme el error completo y ayúdame a resolverlo.
Verifica comandos y versiones en la documentación oficial si algo no coincide.
```

5. Avanza paso a paso. El asistente crea los archivos en tu computador y un repositorio git local. El repositorio en GitHub se crea en el Paso 9, cuando suben el código.

Si solo usas un chat web (ChatGPT, Claude.ai, Gemini o Google AI Studio en el navegador), también sirve: adjunta este archivo y pide lo mismo. La diferencia es que tendrás que crear los archivos y correr los comandos tú mismo, así que recomendamos un asistente que trabaje en la terminal.

Si un paso falla, copia el mensaje de error completo y pégalo en la conversación. Es lo más rápido para destrabarse.

## El hackathon y qué tienes que entregar

Conviertes tu idea en un prototipo funcional desplegado en la testnet Fuji de Avalanche. Puedes empezar a construir desde ahora; el 27 de noviembre de 2026 es el día de la entrega. Datos tomados de la [invitación en Luma](https://luma.com/w5cmfbsx):

| Dato | Detalle |
| --- | --- |
| Evento | Chile Team1 Avalanche Hackathon: de la prueba de concepto al prototipo funcional |
| Fecha | 27 de noviembre de 2026 (día de la entrega) |
| Hora | Luma indica 14:30 a 17:30 (hora de Chile), la hora de clase. Es una franja para trabajar presencialmente; el entregable se entrega durante ese día |
| Lugar | Presencial, Open Beauchef, Av. Beauchef 851, Facultad de Ciencias Físicas y Matemáticas, U. de Chile |
| Equipos | Tu mismo equipo del curso (el evento admite equipos de hasta 3) |
| Idea | Puedes continuar tu proyecto del ideathon o presentar una nueva |
| Red obligatoria | Avalanche Fuji testnet (C-Chain) |
| Evaluación | Jurado; no se publican criterios ni premios |
| Organiza | Team1 LatAm, con ChileDAO y otros anfitriones |
| Inscripción | "Request to Join" en Luma; el anfitrión debe aprobarla |

### Entregables

- [ ] Smart contract desplegado en Fuji C-Chain
- [ ] Al menos una transacción verificable en Snowtrace
- [ ] Demo publicada en una URL
- [ ] Repositorio público en GitHub
- [ ] Video de pitch

Los organizadores sugieren usar agentes de IA y las guías de AVAXSKILLS. Pide el enlace a las guías en el [grupo de WhatsApp del evento](https://chat.whatsapp.com/Fh4K5W3dCX12TOnPRrkv8j).

**Recomendación del curso:** como el jurado revisa una demo y un video, prioriza que algo simple funcione de punta a punta antes de sumar funciones.

## Arquitectura y herramientas, todo gratis

Tu prototipo tiene tres piezas: un contrato en la red Fuji, una web que lo usa y un repositorio que alimenta esa web.

&#91;embedded content: arquitectura del prototipo · 7 piezas\]

El jurado revisa el contrato (resaltado): debe estar en Fuji y tener una transacción visible en Snowtrace.

| Capa | Herramienta | Costo | Para qué sirve |
| --- | --- | --- | --- |
| Wallet | Core o MetaMask | Gratis | Firma tus transacciones |
| Red | Avalanche Fuji (testnet) | AVAX de prueba gratis | Red de ensayo sin dinero real |
| Contrato | Solidity + Hardhat 3 (plan B: Remix) | Gratis | Escribir y desplegar el contrato |
| Web | Next.js + wagmi + viem | Gratis | La pantalla que usa el contrato |
| Hosting | Vercel, plan Hobby | Gratis | URL pública de la demo |
| Código | GitHub, repositorio público | Gratis | Entregable y despliegue automático |
| Explorador | Snowtrace testnet | Gratis | Evidencia de tus transacciones |
| Asistente | Claude Code, Codex, Gemini CLI u otro | Gratis o pagado, según la herramienta | Escribe y explica el código contigo |

## Antes del día: deja todo listo (30 a 45 minutos)

Haz esta preparación cuanto antes, para poder empezar a construir desde ahora. El día de la entrega debería servir para terminar, probar y ensayar el pitch, no para configurar herramientas.

### 1. Cuentas gratuitas

- [ ] GitHub, para el repositorio público
- [ ] Vercel, entrando con tu cuenta de GitHub
- [ ] Claude Code o el asistente de IA que uses

### 2. Instalar en tu computador

- [ ] Node.js 22 LTS o superior (verifica con `node -v`)
- [ ] Git (verifica con `git --version`)
- [ ] Un editor de código, por ejemplo VS Code

### 3. Wallet exclusiva de pruebas

Crea una wallet **nueva, solo para el hackathon**, en Core o MetaMask. Nunca uses la wallet donde tengas dinero real. Guarda su frase semilla fuera de cualquier carpeta de código. Necesitarás la clave privada de **esta** wallet para desplegar el contrato.

### 4. Agregar la red Fuji a la wallet

Core suele traerla incluida. En MetaMask agrégala manualmente con estos datos ([fuente oficial](https://docs.avax.network/build/dapp/chain-settings)):

| Campo | Valor |
| --- | --- |
| Nombre de la red | Avalanche Fuji C-Chain |
| RPC URL | `https://api.avax-test.network/ext/bc/C/rpc` |
| Chain ID | `43113` |
| Símbolo | AVAX |
| Explorador | `https://testnet.snowtrace.io` |

Cuidado: Avalanche mainnet es el Chain ID `43114`. Para el hackathon siempre debe decir `43113`.

### 5. Conseguir AVAX de prueba (sin valor real)

Pide fondos con anticipación, porque algunos faucets limitan las solicitudes por tiempo. Opciones:

1. [Faucet oficial en la consola de Avalanche Builder](https://build.avax.network/console/primary-network/faucet): suele pedir conectar Core wallet y una cuenta de Builder Hub.
2. [Faucet de QuickNode](https://faucet.quicknode.com/avalanche/fuji): conectas tu wallet y puedes reclamar cada 12 horas.
3. Faucet de Chainlink, que entrega AVAX de prueba y LINK.

Los requisitos de cada faucet cambian con el tiempo. Si uno no funciona, prueba otro o pregunta en el grupo de WhatsApp. Para un contrato simple normalmente alcanza con 1 AVAX de prueba.

## Paso a paso, parte 1: idea, contrato y despliegue en Fuji

Si sigues los pasos 1 a 6 en orden, tendrás el contrato en vivo y la transacción verificable que exige el hackathon.

### Paso 1. Define una idea chica y clara

Escríbela en una frase: "\[Tipo de usuario\] puede \[acción\] y el contrato garantiza \[regla\] sin necesitar un tercero de confianza".

Ideas simples, pensadas para ingeniería industrial:

- Pago en garantía (escrow): el pago se libera solo cuando el comprador confirma la entrega.
- Trazabilidad de lotes: cada etapa de una cadena de suministro queda registrada y no se puede alterar.
- Votación o aprobación de un grupo: un fondo común que se gasta solo si la mayoría aprueba.
- Certificados verificables: cualquiera comprueba que un documento fue emitido por una institución.
- Compromiso con garantía: depositas un monto y lo recuperas solo si cumples tu meta.

Regla de oro: **un contrato, de 3 a 5 funciones, una sola pantalla**. Lo pequeño que funciona le gana a lo grande que no despliega.

### Paso 2. Crea el proyecto con tu asistente de IA

Con la carpeta del equipo y el archivo `GUIA.md` listos, abre tu asistente en esa carpeta y pega el prompt de "Armar el proyecto" de la sección de prompts. Lo hace una sola persona y luego comparte el repositorio con el resto. La estructura final tendrá dos carpetas:

- `contracts/`: el smart contract, escrito en Solidity y manejado con Hardhat.
- `web/`: la página web en Next.js que se conecta al contrato.

### Paso 3. Escribe y prueba el contrato

Pide a tu asistente que escriba el contrato con Solidity 0.8 o superior, eventos para cada acción importante y pruebas automáticas. Pídele también que **te explique cada función en lenguaje simple**: tú respondes por lo que despliegas. Luego prueba en tu computador, sin gastar nada:

```bash
npx hardhat test
```

### Paso 4. Configura la red Fuji en Hardhat

Hardhat es la herramienta que compila y despliega el contrato. La versión actual (Hardhat 3) se inicia con `npx hardhat --init`; elige la plantilla con viem. Tu archivo `hardhat.config.ts` debe incluir la red Fuji así ([documentación de Hardhat](https://hardhat.org/docs/tutorial/deploying)):

```ts
import hardhatToolboxViem from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxViem],
  solidity: "0.8.28",
  networks: {
    fuji: {
      type: "http",
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [configVariable("FUJI_PRIVATE_KEY")],
    },
  },
});
```

La clave privada de tu wallet de pruebas **no se escribe en el archivo**. Se entrega como variable (`FUJI_PRIVATE_KEY`) mediante el almacén seguro de Hardhat o un archivo `.env` que esté en `.gitignore`. Pide a tu asistente que te guíe en este paso, pero **nunca pegues tu clave privada en el chat**: escríbela tú directamente en la terminal cuando te la pida.

### Paso 5. Despliega el contrato en Fuji

Hardhat usa "módulos Ignition" para desplegar. Tu asistente creará uno parecido a este:

```ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MiContratoModule", (m) => {
  const contrato = m.contract("MiContrato");
  return { contrato };
});
```

Y lo ejecutas con:

```bash
npx hardhat ignition deploy ignition/modules/MiContrato.ts --network fuji
```

Al terminar verás la **dirección del contrato** (empieza con `0x`). Cópiala y guárdala: la usarás en la web, el README y el video.

### Paso 6. Genera y verifica una transacción en Snowtrace

El contrato desplegado ya es una transacción, pero conviene ejecutar al menos una acción real sobre él (por ejemplo, crear un registro). Luego:

1. Abre [testnet.snowtrace.io](https://testnet.snowtrace.io).
2. Pega la dirección del contrato o el hash de la transacción en el buscador.
3. Comprueba que el estado diga **Success**.
4. Guarda el enlace: es tu evidencia para el jurado.

Opcional, pero suma: verificar el código fuente en Snowtrace para que cualquiera lo lea. Pide a tu asistente que lo haga siguiendo la [guía oficial de verificación](https://docs.avax.network/dapps/verify-contract/hardhat).

### Paso 7. Plan B si Hardhat te da problemas

[Remix](https://remix.ethereum.org) es un editor que corre en el navegador, sin instalar nada. Pegas el contrato, lo compilas y lo despliegas con tu wallet conectada a Fuji (entorno "Injected Provider"). Es más manual, pero cumple el mismo entregable.

## Paso a paso, parte 2: web, GitHub, Vercel y video

Con el contrato en vivo, falta que cualquiera pueda usarlo desde un enlace y entender qué hiciste.

### Paso 8. Construye la web (una sola pantalla)

Pide a tu asistente una app en Next.js con wagmi y viem, las librerías estándar para hablar con una wallet y un contrato. Debe incluir:

- Botón para conectar la wallet.
- Aviso y botón para cambiar a la red Fuji si el usuario está en otra.
- Lectura de al menos un dato del contrato.
- Una acción que escriba en el contrato.
- Tras escribir, el hash de la transacción con enlace a `https://testnet.snowtrace.io/tx/<hash>`.

La dirección del contrato va en una variable `NEXT_PUBLIC_CONTRACT_ADDRESS`, no escrita a mano en el código. Prueba todo en tu computador con `npm run dev` antes de subirlo.

### Paso 9. Sube el código a un repositorio público de GitHub

1. Antes del primer commit, confirma que `.gitignore` incluya `.env`, `.env.local`, `node_modules` y cualquier archivo con claves.
2. Crea el repositorio en GitHub como **público** y sube el código (tu asistente puede hacerlo por ti si tienes instalado `gh`, la herramienta de GitHub).
3. Pide a tu asistente que revise que ninguna clave privada haya quedado en los archivos ni en el historial.
4. Agrega un `README` con: qué hace el proyecto, dirección del contrato con su enlace a Snowtrace, URL de la demo y cómo correrlo.

### Paso 10. Publica la demo en Vercel (gratis)

1. Entra a vercel.com con tu cuenta de GitHub y elige **Add New, Project**.
2. Importa tu repositorio.
3. En **Root Directory** selecciona la carpeta `web`. Vercel detecta Next.js solo.
4. En **Environment Variables** agrega `NEXT_PUBLIC_CONTRACT_ADDRESS` (la dirección del Paso 5) y `NEXT_PUBLIC_CHAIN_ID` con valor `43113`.
5. Presiona **Deploy**. Al terminar tendrás una URL del tipo `tu-proyecto.vercel.app`.

Nunca agregues tu clave privada en Vercel: la web solo necesita la dirección pública del contrato. Cada vez que hagas `git push`, Vercel vuelve a publicar solo.

El plan Hobby de Vercel es gratuito y está pensado para uso personal y no comercial ([fuente](https://vercel.com/docs/plans/hobby)). Sirve para una demo de hackathon; si el proyecto se vuelve un negocio, habrá que cambiar de plan.

### Paso 11. Prueba la demo publicada

Abre la URL desde otro navegador o con tu celular. Conecta la wallet, cámbiate a Fuji, ejecuta la acción y confirma que la transacción aparece en Snowtrace. Si algo falla, revisa la tabla de problemas frecuentes más abajo.

### Paso 12. Graba el video de pitch

Luma no indica duración; como referencia, apunta a 90 segundos o menos. Un guion que funciona:

1. **Problema** (10 s): quién sufre y por qué hoy depende de un intermediario.
2. **Solución** (15 s): qué hace tu contrato, en una frase.
3. **Demo en vivo** (40 s): conectas la wallet, ejecutas la acción y muestras la transacción en Snowtrace.
4. **Por qué blockchain** (10 s): qué regla queda garantizada sin confiar en nadie.
5. **Siguientes pasos** (10 s): qué harías con más tiempo.

## Prompts listos para tu asistente de IA

Copia y pega cada uno en su momento. Reemplaza lo que va entre corchetes con tu información.

### Armar el proyecto (Paso 2)

```text
Quiero armar un prototipo para un hackathon de Avalanche. Mi idea: [tu idea en una frase].
Crea un proyecto con dos carpetas: contracts/ (Hardhat 3 con viem, Solidity 0.8+) y web/ (Next.js con wagmi y viem).
Red objetivo: Avalanche Fuji C-Chain, Chain ID 43113, RPC https://api.avax-test.network/ext/bc/C/rpc.
Reglas: todo gratuito, lo más simple posible, un solo contrato de 3 a 5 funciones, una sola pantalla.
Nunca pidas ni escribas mi clave privada en archivos; usa variables de entorno y deja .env en .gitignore.
Antes de empezar, verifica en la documentación oficial de Hardhat y Avalanche que los comandos sean los actuales.
```

### Escribir el contrato (Paso 3)

```text
Escribe el contrato MiContrato.sol con estas reglas de negocio: [describe las reglas].
Incluye eventos para cada acción importante, validaciones claras y pruebas automáticas.
Después explícame cada función en lenguaje simple, como si yo fuera ingeniero industrial y no programador.
Señala cualquier riesgo o limitación que veas.
```

### Configurar y desplegar en Fuji (Pasos 4 y 5)

```text
Configura la red Fuji en hardhat.config.ts leyendo la clave desde una variable de configuración llamada FUJI_PRIVATE_KEY.
Guíame para ingresarla yo mismo en la terminal, sin que la veas tú.
Crea el módulo Ignition y despliega el contrato en Fuji.
Al final dame la dirección del contrato y el enlace a testnet.snowtrace.io para verla.
```

### Construir la web (Paso 8)

```text
En web/ crea una sola pantalla en Next.js con wagmi y viem que:
1) conecte la wallet, 2) exija la red Fuji (43113) y ofrezca cambiarla, 3) lea [dato] del contrato,
4) tenga un botón para [acción] que escriba en el contrato y 5) muestre el hash de la transacción con enlace a Snowtrace.
La dirección del contrato debe venir de NEXT_PUBLIC_CONTRACT_ADDRESS. Diseño limpio y simple.
```

### Revisar seguridad antes de publicar (Paso 9)

```text
Revisa todo el repositorio, incluido el historial de git: busca claves privadas, frases semilla, archivos .env o secretos.
Confirma que .gitignore los cubre. Luego revisa el contrato buscando errores comunes
(reentrada, permisos mal asignados, funciones que cualquiera puede llamar). Dame un resumen en lenguaje simple.
```

### README y guion del pitch (Pasos 9 y 12)

```text
Escribe un README con: qué hace el proyecto, qué problema resuelve, dirección del contrato y enlace a Snowtrace,
URL de la demo [URL] y cómo correrlo localmente. Después propón un guion de video de 90 segundos con demo en vivo.
```

## Problemas frecuentes y reglas de seguridad

La mayoría de los bloqueos caen en esta tabla. Si el tuyo no está, pega el error completo en tu asistente de IA.

| Síntoma | Causa probable | Qué hacer |
| --- | --- | --- |
| "insufficient funds" al desplegar | La cuenta no tiene AVAX de prueba | Pide fondos en un faucet y confirma que la wallet es la de tu clave privada |
| La transacción no aparece en Snowtrace | Estás mirando el explorador de mainnet | Usa testnet.snowtrace.io y espera unos segundos |
| La wallet se conecta pero todo falla | Red equivocada | Cambia a Fuji, Chain ID 43113 (mainnet es 43114) |
| Error de versión al correr Hardhat | Node.js desactualizado | Instala Node.js 22 LTS o superior |
| No encuentra FUJI\_PRIVATE\_KEY | La variable no está definida | Defínela en el almacén de Hardhat o en `.env` y reinicia la terminal |
| El build falla en Vercel | Root Directory mal elegido o faltan variables | Root Directory = `web`; revisa las variables y el log del build |
| La demo no lee el contrato | Dirección desactualizada tras volver a desplegar | Actualiza `NEXT_PUBLIC_CONTRACT_ADDRESS` en Vercel y redespliega |
| El faucet no entrega fondos | Límite de tiempo o requisitos de cuenta | Prueba otro faucet o pregunta en el grupo de WhatsApp |

### Reglas de seguridad

- Usa una wallet solo para pruebas, sin dinero real.
- Nunca pegues tu clave privada ni tu frase semilla en el chat con la IA, en el código ni en GitHub.
- Pon `.env` y cualquier archivo de claves en `.gitignore` **antes** del primer commit.
- Si una clave se filtró, dáala por perdida y crea otra wallet.
- Las variables que empiezan con `NEXT_PUBLIC_` quedan visibles para todo el mundo: solo van direcciones y números de red.
- Entiende lo que la IA escribió antes de desplegarlo. Tú respondes ante el jurado.

## Checklist final y recursos

Antes de entregar, confirma cada punto con tus propios ojos, idealmente desde otro dispositivo.

- [ ] El contrato está desplegado en Fuji (Chain ID 43113) y su dirección aparece en Snowtrace
- [ ] Hay al menos una transacción con estado Success y tienes su enlace
- [ ] La demo abre en una URL pública y funciona de punta a punta
- [ ] El repositorio de GitHub es público y no contiene claves ni archivos `.env`
- [ ] El README explica qué hace el proyecto e incluye contrato, demo y enlace a Snowtrace
- [ ] El video de pitch está grabado y se ve y escucha bien
- [ ] Todos los integrantes del equipo saben explicar qué hace el contrato

### Cuándo empezar y qué falta por confirmar

Puedes empezar a construir desde ahora, en cualquier momento, con tu idea y todo lo que ya tengas: el contrato, la web y el video se pueden trabajar antes del 27. La única restricción es la entrega: **el 27 de noviembre es el día en que se entrega** el prototipo.

La hora que aparece en Luma (14:30 a 17:30, hora de Chile) es la hora de clase. Tómala como una franja para trabajar presencialmente ese día; el entregable se entrega durante ese día y no depende de esa franja.

Pendiente de confirmar con los organizadores: Luma no publica los criterios del jurado, los premios, el formato exacto de entrega del video (duración y cómo se envía) ni la hora límite de entrega dentro del 27. Pregúntalo en el grupo de WhatsApp antes del 27 de noviembre.

### Recursos

- [Invitación del evento en Luma](https://luma.com/w5cmfbsx)
- [Grupo de WhatsApp del hackathon](https://chat.whatsapp.com/Fh4K5W3dCX12TOnPRrkv8j)
- [Telegram de Team1 LatAm](https://t.me/team1_latam) y [X de Team1 LatAm](https://x.com/team1latam)
- [Parámetros de la red Fuji, documentación de Avalanche](https://docs.avax.network/build/dapp/chain-settings)
- [Faucet de la consola Avalanche Builder](https://build.avax.network/console/primary-network/faucet)
- [Faucet de QuickNode para Fuji](https://faucet.quicknode.com/avalanche/fuji)
- [Explorador Snowtrace de la testnet](https://testnet.snowtrace.io)
- [Verificar contratos con Hardhat en Snowtrace](https://docs.avax.network/dapps/verify-contract/hardhat)
- [Tutorial de despliegue con Hardhat 3](https://hardhat.org/docs/tutorial/deploying)
- [Plan Hobby de Vercel](https://vercel.com/docs/plans/hobby)
- [Remix IDE](https://remix.ethereum.org)
