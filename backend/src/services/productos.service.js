import pool from '../config/db.js';

export async function listarProductos() {

    const [productos] = await pool.query(
        `SELECT
            id_producto,
            tipo_producto,
            nombre,
            color,
            descripcion,
            precio,
            talla_tamano,
            imagen,
            activo
        FROM productos 
        ORDER BY id_producto ASC`
    );

    return productos;
}


//postear productos:
export async function registrarProducto(producto) {

    const {
        tipo_producto,
        nombre,
        color,
        descripcion,
        precio,
        talla_tamano,
        imagen
    } = producto;

    const [resultado] = await pool.query(
        `INSERT INTO productos
        (
            tipo_producto,
            nombre,
            color,
            descripcion,
            precio,
            talla_tamano,
            imagen
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            tipo_producto,
            nombre,
            color,
            descripcion,
            precio,
            talla_tamano,
            imagen
        ]
    );

    return resultado;
}