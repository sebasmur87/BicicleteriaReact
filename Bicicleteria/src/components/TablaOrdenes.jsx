import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import DataTable from "react-data-table-component"
import { createRoot } from "react-dom/client"
import FormularioOrden from "./FormularioOrden"
import { obtenerClientes, nombreCliente } from "../utils/clientesStorage"
import { obtenerEmpleados, nombreEmpleado } from "../utils/empleadosStorage"
import { formatearPrecio } from "../utils/productosStorage"
import {
    obtenerOrdenes,
    guardarOrdenes,
    generarCodigoOrden,
    estadosOrden,
    claseEstado,
    siguienteEstado,
    avanzarOrden
} from "../utils/ordenesStorage"
import { opcionesPaginacion } from "../utils/tablaConfig"

const COLOR = "#1b2430"

/**
 * Una sola tabla para los tres roles:
 *  - cliente:  ve solo sus órdenes, agenda citas y edita/cancela mientras estén pendientes.
 *  - empleado: ve todas, crea, edita y avanza el estado (tomando las que no tienen mecánico).
 *  - admin:    todo lo anterior, asigna a cualquier mecánico y puede eliminar órdenes.
 * `usuarioId` es el id del cliente o del empleado que inició sesión.
 */
function TablaOrdenes({ rol = "cliente", usuarioId = null }) {
    const esStaff = rol !== "cliente"
    const esAdmin = rol === "admin"

    const [ordenes, setOrdenes] = useState(obtenerOrdenes)
    const [clientes] = useState(() => esStaff ? obtenerClientes() : [])
    const [empleados] = useState(() => obtenerEmpleados())
    const [busqueda, setBusqueda] = useState("")
    const [filtroEstado, setFiltroEstado] = useState("Todos")
    const [soloMias, setSoloMias] = useState(false)

    useEffect(() => {
        guardarOrdenes(ordenes)
    }, [ordenes])

    const puedeEditar = (orden) => esStaff || (orden.clienteId === usuarioId && orden.estado === "Pendiente")

    const abrirFormulario = async (orden = null) => {
        const contenedor = document.createElement("div")
        const raiz = createRoot(contenedor)

        raiz.render(
            <FormularioOrden
                orden={orden}
                rol={rol}
                usuarioId={usuarioId}
                clientes={clientes}
                empleados={empleados}
                ordenes={ordenes}
                guardar={(datos) => {
                    if (orden) {
                        setOrdenes(actuales =>
                            actuales.map(item => item.id === orden.id ? { ...item, ...datos } : item)
                        )
                    } else {
                        const id = generarCodigoOrden(ordenes)
                        setOrdenes(actuales => [...actuales, { id, ...datos }])
                    }
                    Swal.close()
                    Swal.fire({
                        icon: "success",
                        title: orden ? "Orden actualizada" : (esStaff ? "Orden creada" : "Cita agendada"),
                        timer: 1800,
                        showConfirmButton: false
                    })
                }}
                cancelar={() => Swal.close()}
            />
        )

        await Swal.fire({
            title: orden ? `Editar ${orden.id}` : (esStaff ? "Nueva orden de taller" : "Agendar servicio"),
            html: contenedor,
            width: 560,
            showConfirmButton: false,
            didClose: () => raiz.unmount()
        })
    }

    const cancelarOrden = async (orden) => {
        const resultado = await Swal.fire({
            title: "¿Cancelar la cita?",
            text: `Se cancelará ${orden.id} (${orden.servicio})`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "Volver",
            confirmButtonColor: "#dc3545"
        })

        if (resultado.isConfirmed) {
            setOrdenes(actuales =>
                actuales.map(item => item.id === orden.id ? { ...item, estado: "Cancelada" } : item)
            )
        }
    }

    const eliminarOrden = async (orden) => {
        const resultado = await Swal.fire({
            title: "¿Eliminar orden?",
            text: `Se borrará ${orden.id} de forma definitiva`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc3545"
        })

        if (resultado.isConfirmed) {
            setOrdenes(actuales => actuales.filter(item => item.id !== orden.id))
            Swal.fire({ title: "Orden eliminada", icon: "success", confirmButtonColor: COLOR })
        }
    }

    const avanzar = (orden) => {
        setOrdenes(actuales =>
            actuales.map(item =>
                item.id === orden.id ? avanzarOrden(item, rol === "empleado" ? usuarioId : null) : item
            )
        )
    }

    const columnas = [
        { name: "Código", selector: fila => fila.id, sortable: true, width: "100px" },
        { name: "Bicicleta", selector: fila => fila.bicicleta, sortable: true, grow: 1.4 },
        { name: "Servicio", selector: fila => fila.servicio, sortable: true, grow: 1.4 },
        {
            name: "Precio",
            selector: fila => fila.precio,
            format: fila => formatearPrecio(fila.precio),
            sortable: true
        },
        ...(esStaff ? [{
            name: "Cliente",
            selector: fila => nombreCliente(clientes, fila.clienteId),
            sortable: true,
            grow: 1.2
        }] : []),
        { name: "Fecha", selector: fila => fila.fecha, sortable: true },
        {
            name: "Mecánico",
            selector: fila => nombreEmpleado(empleados, fila.empleadoId),
            sortable: true
        },
        {
            name: "Estado",
            selector: fila => fila.estado,
            sortable: true,
            cell: fila => <span className={`bk-status ${claseEstado(fila.estado)}`}>{fila.estado}</span>
        },
        {
            name: "Acciones",
            minWidth: esStaff ? "230px" : "130px",
            cell: fila => {
                const siguiente = siguienteEstado(fila.estado)
                const tomada = fila.empleadoId && fila.empleadoId !== usuarioId
                const bloqueada = rol === "empleado" && tomada

                return (
                    <div className="d-flex gap-2 flex-wrap py-1">
                        {esStaff && siguiente && (
                            <button
                                className="btn btn-sm btn-outline-success"
                                disabled={bloqueada}
                                title={bloqueada ? "Asignada a otro mecánico" : `Pasar a «${siguiente}»`}
                                onClick={() => avanzar(fila)}
                            >
                                <i className="bi bi-arrow-right-circle me-1"></i>
                                {rol === "empleado" && fila.estado === "Pendiente" && !fila.empleadoId ? "Tomar" : siguiente}
                            </button>
                        )}
                        {puedeEditar(fila) && (
                            <button
                                className="btn btn-sm btn-outline-primary"
                                title="Editar"
                                onClick={() => abrirFormulario(fila)}
                            >
                                <i className="bi bi-pencil-square"></i>
                            </button>
                        )}
                        {!esStaff && fila.clienteId === usuarioId && fila.estado === "Pendiente" && (
                            <button
                                className="btn btn-sm btn-outline-danger"
                                title="Cancelar cita"
                                onClick={() => cancelarOrden(fila)}
                            >
                                <i className="bi bi-x-circle"></i>
                            </button>
                        )}
                        {esAdmin && (
                            <button
                                className="btn btn-sm btn-outline-danger"
                                title="Eliminar"
                                onClick={() => eliminarOrden(fila)}
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        )}
                    </div>
                )
            }
        }
    ]

    const texto = busqueda.toLowerCase()
    const ordenesVisibles = ordenes
        .filter(orden => esStaff || orden.clienteId === usuarioId)
        .filter(orden => !soloMias || orden.empleadoId === usuarioId)
        .filter(orden => filtroEstado === "Todos" || orden.estado === filtroEstado)
        .filter(orden =>
            orden.id.toLowerCase().includes(texto) ||
            orden.bicicleta.toLowerCase().includes(texto) ||
            orden.servicio.toLowerCase().includes(texto) ||
            (esStaff && nombreCliente(clientes, orden.clienteId).toLowerCase().includes(texto))
        )
        .sort((a, b) => b.id.localeCompare(a.id))

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3 gap-2 flex-wrap">
                <div className="d-flex gap-2 flex-wrap align-items-center">
                    <input
                        type="text"
                        className="form-control"
                        style={{ maxWidth: "260px" }}
                        placeholder="Buscar orden..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />
                    <select
                        className="form-select"
                        style={{ maxWidth: "170px" }}
                        value={filtroEstado}
                        onChange={e => setFiltroEstado(e.target.value)}
                        aria-label="Filtrar por estado"
                    >
                        <option value="Todos">Todos los estados</option>
                        {estadosOrden.map(estado => <option key={estado} value={estado}>{estado}</option>)}
                    </select>
                    {rol === "empleado" && (
                        <div className="form-check mb-0">
                            <input
                                id="solo-mias"
                                type="checkbox"
                                className="form-check-input"
                                checked={soloMias}
                                onChange={e => setSoloMias(e.target.checked)}
                            />
                            <label htmlFor="solo-mias" className="form-check-label">Solo mis órdenes</label>
                        </div>
                    )}
                </div>

                <button className="btn-nuevo" onClick={() => abrirFormulario()}>
                    <i className="bi bi-plus-circle me-2"></i>
                    {esStaff ? "Nueva orden" : "Agendar servicio"}
                </button>
            </div>

            <DataTable
                columns={columnas}
                data={ordenesVisibles}
                pagination
                paginationComponentOptions={opcionesPaginacion}
                highlightOnHover
                responsive
                noDataComponent={esStaff
                    ? "No se encontraron órdenes"
                    : "Aún no tienes servicios. Agenda uno para verlo aquí."}
            />
        </div>
    )
}

export default TablaOrdenes
