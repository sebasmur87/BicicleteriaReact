import { normalizarCorreo } from "./clientesStorage";

const claveEmpleados = "empleadosBici";

export const cargosEmpleado = ["Mecánico", "Vendedor", "Cajero", "Jefe de taller"];

function empleadosDemo() {
    return [
        {
            id: "empleado-demo",
            nombre: "Mateo Rojas",
            correo: "empleado@bicicleteria.com",
            password: "12345",
            cargo: "Mecánico",
            activo: true
        },
        {
            id: "empleado-sara",
            nombre: "Sara Pardo",
            correo: "sara@bicicleteria.com",
            password: "12345",
            cargo: "Vendedor",
            activo: true
        }
    ];
}

export function obtenerEmpleados() {
    const guardados = localStorage.getItem(claveEmpleados);
    if (guardados !== null) {
        const empleados = JSON.parse(guardados);
        if (!Array.isArray(empleados)) {
            throw new Error("El registro de empleados guardado no tiene un formato válido.");
        }
        return empleados;
    }

    const iniciales = empleadosDemo();
    localStorage.setItem(claveEmpleados, JSON.stringify(iniciales));
    return iniciales;
}

export function guardarEmpleados(empleados) {
    localStorage.setItem(claveEmpleados, JSON.stringify(empleados));
}

export function autenticarEmpleado(correo, password) {
    const correoNormalizado = normalizarCorreo(correo);
    const empleado = obtenerEmpleados().find(item =>
        normalizarCorreo(item.correo) === correoNormalizado &&
        item.password === password
    );

    if (!empleado) {
        return null;
    }

    if (!empleado.activo) {
        throw new Error("Tu cuenta de empleado está inactiva. Habla con el administrador.");
    }

    return empleado;
}

export function obtenerEmpleadoPorId(empleadoId) {
    return obtenerEmpleados().find(item => item.id === empleadoId) ?? null;
}

export function nombreEmpleado(empleados, empleadoId) {
    return empleados.find(item => item.id === empleadoId)?.nombre ?? "Sin asignar";
}
