import {
    AfterViewInit,
    Component,
    ElementRef,
    ViewChild,
    inject,
    signal
} from '@angular/core';

import {
    Router
} from '@angular/router';

import {
    HttpErrorResponse
} from '@angular/common/http';

import {
    AuthService
} from '../../services/auth';


declare const google: any;


@Component({
    selector: 'app-login',

    imports: [],

    templateUrl:
        './login.html',

    styleUrl:
        './login.css'
})
export class Login
    implements AfterViewInit {


    @ViewChild(
        'googleButton'
    )
    googleButton!:
        ElementRef<HTMLDivElement>;


    private authService =
        inject(AuthService);


    private router =
        inject(Router);


    cargando =
        signal(false);


    mensajeError =
        signal('');


    private googleClientId =
        '459794329041-1c3brbn6g8541cu0a8qlk8gp2n1ch07a.apps.googleusercontent.com';


    ngAfterViewInit():
        void {

        this.inicializarGoogle();

    }


    private inicializarGoogle():
        void {

        const intentarInicializar =
            () => {

                if (
                    typeof google ===
                    'undefined'
                ) {

                    setTimeout(
                        intentarInicializar,
                        300
                    );

                    return;

                }


                google.accounts.id
                    .initialize({

                        client_id:
                            this.googleClientId,

                        callback:
                            (
                                respuesta: any
                            ) =>
                                this.procesarCredencialGoogle(
                                    respuesta
                                )

                    });


                google.accounts.id
                    .renderButton(
                        this.googleButton
                            .nativeElement,
                        {
                            theme:
                                'outline',

                            size:
                                'large',

                            text:
                                'signin_with',

                            shape:
                                'rectangular',

                            width:
                                280
                        }
                    );

            };


        intentarInicializar();

    }


    private procesarCredencialGoogle(
        respuesta: any
    ): void {

        const credential =
            respuesta?.credential;


        if (!credential) {

            this.mensajeError.set(
                'No fue posible obtener la credencial de Google.'
            );

            return;

        }


        this.cargando.set(
            true
        );


        this.mensajeError.set(
            ''
        );


        this.authService
            .iniciarSesionGoogle(
                credential
            )
            .subscribe({

                next:
                    respuestaLogin => {

                        this.authService
                            .guardarSesion(
                                respuestaLogin
                            );


                        this.cargando.set(
                            false
                        );


                        this.router.navigate(
                            [
                                '/dashboard'
                            ]
                        );

                    },


                error:
                    (
                        error:
                            HttpErrorResponse
                    ) => {

                        this.cargando.set(
                            false
                        );


                        this.mensajeError.set(

                            error.error
                                ?.message ||

                            error.error
                                ?.mensaje ||

                            'No fue posible iniciar sesión.'

                        );

                    }

            });

    }

}