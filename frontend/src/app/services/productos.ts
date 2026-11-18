import {
    Injectable,
    inject
} from '@angular/core';

import {
    HttpClient,
    HttpParams
} from '@angular/common/http';

import {
    RespuestaProductos, 
    ProductoRegistro,
    RespuestaCrearProducto,
    Producto,
    RespuestaImportacionProductos,
    ProductoImagen,
    RespuestaImagenes
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



    obtenerProductos(buscar: string = '') {

    let params =
        new HttpParams();


    if (buscar.trim() !== '') {

        params =
            params.set(
                'buscar',
                buscar.trim()
            );

    }
    console.log(
        'Buscando:',
        buscar
    );

    return this.http
        .get<RespuestaProductos>(
            this.apiUrl,
            { params }
        );
    }

    obtenerProductoPorId(id: number) {

    return this.http.get<{
        producto: Producto
    }>(
        `${this.apiUrl}/${id}`
    );

    }
    
    actualizarProducto(
        id: number,
        producto: ProductoRegistro) {

    return this.http.put<{
        mensaje: string;
        producto?: Producto;
    }>(
        `${this.apiUrl}/${id}`,
        producto
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
        this.apiUrlCategorias,
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
cambiarEstadoProducto(id: number, activo: boolean) {

    return this.http.patch<{
        mensaje: string;
    }>(
        `${this.apiUrl}/${id}/estado`,
        {
            activo: activo
        }
    );

}

eliminarProducto(
    id: number
) {

    return this.http.delete<{
        mensaje: string;
    }>(
        `${this.apiUrl}/${id}`
    );

}

importarProductosExcel(
    archivo: File
) {

    const formData =
        new FormData();


    formData.append(
        'archivo',
        archivo
    );


    return this.http
        .post<RespuestaImportacionProductos>(
            `${this.apiUrl}/importar`,
            formData
        );

}
subirImagenes(
    idProducto: number,
    archivos: File[]
) {

    const formData =
        new FormData();


    for (
        const archivo
        of archivos
    ) {

        formData.append(
            'imagenes',
            archivo
        );

    }


    return this.http.post<{

        mensaje: string;

        imagenes:
            ProductoImagen[];

    }>(
        `${this.apiUrl}/${idProducto}/imagenes`,
        formData
    );

}


obtenerImagenes(
    idProducto: number
) {

    return this.http
        .get<RespuestaImagenes>(
            `${this.apiUrl}/${idProducto}/imagenes`
        );

}


eliminarImagen(
    idProducto: number,
    idImagen: number
) {

    return this.http.delete<{
        mensaje: string;
    }>(
        `${this.apiUrl}/${idProducto}/imagenes/${idImagen}`
    );

}


marcarImagenPrincipal(
    idProducto: number,
    idImagen: number
) {

    return this.http.patch<{
        mensaje: string;
    }>(
        `${this.apiUrl}/${idProducto}/imagenes/${idImagen}/principal`,
        {}
    );

}

}

