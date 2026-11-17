// V2: el catálogo inicial ahora incluye fotos; la clave nueva evita mezclarlo con datos viejos del navegador.
const claveProductos = "productosBiciV2";


export const tiposProducto = ["Montaña", "Eléctrica", "Accesorio", "Repuesto"];


export const productosIniciales = [
    { id: 1, nombre: "Bicicleta de montaña Neon Trail", tipo: "Montaña", precio: 850000, stock: 5, estado: "Disponible", imagen: "/productos/bicicleta-neon-trail.jpg" },
    { id: 2, nombre: "Bicicleta GW Falcon MTB 24 vel Rin 29", tipo: "Montaña", precio: 699900, stock: 4, estado: "Disponible", imagen: "/productos/bicicleta-gw-falcon.jpg" },
    { id: 3, nombre: "Sillín ergonómico Recovery Zone", tipo: "Accesorio", precio: 45000, stock: 12, estado: "Disponible", imagen: "/productos/sillin-ergonomico.jpg" },
    { id: 4, nombre: "Juego de bielas Shimano Altus FC-MT210", tipo: "Repuesto", precio: 203500, stock: 6, estado: "Disponible", imagen: "/productos/shimano-altus-bielas.jpg" },
    { id: 5, nombre: "Llanta Maxxis Rekon Race 29x2.25", tipo: "Repuesto", precio: 99000, stock: 8, estado: "Disponible", imagen: "/productos/maxxis-rekon-race.jpg" },
    { id: 6, nombre: "Manubrio mariposa de aluminio", tipo: "Repuesto", precio: 38000, stock: 10, estado: "Disponible", imagen: "/productos/manubrio-mariposa.jpg" },
//          { id: 13, nombre: "Cadena Shimano 10v", tipo: "Repuesto", precio: 68000, stock: 3, estado: "Disponible", imagen: "/productos/Cadena.jpg" },
   
];


export const STOCK_BAJO = 3;


export function obtenerProductos() {
    const guardados = localStorage.getItem(claveProductos);
    if (guardados === null) {
        localStorage.setItem(claveProductos, JSON.stringify(productosIniciales));
        return productosIniciales;
    }


    const productos = JSON.parse(guardados);
    if (!Array.isArray(productos)) {
        throw new Error("Los productos guardados no tienen un formato válido.");
    }


    return productos;
}


export function guardarProductos(productos) {
    localStorage.setItem(claveProductos, JSON.stringify(productos));
}


/** El estado visible se calcula: Descontinuada se elige a mano, Agotada depende del stock. */
export function estadoProducto(producto) {
    if (producto.estado === "Descontinuada") return "Descontinuada";
    return Number(producto.stock) <= 0 ? "Agotada" : "Disponible";
}


export function formatearPrecio(precio) {
    return `$${Number(precio).toLocaleString("es-CO")}`;
}