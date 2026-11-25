import {
    OAuth2Client
} from 'google-auth-library';

import jwt from 'jsonwebtoken';

import {
    buscarUsuarioPorCorreo,
    actualizarGoogleIdUsuario
} from './usuarios.service.js';


const googleClient =
    new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID
    );


export async function validarUsuarioAdministrativo(
    correo
) {

    const usuario =
        await buscarUsuarioPorCorreo(
            correo
        );


    if (!usuario) {

        return {
            autorizado: false,
            motivo: 'NO_REGISTRADO'
        };

    }


    if (!Boolean(usuario.activo)) {

        return {
            autorizado: false,
            motivo: 'INACTIVO'
        };

    }


    return {
        autorizado: true,
        usuario
    };

}


export async function autenticarConGoogle(
    credential
) {

    const ticket =
        await googleClient.verifyIdToken({

            idToken:
                credential,

            audience:
                process.env.GOOGLE_CLIENT_ID

        });


    const payload =
        ticket.getPayload();


    if (
        !payload ||
        !payload.email ||
        !payload.sub ||
        !payload.email_verified
    ) {

        return {
            autorizado: false,
            motivo: 'GOOGLE_INVALIDO'
        };

    }


    const resultado =
        await validarUsuarioAdministrativo(
            payload.email
                .trim()
                .toLowerCase()
        );


    if (!resultado.autorizado) {

        return resultado;

    }


    const usuario =
        resultado.usuario;


    if (
        usuario.google_id &&
        usuario.google_id !== payload.sub
    ) {

        return {
            autorizado: false,
            motivo:
                'CUENTA_GOOGLE_NO_COINCIDE'
        };

    }


    if (!usuario.google_id) {

        await actualizarGoogleIdUsuario(
            usuario.id_usuario,
            payload.sub
        );

    }


    return {

        autorizado: true,

        usuario: {

            id_usuario:
                usuario.id_usuario,

            nombre:
                usuario.nombre,

            correo:
                usuario.correo,

            google_id:
                payload.sub,

            rol:
                usuario.rol,

            activo:
                Boolean(usuario.activo)

        }

    };

}


export function generarTokenSesion(
    usuario
) {

    return jwt.sign(
        {
            id_usuario:
                usuario.id_usuario,

            correo:
                usuario.correo,

            rol:
                usuario.rol
        },

        process.env.JWT_SECRET,

        {
            expiresIn:
                process.env.JWT_EXPIRES_IN ||
                '8h'
        }
    );

}