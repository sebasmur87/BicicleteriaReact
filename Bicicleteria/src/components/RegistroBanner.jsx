import "./RegistroBanner.css";

function RegistroBanner({ onRegistro }) {
  return (
    <section className="registro-banner text-center py-5">
      <div className="container">
        <h2>Empieza a rodar con nosotros</h2>

        <p>
          Crea tu cuenta y accede a ofertas exclusivas,
          seguimiento de pedidos y mucho mas.
        </p>

        <button
          className="btn btn-success"
          onClick={onRegistro}
        >
          Crear mi cuenta
        </button>
      </div>
    </section>
  );
}

export default RegistroBanner;
