export type RolUsuario =
    'ADMIN' |
    'DEVELOPER' |
    'EDITOR';


export interface Usuario {

    id_usuario: number;

    nombre: string;

    correo: string;

    google_id:
        string | null;

    rol:
        RolUsuario;

    activo:
        boolean | number;

}


export interface UsuarioRegistro {

    nombre: string;

    correo: string;

    rol:
        RolUsuario;

    activo?: boolean;

}


export interface RespuestaUsuarios {

    total: number;

    usuarios:
        Usuario[];

}


export interface RespuestaUsuario {

    usuario:
        Usuario;

}


export interface RespuestaCrearUsuario {

    mensaje: string;

    usuario: {

        id_usuario: number;

        nombre: string;

        correo: string;

        rol:
            RolUsuario;

        activo: boolean;

    };

}