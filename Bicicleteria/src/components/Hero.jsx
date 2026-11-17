import './Hero.css'

function BiciIlustracion() {
    return (
        <svg
            className="hero-bici"
            viewBox="0 0 500 300"
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Ilustración de una bicicleta"
        >
            <circle cx="120" cy="200" r="72" />
            <circle cx="390" cy="200" r="72" />
            <circle cx="120" cy="200" r="6" fill="currentColor" />
            <circle cx="390" cy="200" r="6" fill="currentColor" />
            {/* cuadro */}
            <path d="M120 200 L235 205 L205 105 Z" />
            <path d="M205 105 L335 110 L235 205" />
            <path d="M335 110 L345 135 L390 200" />
            {/* dirección y sillín */}
            <path d="M335 110 L330 82 M312 80 L352 76" />
            <path d="M205 105 L200 90 M182 88 L224 88" />
            {/* pedalier */}
            <circle cx="235" cy="205" r="14" />
            <path d="M235 205 L252 232" />
        </svg>
    )
}

function Hero() {
    return (
        <section className="hero-bici-seccion d-flex align-items-center" id="inicio">
            <div className="container">
                <div className="row align-items-center g-4">
                    <div className="col-lg-6 hero-contenido">
                        <p className="hero-subtitulo">Bicicletería y taller</p>
                        <h1 className="display-3 fw-bold">Rueda más lejos, repara menos.</h1>
                        <p className="lead">
                            Bicicletas, accesorios y un taller que las deja listas para la ruta.
                            Agenda tu servicio en línea y sigue el estado de tu bici.
                        </p>
                        <div className="d-flex flex-wrap gap-2 mt-4">
                            <a href="#catalogo" className="btn btn-light btn-lg">Ver catálogo</a>
                            <a href="#taller" className="btn btn-outline-light btn-lg">Servicios del taller</a>
                        </div>
                    </div>
                    <div className="col-lg-6 text-center">
                        <BiciIlustracion />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
