export const abi = [
  {
    "inputs": [],
    "name": "CustodioInvalido",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "LoteInexistente",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "LoteYaCerrado",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoEsCustodio",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TextoVacio",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "loteId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "desde",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "hacia",
        "type": "address"
      }
    ],
    "name": "CustodiaTraspasada",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "loteId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "autor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ubicacion",
        "type": "string"
      }
    ],
    "name": "EtapaRegistrada",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "loteId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "autor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "detalle",
        "type": "string"
      }
    ],
    "name": "IncidenciaReportada",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "loteId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "autor",
        "type": "address"
      }
    ],
    "name": "LoteCerrado",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "loteId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creador",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "producto",
        "type": "string"
      }
    ],
    "name": "LoteCreado",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "loteId",
        "type": "uint256"
      }
    ],
    "name": "cantidadEventos",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "loteId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "detalle",
        "type": "string"
      }
    ],
    "name": "cerrarLote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "producto",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "origen",
        "type": "string"
      }
    ],
    "name": "crearLote",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "loteId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "loteId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "indice",
        "type": "uint256"
      }
    ],
    "name": "obtenerEvento",
    "outputs": [
      {
        "components": [
          {
            "internalType": "enum TrazabilidadLotes.TipoEvento",
            "name": "tipo",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "autor",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "destinatario",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "ubicacion",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "detalle",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "evidencia",
            "type": "bytes32"
          },
          {
            "internalType": "uint64",
            "name": "fecha",
            "type": "uint64"
          }
        ],
        "internalType": "struct TrazabilidadLotes.Evento",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "loteId",
        "type": "uint256"
      }
    ],
    "name": "obtenerLote",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "producto",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "origen",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "creador",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "custodio",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "cerrado",
            "type": "bool"
          },
          {
            "internalType": "uint64",
            "name": "creadoEn",
            "type": "uint64"
          }
        ],
        "internalType": "struct TrazabilidadLotes.Lote",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "loteId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "ubicacion",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "detalle",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "evidencia",
        "type": "bytes32"
      }
    ],
    "name": "registrarEtapa",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "loteId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "detalle",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "evidencia",
        "type": "bytes32"
      }
    ],
    "name": "reportarIncidencia",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalLotes",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "loteId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "nuevoCustodio",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "detalle",
        "type": "string"
      }
    ],
    "name": "traspasarCustodia",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
