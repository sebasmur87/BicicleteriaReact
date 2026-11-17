import { useState } from "react"
import { cargosEmpleado } from "../utils/empleadosStorage"

// `guardar` devuelve un mensaje de error (texto) si no pudo guardar.
function FormularioEmpleado({ empleado, guardar, cancelar }) {
    const [error, setError] = useState("")
    const [formulario, setFormulario] = useState({
        nombre: empleado?.nombre ?? "",
        correo: empleado?.correo ?? "",
        password: "",
        cargo: empleado?.cargo ?? cargosEmpleado[0],
        activo: empleado ? String(empleado.activo) : "true"
    })

    const manejarCambio = (e) => {
        setError("")
        setFormulario({ ...formulario, [e.target.name]: e.target.value })
    }

    const manejarEnvio = (e) => {
        e.preventDefault()
        const mensaje = guardar({
            nombre: formulario.nombre.trim(),
            correo: formulario.correo.trim().toLowerCase(),
            password: formulario.password,
            cargo: formulario.cargo,
            activo: formulario.activo === "true"
        })

        if (mensaje) {
            setError(mensaje)
        }
    }

    return (
        <form onSubmit={manejarEnvio}>
            {error && (
                <div className="alert alert-warning py-2" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>{error}
                </div>
            )}

            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Nombre completo</label>
                    <input
                        type="text"
                        name="nombre"
                        className="form-control"
                        value={formulario.nombre}
                        onChange={manejarCambio}
                        required
                    />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Correo de acceso</label>
                    <input
                        type="email"
                        name="correo"
                        className="form-control"
                        value={formulario.correo}
                        onChange={manejarCambio}
                        required
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label">
                        {empleado ? "Nueva contraseña" : "Contraseña (mínimo 8)"}
                    </label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        autoComplete="new-password"
                        placeholder={empleado ? "Vacío = no cambiar" : ""}
                        minLength={empleado && !formulario.password ? undefined : 8}
                        value={formulario.password}
                        onChange={manejarCambio}
                        required={!empleado}
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Cargo</label>
                    <select className="form-select" name="cargo" value={formulario.cargo} onChange={manejarCambio}>
                        {cargosEmpleado.map(cargo => <option key={cargo} value={cargo}>{cargo}</option>)}
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label">Estado de la cuenta</label>
                    <select className="form-select" name="activo" value={formulario.activo} onChange={manejarCambio}>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo (no puede ingresar)</option>
                    </select>
                </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-outline-secondary" onClick={cancelar}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                    <i className="bi bi-check-circle me-2"></i>
                    {empleado ? "Actualizar empleado" : "Guardar empleado"}
                </button>
            </div>
        </form>
    )
}

export default FormularioEmpleado
