import {Component, OnInit, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ProductosService} from '../../../services/productos';
import {Producto} from '../../../models/producto';

@Component({selector: 'app-productos',
    imports: [
        RouterLink
    ],
    templateUrl: './productos.html',
    styleUrl: './productos.css'
})
export class Productos implements OnInit {

    private productosService =
        inject(ProductosService);


    productos = signal<Producto[]>([]);

    productoEliminando = signal<number | null>(null);

    cargando = signal(true);

    error = signal('');

    busqueda = signal('');

    mensajeExito = signal('');
    
    mensajeError = signal('');

    ngOnInit(): void {

        this.cargarProductos();

    }


 cargarProductos(buscar: string = ''): void {

    console.log(
        '1. Iniciando carga de productos'
    );

    this.cargando.set(true);

    this.error.set('');


    this.productosService
        .obtenerProductos(buscar)
        .subscribe({

            next: (respuesta) => {

                console.log(
                    '2. Respuesta recibida:',
                    respuesta
                );

                this.productos.set(
                    respuesta.productos
                );

                this.cargando.set(false);

            },


            error: (error) => {

                console.error(
                    '3. Error al obtener productos:',
                    error
                );

                this.error.set(
                    'No fue posible cargar los productos.'
                );

                this.cargando.set(false);

            }

        });

}

buscarProductos(): void {

    this.cargarProductos(this.busqueda());

}

actualizarBusqueda(
    event: Event
): void {

    const input =
        event.target as HTMLInputElement;


    this.busqueda.set(
        input.value
    );

}

limpiarBusqueda(): void {

    this.busqueda.set('');

    this.cargarProductos();

}

eliminarProducto(
    producto: Producto
): void {

    const confirmar =
        window.confirm(
            `¿Desea eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`
        );


    if (!confirmar) {

        return;

    }

    this.productoEliminando.set(
        producto.id_producto
    );


    this.mensajeExito.set('');

    this.mensajeError.set('');


    this.productosService
        .eliminarProducto(
            producto.id_producto
        )
        .subscribe({

            next: () => {

                this.mensajeExito.set(
                    'Producto eliminado correctamente.'
                );


                this.productoEliminando.set(
                    null
                );


                // Volvemos a cargar la tabla
                // manteniendo la búsqueda actual

                this.cargarProductos(
                    this.busqueda()
                );

            },


            error: (error) => {

                console.error(
                    'Error al eliminar producto:',
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

                } else if (
                    error.status === 409
                ) {

                    this.mensajeError.set(

                        error.error?.error ||

                        'No es posible eliminar el producto porque posee información relacionada.'

                    );

                } else {

                    this.mensajeError.set(
                        'No fue posible eliminar el producto.'
                    );

                }


                this.productoEliminando.set(
                    null
                );

            }

        });

}


}