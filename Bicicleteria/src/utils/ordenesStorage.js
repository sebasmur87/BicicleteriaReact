const claveOrdenes = "ordenesBici";
const claveConsecutivo = "consecutivoOrdenesBici";
const prefijoCodigo = "ORD-";

export const estadosOrden = ["Pendiente", "En proceso", "Lista", "Entregada", "Cancelada"];
export const CUPO_DIARIO = 6;

export const serviciosTaller = [
    { id: "ajuste", nombre: "Ajuste general", precio: 35000, icono: "bi-sliders", descripcion: "Frenos, cambios, tornillería y presión de llantas." },
    { id: "mantenimiento", nombre: "Mantenimiento completo", precio: 120000, icono: "bi-tools", descripcion: "Desarme, limpieza profunda, lubricación y calibración." },
    { id: "frenos", nombre: "Cambio de frenos", precio: 60000, icono: "bi-disc", descripcion: "Pastillas o discos, purga y ajuste de palancas." },
    { id: "transmision", nombre: "Transmisión", precio: 80000, icono: "bi-gear-wide-connected", descripcion: "Cadena, cassette, platos y calibración de cambios." },
    { id: "llantas", nombre: "Llantas y rines", precio: 45000, icono: "bi-record-circle", descripcion: "Cambio de llantas, centrado de rines y reparación de pinchazos." },
    { id: "electrica", nombre: "Revisión bici eléctrica", precio: 90000, icono: "bi-lightning-charge", descripcion: "Diagnóstico de batería, motor y controlador." }
];

export function buscarServicio(servicioId) {
    return serviciosTaller.find(servicio => servicio.id === servicioId) ?? null;
}

function sumarDias(dias) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${fecha.getFullYear()}-${mes}-${dia}`;
}

function ordenesDemo() {
    const orden = (n, clienteId, bicicleta, servicioId, dias, estado, empleadoId, notas = "") => {
        const servicio = buscarServicio(servicioId);
        return {
            id: `${prefijoCodigo}${String(n).padStart(3, "0")}`,
            clienteId,
            bicicleta,
            servicioId,
            servicio: servicio.nombre,
            precio: servicio.precio,
            fecha: sumarDias(dias),
            estado,
            empleadoId,
            notas
        };
    };

    return [
        orden(1, "cliente-demo", "Trek Marlin 5 azul", "mantenimiento", 2, "Pendiente", null, "Hace ruido al pedalear."),
        orden(2, "cliente-demo", "Giant Escape 3", "frenos", -3, "En proceso", "empleado-demo", "Freno trasero sin fuerza."),
        orden(3, "cliente-laura", "Specialized Allez roja", "transmision", -1, "En proceso", "empleado-sara"),
        orden(4, "cliente-carlos", "Bici urbana plegable", "ajuste", -6, "Lista", "empleado-demo"),
        orden(5, "cliente-laura", "Scott E-Sub Cross", "electrica", -10, "Entregada", "empleado-demo", "Batería reemplazada por garantía."),
        orden(6, "cliente-carlos", "Montaña rodado 29", "llantas", 1, "Pendiente", null)
    ];
}

export function obtenerOrdenes() {
    const guardadas = localStorage.getItem(claveOrdenes);
    if (guardadas === null) {
        const iniciales = ordenesDemo();
        localStorage.setItem(claveOrdenes, JSON.stringify(iniciales));
        localStorage.setItem(claveConsecutivo, String(iniciales.length + 1));
        return iniciales;
    }

    const ordenes = JSON.parse(guardadas);
    if (!Array.isArray(ordenes)) {
        throw new Error("Las órdenes guardadas no tienen un formato válido.");
    }

    return ordenes;
}

export function guardarOrdenes(ordenes) {
    localStorage.setItem(claveOrdenes, JSON.stringify(ordenes));
}

export function generarCodigoOrden(ordenesActuales = []) {
    const maximo = ordenesActuales.reduce((mayor, orden) => {
        const coincidencia = /^ORD-(\d+)$/.exec(String(orden.id));
        return coincidencia ? Math.max(mayor, Number.parseInt(coincidencia[1], 10)) : mayor;
    }, 0);
    const guardado = Number.parseInt(localStorage.getItem(claveConsecutivo) || "1", 10);
    const siguiente = Math.max(maximo + 1, Number.isSafeInteger(guardado) ? guardado : 1);

    localStorage.setItem(claveConsecutivo, String(siguiente + 1));
    return `${prefijoCodigo}${String(siguiente).padStart(3, "0")}`;
}

export function hoyISO() {
    return sumarDias(0);
}

/** Cuántas órdenes activas (no canceladas) hay en una fecha, para respetar el cupo del taller. */
export function ordenesDelDia(ordenes, fecha, ignorarId = null) {
    return ordenes.filter(orden =>
        orden.fecha === fecha &&
        orden.estado !== "Cancelada" &&
        orden.id !== ignorarId
    ).length;
}

export function esDomingo(fechaISO) {
    return new Date(`${fechaISO}T12:00:00`).getDay() === 0;
}

export function claseEstado(estado) {
    return {
        Pendiente: "pendiente",
        "En proceso": "proceso",
        Lista: "lista",
        Entregada: "entregada",
        Cancelada: "cancelada"
    }[estado] ?? "pendiente";
}

const flujoEstados = {
    Pendiente: "En proceso",
    "En proceso": "Lista",
    Lista: "Entregada"
};

export function siguienteEstado(estado) {
    return flujoEstados[estado] ?? null;
}

/** Avanza una orden un paso. Si un empleado la toma y no tenía mecánico, queda asignada a él. */
export function avanzarOrden(orden, empleadoId = null) {
    const estado = siguienteEstado(orden.estado);
    if (!estado) {
        return orden;
    }

    return {
        ...orden,
        estado,
        empleadoId: orden.empleadoId ?? empleadoId
    };
}
