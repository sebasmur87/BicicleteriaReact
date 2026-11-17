const pool = require("../config/db");

async function buscarPorCorreo(correo) {
  const [filas] = await pool.execute(
    `SELECT c.id, c.nombre, c.apellido, c.correo, c.telefono,
       c.direccion, c.password_hash, c.activo, r.nombre AS rol
     FROM cliente c
     JOIN rol r ON r.id = c.rol_id
     WHERE c.correo = ?`,
    [correo]
  );
  return filas[0] || null;
}

async function buscarPorId(id) {
  const [filas] = await pool.execute(
    `SELECT c.id, c.nombre, c.apellido, c.correo, c.telefono,
       c.direccion, c.activo, r.nombre AS rol
     FROM cliente c
     JOIN rol r ON r.id = c.rol_id
     WHERE c.id = ?`,
    [id]
  );

  return filas[0] || null;
}

async function obtenerRolCliente() {
  const [filas] = await pool.execute(
    "SELECT id FROM rol WHERE nombre = ?", ["cliente"]
  );
  return filas[0] || null;
}

async function crearUsuario(datos) {
  const [resultado] = await pool.execute(
    `INSERT INTO cliente (nombre, apellido, telefono, correo, direccion, password_hash, rol_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [datos.nombre, datos.apellido, datos.telefono, datos.correo, datos.direccion, datos.passwordHash, datos.rolId]
  );
  return resultado.insertId;
}

module.exports = {
  buscarPorCorreo,
  buscarPorId,
  obtenerRolCliente,
  crearUsuario
};
