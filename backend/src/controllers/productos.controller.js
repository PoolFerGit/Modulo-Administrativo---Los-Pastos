import { listarProductos, buscarProductoPorId, actualizarEstadoProductoID } from '../services/productos.service.js';
import { generarResultadoImportacion, importarProductosSincronizados, crearProductoSincronizado, actualizarProductoSincronizado, obtenerProductoSincronizadoPorId, obtenerProductosSincronizados, eliminarProductoSincronizado } from '../services/sincronizacionProductos.service.js';
import { validarProducto, validarEstadoProducto } from '../validators/productos.validator.js';
import {leerProductosExcel, normalizarProductosExcel, validarProductosExcel} from '../services/excelProductos.service.js';
import {unlink} from 'fs/promises';
import ApiError from '../utils/ApiError.js';
import path from 'path';
import {registrarImagenProducto, listarImagenesProducto, buscarImagenProducto, eliminarImagenProducto, establecerImagenPrincipalCatalogo} from '../services/catalogo.service.js';


export const obtenerProductos = async (request, response, next) => {

    try {
        const buscar =
        request.query.buscar || '';

        const productos = await obtenerProductosSincronizados(buscar);

        response.status(200).json({
            total: productos.length,
            productos: productos
        });

    } catch (error) {

        next(error);
    }
};

export const crearProducto = async (
    request,
    response,
    next
) => {

    try {

        const producto =
            request.body;

        const errores =
            validarProducto(producto);

        if (errores.length > 0) {

            throw new ApiError(
                400,
                `Errores de validación: ${errores.join(', ')}`
            );

        }

        const resultado =
            await crearProductoSincronizado(
                producto
            );

        response.status(201).json({
            mensaje:
                'Producto registrado correctamente.',
            producto:
                resultado
        });

    } catch (error) {

        next(error);

    }

};

export const obtenerProductoPorId = async (
    request,
    response,
    next
) => {

    try {

        const producto =
            await obtenerProductoSincronizadoPorId(
                request.idProducto
            );

        if (!producto) {

            throw new ApiError(
                404,
                'Producto no encontrado.'
            );

        }

        response.status(200).json({
            producto: producto
        });

    } catch (error) {

        next(error);

    }

};

//llamamos actualizarProductoPorId:
export const actualizarProducto = async (
    request,
    response,
    next
) => {

    try {

        const idProducto = request.idProducto;
        const datosProducto = request.body;

        const errores = validarProducto(
            datosProducto
        );

        if (errores.length > 0) {

            throw new ApiError(
                400,
                errores.join(' ')
            );

        }

        const productoExistente =
            await buscarProductoPorId(
                idProducto
            );

        if (!productoExistente) {

            throw new ApiError(
                404,
                'Producto no encontrado.'
            );

        }

        await actualizarProductoSincronizado(
            idProducto,
            datosProducto
        );

        response.status(200).json({
            mensaje:
                'Producto actualizado correctamente.'
        });

    } catch (error) {

        next(error);

    }

};

// actulizar estado de producto por id:
export const cambiarEstadoProducto = async (request, response, next) => {

    try {

        const idProducto = request.idProducto;

        const errores = validarEstadoProducto(
            request.body
        );

        if (errores.length > 0) {

            throw new ApiError(
                400,
                errores.join(' ')
            );

        }

        const productoExistente =
            await buscarProductoPorId(
                idProducto
            );

        if (!productoExistente) {

            throw new ApiError(
                404,
                'Producto no encontrado.'
            );

        }

        const { activo } = request.body;

        await actualizarEstadoProductoID(
            idProducto,
            activo
        );

        response.status(200).json({
            mensaje:
                'Estado del producto actualizado correctamente.',
            id_producto: idProducto,
            activo: activo
        });

    } catch (error) {

        next(error);

    }

};

export const eliminarProducto = async (
    request,
    response,
    next
) => {

    try {

        const resultado =
            await eliminarProductoSincronizado(
                request.idProducto
            );


        if (
            resultado.motivo ===
            'NO_ENCONTRADO'
        ) {

            throw new ApiError(
                404,
                'Producto no encontrado.'
            );

        }


        if (
            resultado.motivo ===
            'INCONSISTENCIA'
        ) {

            throw new ApiError(
                409,
                'El producto presenta una inconsistencia entre las bases de datos.'
            );

        }


        if (
            resultado.motivo ===
            'DEPENDENCIAS'
        ) {

            throw new ApiError(
                409,
                'No es posible eliminar el producto porque posee información relacionada.'
            );

        }


        response.status(200).json({

            mensaje:
                'Producto eliminado correctamente.'

        });


    } catch (error) {

        next(error);

    }

};

export const importarProductosExcel = async (
    request,
    response,
    next
) => {

    let rutaArchivo = null;


    try {

        if (!request.file) {

            throw new ApiError(
                400,
                'Debe seleccionar un archivo Excel.'
            );

        }


        rutaArchivo =
            request.file.path;


        const filas =
            leerProductosExcel(
                rutaArchivo
            );


        const productos =
            normalizarProductosExcel(
                filas
            );


        const errores =
            validarProductosExcel(
                productos
            );


        const validacion =
            await generarResultadoImportacion(
                productos,
                errores
            );


        if (
            !validacion.archivo_valido
        ) {

            return response
                .status(422)
                .json({

                    mensaje:
                        'El archivo contiene información que debe revisarse antes de importar.',

                    ...validacion

                });

        }


        const resultado =
            await importarProductosSincronizados(
                productos
            );


        return response
            .status(200)
            .json({

                mensaje:
                    resultado.completo
                        ? 'Los productos fueron importados correctamente.'
                        : 'La importación finalizó con algunos registros no procesados.',

                ...resultado

            });

    }
    catch (error) {

        next(error);

    }
    finally {

        if (rutaArchivo) {

            try {

                await unlink(
                    rutaArchivo
                );

            }
            catch {

            }

        }

    }

};

export const subirImagenesProducto = async (
    request,
    response,
    next
) => {

    try {

        const producto =
            await buscarProductoPorId(
                request.idProducto
            );


        if (!producto) {

            throw new ApiError(
                404,
                'Producto no encontrado.'
            );

        }


        const archivos =
            request.files || [];


        if (
            archivos.length === 0
        ) {

            throw new ApiError(
                400,
                'Debe seleccionar al menos una imagen.'
            );

        }


        const imagenesExistentes =
            await listarImagenesProducto(
                request.idProducto
            );


        let siguienteOrden = 0;


        if (
            imagenesExistentes.length > 0
        ) {

            siguienteOrden =
                Math.max(
                    ...imagenesExistentes.map(
                        imagen =>
                            Number(
                                imagen.producto_imagen_orden
                            )
                    )
                ) + 1;

        }


        const imagenesRegistradas = [];


        for (
            let indice = 0;
            indice < archivos.length;
            indice++
        ) {

            const archivo =
                archivos[indice];


            const imagen =
                await registrarImagenProducto({

                    producto_id:
                        request.idProducto,

                    producto_imagen_url:
                        `/uploads/productos/${archivo.filename}`,

                    producto_imagen_alt:
                        producto.nombre,

                    producto_imagen_orden:
                        siguienteOrden + indice,

                    producto_imagen_principal:
                        imagenesExistentes.length === 0 &&
                        indice === 0

                });


            imagenesRegistradas.push(
                imagen
            );

        }


        response.status(201).json({

            mensaje:
                'Imágenes registradas correctamente.',

            imagenes:
                imagenesRegistradas

        });

    }
    catch (error) {

        next(error);

    }

};

export const obtenerImagenesProducto = async (
    request,
    response,
    next
) => {

    try {

        const producto =
            await buscarProductoPorId(
                request.idProducto
            );


        if (!producto) {

            throw new ApiError(
                404,
                'Producto no encontrado.'
            );

        }


        const imagenes =
            await listarImagenesProducto(
                request.idProducto
            );


        response.status(200).json({

            total:
                imagenes.length,

            imagenes:
                imagenes

        });

    }
    catch (error) {

        next(error);

    }

};

export const eliminarImagenDeProducto = async (
    request,
    response,
    next
) => {

    try {

        const idImagen =
            Number(
                request.params.idImagen
            );


        if (
            !Number.isInteger(idImagen) ||
            idImagen <= 0
        ) {

            throw new ApiError(
                400,
                'Identificador de imagen inválido.'
            );

        }


        const imagen =
            await buscarImagenProducto(
                request.idProducto,
                idImagen
            );


        if (!imagen) {

            throw new ApiError(
                404,
                'Imagen no encontrada.'
            );

        }


        const eraPrincipal =
            Boolean(
                imagen.producto_imagen_principal
            );


        await eliminarImagenProducto(
            request.idProducto,
            idImagen
        );


        const nombreArchivo =
            path.basename(
                imagen.producto_imagen_url
            );


        const rutaArchivo =
            path.resolve(
                'uploads',
                'productos',
                nombreArchivo
            );


        try {

            await unlink(
                rutaArchivo
            );

        }
        catch {

        }


        if (eraPrincipal) {

            const restantes =
                await listarImagenesProducto(
                    request.idProducto
                );


            if (
                restantes.length > 0
            ) {

                await establecerImagenPrincipalCatalogo(
                    request.idProducto,
                    restantes[0]
                        .producto_imagen_id
                );

            }

        }


        response.status(200).json({

            mensaje:
                'Imagen eliminada correctamente.'

        });

    }
    catch (error) {

        next(error);

    }

};

export const establecerImagenPrincipal = async (
    request,
    response,
    next
) => {

    try {

        const idImagen =
            Number(
                request.params.idImagen
            );


        if (
            !Number.isInteger(idImagen) ||
            idImagen <= 0
        ) {

            throw new ApiError(
                400,
                'Identificador de imagen inválido.'
            );

        }


        const imagen =
            await buscarImagenProducto(
                request.idProducto,
                idImagen
            );


        if (!imagen) {

            throw new ApiError(
                404,
                'Imagen no encontrada.'
            );

        }


        await establecerImagenPrincipalCatalogo(
            request.idProducto,
            idImagen
        );


        response.status(200).json({

            mensaje:
                'Imagen principal actualizada correctamente.'

        });

    }
    catch (error) {

        next(error);

    }

};