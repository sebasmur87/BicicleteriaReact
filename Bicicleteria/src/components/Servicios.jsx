import { serviciosTaller } from "../utils/ordenesStorage";
import { formatearPrecio } from "../utils/productosStorage";
import './Servicios.css';

function Servicios() {
    return (
        <section className="py-5" id="taller">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="fw-bold">Servicios del taller</h2>
                    <p className="text-secondary">
                        Inicia sesión para agendar tu cita y seguir el estado de tu bicicleta
                    </p>
                </div>

                <div className="row g-4">
                    {serviciosTaller.map((servicio) => (
                        <div className="col-md-6 col-lg-4" key={servicio.id}>
                            <div className="servicio-tarjeta h-100">
                                <span className="servicio-icono">
                                    <i className={`bi ${servicio.icono}`}></i>
                                </span>
                                <h3 className="fs-5 fw-bold mt-3">{servicio.nombre}</h3>
                                <p className="text-secondary mb-3">{servicio.descripcion}</p>
                                <strong className="servicio-precio">Desde {formatearPrecio(servicio.precio)}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Servicios;
