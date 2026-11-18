
import { estadoProducto, formatearPrecio } from "../utils/productosStorage"

const iconoPorTipo = {
    Montaña: "bi-tree",
    Ruta: "bi-speedometer2",
    Urbana: "bi-buildings",
    Eléctrica: "bi-lightning-charge",
    Accesorio: "bi-shield-check",
    Repuesto: "bi-gear"
}

function ProductoCard({ producto }) {
    const estado = estadoProducto(producto)

    return (
        <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 border-0 shadow-sm producto-card">

                <div className="producto-visual">
                    <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="img-fluid"
                    />

                    <span className="producto-tipo">{producto.tipo}</span>
                </div>

                <div className="card-body p-4 d-flex flex-column">
                    <h4 className="card-title fw-bold fs-5">
                        {producto.nombre}
                    </h4>

                    <p className="fw-bold fs-5 mb-1">
                        {formatearPrecio(producto.precio)} COP
                    </p>

                    <span className={`bk-status ${estado === "Disponible" ? "lista" : "cancelada"} align-self-start`}>
                        {estado === "Disponible" ? `${producto.stock} en stock` : estado}
                    </span>
                </div>

            </div>
        </div>
    )
}

export default ProductoCard
