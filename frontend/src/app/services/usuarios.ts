import {
    Injectable,
    inject
} from '@angular/core';

import {
    HttpClient,
    HttpParams
} from '@angular/common/http';

import {
    RespuestaUsuarios,
    RespuestaUsuario,
    RespuestaCrearUsuario,
    UsuarioRegistro
} from '../models/usuario';


@Injectable({
    providedIn: 'root'
})
export class UsuariosService {

    private http =
        inject(HttpClient);


    private apiUrl =
        'http://localhost:3001/api/usuarios';


    obtenerUsuarios(
        buscar: string = ''
    ) {

        let params =
            new HttpParams();


        if (
            buscar.trim() !== ''
        ) {

            params =
                params.set(
                    'buscar',
                    buscar.trim()
                );

        }


        return this.http
            .get<RespuestaUsuarios>(
                this.apiUrl,
                {
                    params
                }
            );

    }


    obtenerUsuarioPorId(
        id: number
    ) {

        return this.http
            .get<RespuestaUsuario>(
                `${this.apiUrl}/${id}`
            );

    }


    crearUsuario(
        usuario:
            UsuarioRegistro
    ) {

        return this.http
            .post<RespuestaCrearUsuario>(
                this.apiUrl,
                usuario
            );

    }


    actualizarUsuario(
        id: number,
        usuario:
            UsuarioRegistro
    ) {

        return this.http.put<{
            mensaje: string;
        }>(
            `${this.apiUrl}/${id}`,
            usuario
        );

    }


    cambiarEstadoUsuario(
        id: number,
        activo: boolean
    ) {

        return this.http.patch<{
            mensaje: string;
            id_usuario: number;
            activo: boolean;
        }>(
            `${this.apiUrl}/${id}/estado`,
            {
                activo:
                    activo
            }
        );

    }

}