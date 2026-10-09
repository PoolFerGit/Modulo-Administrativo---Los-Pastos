import { listarProductos, registrarProducto } from '../services/productos.service.js';
import { validarProducto } from '../validators/productos.validator.js';
import ApiError from '../utils/ApiError.js';


export const obtenerProductos = async (request, response, next) => {

    try {

        const productos = await listarProductos();

        response.status(200).json({
            total: productos.length,
            productos: productos
        });

    } catch (error) {

        next(error);
    }
};

export const crearProducto = async (request, response, next) => {
    try {
        const producto = request.body;
        const errores = validarProducto(producto);
        if (errores.length > 0) {
            throw new ApiError(400, `Errores de validación: ${errores.join(', ')}`);
        }
        const resultado = await registrarProducto(producto);
        response.status(201).json({
            mensaje: 'Producto registrado exitosamente.',
            producto: resultado
        });
    } catch (error) {
        next(error);
    }
};