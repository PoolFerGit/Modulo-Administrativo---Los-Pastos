import {
    Injectable,
    inject
} from '@angular/core';

import {
    HttpClient
} from '@angular/common/http';

import {
    RespuestaProductos
} from '../models/producto';


@Injectable({
    providedIn: 'root'
})
export class ProductosService {

    private http =
        inject(HttpClient);

    private apiUrl =
        'http://localhost:3001/api/productos';


    obtenerProductos() {

        return this.http.get<RespuestaProductos>(
            this.apiUrl
        );

    }

}