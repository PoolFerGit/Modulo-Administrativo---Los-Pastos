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
    ProductoRegistro
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

    private router =
        inject(Router);

    private productosService =
        inject(ProductosService);


    idProducto = 0;


    categorias =
        signal<Categoria[]>([]);

    errorCategorias =
        signal('');

    cargandoCategorias =
        signal(true);

    cargandoProducto =
        signal(true);

    errorProducto =
        signal('');

    errorCargaProducto =
        signal('');


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