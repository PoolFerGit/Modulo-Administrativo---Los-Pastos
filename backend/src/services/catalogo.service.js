import catalogoPool
    from '../config/dbCatalogo.js';

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