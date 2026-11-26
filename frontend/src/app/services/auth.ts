import {
    Injectable,
    inject
} from '@angular/core';

import {
    HttpClient
} from '@angular/common/http';

import {
    Router
} from '@angular/router';

import {
    Observable
} from 'rxjs';

import {
    Usuario
} from '../models/usuario';


interface RespuestaLogin {

    mensaje: string;

    token: string;

    usuario: Usuario;

}


@Injectable({
    providedIn: 'root'
})
export class AuthService {


    private http =
        inject(HttpClient);


    private router =
        inject(Router);


    private apiUrl =
        'http://localhost:3001/api/auth';


    iniciarSesionGoogle(
        credential: string
    ): Observable<RespuestaLogin> {

        return this.http.post<RespuestaLogin>(
            `${this.apiUrl}/google`,
            {
                credential
            }
        );

    }


    guardarSesion(
        respuesta: RespuestaLogin
    ): void {

        localStorage.setItem(
            'token',
            respuesta.token
        );


        localStorage.setItem(
            'usuario',
            JSON.stringify(
                respuesta.usuario
            )
        );

    }


    obtenerToken():
        string | null {

        return localStorage.getItem(
            'token'
        );

    }


    obtenerUsuario():
        Usuario | null {

        const usuario =
            localStorage.getItem(
                'usuario'
            );


        if (!usuario) {

            return null;

        }


        try {

            return JSON.parse(
                usuario
            ) as Usuario;

        } catch {

            return null;

        }

    }


    haySesion():
        boolean {

        return Boolean(
            this.obtenerToken()
        );

    }


    cerrarSesion():
        void {

        localStorage.removeItem(
            'token'
        );


        localStorage.removeItem(
            'usuario'
        );


        if (
            typeof google !==
            'undefined'
        ) {

            google.accounts.id
                .disableAutoSelect();

        }


        this.router.navigate(
            [
                '/login'
            ]
        );

    }

}


declare const google: any;