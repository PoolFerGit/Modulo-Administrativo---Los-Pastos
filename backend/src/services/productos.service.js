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
        FROM productos where id_producto > 99
        ORDER BY id_producto ASC`
    );

    return productos;
}