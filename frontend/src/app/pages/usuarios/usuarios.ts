import {
    Component,
    OnInit,
    inject,
    signal,
    computed
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


    usuarioEditando =
        signal<Usuario | null>(
            null
        );


    filtroRol =
        signal<
            'TODOS' |
            RolUsuario
        >(
            'TODOS'
        );


    filtroEstado =
        signal<
            'TODOS' |
            'ACTIVO' |
            'INACTIVO'
        >(
            'TODOS'
        );


    usuarioCambiandoEstado =
        signal<number | null>(
            null
        );


    totalUsuarios =
        computed(
            () =>
                this.usuarios()
                    .length
        );


    totalActivos =
        computed(
            () =>
                this.usuarios()
                    .filter(
                        usuario =>
                            Boolean(
                                usuario.activo
                            )
                    )
                    .length
        );


    totalInactivos =
        computed(
            () =>
                this.usuarios()
                    .filter(
                        usuario =>
                            !Boolean(
                                usuario.activo
                            )
                    )
                    .length
        );


    usuariosFiltrados =
        computed(
            () => {

                let resultado =
                    this.usuarios();


                if (
                    this.filtroRol() !==
                    'TODOS'
                ) {

                    resultado =
                        resultado.filter(
                            usuario =>
                                usuario.rol ===
                                this.filtroRol()
                        );

                }


                if (
                    this.filtroEstado() ===
                    'ACTIVO'
                ) {

                    resultado =
                        resultado.filter(
                            usuario =>
                                Boolean(
                                    usuario.activo
                                )
                        );

                }


                if (
                    this.filtroEstado() ===
                    'INACTIVO'
                ) {

                    resultado =
                        resultado.filter(
                            usuario =>
                                !Boolean(
                                    usuario.activo
                                )
                        );

                }


                return resultado;

            }
        );


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


    actualizarFiltroRol(
        event: Event
    ): void {

        const select =
            event.target as
                HTMLSelectElement;


        this.filtroRol.set(
            select.value as
                'TODOS' |
                RolUsuario
        );

    }


    actualizarFiltroEstado(
        event: Event
    ): void {

        const select =
            event.target as
                HTMLSelectElement;


        this.filtroEstado.set(
            select.value as
                'TODOS' |
                'ACTIVO' |
                'INACTIVO'
        );

    }


    abrirNuevoUsuario(): void {

        this.usuarioEditando.set(
            null
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


        this.mensajeExito.set(
            ''
        );

        this.mensajeError.set(
            ''
        );


        this.mostrarFormulario.set(
            true
        );

    }


    editarUsuario(
        usuario: Usuario
    ): void {

        this.usuarioEditando.set(
            usuario
        );


        this.formulario.patchValue({

            nombre:
                usuario.nombre,

            correo:
                usuario.correo,

            rol:
                usuario.rol,

            activo:
                Boolean(
                    usuario.activo
                )

        });


        this.mensajeExito.set(
            ''
        );

        this.mensajeError.set(
            ''
        );


        this.mostrarFormulario.set(
            true
        );


        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    }


    cancelarFormulario(): void {

        this.usuarioEditando.set(
            null
        );


        this.mostrarFormulario.set(
            false
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


        const usuarioActual =
            this.usuarioEditando();


        if (usuarioActual) {

            this.usuariosService
                .actualizarUsuario(
                    usuarioActual
                        .id_usuario,
                    usuario
                )
                .subscribe({

                    next: () => {

                        this.mensajeExito.set(
                            'Usuario actualizado correctamente.'
                        );


                        this.guardando.set(
                            false
                        );


                        this.usuarioEditando.set(
                            null
                        );


                        this.mostrarFormulario.set(
                            false
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

                            'No fue posible actualizar el usuario.'

                        );


                        this.guardando.set(
                            false
                        );

                    }

                });


            return;

        }


        this.usuariosService
            .crearUsuario(
                usuario
            )
            .subscribe({

                next: () => {

                    this.mensajeExito.set(
                        'Usuario registrado correctamente.'
                    );


                    this.guardando.set(
                        false
                    );


                    this.mostrarFormulario.set(
                        false
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

        const estadoActual =
            Boolean(
                usuario.activo
            );


        const nuevoEstado =
            !estadoActual;


        if (estadoActual) {

            const confirmar =
                window.confirm(
                    `¿Desea desactivar al usuario "${usuario.nombre}"?`
                );


            if (!confirmar) {

                return;

            }

        }


        this.usuarioCambiandoEstado.set(
            usuario.id_usuario
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


                    this.usuarioCambiandoEstado.set(
                        null
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


                    this.usuarioCambiandoEstado.set(
                        null
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