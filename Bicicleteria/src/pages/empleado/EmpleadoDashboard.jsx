import { useState } from "react"
import Sidebar from "../../components/Sidebar"
import ResumenEmpleado from "../../components/ResumenEmpleado"
import TablaOrdenes from "../../components/TablaOrdenes"
import TablaProductos from "../../components/TablaProductos"
import { obtenerEmpleadoPorId } from "../../utils/empleadosStorage"
import "../admin/Dashboard.css"

const opciones = ["Resumen", "Órdenes de taller", "Inventario"]

const subtitulos = {
    Resumen: "Lo que necesitas atender hoy en el taller",
    "Órdenes de taller": "Toma órdenes, avanza su estado y registra notas",
    Inventario: "Consulta el stock y ajusta las unidades"
}

function EmpleadoDashboard({ empleadoId, onLogout }) {
    const [seccion, setSeccion] = useState("Resumen")
    const [empleado] = useState(() => obtenerEmpleadoPorId(empleadoId))

    const nombre = empleado?.nombre ?? "Empleado"
    const iniciales = nombre.split(/\s+/).slice(0, 2).map(parte => parte[0]?.toUpperCase()).join("")

    return (
        <div className="bk-dashboard">
            <Sidebar
                titulo="Panel del empleado"
                opciones={opciones}
                seccion={seccion}
                cambiarSeccion={setSeccion}
                cerrarSesion={onLogout}
            />

            <main className="bk-main">
                <header className="bk-header">
                    <div>
                        <p className="bk-eyebrow">PANEL DEL EMPLEADO</p>
                        <h1>{seccion === "Resumen" ? `Hola, ${nombre.split(" ")[0]}` : seccion}</h1>
                        <p className="bk-subtitle">{subtitulos[seccion]}</p>
                    </div>
                    <div className="bk-user">
                        <span className="bk-avatar">{iniciales}</span>
                        <span>{nombre}<small>{empleado?.cargo ?? "Equipo Pedal Andino"}</small></span>
                    </div>
                </header>

                {seccion === "Resumen" && (
                    <ResumenEmpleado
                        empleadoId={empleadoId}
                        irAOrdenes={() => setSeccion("Órdenes de taller")}
                    />
                )}

                {seccion === "Órdenes de taller" && (
                    <section className="bk-panel">
                        <TablaOrdenes rol="empleado" usuarioId={empleadoId} />
                    </section>
                )}

                {seccion === "Inventario" && <TablaProductos />}

                <footer className="bk-footer">Pedal Andino · Proyecto académico React</footer>
            </main>
        </div>
    )
}

export default EmpleadoDashboard
