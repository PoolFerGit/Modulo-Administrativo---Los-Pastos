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
    ActivatedRoute,
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
    Categoria
} from '../../../models/categoria';

import {
    ProductoRegistro,
    ProductoImagen,
} from '../../../models/producto';


@Component({
    selector: 'app-producto-editar',

    imports: [
        ReactiveFormsModule,
        RouterLink
    ],

    templateUrl:
        './producto-editar.html',

    styleUrl:
        './producto-editar.css'
})
export class ProductoEditar
    implements OnInit {


    private fb =
        inject(FormBuilder);

    private route =
        inject(ActivatedRoute);


    private productosService =
        inject(ProductosService);


    idProducto = 0;


    categorias =
        signal<Categoria[]>([]);

    errorCategorias =
        signal('');

    cargandoCategorias =
        signal(true);

    cargando =
        signal(true);

    guardando =
        signal(false);

    mensajeExito =
        signal('');

    mensajeError =
        signal('');


    imagenActual =
        signal<string | null>(null);
    
    activoProducto =
        signal(false);

    cambiandoEstado =   
        signal(false);
    
        imagenesProducto =
    signal<ProductoImagen[]>([]);

    imagenesPendientes =
    signal<{
        archivo: File;
        url: string;
    }[]>([]);

    guardandoImagenes =
    signal(false);

    mensajeImagenes =
    signal('');

    errorImagenes =
    signal('');


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

            precio:
              this.fb.control<number | null>(null, [
                Validators.required,
                Validators.min(0.01)
              ])
            ,

            talla_tamano: [
                ''
            ],

            categoria_id: [
                '',
                Validators.required
            ],

            producto_destacado: [
                false
            ]

        });


    ngOnInit(): void {

        const id =
            this.route.snapshot
                .paramMap
                .get('id');


        this.idProducto =
            Number(id);


        if (
            !this.idProducto ||
            this.idProducto <= 0
        ) {

            this.mensajeError.set(
                'Identificador de producto inválido.'
            );

            this.cargando.set(false);

            return;

        }


        this.cargarCategorias();

        this.cargarProducto();

        this.cargarImagenes();

    }


    cargarCategorias(): void {

    this.cargandoCategorias.set(true);

    this.errorCategorias.set('');


    this.productosService
        .obtenerCategorias()
        .subscribe({

            next: (respuesta) => {

                console.log(
                    'Categorías recibidas:',
                    respuesta
                );


                this.categorias.set(
                    respuesta.categorias
                );


                this.cargandoCategorias.set(
                    false
                );

            },


            error: (error) => {

                console.error(
                    'Error al cargar categorías:',
                    error
                );


                this.errorCategorias.set(
                    'No fue posible cargar las categorías.'
                );


                this.cargandoCategorias.set(
                    false
                );

            }

        });

}


    cargarProducto(): void {

        this.cargando.set(true);

        this.mensajeError.set('');


        this.productosService
            .obtenerProductoPorId(
                this.idProducto
            )
            .subscribe({

                next: (respuesta) => {

                    const producto =
                        respuesta.producto;

                    this.activoProducto.set(
                        Boolean(producto.activo)
                    );


                    this.imagenActual.set(
                        producto.imagen
                    );


                    this.formulario.patchValue({

                        tipo_producto:
                            producto.tipo_producto,

                        nombre:
                            producto.nombre,

                        color:
                            producto.color || '',

                        descripcion:
                            producto.descripcion || '',

                        precio:
                            Number(producto.precio),

                        talla_tamano:
                            producto.talla_tamano || '',

                        categoria_id:
                            producto.categoria_id !== null
                                ? String(
                                    producto.categoria_id
                                )
                                : '',

                        producto_destacado:
                            Boolean(
                                producto.producto_destacado
                            )

                    });


                    this.cargando.set(false);

                },


                error: (
                    error: HttpErrorResponse
                ) => {

                    console.error(
                        'Error al cargar producto:',
                        error
                    );


                    if (
                        error.status === 404
                    ) {

                        this.mensajeError.set(
                            'Producto no encontrado.'
                        );

                    } else {

                        this.mensajeError.set(
                            'No fue posible cargar el producto.'
                        );

                    }


                    this.cargando.set(false);

                }

            });

    }
    cargarImagenes(): void {

    this.productosService
        .obtenerImagenes(
            this.idProducto
        )
        .subscribe({

            next: (respuesta) => {

                this.imagenesProducto.set(
                    respuesta.imagenes
                );

            },

            error: () => {

                this.errorImagenes.set(
                    'No fue posible cargar las imágenes.'
                );

            }

        });

}


seleccionarImagenes(
    event: Event
): void {

    const input =
        event.target as HTMLInputElement;

    const archivos =
        Array.from(
            input.files || []
        );


    const permitidos = [
        'image/jpeg',
        'image/png',
        'image/webp'
    ];


    const validos =
        archivos.filter(
            archivo =>
                permitidos.includes(
                    archivo.type
                ) &&
                archivo.size <=
                    5 * 1024 * 1024
        );


    const nuevas =
        validos.map(
            archivo => ({

                archivo,

                url:
                    URL.createObjectURL(
                        archivo
                    )

            })
        );


    this.imagenesPendientes.update(
        actuales => [
            ...actuales,
            ...nuevas
        ]
    );


    input.value = '';

}


eliminarImagenPendiente(
    indice: number
): void {

    const imagenes =
        [...this.imagenesPendientes()];


    URL.revokeObjectURL(
        imagenes[indice].url
    );


    imagenes.splice(
        indice,
        1
    );


    this.imagenesPendientes.set(
        imagenes
    );

}


guardarImagenes(): void {

    const archivos =
        this.imagenesPendientes()
            .map(
                imagen =>
                    imagen.archivo
            );


    if (
        archivos.length === 0
    ) {

        return;

    }


    this.guardandoImagenes.set(
        true
    );

    this.mensajeImagenes.set('');

    this.errorImagenes.set('');


    this.productosService
        .subirImagenes(
            this.idProducto,
            archivos
        )
        .subscribe({

            next: () => {

                for (
                    const imagen
                    of this.imagenesPendientes()
                ) {

                    URL.revokeObjectURL(
                        imagen.url
                    );

                }


                this.imagenesPendientes.set(
                    []
                );


                this.mensajeImagenes.set(
                    'Imágenes registradas correctamente.'
                );


                this.guardandoImagenes.set(
                    false
                );


                this.cargarImagenes();

            },

            error: () => {

                this.errorImagenes.set(
                    'No fue posible guardar las imágenes.'
                );

                this.guardandoImagenes.set(
                    false
                );

            }

        });

}


eliminarImagen(
    imagen: ProductoImagen
): void {

    this.productosService
        .eliminarImagen(
            this.idProducto,
            imagen.producto_imagen_id
        )
        .subscribe({

            next: () => {

                this.cargarImagenes();

            },

            error: () => {

                this.errorImagenes.set(
                    'No fue posible eliminar la imagen.'
                );

            }

        });

}


hacerPrincipal(
    imagen: ProductoImagen
): void {

    this.productosService
        .marcarImagenPrincipal(
            this.idProducto,
            imagen.producto_imagen_id
        )
        .subscribe({

            next: () => {

                this.cargarImagenes();

            },

            error: () => {

                this.errorImagenes.set(
                    'No fue posible cambiar la imagen principal.'
                );

            }

        });

}


urlImagen(
    ruta: string
): string {

    if (
        ruta.startsWith(
            'http'
        )
    ) {

        return ruta;

    }


    return (
        'http://localhost:3001' +
        ruta
    );

}

    actualizarProducto(): void {

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
                datos.color?.trim() || null,

            descripcion:
                datos.descripcion?.trim() || null,

            precio:
                Number(datos.precio),

            talla_tamano:
                datos.talla_tamano?.trim() || null,

            imagen:
                this.imagenActual(),

            categoria_id:
                Number(datos.categoria_id),

            producto_destacado:
                Boolean(
                    datos.producto_destacado
                )

        };


        this.guardando.set(true);

        this.mensajeExito.set('');

        this.mensajeError.set('');


        this.productosService
            .actualizarProducto(
                this.idProducto,
                producto
            )
            .subscribe({

                next: (respuesta) => {

                    console.log(
                        'Producto actualizado:',
                        respuesta
                    );


                    this.mensajeExito.set(
                        'Producto actualizado correctamente.'
                    );

                    this.guardando.set(false);

                },


                error: (
                    error: HttpErrorResponse
                ) => {

                    console.error(
                        'Error al actualizar producto:',
                        error
                    );


                    this.mensajeError.set(
                        error.error?.error ||
                        'No fue posible actualizar el producto.'
                    );


                    this.guardando.set(false);

                }

            });

    }


    cambiarEstado(): void {

    const nuevoEstado =
        !this.activoProducto();


    this.cambiandoEstado.set(true);

    this.mensajeExito.set('');

    this.mensajeError.set('');


    this.productosService
        .cambiarEstadoProducto(
            this.idProducto,
            nuevoEstado
        )
        .subscribe({

            next: () => {

                this.activoProducto.set(
                    nuevoEstado
                );


                this.mensajeExito.set(

                    nuevoEstado
                        ? 'Producto activado correctamente.'
                        : 'Producto desactivado correctamente.'

                );


                this.cambiandoEstado.set(
                    false
                );

            },


            error: (
                error: HttpErrorResponse
            ) => {

                console.error(
                    'Error al cambiar el estado:',
                    error
                );


                if (
                    error.status === 0
                ) {

                    this.mensajeError.set(
                        'No fue posible conectar con el servidor.'
                    );

                } else if (
                    error.status === 404
                ) {

                    this.mensajeError.set(
                        'El producto ya no existe.'
                    );

                } else {

                    this.mensajeError.set(
                        'No fue posible cambiar el estado del producto.'
                    );

                }


                this.cambiandoEstado.set(
                    false
                );

            }

        });

    }

}