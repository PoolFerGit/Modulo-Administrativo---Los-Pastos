import {
    validarUsuarioAdministrativo
} from '../services/auth.service.js';

import ApiError from '../utils/ApiError.js';

import {
    autenticarConGoogle,
    generarTokenSesion
} from '../services/auth.service.js';


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

export async function iniciarSesionGoogle(
    request,
    response,
    next
) {

    try {

        const credential =
            request.body.credential;


        if (!credential) {

            throw new ApiError(
                400,
                'La credencial de Google es obligatoria.'
            );

        }


        const resultado =
            await autenticarConGoogle(
                credential
            );


        if (
            resultado.motivo ===
            'NO_REGISTRADO'
        ) {

            throw new ApiError(
                403,
                'El usuario no está autorizado.'
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


        if (
            resultado.motivo ===
            'CUENTA_GOOGLE_NO_COINCIDE'
        ) {

            throw new ApiError(
                403,
                'La cuenta de Google no coincide con el usuario registrado.'
            );

        }


        if (!resultado.autorizado) {

            throw new ApiError(
                401,
                'No fue posible validar la cuenta de Google.'
            );

        }


        const token =
            generarTokenSesion(
                resultado.usuario
            );


        response.status(200).json({

            mensaje:
                'Inicio de sesión correcto.',

            token,

            usuario:
                resultado.usuario

        });

    } catch (error) {

        if (
            error.message?.includes(
                'Wrong number of segments'
            ) ||
            error.message?.includes(
                'Invalid token'
            )
        ) {

            return next(
                new ApiError(
                    401,
                    'Credencial de Google inválida.'
                )
            );

        }


        next(error);

    }

}