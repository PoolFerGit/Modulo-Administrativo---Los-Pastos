export function validarProducto(producto) {

    const errores = [];

    if (
        !producto.tipo_producto ||
        !['PRENDA', 'TELA'].includes(producto.tipo_producto)
    ) {
        errores.push(
            'El tipo de producto debe ser PRENDA o TELA.'
        );
    }

    if (
        !producto.nombre ||
        producto.nombre.trim() === ''
    ) {
        errores.push(
            'El nombre del producto es obligatorio.'
        );
    }

    if (
        producto.precio === undefined ||
        producto.precio === null ||
        isNaN(Number(producto.precio)) ||
        Number(producto.precio) <= 0
    ) {
        errores.push(
            'El precio debe ser un número mayor que cero.'
        );
    }

    return errores;
}
