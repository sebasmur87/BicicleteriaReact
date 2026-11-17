import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import './Dashboard.css'
import TablaProductos from '../../components/TablaProductos'
import TablaOrdenes from '../../components/TablaOrdenes'
import TablaClientes from '../../components/TablaClientes'
import TablaEmpleados from '../../components/TablaEmpleados'
import { obtenerClientes, nombreCliente } from '../../utils/clientesStorage'
import { obtenerEmpleados } from '../../utils/empleadosStorage'
import { obtenerProductos, estadoProducto, formatearPrecio, STOCK_BAJO } from '../../utils/productosStorage'
import { obtenerOrdenes, estadosOrden, claseEstado } from '../../utils/ordenesStorage'

const secciones = ['Resumen', 'Inventario', 'Órdenes', 'Clientes', 'Empleados']

const subtitulos = {
  Resumen: 'Resumen general de la operación de la bicicletería',
  Inventario: 'Bicicletas, accesorios y repuestos disponibles',
  Órdenes: 'Seguimiento de las órdenes del taller',
  Clientes: 'Cuentas registradas en la tienda en línea',
  Empleados: 'Equipo con acceso al panel de trabajo'
}

function Dashboard({ onLogout }) {
  const [seccion, setSeccion] = useState('Resumen')

  const [ordenes] = useState(() => obtenerOrdenes())
  const [productos] = useState(() => obtenerProductos())
  const [clientes] = useState(() => obtenerClientes())
  const [empleados] = useState(() => obtenerEmpleados())

  const productosActivos = productos.filter(producto => estadoProducto(producto) !== 'Descontinuada')
  const stockBajo = productosActivos.filter(producto => Number(producto.stock) <= STOCK_BAJO)
  const activas = ordenes.filter(orden => ['Pendiente', 'En proceso', 'Lista'].includes(orden.estado)).length
  const ingresos = ordenes
    .filter(orden => orden.estado === 'Entregada')
    .reduce((total, orden) => total + Number(orden.precio), 0)
  const recientes = [...ordenes].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5)
  const maximoPorEstado = Math.max(1, ...estadosOrden.map(estado => ordenes.filter(orden => orden.estado === estado).length))

  const indicadores = [
    { titulo: 'Productos', valor: productosActivos.length, detalle: 'En catálogo activo', icono: 'bi-bicycle' },
    { titulo: 'Stock bajo', valor: stockBajo.length, detalle: `${STOCK_BAJO} unidades o menos`, icono: 'bi-exclamation-triangle' },
    { titulo: 'Órdenes activas', valor: activas, detalle: 'Pendientes, en proceso o listas', icono: 'bi-wrench-adjustable' },
    { titulo: 'Clientes', valor: clientes.length, detalle: 'Cuentas registradas', icono: 'bi-people' },
    { titulo: 'Empleados', valor: empleados.filter(empleado => empleado.activo).length, detalle: 'Cuentas activas', icono: 'bi-person-badge' },
    { titulo: 'Ingresos del taller', valor: formatearPrecio(ingresos), detalle: 'Órdenes entregadas', icono: 'bi-cash-coin' }
  ]

  return (
    <div className="bk-dashboard">
      <Sidebar
        titulo="Administración"
        opciones={secciones}
        seccion={seccion}
        cambiarSeccion={setSeccion}
        cerrarSesion={onLogout}
      />

      <main className="bk-main">
        <header className="bk-header">
          <div>
            <p className="bk-eyebrow">PANEL ADMINISTRATIVO</p>
            <h1>{seccion === 'Resumen' ? 'Bienvenido a Pedal Andino' : seccion}</h1>
            <p className="bk-subtitle">{subtitulos[seccion]}</p>
          </div>
          <div className="bk-user"><span className="bk-avatar">A</span><span>Administrador</span></div>
        </header>

        {seccion === 'Resumen' && (
          <>
            <section className="bk-stats" aria-label="Indicadores de la bicicletería">
              {indicadores.map((dato) => (
                <article className="bk-stat" key={dato.titulo}>
                  <div className="bk-stat-top">
                    <span>{dato.titulo}</span>
                    <span className="bk-stat-icon"><i className={`bi ${dato.icono}`}></i></span>
                  </div>
                  <strong>{dato.valor}</strong>
                  <small>{dato.detalle}</small>
                </article>
              ))}
            </section>

            <div className="bk-grid-2">
              <section className="bk-panel">
                <div className="bk-panel-header">
                  <div><h2>Órdenes recientes</h2><p>Últimos registros del taller</p></div>
                  <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => setSeccion('Órdenes')}>
                    Ver todas
                  </button>
                </div>
                <div className="bk-table-wrap">
                  <table className="bk-table">
                    <thead>
                      <tr><th>Código</th><th>Cliente</th><th>Servicio</th><th>Fecha</th><th>Estado</th></tr>
                    </thead>
                    <tbody>
                      {recientes.map((orden) => (
                        <tr key={orden.id}>
                          <td>{orden.id}</td>
                          <td>{nombreCliente(clientes, orden.clienteId)}</td>
                          <td>{orden.servicio}</td>
                          <td>{orden.fecha}</td>
                          <td><span className={`bk-status ${claseEstado(orden.estado)}`}>{orden.estado}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div>
                <section className="bk-panel">
                  <div className="bk-panel-header"><div><h2>Órdenes por estado</h2></div></div>
                  <div className="bk-barras">
                    {estadosOrden.map(estado => {
                      const cantidad = ordenes.filter(orden => orden.estado === estado).length
                      return (
                        <div className="bk-barra-fila" key={estado}>
                          <span>{estado}</span>
                          <div className="bk-barra"><span style={{ width: `${(cantidad / maximoPorEstado) * 100}%` }}></span></div>
                          <strong>{cantidad}</strong>
                        </div>
                      )
                    })}
                  </div>
                </section>

                <section className="bk-panel">
                  <div className="bk-panel-header">
                    <div><h2>Alertas de stock</h2><p>Productos por reponer</p></div>
                    <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => setSeccion('Inventario')}>
                      Inventario
                    </button>
                  </div>
                  {stockBajo.length ? (
                    <ul className="bk-lista">
                      {stockBajo.map(producto => (
                        <li key={producto.id}>
                          <div>{producto.nombre}<small>{producto.tipo}</small></div>
                          <span className={`bk-status ${Number(producto.stock) === 0 ? 'cancelada' : 'pendiente'}`}>
                            {Number(producto.stock) === 0 ? 'Agotado' : `${producto.stock} u.`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="bk-vacio">Todo el inventario está sobre el mínimo.</p>
                  )}
                </section>
              </div>
            </div>
          </>
        )}

        {seccion === 'Inventario' && <TablaProductos esAdmin />}

        {seccion === 'Órdenes' && (
          <section className="bk-panel">
            <TablaOrdenes rol="admin" />
          </section>
        )}

        {seccion === 'Clientes' && <TablaClientes />}

        {seccion === 'Empleados' && <TablaEmpleados />}

        <footer className="bk-footer">Pedal Andino · Proyecto académico React</footer>
      </main>
    </div>
  )
}

export default Dashboard
