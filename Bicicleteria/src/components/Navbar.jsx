import './Navbar.css'

function Navbar({ abrirLogin }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bici-navbar sticky-top">
            <div className="container">
                <a href="#inicio" className="navbar-brand fw-bold">
                    <i className="bi bi-bicycle me-2"></i>
                    Bicicletria S.A.
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#menu"
                    aria-label="Abrir menú"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="menu">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item"><a href="#inicio" className="nav-link">Inicio</a></li>
                        <li className="nav-item"><a href="#catalogo" className="nav-link">Catálogo</a></li>
                        <li className="nav-item"><a href="#taller" className="nav-link">Taller</a></li>
                        <li className="nav-item"><a href="#contacto" className="nav-link">Contacto</a></li>
                    </ul>
                    <button
                        type="button"
                        className="btn ms-lg-3 btn-ingresar"
                        onClick={abrirLogin}
                    >
                        Iniciar sesión
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
