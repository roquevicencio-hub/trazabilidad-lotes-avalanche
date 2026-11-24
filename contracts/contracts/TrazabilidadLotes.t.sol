// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {TrazabilidadLotes} from "./TrazabilidadLotes.sol";

contract TrazabilidadLotesTest is Test {
    TrazabilidadLotes t;

    address productor = address(0xA1);
    address transportista = address(0xB2);
    address importador = address(0xC3);
    address intruso = address(0xD4);

    function setUp() public {
        t = new TrazabilidadLotes();
    }

    function _crearLote() internal returns (uint256 id) {
        vm.prank(productor);
        id = t.crearLote("Cerezas de exportacion", "Huerto Rancagua");
    }

    function test_CrearLoteAsignaCustodioInicial() public {
        uint256 id = _crearLote();
        TrazabilidadLotes.Lote memory l = t.obtenerLote(id);
        assertEq(id, 1);
        assertEq(l.custodio, productor);
        assertEq(l.creador, productor);
        assertFalse(l.cerrado);
        assertEq(t.cantidadEventos(id), 1);
    }

    function test_CrearLoteSinProductoFalla() public {
        vm.expectRevert(TrazabilidadLotes.TextoVacio.selector);
        t.crearLote("", "Huerto");
    }

    function test_SoloElCustodioRegistraEtapas() public {
        uint256 id = _crearLote();

        vm.expectRevert(TrazabilidadLotes.NoEsCustodio.selector);
        vm.prank(intruso);
        t.registrarEtapa(id, "Bodega", "Ingreso falso", bytes32(0));

        vm.prank(productor);
        t.registrarEtapa(id, "Packing", "Empaque terminado", keccak256("certificado"));
        assertEq(t.cantidadEventos(id), 2);
    }

    function test_TraspasoCambiaElCustodio() public {
        uint256 id = _crearLote();

        vm.prank(productor);
        t.traspasarCustodia(id, transportista, "Entrega a camion");
        assertEq(t.obtenerLote(id).custodio, transportista);

        // el productor ya no puede modificar el lote
        vm.expectRevert(TrazabilidadLotes.NoEsCustodio.selector);
        vm.prank(productor);
        t.registrarEtapa(id, "Packing", "Intento tardio", bytes32(0));

        // el transportista si
        vm.prank(transportista);
        t.reportarIncidencia(id, "Se corto la cadena de frio", bytes32(0));
        assertEq(t.cantidadEventos(id), 3);
    }

    function test_TraspasoAUnaDireccionInvalidaFalla() public {
        uint256 id = _crearLote();
        vm.startPrank(productor);
        vm.expectRevert(TrazabilidadLotes.CustodioInvalido.selector);
        t.traspasarCustodia(id, address(0), "x");
        vm.expectRevert(TrazabilidadLotes.CustodioInvalido.selector);
        t.traspasarCustodia(id, productor, "x");
        vm.stopPrank();
    }

    function test_LoteCerradoNoAdmiteCambios() public {
        uint256 id = _crearLote();
        vm.startPrank(productor);
        t.cerrarLote(id, "Entregado");
        vm.expectRevert(TrazabilidadLotes.LoteYaCerrado.selector);
        t.registrarEtapa(id, "Packing", "Tarde", bytes32(0));
        vm.stopPrank();
        assertTrue(t.obtenerLote(id).cerrado);
    }

    function test_LoteInexistenteFalla() public {
        vm.expectRevert(TrazabilidadLotes.LoteInexistente.selector);
        t.obtenerLote(99);
    }

    function test_FlujoCompletoProductorTransportistaImportador() public {
        uint256 id = _crearLote();

        vm.prank(productor);
        t.registrarEtapa(id, "Packing", "Empaque terminado", bytes32(0));
        vm.prank(productor);
        t.traspasarCustodia(id, transportista, "Sale hacia puerto");

        vm.prank(transportista);
        t.registrarEtapa(id, "Puerto de Valparaiso", "Embarcado", bytes32(0));
        vm.prank(transportista);
        t.traspasarCustodia(id, importador, "Entrega en destino");

        vm.prank(importador);
        t.cerrarLote(id, "Recibido conforme");

        assertEq(t.cantidadEventos(id), 6);
        TrazabilidadLotes.Evento memory ultimo = t.obtenerEvento(id, 5);
        assertEq(uint256(ultimo.tipo), uint256(TrazabilidadLotes.TipoEvento.Cierre));
        assertEq(ultimo.autor, importador);
    }
}
