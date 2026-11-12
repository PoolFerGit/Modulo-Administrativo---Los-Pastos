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
    Router,
    RouterLink
} from '@angular/router';

import {
    HttpErrorResponse
} from '@angular/common/http';

import {
    ProductosService
} from '../../../services/productos';

import {
    ImportacionProductosService
} from '../../../services/importacion-productos';

import {
    Categoria
} from '../../../models/categoria';

import {
    ProductoRegistro,
    RespuestaImportacionProductos
} from '../../../models/producto';


@Component({
    selector: 'app-producto-crear',

    imports: [
        ReactiveFormsModule,
        RouterLink
    ],

    templateUrl: './producto-crear.html',

    styleUrl: './producto-crear.css'
})
export class ProductoCrear
    implements OnInit {


    // ------------------------------------------------
    // SERVICIOS
    // ------------------------------------------------

    private fb =
        inject(FormBuilder);

    private productosService =
        inject(ProductosService);

        private importacionService =
    inject(
        ImportacionProductosService
    );

    private router =
     inject(Router);


    // ------------------------------------------------
    // CATEGORÍAS
    // ------------------------------------------------

    categorias =
        signal<Categoria[]>([]);

    cargandoCategorias =
        signal(true);

    errorCategorias =
        signal('');


    // ------------------------------------------------
    // NUEVA CATEGORÍA
    // ------------------------------------------------

    mostrarNuevaCategoria =
        signal(false);

    guardandoCategoria =
        signal(false);

    mensajeCategoria =
        signal('');

    errorNuevaCategoria =
        signal('');


    // ------------------------------------------------
    // REGISTRO DEL PRODUCTO
    // ------------------------------------------------

    guardando =
        signal(false);

    mensajeExito =
        signal('');

    mensajeError =
        signal('');


    // ------------------------------------------------
    // FORMULARIO PRINCIPAL DEL PRODUCTO
    // ------------------------------------------------

    archivoExcel =
    this.importacionService.archivo;

categoriasFaltantes =
    this.importacionService
        .categoriasFaltantes;

revisandoArchivo =
    signal(false);

mensajeImportacion =
    signal('');

errorImportacion =
    signal('');

resultadoImportacion =
    signal<
        RespuestaImportacionProductos |
        null
    >(null);

    formulario =
        this.fb.group({

            tipo_producto: [
                '',
                Validators.required
            ],

            nombre: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2)
                ]
            ],

            color: [
                ''
            ],

            descripcion: [
                '',
                Validators.maxLength(300)
            ],

            precio: [
                null,
                [
                    Validators.required,
                    Validators.min(0.01)
                ]
            ],

            talla_tamano: [
                ''
            ],

            categoria_id: [
                '',
                Validators.required
            ],

            producto_destacado: [
                false
            ],

            activo: [
             true
            ]

        });


    // ------------------------------------------------
    // FORMULARIO PARA NUEVA CATEGORÍA
    // ------------------------------------------------

    formularioCategoria =
        this.fb.group({

            nombre: [
                '',
                [
                    Validators.required,
                    Validators.minLength(2)
                ]
            ],

            descripcion: [
                ''
            ]

        });


    // ------------------------------------------------
    // AL INICIAR EL COMPONENTE
    // ------------------------------------------------

    ngOnInit(): void {

        this.cargarCategorias();

    }


    // ------------------------------------------------
    // OBTENER CATEGORÍAS
    // ------------------------------------------------

    cargarCategorias(): void {

        this.cargandoCategorias.set(true);

        this.errorCategorias.set('');


        this.productosService
            .obtenerCategorias()
            .subscribe({

                next: (respuesta) => {

                    this.categorias.set(
                        respuesta.categorias
                    );

                    this.cargandoCategorias
                        .set(false);

                },


                error: (error) => {

                    console.error(
                        'Error al obtener categorías:',
                        error
                    );

                    this.errorCategorias.set(
                        'No fue posible cargar las categorías.'
                    );

                    this.cargandoCategorias
                        .set(false);

                }

            });

    }


    // ------------------------------------------------
    // MOSTRAR / OCULTAR NUEVA CATEGORÍA
    // ------------------------------------------------

    alternarNuevaCategoria(): void {

        const mostrar =
            !this.mostrarNuevaCategoria();

        this.mostrarNuevaCategoria
            .set(mostrar);

        this.mensajeCategoria.set('');

        this.errorNuevaCategoria.set('');


        if (!mostrar) {

            this.formularioCategoria
                .reset();

        }

    }


    // ------------------------------------------------
    // GUARDAR NUEVA CATEGORÍA
    // ------------------------------------------------

    guardarCategoria(): void {

        if (
            this.formularioCategoria.invalid
        ) {

            this.formularioCategoria
                .markAllAsTouched();

            return;

        }


        const datos =
            this.formularioCategoria
                .getRawValue();


        const categoria = {

            nombre:
                datos.nombre!.trim(),

            descripcion:
                datos.descripcion?.trim()
                || null

        };


        this.guardandoCategoria
            .set(true);

        this.mensajeCategoria
            .set('');

        this.errorNuevaCategoria
            .set('');


        this.productosService
            .crearCategoria(categoria)
            .subscribe({

                next: (respuesta) => {

                    console.log(
                        'Categoría registrada:',
                        respuesta
                    );


                    this.mensajeCategoria.set(
                        'Categoría registrada correctamente.'
                    );


                    // Actualizamos nuevamente
                    // la lista de categorías
                    this.cargarCategorias();


                    // Seleccionamos automáticamente
                    // la categoría recién creada
                    this.formulario.patchValue({

                        categoria_id:
                            String(
                                respuesta
                                    .categoria
                                    .categoria_id
                            )

                    });


                    // Limpiamos el formulario
                    // de categoría
                    this.formularioCategoria
                        .reset();


                    this.guardandoCategoria
                        .set(false);

                    this.mostrarNuevaCategoria
                        .set(false);

                },


                error: (
                    error: HttpErrorResponse
                ) => {

                    console.error(
                        'Error al registrar categoría:',
                        error
                    );


                    if (
                        error.status === 409
                    ) {

                        this.errorNuevaCategoria.set(
                            'Ya existe una categoría con ese nombre.'
                        );

                    } else {

                        this.errorNuevaCategoria.set(
                            'No fue posible registrar la categoría.'
                        );

                    }


                    this.guardandoCategoria
                        .set(false);

                }

            });

    }


    // ------------------------------------------------
    // REGISTRAR PRODUCTO
    // ------------------------------------------------

    seleccionarArchivoExcel(
    event: Event
): void {

    const input =
        event.target as HTMLInputElement;

    const archivo =
        input.files?.[0];


    if (!archivo) {

        return;

    }


    this.importacionService
        .guardarArchivo(
            archivo
        );

    this.importacionService
        .limpiarCategorias();

    this.resultadoImportacion
        .set(null);

    this.mensajeImportacion
        .set('');

    this.errorImportacion
        .set('');

}

revisarEImportar(): void {

    const archivo =
        this.archivoExcel();

    if (!archivo) {

        this.errorImportacion.set(
            'Seleccione un archivo Excel.'
        );

        return;

    }

    this.revisandoArchivo.set(
        true
    );

    this.mensajeImportacion.set('');

    this.errorImportacion.set('');

    this.resultadoImportacion.set(
        null
    );

    this.importacionService
        .limpiarCategorias();

    this.productosService
        .importarProductosExcel(
            archivo
        )
        .subscribe({

            next: (
                respuesta
            ) => {

                this.resultadoImportacion
                    .set(
                        respuesta
                    );

                this.mensajeImportacion
                    .set(
                        respuesta.mensaje
                    );

                this.revisandoArchivo
                    .set(false);

                this.importacionService
                    .limpiar();

            },

            error: (
                error: HttpErrorResponse
            ) => {

                const respuesta =
                    error.error as
                        RespuestaImportacionProductos;

                if (
                    error.status === 422 &&
                    respuesta
                ) {

                    this.resultadoImportacion
                        .set(
                            respuesta
                        );

                    const categorias =
                        respuesta
                            .categorias_faltantes ??
                        [];

                    this.importacionService
                        .guardarCategorias(
                            categorias
                        );

                    this.errorImportacion
                        .set(
                            respuesta.mensaje
                        );

                } else {

                    this.errorImportacion
                        .set(
                            error.error?.error ||
                            'No fue posible procesar el archivo.'
                        );

                }

                this.revisandoArchivo
                    .set(false);

            }

        });

}

irACategoriasFaltantes(): void {

    this.router.navigate(
        [
            '/productos/categorias-importacion'
        ]
    );

}

    registrarProducto(): void {

        if (this.formulario.invalid) {

            this.formulario
                .markAllAsTouched();

            return;

        }


        const datos =
            this.formulario
                .getRawValue();


        const producto: ProductoRegistro = {

            tipo_producto:
                datos.tipo_producto as
                'PRENDA' | 'TELA',

            nombre:
                datos.nombre!.trim(),

            color:
                datos.color?.trim()
                || null,

            descripcion:
                datos.descripcion?.trim()
                || null,

            precio:
                Number(
                    datos.precio
                ),

            talla_tamano:
                datos.talla_tamano?.trim()
                || null,

            imagen:
                null,

            categoria_id:
                Number(
                    datos.categoria_id
                ),

            producto_destacado:
                Boolean(
                    datos.producto_destacado
                ),
            
            activo:
                Boolean(
                     datos.activo
               )

        };


        console.log(
            'Producto enviado:',
            producto
        );


        this.guardando.set(true);

        this.mensajeExito.set('');

        this.mensajeError.set('');


        this.productosService
            .crearProducto(producto)
            .subscribe({

                next: (respuesta) => {

                    console.log(
                        'Producto registrado:',
                        respuesta
                    );


                    this.mensajeExito.set(
                        'Producto registrado correctamente.'
                    );

                    this.guardando.set(false);

                },


                error: (
                    error: HttpErrorResponse
                ) => {

                    console.error(
                        'Error al registrar producto:',
                        error
                    );


                    const mensajeBackend =
                        error.error?.error;


                    this.mensajeError.set(

                        mensajeBackend ||

                        'No fue posible registrar el producto.'

                    );


                    this.guardando.set(false);

                }

            });

    }

}