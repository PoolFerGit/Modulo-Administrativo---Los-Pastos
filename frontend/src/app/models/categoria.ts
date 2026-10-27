export interface Categoria {

    categoria_id: number;

    categoria_nombre: string;

    categoria_descripcion:
        string | null;

}


export interface RespuestaCategorias {

    total: number;

    categorias: Categoria[];

}