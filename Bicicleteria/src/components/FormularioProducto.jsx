import { useState } from "react"
import { tiposProducto } from "../utils/productosStorage"

function FormularioProducto({ producto, guardar, cancelar }) {
    const [formulario, setFormulario] = useState({
        nombre: producto?.nombre ?? "",
        tipo: producto?.tipo ?? tiposProducto[0],
        precio: producto?.precio ?? "",
        stock: producto?.stock ?? 0,
        estado: producto?.estado ?? "Disponible"
    })

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        })
    }

    const manejarEnvio = (e) => {
        e.preventDefault()
        guardar({
            ...formulario,
            nombre: formulario.nombre.trim(),
            precio: Number(formulario.precio),
            stock: Math.trunc(Number(formulario.stock))
        })
    }

    return (
        <form onSubmit={manejarEnvio}>
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label">Nombre del producto</label>
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
                    <label className="form-label">Tipo</label>
                    <select
                        className="form-select"
                        name="tipo"
                        value={formulario.tipo}
                        onChange={manejarCambio}
                        required
                    >
                        {tiposProducto.map(tipo => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label">Precio (COP)</label>
                    <input
                        type="number"
                        className="form-control"
                        name="precio"
                        min="1"
                        value={formulario.precio}
                        onChange={manejarCambio}
                        required
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Unidades en stock</label>
                    <input
                        type="number"
                        className="form-control"
                        name="stock"
                        min="0"
                        step="1"
                        value={formulario.stock}
                        onChange={manejarCambio}
                        required
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Estado</label>
                    <select
                        className="form-select"
                        name="estado"
                        value={formulario.estado}
                        onChange={manejarCambio}
                        required
                    >
                        <option value="Disponible">Disponible</option>
                        <option value="Descontinuada">Descontinuada</option>
                    </select>
                    <small className="text-secondary">«Agotada» se asigna sola cuando el stock llega a 0.</small>
                </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-outline-secondary" onClick={cancelar}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                    <i className="bi bi-check-circle me-2"></i>
                    {producto ? "Actualizar producto" : "Guardar producto"}
                </button>
            </div>
        </form>
    )
}

export default FormularioProducto
