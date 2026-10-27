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
    RouterLink
} from '@angular/router';

import {
    ProductosService
} from '../../../services/productos';

import {
    Categoria
} from '../../../models/categoria';


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

    private fb =
        inject(FormBuilder);

    private productosService =
        inject(ProductosService);


    categorias =
        signal<Categoria[]>([]);

    cargandoCategorias =
        signal(true);

    errorCategorias =
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
            ]

        });


    ngOnInit(): void {

        this.cargarCategorias();

    }


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

}