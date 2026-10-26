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

    cargando = signal(true);

    error = signal('');

    ngOnInit(): void {

        this.cargarProductos();

    }


 cargarProductos(): void {

    console.log(
        '1. Iniciando carga de productos'
    );

    this.cargando.set(true);

    this.error.set('');


    this.productosService
        .obtenerProductos()
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

}}