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
export async function registrarProducto(
    idProducto,
    producto
) {

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
            id_producto,
            tipo_producto,
            nombre,
            color,
            descripcion,
            precio,
            talla_tamano,
            imagen
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            idProducto,
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

//buscar productos por id:
export async function buscarProductoPorId(idProducto) {

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
        WHERE id_producto = ?`,
        [idProducto]
    );

    return productos[0];
}

//actualizar productos por id::

export async function actualizarProductoPorId(
    idProducto,
    producto
) {

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
        `UPDATE productos
        SET
            tipo_producto = ?,
            nombre = ?,
            color = ?,
            descripcion = ?,
            precio = ?,
            talla_tamano = ?,
            imagen = ?
        WHERE id_producto = ?`,
        [
            tipo_producto,
            nombre,
            color,
            descripcion,
            precio,
            talla_tamano,
            imagen,
            idProducto
        ]
    );

    return resultado;
}

//filtrar por estado activo o inactivo:
export async function actualizarEstadoProductoID(idProducto, activo)
{

    const [resultado] = await pool.query(
        `UPDATE productos
        SET activo = ?
        WHERE id_producto = ?`,
        [
            activo,
            idProducto
        ]
    );

    return resultado;
}