import { useState } from "react"
import { formatearPrecio } from "../utils/productosStorage"
import {
    serviciosTaller,
    buscarServicio,
    estadosOrden,
    CUPO_DIARIO,
    hoyISO,
    ordenesDelDia,
    esDomingo
} from "../utils/ordenesStorage"
import { nombreCliente } from "../utils/clientesStorage"

function FormularioOrden({
    orden,
    guardar,
    cancelar,
    rol,
    usuarioId,
    clientes = [],
    empleados = [],
    ordenes = []
}) {
    const esStaff = rol !== "cliente"
    const [error, setError] = useState("")
    const [datos, setDatos] = useState(() => ({
        servicioId: orden?.servicioId ?? "",
        bicicleta: orden?.bicicleta ?? "",
        fecha: orden?.fecha ?? "",
        notas: orden?.notas ?? "",
        estado: orden?.estado ?? "Pendiente",
        clienteId: orden?.clienteId ?? "",
        empleadoId: orden?.empleadoId ?? ""
    }))

    // Un empleado solo puede dejar la orden sin asignar o a su nombre; el admin elige a cualquiera activo.
    const empleadosElegibles = rol === "admin"
        ? empleados.filter(item => item.activo || item.id === orden?.empleadoId)
        : empleados.filter(item => item.id === usuarioId)

    const servicio = buscarServicio(datos.servicioId)
    const ocupadas = datos.fecha ? ordenesDelDia(ordenes, datos.fecha, orden?.id) : 0
    const cerrado = datos.fecha && esDomingo(datos.fecha)

    const manejarCambio = (e) => {
        setError("")
        setDatos(actuales => ({ ...actuales, [e.target.name]: e.target.value }))
    }

    const manejarEnvio = (e) => {
        e.preventDefault()

        if (!servicio) {
            setError("Selecciona el servicio que necesitas.")
            return
        }

        if (!orden || datos.fecha !== orden.fecha) {
            if (datos.fecha < hoyISO()) {
                setError("La fecha de la cita no puede estar en el pasado.")
                return
            }
        }

        if (esDomingo(datos.fecha)) {
            setError("El taller permanece cerrado los domingos. Elige otro día.")
            return
        }

        const estadoFinal = esStaff ? datos.estado : (orden?.estado ?? "Pendiente")
        if (estadoFinal !== "Cancelada" && ordenesDelDia(ordenes, datos.fecha, orden?.id) >= CUPO_DIARIO) {
            setError(`Ese día el taller ya completó su cupo de ${CUPO_DIARIO} citas. Prueba con otra fecha.`)
            return
        }

        guardar({
            clienteId: esStaff ? (datos.clienteId || null) : usuarioId,
            bicicleta: datos.bicicleta.trim(),
            servicioId: servicio.id,
            servicio: servicio.nombre,
            precio: servicio.precio,
            fecha: datos.fecha,
            notas: datos.notas.trim(),
            estado: estadoFinal,
            empleadoId: esStaff ? (datos.empleadoId || null) : (orden?.empleadoId ?? null)
        })
    }

    return (
        <form onSubmit={manejarEnvio} className="text-start">
            {error && (
                <div className="alert alert-warning py-2" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>{error}
                </div>
            )}

            <div className="mb-3">
                <label className="form-label">Servicio</label>
                <select
                    className="form-select"
                    name="servicioId"
                    value={datos.servicioId}
                    onChange={manejarCambio}
                    required
                >
                    <option value="">Selecciona un servicio</option>
                    {serviciosTaller.map(item => (
                        <option key={item.id} value={item.id}>
                            {item.nombre} — {formatearPrecio(item.precio)}
                        </option>
                    ))}
                </select>
                {servicio && (
                    <div className="mt-2 p-3 rounded-3 bg-light" aria-live="polite">
                        <strong>{servicio.nombre}</strong>
                        <span className="d-block text-secondary small">{servicio.descripcion}</span>
                    </div>
                )}
            </div>

            <div className="mb-3">
                <label className="form-label">Tu bicicleta</label>
                <input
                    type="text"
                    name="bicicleta"
                    className="form-control"
                    placeholder="Marca, modelo y color"
                    value={datos.bicicleta}
                    onChange={manejarCambio}
                    required
                />
            </div>

            {esStaff && (
                <div className="mb-3">
                    <label className="form-label">Cliente</label>
                    <select
                        className="form-select"
                        name="clienteId"
                        value={datos.clienteId}
                        onChange={manejarCambio}
                    >
                        <option value="">Cliente de mostrador</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                                {nombreCliente(clientes, cliente.id)} ({cliente.correo})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="mb-3">
                <label className="form-label">Fecha de la cita</label>
                <input
                    type="date"
                    name="fecha"
                    className="form-control"
                    min={orden ? undefined : hoyISO()}
                    value={datos.fecha}
                    onChange={manejarCambio}
                    required
                />
                {datos.fecha && (
                    <small className={`d-block mt-1 ${cerrado || ocupadas >= CUPO_DIARIO ? "text-danger" : "text-secondary"}`}>
                        {cerrado
                            ? "Cerrado los domingos"
                            : `Cupo del día: ${ocupadas} de ${CUPO_DIARIO} citas ocupadas`}
                    </small>
                )}
            </div>

            {esStaff && (
                <div className="row g-3 mb-3">
                    <div className="col-sm-6">
                        <label className="form-label">Estado</label>
                        <select className="form-select" name="estado" value={datos.estado} onChange={manejarCambio}>
                            {estadosOrden.map(estado => (
                                <option key={estado} value={estado}>{estado}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label">Mecánico</label>
                        <select className="form-select" name="empleadoId" value={datos.empleadoId} onChange={manejarCambio}>
                            <option value="">Sin asignar</option>
                            {empleadosElegibles.map(empleado => (
                                <option key={empleado.id} value={empleado.id}>
                                    {empleado.nombre} ({empleado.cargo})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <div className="mb-3">
                <label className="form-label">{esStaff ? "Notas del servicio" : "¿Qué le notas a tu bicicleta?"}</label>
                <textarea
                    name="notas"
                    className="form-control"
                    rows="3"
                    placeholder={esStaff ? "Diagnóstico, repuestos usados…" : "Ruidos, frenos, cambios, golpes…"}
                    value={datos.notas}
                    onChange={manejarCambio}
                />
            </div>

            {!esStaff && !orden && (
                <p className="small text-secondary">
                    Tu cita queda <b>pendiente</b> hasta que el taller la tome y te asigne un mecánico.
                </p>
            )}

            <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={cancelar}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                    <i className="bi bi-check-circle me-2"></i>
                    {orden ? "Guardar cambios" : esStaff ? "Crear orden" : "Agendar cita"}
                </button>
            </div>
        </form>
    )
}

export default FormularioOrden
