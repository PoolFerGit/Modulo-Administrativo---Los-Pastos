import {
    Component,
    OnInit,
    inject,
    signal
} from '@angular/core';

import {
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import {
    HttpErrorResponse
} from '@angular/common/http';

import {
    UsuariosService
} from '../../services/usuarios';

import {
    Usuario,
    UsuarioRegistro,
    RolUsuario
} from '../../models/usuario';


@Component({
    selector: 'app-usuarios',

    imports: [
        ReactiveFormsModule
    ],

    templateUrl:
        './usuarios.html',

    styleUrl:
        './usuarios.css'
})
export class Usuarios
    implements OnInit {


    private usuariosService =
        inject(UsuariosService);

    private fb =
        inject(FormBuilder);


    usuarios =
        signal<Usuario[]>([]);


    cargando =
        signal(false);


    mostrarFormulario =
        signal(false);


    guardando =
        signal(false);


    mensajeExito =
        signal('');


    mensajeError =
        signal('');


    busqueda =
        signal('');


    formulario =
        this.fb.group({

            nombre: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(150)
                ]
            ],

            correo: [
                '',
                [
                    Validators.required,
                    Validators.email
                ]
            ],

            rol: [
                '',
                Validators.required
            ],

            activo: [
                true
            ]

        });


    ngOnInit(): void {

        this.cargarUsuarios();

    }


    cargarUsuarios(
        buscar: string = ''
    ): void {

        this.cargando.set(
            true
        );

        this.mensajeError.set(
            ''
        );


        this.usuariosService
            .obtenerUsuarios(
                buscar
            )
            .subscribe({

                next: (
                    respuesta
                ) => {

                    this.usuarios.set(
                        respuesta.usuarios
                    );

                    this.cargando.set(
                        false
                    );

                },

                error: (
                    error
                ) => {

                    console.error(
                        'Error al cargar usuarios:',
                        error
                    );


                    this.mensajeError.set(
                        'No fue posible cargar los usuarios.'
                    );

                    this.cargando.set(
                        false
                    );

                }

            });

    }


    buscarUsuarios(
        event: Event
    ): void {

        const input =
            event.target as
                HTMLInputElement;


        const texto =
            input.value;


        this.busqueda.set(
            texto
        );


        this.cargarUsuarios(
            texto
        );

    }


    alternarFormulario(): void {

        this.mostrarFormulario.set(
            !this.mostrarFormulario()
        );

        this.mensajeExito.set(
            ''
        );

        this.mensajeError.set(
            ''
        );


        if (
            !this.mostrarFormulario()
        ) {

            this.formulario.reset({

                nombre:
                    '',

                correo:
                    '',

                rol:
                    '',

                activo:
                    true

            });

        }

    }


    guardarUsuario(): void {

        if (
            this.formulario.invalid
        ) {

            this.formulario
                .markAllAsTouched();

            return;

        }


        const datos =
            this.formulario
                .getRawValue();


        const usuario:
            UsuarioRegistro = {

            nombre:
                datos.nombre!
                    .trim(),

            correo:
                datos.correo!
                    .trim()
                    .toLowerCase(),

            rol:
                datos.rol as
                    RolUsuario,

            activo:
                Boolean(
                    datos.activo
                )

        };


        this.guardando.set(
            true
        );

        this.mensajeExito.set(
            ''
        );

        this.mensajeError.set(
            ''
        );


        this.usuariosService
            .crearUsuario(
                usuario
            )
            .subscribe({

                next: () => {

                    this.mensajeExito.set(
                        'Usuario registrado correctamente.'
                    );


                    this.formulario.reset({

                        nombre:
                            '',

                        correo:
                            '',

                        rol:
                            '',

                        activo:
                            true

                    });


                    this.mostrarFormulario.set(
                        false
                    );


                    this.guardando.set(
                        false
                    );


                    this.cargarUsuarios(
                        this.busqueda()
                    );

                },

                error: (
                    error:
                        HttpErrorResponse
                ) => {

                    this.mensajeError.set(

                        error.error?.error ||

                        'No fue posible registrar el usuario.'

                    );


                    this.guardando.set(
                        false
                    );

                }

            });

    }


    cambiarEstado(
        usuario: Usuario
    ): void {

        const nuevoEstado =
            !Boolean(
                usuario.activo
            );


        this.mensajeExito.set(
            ''
        );

        this.mensajeError.set(
            ''
        );


        this.usuariosService
            .cambiarEstadoUsuario(
                usuario.id_usuario,
                nuevoEstado
            )
            .subscribe({

                next: () => {

                    this.mensajeExito.set(

                        nuevoEstado
                            ? 'Usuario activado correctamente.'
                            : 'Usuario desactivado correctamente.'

                    );


                    this.cargarUsuarios(
                        this.busqueda()
                    );

                },

                error: (
                    error:
                        HttpErrorResponse
                ) => {

                    this.mensajeError.set(

                        error.error?.error ||

                        'No fue posible cambiar el estado del usuario.'

                    );

                }

            });

    }


    nombreRol(
        rol: RolUsuario
    ): string {

        switch (rol) {

            case 'ADMIN':

                return 'Administrador';


            case 'DEVELOPER':

                return 'Desarrollador';


            case 'EDITOR':

                return 'Editor';


            default:

                return rol;

        }

    }

}