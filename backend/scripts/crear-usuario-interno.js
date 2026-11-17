
// Uso local:
// node scripts/crear-usuario-interno.js admin "Nombre" "Apellido" correo telefono "Direccion"
// También admite el rol empleado.

require("dotenv").config();

const argon2 = require("argon2");
const pool = require("../src/config/db");
const readline = require("node:readline/promises");

async function main() {
  const [rol, nombre, apellido, correo, telefono, direccion] =
    process.argv.slice(2);

  if (
    !["admin", "empleado"].includes(rol) ||
    !nombre || !apellido || !correo || !telefono || !direccion
  ) {
    throw new Error(
      'Uso: node scripts/crear-usuario-interno.js admin "Nombre" "Apellido" correo telefono "Direccion"'
    );
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let password;

  try {
    password = await rl.question(
      "Contraseña temporal (mínimo 8 caracteres): "
    );
  } finally {
    rl.close();
  }

  if (password.length < 8) {
    throw new Error("Contraseña demasiado corta");
  }

  const nombreRol = rol === "admin" ? "administrador" : "empleado";

  const [roles] = await pool.execute(
    "SELECT id FROM rol WHERE nombre = ?",
    [nombreRol]
  );

  if (!roles.length) {
    throw new Error("El rol no existe en MySQL");
  }

  const hash = await argon2.hash(password, {
    type: argon2.argon2id
  });

  await pool.execute(
    `INSERT INTO cliente
    (nombre, apellido, telefono, correo, direccion, password_hash, rol_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre.trim(),
      apellido.trim(),
      telefono.trim(),
      correo.trim().toLowerCase(),
      direccion.trim(),
      hash,
      roles[0].id
    ]
  );

  console.log(`Cuenta ${nombreRol} creada correctamente`);
}

main()
  .catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
