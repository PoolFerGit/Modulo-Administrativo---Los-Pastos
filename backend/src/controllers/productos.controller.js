import { listarProductos, buscarProductoPorId, actualizarEstadoProductoID } from '../services/productos.service.js';
import { crearProductoSincronizado, actualizarProductoSincronizado, obtenerProductoSincronizadoPorId, obtenerProductosSincronizados } from '../services/sincronizacionProductos.service.js';
import { validarProducto, validarEstadoProducto } from '../validators/productos.validator.js';
import ApiError from '../utils/ApiError.js';


export const obtenerProductos = async (request, response, next) => {

    try {

        const productos = await obtenerProductosSincronizados();

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