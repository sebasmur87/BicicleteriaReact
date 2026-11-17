import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import DataTable from "react-data-table-component"
import FormularioEmpleado from "./FormularioEmpleado"
import { obtenerEmpleados, guardarEmpleados } from "../utils/empleadosStorage"
import { obtenerClientes, normalizarCorreo } from "../utils/clientesStorage"
import { obtenerOrdenes, guardarOrdenes } from "../utils/ordenesStorage"
import { ADMIN } from "../utils/adminConfig"
import { opcionesPaginacion } from "../utils/tablaConfig"

const ESTADOS_ACTIVOS = ["Pendiente", "En proceso", "Lista"]

function TablaEmpleados() {
    const [empleados, setEmpleados] = useState(obtenerEmpleados)
    const [ordenes, setOrdenes] = useState(obtenerOrdenes)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [empleadoEditando, setEmpleadoEditando] = useState(null)
    const [busqueda, setBusqueda] = useState("")

    useEffect(() => {
        guardarEmpleados(empleados)
    }, [empleados])

    const abrirFormulario = (empleado = null) => {
        setEmpleadoEditando(empleado)
        setMostrarFormulario(true)
    }

    const cerrarFormulario = () => {
        setMostrarFormulario(false)
        setEmpleadoEditando(null)
    }

    const guardarEmpleado = (datos) => {
        const correo = normalizarCorreo(datos.correo)
        const correoEnUso =
            correo === ADMIN.correo ||
            empleados.some(item => item.id !== empleadoEditando?.id && normalizarCorreo(item.correo) === correo) ||
            obtenerClientes().some(cliente => normalizarCorreo(cliente.correo) === correo)

        if (correoEnUso) {
            return "Ese correo ya pertenece a otra cuenta."
        }

        if (!empleadoEditando && datos.password.length < 8) {
            return "La contraseña debe tener al menos 8 caracteres."
        }

        if (empleadoEditando) {
            setEmpleados(actuales =>
                actuales.map(item =>
                    item.id === empleadoEditando.id
                        ? { ...item, ...datos, password: datos.password || item.password }
                        : item
                )
            )
        } else {
            const id = `empleado-${Date.now()}`
            setEmpleados(actuales => [...actuales, { ...datos, id }])
        }

        Swal.fire({
            title: empleadoEditando ? "Empleado actualizado" : "Empleado registrado",
            icon: "success",
            timer: 1800,
            showConfirmButton: false
        })
        cerrarFormulario()
    }

    const alternarActivo = (empleado) => {
        setEmpleados(actuales =>
            actuales.map(item => item.id === empleado.id ? { ...item, activo: !item.activo } : item)
        )
    }

    const eliminarEmpleado = async (empleado) => {
        const asignadas = ordenes.filter(orden => orden.empleadoId === empleado.id && ESTADOS_ACTIVOS.includes(orden.estado)).length
        const resultado = await Swal.fire({
            title: "¿Eliminar empleado?",
            text: asignadas
                ? `${empleado.nombre} tiene ${asignadas} orden(es) activa(s); quedarán sin asignar.`
                : `Se eliminará la cuenta de ${empleado.nombre}.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc3545"
        })

        if (!resultado.isConfirmed) {
            return
        }

        const ordenesActualizadas = ordenes.map(orden =>
            orden.empleadoId === empleado.id ? { ...orden, empleadoId: null } : orden
        )
        guardarOrdenes(ordenesActualizadas)
        setOrdenes(ordenesActualizadas)
        setEmpleados(actuales => actuales.filter(item => item.id !== empleado.id))
    }

    const columnas = [
        { name: "Nombre", selector: fila => fila.nombre, sortable: true, grow: 1.3 },
        { name: "Correo", selector: fila => fila.correo, sortable: true, grow: 1.5 },
        { name: "Cargo", selector: fila => fila.cargo, sortable: true },
        {
            name: "Órdenes activas",
            selector: fila => ordenes.filter(orden => orden.empleadoId === fila.id && ESTADOS_ACTIVOS.includes(orden.estado)).length,
            sortable: true
        },
        {
            name: "Estado",
            selector: fila => fila.activo,
            sortable: true,
            cell: fila => (
                <span className={`bk-status ${fila.activo ? "lista" : "cancelada"}`}>
                    {fila.activo ? "Activo" : "Inactivo"}
                </span>
            )
        },
        {
            name: "Acciones",
            minWidth: "150px",
            cell: fila => (
                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary" title="Editar" onClick={() => abrirFormulario(fila)}>
                        <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        title={fila.activo ? "Desactivar cuenta" : "Activar cuenta"}
                        onClick={() => alternarActivo(fila)}
                    >
                        <i className={`bi ${fila.activo ? "bi-toggle-on" : "bi-toggle-off"}`}></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" title="Eliminar" onClick={() => eliminarEmpleado(fila)}>
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            )
        }
    ]

    const texto = busqueda.toLowerCase()
    const empleadosFiltrados = empleados.filter(empleado =>
        empleado.nombre.toLowerCase().includes(texto) ||
        empleado.correo.toLowerCase().includes(texto) ||
        empleado.cargo.toLowerCase().includes(texto)
    )

    return (
        <section className="bk-panel">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                    <h2 className="mb-1">Empleados</h2>
                    <p className="text-secondary mb-0">Crea cuentas para el equipo del taller y la tienda</p>
                </div>
                <button className="btn-nuevo" onClick={() => abrirFormulario()}>
                    <i className="bi bi-plus-circle me-2"></i>Nuevo empleado
                </button>
            </div>

            {mostrarFormulario && (
                <div className="card p-4 mb-4">
                    <h5 className="mb-3">{empleadoEditando ? "Editar empleado" : "Registrar empleado"}</h5>
                    <FormularioEmpleado
                        key={empleadoEditando?.id ?? "nuevo"}
                        empleado={empleadoEditando}
                        guardar={guardarEmpleado}
                        cancelar={cerrarFormulario}
                    />
                </div>
            )}

            <div className="d-flex justify-content-end mb-3">
                <div className="input-group w-100" style={{ maxWidth: "400px" }}>
                    <span className="input-group-text"><i className="bi bi-search" aria-hidden="true"></i></span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre, correo o cargo"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            <DataTable
                columns={columnas}
                data={empleadosFiltrados}
                pagination
                paginationComponentOptions={opcionesPaginacion}
                highlightOnHover
                striped
                responsive
                noDataComponent="No hay empleados registrados"
            />
        </section>
    )
}

export default TablaEmpleados
