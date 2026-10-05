import pool from '../config/db.js';

export const obtenerProductos = async (request, response) => {

    try {

        const [productos] = await pool.query(
            'SELECT * FROM productos'
        );

        response.json(productos);

    } catch (error) {

        console.error('Error al consultar productos:', error);

        response.status(500).json({
            mensaje: 'Error al consultar los productos'
        });

    }
};