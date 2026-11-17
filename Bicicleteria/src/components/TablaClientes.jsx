import { useState } from "react"
import DataTable from "react-data-table-component"
import { obtenerClientes, nombreCliente } from "../utils/clientesStorage"
import { obtenerOrdenes } from "../utils/ordenesStorage"
import { formatearPrecio } from "../utils/productosStorage"
import { opcionesPaginacion } from "../utils/tablaConfig"

function TablaClientes() {
    const [clientes] = useState(obtenerClientes)
    const [ordenes] = useState(obtenerOrdenes)
    const [busqueda, setBusqueda] = useState("")

    const ordenesDe = (clienteId) => ordenes.filter(orden => orden.clienteId === clienteId)
    const gastado = (clienteId) => ordenesDe(clienteId)
        .filter(orden => orden.estado === "Entregada")
        .reduce((total, orden) => total + Number(orden.precio), 0)

    const columnas = [
        { name: "Cliente", selector: fila => nombreCliente(clientes, fila.id), sortable: true, grow: 1.3 },
        { name: "Correo", selector: fila => fila.correo, sortable: true, grow: 1.4 },
        { name: "Teléfono", selector: fila => fila.perfil?.telefono || "—", sortable: true },
        { name: "Ciudad", selector: fila => fila.perfil?.ciudad || "—", sortable: true },
        { name: "Órdenes", selector: fila => ordenesDe(fila.id).length, sortable: true, width: "110px" },
        {
            name: "Pagado en taller",
            selector: fila => gastado(fila.id),
            format: fila => formatearPrecio(gastado(fila.id)),
            sortable: true
        }
    ]

    const texto = busqueda.toLowerCase()
    const clientesFiltrados = clientes.filter(cliente =>
        nombreCliente(clientes, cliente.id).toLowerCase().includes(texto) ||
        cliente.correo.toLowerCase().includes(texto) ||
        (cliente.perfil?.ciudad || "").toLowerCase().includes(texto)
    )

    return (
        <section className="bk-panel">
            <div className="mb-3">
                <h2 className="mb-1">Clientes</h2>
                <p className="text-secondary mb-0">Personas registradas en la tienda en línea</p>
            </div>

            <div className="d-flex justify-content-end mb-3">
                <div className="input-group w-100" style={{ maxWidth: "400px" }}>
                    <span className="input-group-text"><i className="bi bi-search" aria-hidden="true"></i></span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre, correo o ciudad"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            <DataTable
                columns={columnas}
                data={clientesFiltrados}
                pagination
                paginationComponentOptions={opcionesPaginacion}
                highlightOnHover
                striped
                responsive
                noDataComponent="Aún no hay clientes registrados"
            />
        </section>
    )
}

export default TablaClientes
