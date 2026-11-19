import {
    listarUsuarios,
    buscarUsuarioPorId,
    buscarUsuarioPorCorreo,
    registrarUsuario,
    actualizarUsuarioPorId,
    actualizarEstadoUsuarioID
} from '../services/usuarios.service.js';

import {
    validarUsuario,
    validarEstadoUsuario
} from '../validators/usuarios.validator.js';

import ApiError from '../utils/ApiError.js';


export const obtenerUsuarios = async (
    request,
    response,
    next
) => {

    try {

        const buscar =
            request.query.buscar || '';


        const usuarios =
            await listarUsuarios(
                buscar
            );


        response.status(200).json({

            total:
                usuarios.length,

            usuarios:
                usuarios

        });

    }
    catch (error) {

        next(error);

    }

};


export const obtenerUsuarioPorId = async (
    request,
    response,
    next
) => {

    try {

        const usuario =
            await buscarUsuarioPorId(
                request.idUsuario
            );


        if (!usuario) {

            throw new ApiError(
                404,
                'Usuario no encontrado.'
            );

        }


        response.status(200).json({

            usuario:
                usuario

        });

    }
    catch (error) {

        next(error);

    }

};


export const crearUsuario = async (
    request,
    response,
    next
) => {

    try {

        const datos =
            request.body;


        const usuario = {

            nombre:
                datos.nombre?.trim(),

            correo:
                datos.correo
                    ?.trim()
                    .toLowerCase(),

            google_id:
                null,

            rol:
                datos.rol,

            activo:
                datos.activo === undefined
                    ? true
                    : datos.activo

        };


        const errores =
            validarUsuario(
                usuario
            );


        if (
            errores.length > 0
        ) {

            throw new ApiError(
                400,
                errores.join(' ')
            );

        }


        const usuarioExistente =
            await buscarUsuarioPorCorreo(
                usuario.correo
            );


        if (usuarioExistente) {

            throw new ApiError(
                409,
                'Ya existe un usuario registrado con ese correo electrónico.'
            );

        }


        const resultado =
            await registrarUsuario(
                usuario
            );


        response.status(201).json({

            mensaje:
                'Usuario registrado correctamente.',

            usuario: {

                id_usuario:
                    resultado.id_usuario,

                nombre:
                    usuario.nombre,

                correo:
                    usuario.correo,

                rol:
                    usuario.rol,

                activo:
                    usuario.activo

            }

        });

    }
    catch (error) {

        next(error);

    }

};


export const actualizarUsuario = async (
    request,
    response,
    next
) => {

    try {

        const usuarioExistente =
            await buscarUsuarioPorId(
                request.idUsuario
            );


        if (!usuarioExistente) {

            throw new ApiError(
                404,
                'Usuario no encontrado.'
            );

        }


        const datos =
            request.body;


        const usuario = {

            nombre:
                datos.nombre?.trim(),

            correo:
                datos.correo
                    ?.trim()
                    .toLowerCase(),

            rol:
                datos.rol,

            activo:
                Boolean(
                    usuarioExistente.activo
                )

        };


        const errores =
            validarUsuario(
                usuario
            );


        if (
            errores.length > 0
        ) {

            throw new ApiError(
                400,
                errores.join(' ')
            );

        }


        const usuarioCorreo =
            await buscarUsuarioPorCorreo(
                usuario.correo
            );


        if (
            usuarioCorreo &&
            Number(
                usuarioCorreo.id_usuario
            ) !==
            Number(
                request.idUsuario
            )
        ) {

            throw new ApiError(
                409,
                'Ya existe otro usuario registrado con ese correo electrónico.'
            );

        }


        await actualizarUsuarioPorId(
            request.idUsuario,
            usuario
        );


        response.status(200).json({

            mensaje:
                'Usuario actualizado correctamente.'

        });

    }
    catch (error) {

        next(error);

    }

};


export const cambiarEstadoUsuario = async (
    request,
    response,
    next
) => {

    try {

        const errores =
            validarEstadoUsuario(
                request.body
            );


        if (
            errores.length > 0
        ) {

            throw new ApiError(
                400,
                errores.join(' ')
            );

        }


        const usuario =
            await buscarUsuarioPorId(
                request.idUsuario
            );


        if (!usuario) {

            throw new ApiError(
                404,
                'Usuario no encontrado.'
            );

        }


        const {
            activo
        } = request.body;


        await actualizarEstadoUsuarioID(
            request.idUsuario,
            activo
        );


        response.status(200).json({

            mensaje:
                'Estado del usuario actualizado correctamente.',

            id_usuario:
                request.idUsuario,

            activo:
                activo

        });

    }
    catch (error) {

        next(error);

    }

};