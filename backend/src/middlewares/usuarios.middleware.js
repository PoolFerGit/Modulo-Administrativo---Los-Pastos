import ApiError from '../utils/ApiError.js';


export const validarIdUsuario = (
    request,
    response,
    next
) => {

    const idUsuario =
        Number(
            request.params.id
        );


    if (
        !Number.isInteger(
            idUsuario
        ) ||
        idUsuario <= 0
    ) {

        return next(
            new ApiError(
                400,
                'El identificador del usuario debe ser un número entero positivo.'
            )
        );

    }


    request.idUsuario =
        idUsuario;


    next();

};