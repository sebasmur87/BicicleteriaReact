function Footer() {
  return (
    <footer className="text-white py-4" style={{ backgroundColor: "#1b2430" }}>
      <div className="container">
        <div className="row gy-4">
          <div className="col-md-4">
            <h4 className="fw-bold" style={{ color: "#ff6a1a" }}>
              <i className="bi bi-bicycle me-2"></i>Bicicletria S.A.
            </h4>
            <p className="text-white-50">Bicicletas, accesorios y taller para tu día a día.</p>
          </div>
          <div className="col-md-4">
            <h5>Enlaces de interés</h5>
            <ul className="list-unstyled">
              <li><a href="#inicio" className="text-white text-decoration-none">Inicio</a></li>
              <li><a href="#catalogo" className="text-white text-decoration-none">Catálogo</a></li>
              <li><a href="#taller" className="text-white text-decoration-none">Taller</a></li>
              <li><a href="#contacto" className="text-white text-decoration-none">Contacto</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contáctanos</h5>
            <p className="text-white-50 mb-1">Bogotá, Colombia</p>
            <p className="text-white-50 mb-1">bicicleteriasa.com</p>
          </div>
        </div>
        <hr />
        <div className="text-center">
          <p className="mb-0 text-white-50">
            © {new Date().getFullYear()} Bicicleteria S.A. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
