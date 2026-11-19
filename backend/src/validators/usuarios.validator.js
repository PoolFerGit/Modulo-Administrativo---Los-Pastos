export function validarUsuario(
    usuario
) {

    const errores = [];


    if (
        !usuario.nombre ||
        usuario.nombre.trim() === ''
    ) {

        errores.push(
            'El nombre del usuario es obligatorio.'
        );

    }
    else if (
        usuario.nombre.trim().length > 150
    ) {

        errores.push(
            'El nombre no puede superar los 150 caracteres.'
        );

    }


    if (
        !usuario.correo ||
        usuario.correo.trim() === ''
    ) {

        errores.push(
            'El correo electrónico es obligatorio.'
        );

    }
    else {

        const patronCorreo =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !patronCorreo.test(
                usuario.correo.trim()
            )
        ) {

            errores.push(
                'El correo electrónico no tiene un formato válido.'
            );

        }

    }


    const rolesPermitidos = [
        'ADMIN',
        'DEVELOPER',
        'EDITOR'
    ];


    if (
        !usuario.rol ||
        !rolesPermitidos.includes(
            usuario.rol
        )
    ) {

        errores.push(
            'El rol debe ser ADMIN, DEVELOPER o EDITOR.'
        );

    }


    if (
        usuario.activo !== undefined &&
        typeof usuario.activo !== 'boolean'
    ) {

        errores.push(
            'El estado activo debe ser verdadero o falso.'
        );

    }


    return errores;

}


export function validarEstadoUsuario(
    datos
) {

    const errores = [];


    if (
        typeof datos.activo !== 'boolean'
    ) {

        errores.push(
            'El estado del usuario debe ser verdadero o falso.'
        );

    }


    return errores;

}