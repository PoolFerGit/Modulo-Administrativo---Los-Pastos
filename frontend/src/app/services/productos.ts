import {
    Injectable,
    inject
} from '@angular/core';

import {
    HttpClient
} from '@angular/common/http';

import {
    RespuestaProductos, 
    ProductoRegistro,
    RespuestaCrearProducto
} from '../models/producto';

import {
    RespuestaCategorias
} from '../models/categoria';


@Injectable({
    providedIn: 'root'
})
export class ProductosService {

    private http =
        inject(HttpClient);

    private apiUrl =
        'http://localhost:3001/api/productos';
    private apiUrlCategorias =
        'http://localhost:3001/api/categorias';
    private categoriasUrl =
        'http://localhost:3001/api/categorias';


    obtenerProductos() {

        return this.http.get<RespuestaProductos>(
            this.apiUrl
        );

    }

    obtenerCategorias() {

        return this.http.get<RespuestaCategorias>(
            this.apiUrlCategorias
        );

    }

    crearCategoria(
    categoria: {
        nombre: string;
        descripcion: string | null;
    }
) {

    return this.http.post<{
        mensaje: string;

        categoria: {
            categoria_id: number;
            categoria_nombre: string;
        };
    }>(
        this.categoriasUrl,
        categoria
    );

}

crearProducto(
    producto: ProductoRegistro
) {

    return this.http
        .post<RespuestaCrearProducto>(
            this.apiUrl,
            producto
        );

}

}

