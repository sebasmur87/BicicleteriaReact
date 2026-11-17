import { useState } from "react";
import Swal from "sweetalert2";
import "./Contacto.css";

const formularioVacio = { nombre: "", email: "", mensaje: "" }

function Contacto() {
    const [datos, setDatos] = useState(formularioVacio)

    const manejarCambio = (e) => {
        setDatos({ ...datos, [e.target.name]: e.target.value })
    }

    const enviar = (e) => {
        e.preventDefault()
        Swal.fire({
            icon: "success",
            title: "Mensaje enviado",
            text: "Gracias por escribirnos, te responderemos muy pronto.",
            confirmButtonColor: "#1b2430"
        })
        setDatos(formularioVacio)
    }

    return (
        <section className="py-5 bg-light" id="contacto">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="fw-bold">Contáctanos</h2>
                    <p className="text-secondary">
                        ¿Dudas sobre una bicicleta o un servicio? Escríbenos o visítanos.
                    </p>
                </div>

                <div className="row align-items-stretch g-4">
                    <div className="col-md-6">
                        <form onSubmit={enviar}>
                            <div className="mb-3">
                                <label className="form-label">Nombre completo</label>
                                <input type="text" name="nombre" className="form-control" placeholder="Ingresa tu nombre"
                                    value={datos.nombre} onChange={manejarCambio} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Correo electrónico</label>
                                <input type="email" name="email" className="form-control" placeholder="Ingresa tu correo"
                                    value={datos.email} onChange={manejarCambio} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mensaje</label>
                                <textarea name="mensaje" className="form-control" rows="4" placeholder="¿En qué podemos ayudarte?"
                                    value={datos.mensaje} onChange={manejarCambio} required />
                            </div>
                            <button type="submit" className="btn px-4">Enviar mensaje</button>
                        </form>
                    </div>

                    <div className="col-md-6">
                        <div className="contacto-info h-100">
                            <h3 className="fs-4 fw-bold mb-4">Visítanos</h3>
                            <p><i className="bi bi-geo-alt"></i> Calle 63 #10-45, Bogotá, Colombia</p>
                            <p><i className="bi bi-clock"></i> Lunes a sábado, 8:00 a.m. – 6:00 p.m.</p>
                            <p><i className="bi bi-telephone"></i> +57 300 123 4567</p>
                            <p className="mb-0"><i className="bi bi-envelope"></i> contacto@pedalandino.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Contacto;
