import { useState } from "react"
import ProductoCard from "./ProductoCard"
import { obtenerProductos, estadoProducto, tiposProducto } from "../utils/productosStorage"
import "./Catalogo.css"

function CatalogoCliente() {
    const [productos] = useState(() => {
        try {
            return obtenerProductos().filter(producto => estadoProducto(producto) !== "Descontinuada")
        } catch {
            return []
        }
    })
    const [tipo, setTipo] = useState("Todos")
    const [busqueda, setBusqueda] = useState("")

    const texto = busqueda.toLowerCase()
    const visibles = productos.filter(producto =>
        (tipo === "Todos" || producto.tipo === tipo) &&
        producto.nombre.toLowerCase().includes(texto)
    )

    return (
        <div>
            <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                <div className="bk-filtros mb-0">
                    {["Todos", ...tiposProducto].map(opcion => (
                        <button
                            key={opcion}
                            type="button"
                            className={`bk-pill ${tipo === opcion ? "active" : ""}`}
                            onClick={() => setTipo(opcion)}
                        >
                            {opcion}
                        </button>
                    ))}
                </div>
                <input
                    type="text"
                    className="form-control"
                    style={{ maxWidth: "260px" }}
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            <div className="row">
                {visibles.length ? (
                    visibles.map(producto => <ProductoCard key={producto.id} producto={producto} />)
                ) : (
                    <p className="bk-vacio">No encontramos productos con ese filtro.</p>
                )}
            </div>
        </div>
    )
}

export default CatalogoCliente
