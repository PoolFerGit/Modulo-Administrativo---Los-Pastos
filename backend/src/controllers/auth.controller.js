import {
    validarUsuarioAdministrativo
} from '../services/auth.service.js';

import ApiError from '../utils/ApiError.js';


export async function validarAccesoUsuario(
    request,
    response,
    next
) {

    try {

        const correo =
            String(
                request.body.correo ?? ''
            )
                .trim()
                .toLowerCase();


        if (!correo) {

            throw new ApiError(
                400,
                'El correo es obligatorio.'
            );

        }


        const resultado =
            await validarUsuarioAdministrativo(
                correo
            );


        if (
            resultado.motivo ===
            'NO_REGISTRADO'
        ) {

            throw new ApiError(
                403,
                'El usuario no está autorizado para ingresar al módulo administrativo.'
            );

        }


        if (
            resultado.motivo ===
            'INACTIVO'
        ) {

            throw new ApiError(
                403,
                'El usuario se encuentra inactivo.'
            );

        }


        response.status(200).json({

            mensaje:
                'Usuario autorizado.',

            usuario:
                resultado.usuario

        });

    } catch (error) {

        next(error);

    }

}