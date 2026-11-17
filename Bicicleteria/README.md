# Bicicleteria · Bicicletería y taller

Proyecto académico en **React + Vite**, basado en la estructura del repositorio `hotel-paraiso` pero para una bicicletería: tienda en línea, taller con citas de reparación y tres paneles según el rol de quien inicia sesión.

React 19 · Vite · React Router (`react-router-dom`) · Bootstrap 5 + Bootstrap Icons · `react-data-table-component` · SweetAlert2 · `localStorage` como base de datos.

## Cómo ejecutarlo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run lint
```

## Cuentas de demostración

| Rol      | Correo                      | Contraseña |
|----------|-----------------------------|------------|
| Admin    | admin@bicicleteria.com      | 12345      |
| Empleado | empleado@bicicleteria.com   | 12345      |
| Cliente  | cliente@bicicleteria.com    | 12345      |

También puedes registrar clientes nuevos desde el modal de login («Regístrate»). El login prueba en orden **admin → empleado → cliente** y redirige a `/admin`, `/empleado` o `/cliente`.

## Qué puede hacer cada rol

| Panel | Secciones | Permisos |
|-------|-----------|----------|
| **Admin** (`/admin`) | Resumen, Inventario, Órdenes, Clientes, Empleados | CRUD de productos y empleados (activar/desactivar cuentas), CRUD completo de órdenes (asigna a cualquier mecánico y puede eliminar), consulta de clientes, indicadores, alertas de stock |
| **Empleado** (`/empleado`) | Resumen, Órdenes de taller, Inventario | Cola de trabajo con «Tomar orden» / «Pasar a…», crea y edita órdenes (solo se asigna a sí mismo), ajusta el stock (no crea ni elimina productos) |
| **Cliente** (`/cliente`) | Mis servicios, Catálogo, Mi perfil | Agenda citas de taller, edita o cancela las suyas mientras estén *Pendiente*, explora el catálogo con filtros y edita su perfil |

Reglas del taller: máximo **6 citas por día**, cerrado los **domingos**, no se agendan fechas pasadas. Flujo de estados: `Pendiente → En proceso → Lista → Entregada` (o `Cancelada`).

## Equivalencias con el proyecto del hotel

| Hotel Paraíso | Pedal Andino |
|---------------|--------------|
| Habitaciones | Productos / inventario (`TablaProductos`, `FormularioProducto`) |
| Reservas | Órdenes de taller (`TablaOrdenes`, `FormularioOrden`) |
| Huéspedes | Clientes (`TablaClientes`) |
| — | Empleados (`TablaEmpleados`, `FormularioEmpleado`, `EmpleadoDashboard`) |
| Disponibilidad por fechas superpuestas | Cupo diario del taller |
| `usuarioHotel` en localStorage | `usuarioBici` + `usuarioBiciId` |

## Estructura

```
src/
├─ main.jsx · App.jsx            # rutas y estado de sesión (rol + id)
├─ pages/
│  ├─ Home.jsx                   # landing pública + LoginModal
│  ├─ admin/Dashboard.jsx (+ .css compartido por los tres paneles)
│  ├─ empleado/EmpleadoDashboard.jsx
│  └─ cliente/ClienteDashboard.jsx
├─ components/                   # Navbar, Hero, Catalogo, Servicios, Contacto, Footer,
│                                # LoginModal, ProtectedRoute, Sidebar, Tablas, Formularios, PerfilCliente
└─ utils/                        # clientes / empleados / productos / ordenes Storage, adminConfig, tablaConfig
```

## Notas

- Los datos viven en el navegador (`localStorage`); no se sincronizan entre dispositivos. Para reiniciar la demo, borra el almacenamiento del sitio.
- Las contraseñas se guardan en texto plano y la cuenta de admin está fija en `utils/adminConfig.js`, igual que en el proyecto original: sirve para aprender, no para producción. Para producción haría falta un backend con autenticación real.
- No hay fotos de producto: las tarjetas usan íconos de Bootstrap y la bicicleta del hero es un SVG. Puedes agregar imágenes en `src/assets/` como en el proyecto original.
