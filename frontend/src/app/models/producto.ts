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

    activo?: boolean;

}


export interface RespuestaCrearProducto {

    mensaje: string;

    producto: {
        id_producto: number;
    };

}

export interface ErrorImportacionProducto {

    fila: number;

    campo?: string;

    producto?: string;

    mensaje: string;

}


export interface ProductoImportado {

    fila: number;

    id_producto: number;

    nombre: string;

}


export interface RespuestaImportacionProductos {

    mensaje: string;

    total_filas?: number;

    archivo_valido?: boolean;

    categorias_faltantes?: string[];

    total?: number;

    importados?: number;

    fallidos?: number;

    completo?: boolean;

    productos?: ProductoImportado[];

    errores: ErrorImportacionProducto[];

}