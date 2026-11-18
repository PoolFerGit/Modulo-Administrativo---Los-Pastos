import catalogoPool from '../config/dbCatalogo.js';

export async function listarCategoriasCatalogo() {

    const [categorias] =
        await catalogoPool.query(
            `SELECT
                categoria_id,
                categoria_nombre,
                categoria_descripcion
            FROM categoria
            ORDER BY categoria_id`
        );

    return categorias;
}

export async function registrarProductoCatalogo(
    producto
) {

    const [resultado] =
        await catalogoPool.query(
            `INSERT INTO producto
            (
                producto_nombre,
                producto_descripcion,
                producto_precio,
                categoria_id,
                producto_destacado
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                producto.producto_nombre,
                producto.producto_descripcion,
                producto.producto_precio,
                producto.categoria_id,
                producto.producto_destacado
            ]
        );

    return resultado;
}
//actualizar producto en catalogo

export async function actualizarProductoCatalogo(idProducto,producto) {

    const [resultado] = await catalogoPool.query(
        `UPDATE producto
        SET
            producto_nombre = ?,
            producto_descripcion = ?,
            producto_precio = ?,
            categoria_id = ?,
            producto_destacado = ?
        WHERE producto_id = ?`,
        [
            producto.producto_nombre,
            producto.producto_descripcion,
            producto.producto_precio,
            producto.categoria_id,
            producto.producto_destacado,
            idProducto
        ]
    );

    return resultado;
}

//listar producto en catalogo:

export async function listarProductosCatalogo() {

    const [productos] =
        await catalogoPool.query(
            `SELECT
                p.producto_id,
                p.categoria_id,
                c.categoria_nombre,
                p.producto_destacado
            FROM producto p
            LEFT JOIN categoria c
                ON p.categoria_id = c.categoria_id
            ORDER BY p.producto_id ASC`
        );

    return productos;
}

//buscar producto en catalogo por id

export async function buscarProductoCatalogoPorId(
    idProducto
) {

    const [productos] =
        await catalogoPool.query(
            `SELECT
                p.producto_id,
                p.categoria_id,
                c.categoria_nombre,
                p.producto_destacado
            FROM producto p
            LEFT JOIN categoria c
                ON p.categoria_id = c.categoria_id
            WHERE p.producto_id = ?`,
            [idProducto]
        );

    return productos[0];
}

//registrar categoria en catalogo

export async function registrarCategoriaCatalogo(
    categoria
) {

    const {
        nombre,
        descripcion
    } = categoria;


    // 1. Comprobar si ya existe una categoría
    // con el mismo nombre
    const [categoriasExistentes] =
        await catalogoPool.query(
            `SELECT
                categoria_id,
                categoria_nombre
            FROM categoria
            WHERE LOWER(categoria_nombre)
                = LOWER(?)`,
            [nombre]
        );


    // 2. Si existe, no hacemos el INSERT
    if (categoriasExistentes.length > 0) {

        return {
            creada: false,
            categoria:
                categoriasExistentes[0]
        };

    }


    // 3. Si no existe, crear la categoría
    const [resultado] =
        await catalogoPool.query(
            `INSERT INTO categoria
            (
                categoria_nombre,
                categoria_descripcion
            )
            VALUES (?, ?)`,
            [
                nombre,
                descripcion || null
            ]
        );


    return {
        creada: true,
        categoria: {
            categoria_id:
                resultado.insertId,

            categoria_nombre:
                nombre
        }
    };
}

export async function verificarDependenciasProductoCatalogo(
    idProducto
) {

    const [resultado] =
        await catalogoPool.query(
            `SELECT

                (
                    SELECT COUNT(*)
                    FROM producto_imagen
                    WHERE producto_id = ?
                ) AS imagenes,

                (
                    SELECT COUNT(*)
                    FROM inventario
                    WHERE producto_id = ?
                ) AS inventarios`,
            [
                idProducto,
                idProducto
            ]
        );


    return {

        imagenes:
            Number(
                resultado[0].imagenes
            ),

        inventarios:
            Number(
                resultado[0].inventarios
            )

    };

}

export async function eliminarProductoCatalogo(
    idProducto
) {

    const [resultado] =
        await catalogoPool.query(
            `DELETE FROM producto
            WHERE producto_id = ?`,
            [
                idProducto
            ]
        );


    return resultado;

}

export async function registrarImagenProducto(
    imagen
) {

    const [resultado] =
        await catalogoPool.query(
            `INSERT INTO producto_imagen
            (
                producto_id,
                producto_imagen_url,
                producto_imagen_alt,
                producto_imagen_orden,
                producto_imagen_principal,
                producto_imagen_origen
            )
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                imagen.producto_id,
                imagen.producto_imagen_url,
                imagen.producto_imagen_alt,
                imagen.producto_imagen_orden,
                imagen.producto_imagen_principal,
                'upload'
            ]
        );


    return {

        producto_imagen_id:
            resultado.insertId,

        ...imagen,

        producto_imagen_origen:
            'upload'

    };

}


export async function listarImagenesProducto(
    idProducto
) {

    const [imagenes] =
        await catalogoPool.query(
            `SELECT
                producto_imagen_id,
                producto_id,
                producto_imagen_url,
                producto_imagen_alt,
                producto_imagen_orden,
                producto_imagen_principal,
                producto_imagen_origen,
                producto_imagen_creada
            FROM producto_imagen
            WHERE producto_id = ?
            ORDER BY
                producto_imagen_principal DESC,
                producto_imagen_orden ASC,
                producto_imagen_id ASC`,
            [
                idProducto
            ]
        );


    return imagenes;

}


export async function buscarImagenProducto(
    idProducto,
    idImagen
) {

    const [imagenes] =
        await catalogoPool.query(
            `SELECT
                producto_imagen_id,
                producto_id,
                producto_imagen_url,
                producto_imagen_alt,
                producto_imagen_orden,
                producto_imagen_principal,
                producto_imagen_origen
            FROM producto_imagen
            WHERE producto_id = ?
            AND producto_imagen_id = ?`,
            [
                idProducto,
                idImagen
            ]
        );


    return imagenes[0];

}


export async function eliminarImagenProducto(
    idProducto,
    idImagen
) {

    const [resultado] =
        await catalogoPool.query(
            `DELETE FROM producto_imagen
            WHERE producto_id = ?
            AND producto_imagen_id = ?`,
            [
                idProducto,
                idImagen
            ]
        );


    return resultado;

}


export async function establecerImagenPrincipalCatalogo(
    idProducto,
    idImagen
) {

    await catalogoPool.query(
        `UPDATE producto_imagen
        SET producto_imagen_principal = FALSE
        WHERE producto_id = ?`,
        [
            idProducto
        ]
    );


    const [resultado] =
        await catalogoPool.query(
            `UPDATE producto_imagen
            SET producto_imagen_principal = TRUE
            WHERE producto_id = ?
            AND producto_imagen_id = ?`,
            [
                idProducto,
                idImagen
            ]
        );


    return resultado;

}