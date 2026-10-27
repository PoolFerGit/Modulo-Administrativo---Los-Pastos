import {
    listarCategoriasCatalogo
} from '../services/catalogo.service.js';


export const obtenerCategorias = async (
    request,
    response,
    next
) => {

    try {

        const categorias =
            await listarCategoriasCatalogo();

        response.status(200).json({
            total: categorias.length,
            categorias: categorias
        });

    } catch (error) {

        next(error);

    }

};