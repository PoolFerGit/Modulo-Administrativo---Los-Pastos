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
                            : null,
                            cantidad_imagenes:
                             Number(
                             productoCatalogo?.cantidad_imagenes ?? 0
                            )

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


    const productoAdmin =
        await buscarProductoPorId(
            idProducto
        );


    const productoCatalogo =
        await buscarProductoCatalogoPorId(
            idProducto
        );



    if (
        !productoAdmin &&
        !productoCatalogo
    ) {

        return {
            eliminado: false,
            motivo: 'NO_ENCONTRADO'
        };

    }

    if (
        !productoAdmin ||
        !productoCatalogo
    ) {

        return {
            eliminado: false,
            motivo: 'INCONSISTENCIA'
        };

    }


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


    await eliminarProductoCatalogo(
        idProducto
    );



    await eliminarProductoAdmin(
        idProducto
    );


    return {
        eliminado: true
    };

}

export async function detectarCategoriasFaltantes(
    productos
) {


    const categoriasExistentes =
        await listarCategoriasCatalogo();


    const nombresExistentes =
        categoriasExistentes.map(
            categoria =>
                String(
                    categoria.categoria_nombre
                )
                    .trim()
                    .toLowerCase()
        );


    const categoriasExcel =
        productos
            .map(
                producto =>
                    producto.categoria
            )
            .filter(
                categoria =>
                    categoria
            );


    const categoriasUnicas =
        [
            ...new Map(
                categoriasExcel.map(
                    categoria => [

                        categoria
                            .trim()
                            .toLowerCase(),

                        categoria.trim()

                    ]
                )
            ).values()
        ];

    const categoriasFaltantes =
        categoriasUnicas.filter(
            categoria =>
                !nombresExistentes.includes(
                    categoria.toLowerCase()
                )
        );


    return categoriasFaltantes;

}

export async function generarResultadoImportacion(
    productos,
    errores
) {


    const categoriasFaltantes =
        await detectarCategoriasFaltantes(
            productos
        );


    const archivoValido =
        errores.length === 0 &&
        categoriasFaltantes.length === 0;

    return {

        total_filas:
            productos.length,

        archivo_valido:
            archivoValido,

        categorias_faltantes:
            categoriasFaltantes,

        errores

    };

}

function normalizarNombreCategoria(
    nombre
) {

    return String(
        nombre ?? ''
    )
        .trim()
        .toLowerCase();

}


export async function prepararProductosImportacion(
    productos
) {

    const categorias =
        await listarCategoriasCatalogo();


    const mapaCategorias =
        new Map(
            categorias.map(
                categoria => [

                    normalizarNombreCategoria(
                        categoria.categoria_nombre
                    ),

                    Number(
                        categoria.categoria_id
                    )

                ]
            )
        );


    const productosPreparados = [];


    for (
        const producto
        of productos
    ) {

        const categoriaId =
            mapaCategorias.get(
                normalizarNombreCategoria(
                    producto.categoria
                )
            );


        if (!categoriaId) {

            throw new Error(
                `La categoría "${producto.categoria}" no existe.`
            );

        }


        productosPreparados.push({

            fila_excel:
                producto.fila_excel,

            producto: {

                tipo_producto:
                    producto.tipo_producto,

                nombre:
                    producto.nombre,

                color:
                    producto.color,

                descripcion:
                    producto.descripcion,

                precio:
                    producto.precio,

                talla_tamano:
                    producto.talla_tamano,

                imagen:
                    null,

                categoria_id:
                    categoriaId,

                producto_destacado:
                    producto.producto_destacado,

                activo:
                    producto.activo

            }

        });

    }


    return productosPreparados;

}

function normalizarTexto(
    valor
) {

    return String(
        valor ?? ''
    )
        .trim()
        .toLowerCase();

}


function normalizarBooleano(
    valor
) {

    return (
        valor === true ||
        valor === 1 ||
        valor === '1' ||
        normalizarTexto(valor) === 'si' ||
        normalizarTexto(valor) === 'sí' ||
        normalizarTexto(valor) === 'true'
    );

}


function sonProductosIguales(
    existente,
    nuevo
) {

    return (

        normalizarTexto(
            existente.tipo_producto
        ) ===
        normalizarTexto(
            nuevo.tipo_producto
        )

        &&

        normalizarTexto(
            existente.nombre
        ) ===
        normalizarTexto(
            nuevo.nombre
        )

        &&

        normalizarTexto(
            existente.color
        ) ===
        normalizarTexto(
            nuevo.color
        )

        &&

        normalizarTexto(
            existente.descripcion
        ) ===
        normalizarTexto(
            nuevo.descripcion
        )

        &&

        Number(
            existente.precio
        ).toFixed(2) ===
        Number(
            nuevo.precio
        ).toFixed(2)

        &&

        normalizarTexto(
            existente.talla_tamano
        ) ===
        normalizarTexto(
            nuevo.talla_tamano
        )

        &&

        Number(
            existente.categoria_id
        ) ===
        Number(
            nuevo.categoria_id
        )

        &&

        normalizarBooleano(
            existente.producto_destacado
        ) ===
        normalizarBooleano(
            nuevo.producto_destacado
        )

        &&

        normalizarBooleano(
            existente.activo
        ) ===
        normalizarBooleano(
            nuevo.activo
        )

    );

}

export async function importarProductosSincronizados(
    productos
) {

    const productosPreparados =
        await prepararProductosImportacion(
            productos
        );


    const productosExistentes =
        await obtenerProductosSincronizados();


    const productosImportados = [];

    const productosDuplicados = [];

    const errores = [];


    for (
        const item
        of productosPreparados
    ) {

        const duplicado =
            productosExistentes.find(
                productoExistente =>
                    sonProductosIguales(
                        productoExistente,
                        item.producto
                    )
            );


        if (duplicado) {

            productosDuplicados.push({

                fila:
                    item.fila_excel,

                id_producto:
                    duplicado.id_producto,

                nombre:
                    item.producto.nombre

            });

            continue;

        }


        try {

            const resultado =
                await crearProductoSincronizado(
                    item.producto
                );


            productosImportados.push({

                fila:
                    item.fila_excel,

                id_producto:
                    resultado.id_producto,

                nombre:
                    item.producto.nombre

            });


            productosExistentes.push({

                ...item.producto,

                id_producto:
                    resultado.id_producto,

                categoria_nombre:
                    null

            });

        }
        catch (error) {

            errores.push({

                fila:
                    item.fila_excel,

                producto:
                    item.producto.nombre,

                mensaje:
                    error.message

            });

        }

    }


    return {

        total:
            productosPreparados.length,

        importados:
            productosImportados.length,

        duplicados:
            productosDuplicados.length,

        fallidos:
            errores.length,

        completo:
            errores.length === 0,

        productos:
            productosImportados,

        productos_duplicados:
            productosDuplicados,

        errores

    };

}