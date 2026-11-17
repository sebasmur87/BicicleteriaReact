
import { useState } from "react";
import Swal from "sweetalert2";
import { iniciarSesionAPI, registrarClienteAPI } from "../services/authService";

const COLOR_BOTON = "#d9560f";

function LoginModal({ mostrar, cerrar, onLogin }) {
  const [modo, setModo] = useState("login");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [procesando, setProcesando] = useState(false);

  if (!mostrar) return null;

  // Iniciar sesión
  const iniciarSesion = async (e) => {
    e.preventDefault();

    if (procesando) return;

    setProcesando(true);

    try {
      const resultado = await iniciarSesionAPI(
        correo.trim().toLowerCase(),
        password
      );

      if (
        !resultado.token ||
        !resultado.usuario?.rol ||
        resultado.usuario?.id == null
      ) {
        throw new Error("La respuesta del servidor no contiene una sesión válida.");
      }

      await Swal.fire({
        icon: "success",
        title: `¡Bienvenido a Pedal Andino, ${resultado.usuario.nombre || "usuario"}!`,
        text: "Has iniciado sesión correctamente.",
        confirmButtonText: "Continuar",
        confirmButtonColor: COLOR_BOTON
      });

      const rol = resultado.usuario.rol === "administrador"
        ? "admin"
        : resultado.usuario.rol;

      onLogin(rol, resultado.usuario.id, resultado.token);
      cerrar();

    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "No se pudo iniciar sesión",
        text: error.message,
        confirmButtonText: "Intentar nuevamente",
        confirmButtonColor: COLOR_BOTON
      });
    } finally {
      setProcesando(false);
    }
  };

  // Registrar cliente
  const crearCuenta = async (e) => {
    e.preventDefault();

    if (procesando) return;

    if (password.length < 8) {
      await Swal.fire({
        icon: "warning",
        title: "Contraseña demasiado corta",
        text: "Tu contraseña debe tener al menos 8 caracteres.",
        confirmButtonColor: COLOR_BOTON
      });
      return;
    }

    if (password !== confirmarPassword) {
      await Swal.fire({
        icon: "warning",
        title: "Las contraseñas no coinciden",
        text: "Verifica que ambas contraseñas sean iguales.",
        confirmButtonColor: COLOR_BOTON
      });
      return;
    }

    setProcesando(true);

    try {
      await registrarClienteAPI({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        telefono: telefono.trim(),
        correo: correo.trim().toLowerCase(),
        direccion: direccion.trim(),
        password
      });

      await Swal.fire({
        icon: "success",
        title: "¡Cuenta creada!",
        text: "Ya puedes iniciar sesión en Bicicletería SA.",
        confirmButtonText: "Continuar",
        confirmButtonColor: COLOR_BOTON
      });

      setModo("login");
      setPassword("");
      setConfirmarPassword("");

    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "No se pudo crear la cuenta",
        text: error.message,
        confirmButtonText: "Entendido",
        confirmButtonColor: COLOR_BOTON
      });
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content rounded-4 shadow">

          <div className="modal-header border-0">
            <h4 className="modal-title fw-bold">
              {modo === "login" ? "Bienvenido" : "Crear cuenta"}
            </h4>

            <button
              type="button"
              className="btn-close"
              onClick={cerrar}
              aria-label="Cerrar"
            />
          </div>

          <div className="modal-body px-4 pb-4">

            <p className="text-muted">
              {modo === "login"
                ? "Ingresa a tu cuenta de Bicicletería SA."
                : "Regístrate para disfrutar de nuestros productos y servicios."}
            </p>

            {modo === "login" ? (

              <form onSubmit={iniciarSesion}>

                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="correo@ejemplo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={procesando}
                  className="btn w-100 text-white py-2"
                  style={{ backgroundColor: COLOR_BOTON }}
                >
                  {procesando ? "Ingresando..." : "Iniciar sesión"}
                </button>

              </form>

            ) : (

              <form onSubmit={crearCuenta}>

                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    autoComplete="given-name"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    type="text"
                    className="form-control"
                    autoComplete="family-name"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    autoComplete="email"
                    placeholder="correo@ejemplo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    autoComplete="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Dirección</label>
                  <input
                    type="text"
                    className="form-control"
                    autoComplete="street-address"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Contraseña (mínimo 8 caracteres)
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    autoComplete="new-password"
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Confirmar contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    autoComplete="new-password"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={procesando}
                  className="btn w-100 text-white py-2"
                  style={{ backgroundColor: COLOR_BOTON }}
                >
                  {procesando ? "Creando cuenta..." : "Crear cuenta"}
                </button>

              </form>
            )}

            <p className="text-center mt-3 mb-0">
              {modo === "login"
                ? "¿No tienes cuenta? "
                : "¿Ya tienes cuenta? "}

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();

                  if (!procesando) {
                    setModo(modo === "login" ? "registro" : "login");
                  }
                }}
              >
                {modo === "login" ? "Regístrate" : "Inicia sesión"}
              </a>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
