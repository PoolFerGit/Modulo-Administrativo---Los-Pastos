import {
    Injectable,
    signal
} from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class ImportacionProductosService {

    archivo =
        signal<File | null>(
            null
        );


    categoriasFaltantes =
        signal<string[]>(
            []
        );


    guardarArchivo(
        archivo: File
    ): void {

        this.archivo.set(
            archivo
        );

    }


    guardarCategorias(
        categorias: string[]
    ): void {

        this.categoriasFaltantes.set(
            categorias
        );

    }


    quitarCategoria(
        categoria: string
    ): void {

        this.categoriasFaltantes.update(
            categorias =>
                categorias.filter(
                    item =>
                        item !== categoria
                )
        );

    }


    limpiarCategorias(): void {

        this.categoriasFaltantes.set(
            []
        );

    }


    limpiar(): void {

        this.archivo.set(
            null
        );

        this.categoriasFaltantes.set(
            []
        );

    }

}