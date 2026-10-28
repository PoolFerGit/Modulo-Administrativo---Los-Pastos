export interface Producto {

    id_producto: number;

    tipo_producto: string;

    nombre: string;

    color: string | null;

    descripcion: string | null;

    precio: number | string;

    talla_tamano: string | null;

    imagen: string | null;

    activo: boolean | number;

    categoria_id: number | null;

    categoria_nombre: string | null;

    producto_destacado: boolean;

}

export interface RespuestaProductos {

    total: number;

    productos: Producto[];

}

export interface ProductoRegistro {

    tipo_producto:
        'PRENDA' | 'TELA';

    nombre: string;

    color:
        string | null;

    descripcion:
        string | null;

    precio: number;

    talla_tamano:
        string | null;

    imagen:
        string | null;

    categoria_id: number;

    producto_destacado: boolean;

}


export interface RespuestaCrearProducto {

    mensaje: string;

    id_producto?: number;

}