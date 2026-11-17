import { useState } from "react";
import ProductoCard from "./ProductoCard";
import { obtenerProductos, estadoProducto } from "../utils/productosStorage";
import './Catalogo.css'

function Catalogo() {
    // El catálogo público muestra lo que el admin y los empleados gestionan en el inventario.
    const [destacados] = useState(() => {
        try {
            return obtenerProductos()
                .filter(producto => estadoProducto(producto) === "Disponible")
                .slice(0, 6)
        } catch {
            return []
        }
    })

    return (
        <section className="py-5 bg-light" id="catalogo">
            <div className="container">
                <h2 className="text-center fw-bold mb-3">Nuestro catálogo</h2>
                <p className="text-center text-secondary mb-5">
                    Una selección de lo que tenemos disponible hoy en tienda
                </p>

                <div className="row">
                    {destacados.length ? (
                        destacados.map((producto) => (
                            <ProductoCard key={producto.id} producto={producto} />
                        ))
                    ) : (
                        <p className="text-center text-secondary">Pronto tendremos novedades.</p>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Catalogo
