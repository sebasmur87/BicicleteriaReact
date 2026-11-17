import { useState } from "react"
import Sidebar from "../../components/Sidebar"
import TablaOrdenes from "../../components/TablaOrdenes"
import CatalogoCliente from "../../components/CatalogoCliente"
import PerfilCliente from "../../components/PerfilCliente"
import { obtenerClientePorId } from "../../utils/clientesStorage"
import "../admin/Dashboard.css"

const opciones = ["Mis servicios", "Catálogo", "Mi perfil"]

const descripciones = {
    "Mis servicios": "Agenda citas de taller y sigue el estado de tu bicicleta",
    Catálogo: "Lo que tenemos disponible hoy en tienda",
    "Mi perfil": "Aquí podrás consultar tu información personal."
}

function ClienteDashboard({ clienteId, onLogout }) {
    const [seccion, setSeccion] = useState("Mis servicios")
    const [cliente] = useState(() => obtenerClientePorId(clienteId))

    const nombre = cliente?.perfil?.nombre || cliente?.correo || "cliente"

    return (
        <div className="bk-dashboard">
            <Sidebar
                titulo="Espacio del cliente"
                opciones={opciones}
                seccion={seccion}
                cambiarSeccion={setSeccion}
                cerrarSesion={onLogout}
            />

            <main className="bk-main">
                <header className="bk-header">
                    <div>
                        <p className="bk-eyebrow">PANEL DEL CLIENTE</p>
                        <h1>{seccion}</h1>
                        <p className="bk-subtitle">Bienvenido a Pedal Andino, {nombre.split(" ")[0]}</p>
                    </div>
                </header>

                <section className="bk-panel">
                    <div className="bk-panel-header">
                        <div>
                            <h2>{seccion}</h2>
                            <p>{descripciones[seccion]}</p>
                        </div>
                    </div>

                    {seccion === "Mis servicios" && <TablaOrdenes rol="cliente" usuarioId={clienteId} />}
                    {seccion === "Catálogo" && <CatalogoCliente />}
                    {seccion === "Mi perfil" && <PerfilCliente key={clienteId} clienteId={clienteId} />}
                </section>

                <footer className="bk-footer">Pedal Andino · Proyecto académico React</footer>
            </main>
        </div>
    )
}

export default ClienteDashboard
