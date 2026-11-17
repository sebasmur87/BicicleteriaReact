import Swal from "sweetalert2"

const iconos = {
    Resumen: "bi-grid-1x2",
    Inventario: "bi-box-seam",
    Órdenes: "bi-wrench-adjustable",
    "Órdenes de taller": "bi-wrench-adjustable",
    Clientes: "bi-people",
    Empleados: "bi-person-badge",
    "Mis servicios": "bi-calendar2-check",
    Catálogo: "bi-bicycle",
    "Mi perfil": "bi-person-circle"
}

function Sidebar({
    titulo = "Administración",
    opciones,
    seccion,
    cambiarSeccion,
    cerrarSesion
}) {
    const confirmarSalida = () => {
        Swal.fire({
            title: "¿Deseas cerrar sesión?",
            text: "Regresarás a la página principal",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#1b2430"
        }).then((resultado) => {
            if (resultado.isConfirmed) {
                cerrarSesion()
            }
        })
    }

    return (
        <aside className="bk-sidebar">
            <div className="bk-brand">
                <span className="bk-brand-icon"><i className="bi bi-bicycle"></i></span>
                <div>
                    <strong>Pedal Andino</strong>
                    <small>{titulo}</small>
                </div>
            </div>

            <nav className="bk-menu" aria-label="Menú">
                {opciones.map((item) => (
                    <button
                        key={item}
                        type="button"
                        className={`bk-menu-item ${seccion === item ? "active" : ""}`}
                        onClick={() => cambiarSeccion(item)}
                    >
                        <span aria-hidden="true">
                            <i className={`bi ${iconos[item] || "bi-chevron-right"}`}></i>
                        </span>
                        {item}
                    </button>
                ))}
            </nav>

            <button className="bk-logout" type="button" onClick={confirmarSalida}>
                <i className="bi bi-box-arrow-left me-2"></i>
                Cerrar sesión
            </button>
        </aside>
    )
}

export default Sidebar
