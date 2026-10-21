import ApiError from '../utils/ApiError.js';

export const validarIdProducto = (
    request,
    response,
    next
) => {

    const idProducto = Number(request.params.id);

    if (
        !Number.isInteger(idProducto) ||
        idProducto <= 0
    ) {
        return next(
            new ApiError(
                400,
                'El identificador del producto debe ser un número entero positivo.'
            )
        );
    }

    request.idProducto = idProducto;

    next();
};