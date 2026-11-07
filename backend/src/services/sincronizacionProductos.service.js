import {buscarProductoPorId, registrarProducto, actualizarProductoPorId, listarProductos, eliminarProductoAdmin} from './productos.service.js';

import {listarCategoriasCatalogo, registrarProductoCatalogo, actualizarProductoCatalogo, buscarProductoCatalogoPorId, listarProductosCatalogo, verificarDependenciasProductoCatalogo, eliminarProductoCatalogo} from './catalogo.service.js';

import {mapearProductoAGissi} from '../mappers/producto.mapper.js';

export async function prepararProductoParaCatalogo(
    idProducto
) {

    const productoAdmin =
        await buscarProductoPorId(
            idProducto
        );

    if (!productoAdmin) {
        return null;
    }

    const productoGissi =
        mapearProductoAGissi(
            productoAdmin
        );

    const categorias =
        await listarCategoriasCatalogo();

    return {

        origen_admin:
            productoAdmin,

        destino_gissi:
            productoGissi,

        datos_adicionales: {

            color:
                productoAdmin.color,

            talla_tamano:
                productoAdmin.talla_tamano,

            imagen:
                productoAdmin.imagen

        },

        categorias_disponibles:
            categorias,

        pendientes: [
            'Definir categoria_id',
            'Definir stock',
            'Resolver la variante de talla/tamaño',
            'Registrar imagen posteriormente'
        ]

    };

}

export async function crearProductoSincronizado(
    producto
) {

    const productoGissi =
        mapearProductoAGissi(
            producto
        );

    const resultadoCatalogo =
        await registrarProductoCatalogo(
            productoGissi
        );

    const idProducto =
        resultadoCatalogo.insertId;


    try {

        await registrarProducto(
            idProducto,
            producto
        );

    } catch (error) {

        try {

            await eliminarProductoCatalogo(
                idProducto
            );

        } catch (errorRollback) {

            console.error(
                'No fue posible revertir el producto en GISSI:',
                errorRollback
            );

        }

        throw error;

    }


    return {
        id_producto: idProducto
    };

}

//Obtener productos:

export async function obtenerProductosSincronizados(buscar = '') {

    const productosAdmin =
        await listarProductos(buscar);

    const productosCatalogo =
        await listarProductosCatalogo();

    const productosCompletos =
        productosAdmin.map(
            productoAdmin => {

                const productoCatalogo =
                    productosCatalogo.find(
                        producto =>
                            producto.producto_id ===
                            productoAdmin.id_producto
                    );

                return {

                    ...productoAdmin,

                    categoria_id:
                        productoCatalogo?.categoria_id ?? null,

                    categoria_nombre:
                        productoCatalogo?.categoria_nombre ?? null,

                    producto_destacado:
                        productoCatalogo
                            ? Boolean(
                                productoCatalogo.producto_destacado
                            )
                            : null

                };

            }
        );

    return productosCompletos;
}


export async function actualizarProductoSincronizado(idProducto,producto) {

    const productoGissi =
        mapearProductoAGissi(
            producto
        );

    await actualizarProductoCatalogo(
        idProducto,
        productoGissi
    );

    await actualizarProductoPorId(
        idProducto,
        producto
    );

    return {
        id_producto: idProducto
    };

}


//buscar producto en catalogo por id:

export async function obtenerProductoSincronizadoPorId(
    idProducto
) {

    const productoAdmin =
        await buscarProductoPorId(
            idProducto
        );

    if (!productoAdmin) {
        return null;
    }

    const productoCatalogo =
        await buscarProductoCatalogoPorId(
            idProducto
        );

    return {

        ...productoAdmin,

        categoria_id:
            productoCatalogo?.categoria_id ?? null,

        categoria_nombre:
            productoCatalogo?.categoria_nombre ?? null,

        producto_destacado:
            Boolean(
                productoCatalogo?.producto_destacado
            )

    };

}

export async function eliminarProductoSincronizado(
    idProducto
) {

    // ---------------------------------
    // 1. Buscar producto en ADMIN
    // ---------------------------------

    const productoAdmin =
        await buscarProductoPorId(
            idProducto
        );


    // ---------------------------------
    // 2. Buscar producto en GISSI
    // ---------------------------------

    const productoCatalogo =
        await buscarProductoCatalogoPorId(
            idProducto
        );


    // ---------------------------------
    // 3. No existe en ninguna base
    // ---------------------------------

    if (
        !productoAdmin &&
        !productoCatalogo
    ) {

        return {
            eliminado: false,
            motivo: 'NO_ENCONTRADO'
        };

    }


    // ---------------------------------
    // 4. Existe solo en una base
    // ---------------------------------

    if (
        !productoAdmin ||
        !productoCatalogo
    ) {

        return {
            eliminado: false,
            motivo: 'INCONSISTENCIA'
        };

    }


    // ---------------------------------
    // 5. Revisar relaciones
    // ---------------------------------

    const dependencias =
        await verificarDependenciasProductoCatalogo(
            idProducto
        );


    if (
        dependencias.imagenes > 0 ||
        dependencias.inventarios > 0
    ) {

        return {

            eliminado: false,

            motivo:
                'DEPENDENCIAS',

            dependencias:
                dependencias

        };

    }


    // ---------------------------------
    // 6. Eliminar GISSI
    // ---------------------------------

    await eliminarProductoCatalogo(
        idProducto
    );


    // ---------------------------------
    // 7. Eliminar ADMIN
    // ---------------------------------

    await eliminarProductoAdmin(
        idProducto
    );


    return {
        eliminado: true
    };

}