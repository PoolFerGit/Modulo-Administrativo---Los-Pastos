import jwt from 'jsonwebtoken';

import ApiError from '../utils/ApiError.js';


export function verificarAutenticacion(
    request,
    response,
    next
) {

    try {

        const authorization =
            request.headers.authorization;


        if (
            !authorization ||
            !authorization.startsWith(
                'Bearer '
            )
        ) {

            throw new ApiError(
                401,
                'Debe iniciar sesión.'
            );

        }


        const token =
            authorization.substring(7);


        const usuario =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        request.usuario =
            usuario;


        next();

    } catch (error) {

        if (
            error instanceof ApiError
        ) {

            return next(error);

        }


        next(
            new ApiError(
                401,
                'La sesión no es válida o ha expirado.'
            )
        );

    }

}