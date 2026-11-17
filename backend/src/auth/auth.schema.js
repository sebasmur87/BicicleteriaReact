const { z } = require("zod");

const registroSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),
  apellido: z.string().trim().min(1, "El apellido es obligatorio"),
  telefono: z.string().trim().min(7, "Teléfono demasiado corto").max(20),
  correo: z.email("Correo electrónico inválido").trim().toLowerCase(),
  direccion: z.string().trim().min(1, "El nombre es obligatorio"),
  password: z.string().min(8, "La contraseña debe tener mínimo 8 caracteres").max(128)
});

const loginSchema = z.object({
  correo: z.email("Correo electrónico inválido").trim().toLowerCase(),
  password: z.string().min(1, "La contraseña es obligatoria")
});

module.exports = { registroSchema, loginSchema };