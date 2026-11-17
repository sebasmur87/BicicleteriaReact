import { useState } from "react"
import { obtenerClientes, nombreCliente } from "../utils/clientesStorage"
import {
    obtenerOrdenes,
    guardarOrdenes,
    avanzarOrden,
    siguienteEstado,
    claseEstado
} from "../utils/ordenesStorage"

const ACTIVAS = ["Pendiente", "En proceso", "Lista"]

function ResumenEmpleado({ empleadoId, irAOrdenes }) {
    const [ordenes, setOrdenes] = useState(obtenerOrdenes)
    const [clientes] = useState(obtenerClientes)

    const mias = ordenes.filter(orden => orden.empleadoId === empleadoId && ACTIVAS.includes(orden.estado))
    const sinAsignar = ordenes.filter(orden => !orden.empleadoId && orden.estado === "Pendiente")
    const enProceso = ordenes.filter(orden => orden.estado === "En proceso").length
    const listas = ordenes.filter(orden => orden.estado === "Lista").length

    const cola = [...mias, ...sinAsignar].sort((a, b) => a.fecha.localeCompare(b.fecha))

    const avanzar = (orden) => {
        const actualizadas = ordenes.map(item =>
            item.id === orden.id ? avanzarOrden(item, empleadoId) : item
        )
        guardarOrdenes(actualizadas)
        setOrdenes(actualizadas)
    }

    const indicadores = [
        { titulo: "Mis órdenes activas", valor: mias.length, detalle: "Asignadas a ti", icono: "bi-wrench-adjustable" },
        { titulo: "Sin asignar", valor: sinAsignar.length, detalle: "Esperan un mecánico", icono: "bi-inbox" },
        { titulo: "En proceso", valor: enProceso, detalle: "En todo el taller", icono: "bi-gear" },
        { titulo: "Listas para entregar", valor: listas, detalle: "Avisar al cliente", icono: "bi-check2-circle" }
    ]

    return (
        <>
            <section className="bk-stats" aria-label="Indicadores del taller">
                {indicadores.map(dato => (
                    <article className="bk-stat" key={dato.titulo}>
                        <div className="bk-stat-top">
                            <span>{dato.titulo}</span>
                            <span className="bk-stat-icon"><i className={`bi ${dato.icono}`}></i></span>
                        </div>
                        <strong>{dato.valor}</strong>
                        <small>{dato.detalle}</small>
                    </article>
                ))}
            </section>

            <section className="bk-panel">
                <div className="bk-panel-header">
                    <div>
                        <h2>Mi cola de trabajo</h2>
                        <p>Tus órdenes activas y las que nadie ha tomado, ordenadas por fecha</p>
                    </div>
                    <button type="button" className="btn btn-sm btn-outline-dark" onClick={irAOrdenes}>
                        Ver todas las órdenes
                    </button>
                </div>

                {cola.length ? (
                    <div className="bk-cola">
                        {cola.map(orden => {
                            const siguiente = siguienteEstado(orden.estado)
                            const sinDueno = !orden.empleadoId

                            return (
                                <article className="bk-tarea" key={orden.id}>
                                    <div>
                                        <h3>{orden.id} · {orden.servicio}</h3>
                                        <p>
                                            {orden.bicicleta} · {nombreCliente(clientes, orden.clienteId)} · cita {orden.fecha}
                                        </p>
                                        {orden.notas && <p className="fst-italic">“{orden.notas}”</p>}
                                    </div>
                                    <div className="bk-tarea-acciones">
                                        <span className={`bk-status ${claseEstado(orden.estado)}`}>{orden.estado}</span>
                                        {siguiente && (
                                            <button
                                                type="button"
                                                className="btn-accent"
                                                onClick={() => avanzar(orden)}
                                            >
                                                {sinDueno ? "Tomar orden" : `Pasar a ${siguiente}`}
                                            </button>
                                        )}
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                ) : (
                    <p className="bk-vacio">¡Todo al día! No tienes órdenes pendientes.</p>
                )}
            </section>
        </>
    )
}

export default ResumenEmpleado
