export function mapearProductoAGissi(
    producto
) {

    return {

        producto_nombre:
            producto.nombre,

        producto_descripcion:
            producto.descripcion || null,

        producto_precio:
            Number(producto.precio),

        categoria_id:
            producto.categoria_id ?? null,

        producto_destacado:
            producto.producto_destacado ?? false

    };

}