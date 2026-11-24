import {
    buscarUsuarioPorCorreo
} from './usuarios.service.js';


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

        usuario: {

            id_usuario:
                usuario.id_usuario,

            nombre:
                usuario.nombre,

            correo:
                usuario.correo,

            google_id:
                usuario.google_id,

            rol:
                usuario.rol,

            activo:
                Boolean(usuario.activo)

        }

    };

}