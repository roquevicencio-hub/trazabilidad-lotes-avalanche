// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Trazabilidad de lotes en una cadena de suministro
/// @notice Registra etapas, traspasos de custodia e incidencias de un lote.
///         Solo el custodio actual puede modificar el lote. El historial no se puede borrar.
contract TrazabilidadLotes {
    enum TipoEvento { Creacion, Etapa, Traspaso, Incidencia, Cierre }

    struct Lote {
        uint256 id;
        string producto;
        string origen;
        address creador;
        address custodio;
        bool cerrado;
        uint64 creadoEn;
    }

    struct Evento {
        TipoEvento tipo;
        address autor;
        address destinatario; // solo se usa en traspasos
        string ubicacion;
        string detalle;
        bytes32 evidencia;    // huella (hash) de un documento o foto, opcional
        uint64 fecha;
    }

    uint256 public totalLotes;
    mapping(uint256 => Lote) private lotes;
    mapping(uint256 => Evento[]) private historial;

    event LoteCreado(uint256 indexed loteId, address indexed creador, string producto);
    event EtapaRegistrada(uint256 indexed loteId, address indexed autor, string ubicacion);
    event CustodiaTraspasada(uint256 indexed loteId, address indexed desde, address indexed hacia);
    event IncidenciaReportada(uint256 indexed loteId, address indexed autor, string detalle);
    event LoteCerrado(uint256 indexed loteId, address indexed autor);

    error LoteInexistente();
    error NoEsCustodio();
    error LoteYaCerrado();
    error CustodioInvalido();
    error TextoVacio();

    modifier existe(uint256 loteId) {
        if (loteId == 0 || loteId > totalLotes) revert LoteInexistente();
        _;
    }

    modifier soloCustodio(uint256 loteId) {
        if (lotes[loteId].custodio != msg.sender) revert NoEsCustodio();
        _;
    }

    modifier abierto(uint256 loteId) {
        if (lotes[loteId].cerrado) revert LoteYaCerrado();
        _;
    }

    /// @notice Crea un lote. Quien lo crea es su primer custodio.
    function crearLote(string calldata producto, string calldata origen) external returns (uint256 loteId) {
        if (bytes(producto).length == 0) revert TextoVacio();

        loteId = ++totalLotes;
        lotes[loteId] = Lote({
            id: loteId,
            producto: producto,
            origen: origen,
            creador: msg.sender,
            custodio: msg.sender,
            cerrado: false,
            creadoEn: uint64(block.timestamp)
        });

        _agregarEvento(loteId, TipoEvento.Creacion, address(0), origen, "Lote creado", bytes32(0));
        emit LoteCreado(loteId, msg.sender, producto);
    }

    /// @notice El custodio actual registra una etapa (ej: empaque, transporte, aduana).
    function registrarEtapa(
        uint256 loteId,
        string calldata ubicacion,
        string calldata detalle,
        bytes32 evidencia
    ) external existe(loteId) abierto(loteId) soloCustodio(loteId) {
        if (bytes(detalle).length == 0) revert TextoVacio();
        _agregarEvento(loteId, TipoEvento.Etapa, address(0), ubicacion, detalle, evidencia);
        emit EtapaRegistrada(loteId, msg.sender, ubicacion);
    }

    /// @notice El custodio actual entrega el lote a otra dirección, que pasa a ser el nuevo custodio.
    function traspasarCustodia(
        uint256 loteId,
        address nuevoCustodio,
        string calldata detalle
    ) external existe(loteId) abierto(loteId) soloCustodio(loteId) {
        if (nuevoCustodio == address(0) || nuevoCustodio == msg.sender) revert CustodioInvalido();

        lotes[loteId].custodio = nuevoCustodio;
        _agregarEvento(loteId, TipoEvento.Traspaso, nuevoCustodio, "", detalle, bytes32(0));
        emit CustodiaTraspasada(loteId, msg.sender, nuevoCustodio);
    }

    /// @notice El custodio actual deja constancia de un problema (ej: se cortó la cadena de frío).
    function reportarIncidencia(
        uint256 loteId,
        string calldata detalle,
        bytes32 evidencia
    ) external existe(loteId) abierto(loteId) soloCustodio(loteId) {
        if (bytes(detalle).length == 0) revert TextoVacio();
        _agregarEvento(loteId, TipoEvento.Incidencia, address(0), "", detalle, evidencia);
        emit IncidenciaReportada(loteId, msg.sender, detalle);
    }

    /// @notice El custodio final cierra el lote. Después de esto no admite más cambios.
    function cerrarLote(uint256 loteId, string calldata detalle)
        external
        existe(loteId)
        abierto(loteId)
        soloCustodio(loteId)
    {
        lotes[loteId].cerrado = true;
        _agregarEvento(loteId, TipoEvento.Cierre, address(0), "", detalle, bytes32(0));
        emit LoteCerrado(loteId, msg.sender);
    }

    // ---------- Consultas (gratis, no cuestan gas) ----------

    function obtenerLote(uint256 loteId) external view existe(loteId) returns (Lote memory) {
        return lotes[loteId];
    }

    function cantidadEventos(uint256 loteId) external view existe(loteId) returns (uint256) {
        return historial[loteId].length;
    }

    function obtenerEvento(uint256 loteId, uint256 indice) external view existe(loteId) returns (Evento memory) {
        return historial[loteId][indice];
    }

    // ---------- Interno ----------

    function _agregarEvento(
        uint256 loteId,
        TipoEvento tipo,
        address destinatario,
        string memory ubicacion,
        string memory detalle,
        bytes32 evidencia
    ) private {
        historial[loteId].push(
            Evento({
                tipo: tipo,
                autor: msg.sender,
                destinatario: destinatario,
                ubicacion: ubicacion,
                detalle: detalle,
                evidencia: evidencia,
                fecha: uint64(block.timestamp)
            })
        );
    }
}
