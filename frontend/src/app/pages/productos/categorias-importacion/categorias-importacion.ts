import {
    Component,
    inject,
    signal
} from '@angular/core';

import {
    Router,
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


@Component({
    selector:
        'app-categorias-importacion',

    templateUrl:
        './categorias-importacion.html',

    styleUrl:
        './categorias-importacion.css'

})
export class CategoriasImportacion {

    private productosService =
        inject(ProductosService);

    private importacionService =
        inject(
            ImportacionProductosService
        );

    private router =
        inject(Router);

    categorias =
        this.importacionService
            .categoriasFaltantes;

    guardando =
        signal<string | null>(
            null
        );

    mensaje =
        signal('');

    error =
        signal('');

    crearCategoria(
        categoria: string
    ): void {

        this.guardando.set(
            categoria
        );

        this.mensaje.set('');

        this.error.set('');

        this.productosService
            .crearCategoria({

                nombre:
                    categoria,

                descripcion:
                    null

            })
            .subscribe({

                next: () => {

                    this.importacionService
                        .quitarCategoria(
                            categoria
                        );

                    this.guardando.set(
                        null
                    );

                    this.mensaje.set(
                        `Categoría "${categoria}" registrada correctamente.`
                    );

                    if (
                        this.categorias()
                            .length === 0
                    ) {

                        this.router.navigate(
                            [
                                '/productos/nuevo'
                            ]
                        );

                    }

                },

                error: (
                    error: HttpErrorResponse
                ) => {

                    if (
                        error.status === 409
                    ) {

                        this.importacionService
                            .quitarCategoria(
                                categoria
                            );

                        this.guardando.set(
                            null
                        );

                        if (
                            this.categorias()
                                .length === 0
                        ) {

                            this.router.navigate(
                                [
                                    '/productos/nuevo'
                                ]
                            );

                        }

                        return;

                    }

                    this.error.set(
                        'No fue posible registrar la categoría.'
                    );

                    this.guardando.set(
                        null
                    );

                }

            });

    }

    volver(): void {

        this.router.navigate(
            [
                '/productos/nuevo'
            ]
        );

    }

}