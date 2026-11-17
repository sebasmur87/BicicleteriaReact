import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import DataTable from "react-data-table-component"
import FormularioProducto from "./FormularioProducto"
import {
    obtenerProductos,
    guardarProductos,
    estadoProducto,
    formatearPrecio,
    STOCK_BAJO
} from "../utils/productosStorage"
import { opcionesPaginacion } from "../utils/tablaConfig"

const COLOR = "#1b2430"

// esAdmin: crea, edita y elimina productos.
// Empleado (esAdmin = false): solo puede ajustar las unidades en stock.
function TablaProductos({ esAdmin = false }) {
    const [productos, setProductos] = useState(obtenerProductos)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [productoEditando, setProductoEditando] = useState(null)
    const [busqueda, setBusqueda] = useState("")

    useEffect(() => {
        guardarProductos(productos)
    }, [productos])

    const abrirFormulario = (producto = null) => {
        setProductoEditando(producto)
        setMostrarFormulario(true)
    }

    const cerrarFormulario = () => {
        setMostrarFormulario(false)
        setProductoEditando(null)
    }

    const guardarProducto = (datos) => {
        if (productoEditando) {
            setProductos(actuales =>
                actuales.map(producto =>
                    producto.id === productoEditando.id ? { ...datos, id: producto.id } : producto
                )
            )
            Swal.fire({
                title: "Producto actualizado",
                icon: "success",
                timer: 1800,
                showConfirmButton: false
            })
        } else {
            setProductos(actuales => [
                ...actuales,
                { ...datos, id: Math.max(0, ...actuales.map(producto => producto.id)) + 1 }
            ])
            Swal.fire({
                title: "Producto registrado",
                icon: "success",
                timer: 1800,
                showConfirmButton: false
            })
        }

        cerrarFormulario()
    }

    const eliminarProducto = (producto) => {
        Swal.fire({
            title: "¿Eliminar producto?",
            text: `Se quitará «${producto.nombre}» del inventario`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc3545"
        }).then((resultado) => {
            if (resultado.isConfirmed) {
                setProductos(actuales => actuales.filter(item => item.id !== producto.id))
                Swal.fire({
                    title: "Eliminado",
                    text: "El producto se eliminó correctamente",
                    icon: "success",
                    confirmButtonColor: COLOR
                })
            }
        })
    }

    const ajustarStock = async (producto) => {
        const resultado = await Swal.fire({
            title: "Ajustar stock",
            text: producto.nombre,
            input: "number",
            inputValue: producto.stock,
            inputAttributes: { min: 0, step: 1 },
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: COLOR,
            inputValidator: (valor) => {
                const numero = Number(valor)
                if (valor === "" || !Number.isInteger(numero) || numero < 0) {
                    return "Ingresa un número entero mayor o igual a 0"
                }
            }
        })

        if (resultado.isConfirmed) {
            const nuevoStock = Number(resultado.value)
            setProductos(actuales =>
                actuales.map(item => item.id === producto.id ? { ...item, stock: nuevoStock } : item)
            )
        }
    }

    const columnas = [
        { name: "ID", selector: fila => fila.id, sortable: true, width: "70px" },
        { name: "Producto", selector: fila => fila.nombre, sortable: true, grow: 2 },
        { name: "Tipo", selector: fila => fila.tipo, sortable: true },
        {
            name: "Precio",
            selector: fila => fila.precio,
            format: fila => formatearPrecio(fila.precio),
            sortable: true
        },
        {
            name: "Stock",
            selector: fila => fila.stock,
            sortable: true,
            cell: fila => (
                <span className={fila.stock <= STOCK_BAJO && estadoProducto(fila) !== "Descontinuada" ? "text-danger fw-bold" : ""}>
                    {fila.stock}
                    {fila.stock > 0 && fila.stock <= STOCK_BAJO && estadoProducto(fila) !== "Descontinuada" && (
                        <i className="bi bi-exclamation-triangle ms-1" title="Stock bajo"></i>
                    )}
                </span>
            )
        },
        {
            name: "Estado",
            selector: fila => estadoProducto(fila),
            sortable: true,
            cell: fila => {
                const estado = estadoProducto(fila)
                const clase = estado === "Disponible" ? "lista" : estado === "Agotada" ? "pendiente" : "cancelada"
                return <span className={`bk-status ${clase}`}>{estado}</span>
            }
        },
        {
            name: "Acciones",
            cell: fila => (
                <div className="d-flex gap-2">
                    {esAdmin ? (
                        <>
                            <button
                                className="btn btn-sm btn-outline-primary"
                                title="Editar"
                                onClick={() => abrirFormulario(fila)}
                            >
                                <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                title="Eliminar"
                                onClick={() => eliminarProducto(fila)}
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => ajustarStock(fila)}
                        >
                            <i className="bi bi-box-seam me-1"></i> Ajustar stock
                        </button>
                    )}
                </div>
            ),
            minWidth: esAdmin ? "120px" : "170px"
        }
    ]

    const texto = busqueda.toLowerCase()
    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(texto) ||
        producto.tipo.toLowerCase().includes(texto) ||
        estadoProducto(producto).toLowerCase().includes(texto)
    )

    return (
        <section className="bk-panel">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                    <h2 className="mb-1">Inventario</h2>
                    <p className="text-secondary mb-0">
                        {esAdmin
                            ? "Administra bicicletas, accesorios y repuestos"
                            : "Consulta el inventario y ajusta las unidades en stock"}
                    </p>
                </div>
                {esAdmin && (
                    <button className="btn-nuevo" onClick={() => abrirFormulario()}>
                        <i className="bi bi-plus-circle me-2"></i>Nuevo producto
                    </button>
                )}
            </div>

            {esAdmin && mostrarFormulario && (
                <div className="card p-4 mb-4">
                    <h5 className="mb-3">
                        {productoEditando ? "Editar producto" : "Registrar producto"}
                    </h5>
                    <FormularioProducto
                        key={productoEditando?.id ?? "nuevo"}
                        producto={productoEditando}
                        guardar={guardarProducto}
                        cancelar={cerrarFormulario}
                    />
                </div>
            )}

            <div className="d-flex justify-content-end mb-3">
                <div className="input-group w-100" style={{ maxWidth: "400px" }}>
                    <span className="input-group-text">
                        <i className="bi bi-search" aria-hidden="true"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por nombre, tipo o estado"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            <DataTable
                columns={columnas}
                data={productosFiltrados}
                pagination
                paginationComponentOptions={opcionesPaginacion}
                highlightOnHover
                striped
                responsive
                noDataComponent="No hay productos registrados"
            />
        </section>
    )
}

export default TablaProductos
