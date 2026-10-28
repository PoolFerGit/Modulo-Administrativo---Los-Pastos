import {
    listarCategoriasCatalogo
} from '../services/catalogo.service.js';

import {
    registrarCategoriaCatalogo
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

//agragamos registrar categoria

export const crearCategoria = async (
    request,
    response,
    next
) => {

    try {

        const {
            nombre,
            descripcion
        } = request.body;


        if (
            !nombre ||
            nombre.trim() === ''
        ) {

            return response
                .status(400)
                .json({
                    error:
                        'El nombre de la categoría es obligatorio.'
                });

        }


        const resultado =
            await registrarCategoriaCatalogo({
                nombre:
                    nombre.trim(),

                descripcion:
                    descripcion?.trim() || null
            });


        if (!resultado.creada) {

            return response
                .status(409)
                .json({

                    error:
                        'Ya existe una categoría con ese nombre.',

                    categoria:
                        resultado.categoria

                });

        }


        return response
            .status(201)
            .json({

                mensaje:
                    'Categoría registrada correctamente.',

                categoria:
                    resultado.categoria

            });


    } catch (error) {

        next(error);

    }

};