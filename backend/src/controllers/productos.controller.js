import { listarProductos } from '../services/productos.service.js';

export const obtenerProductos = async (request, response) => {

    try {

        const productos = await listarProductos();

        response.status(200).json({
            total: productos.length,
            productos: productos
        });

    } catch (error) {

        console.error(
            'Error al obtener los productos:',
            error
        );

        response.status(500).json({
            mensaje: 'No fue posible obtener los productos.'
        });

    }

};