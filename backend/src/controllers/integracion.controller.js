import {prepararProductoParaCatalogo} from '../services/sincronizacionProductos.service.js';

import ApiError from '../utils/ApiError.js';

export const prepararProducto = async (
    request,
    response,
    next
) => {

    try {

        const resultado =
            await prepararProductoParaCatalogo(
                request.idProducto
            );

        if (!resultado) {

            throw new ApiError(
                404,
                'Producto no encontrado.'
            );

        }

        response.status(200).json(
            resultado
        );

    } catch (error) {

        next(error);

    }

};