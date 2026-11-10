import XLSX from 'xlsx';


/**
 * Lee la primera hoja de un archivo Excel
 * y devuelve sus filas como objetos JavaScript.
 */
export function leerProductosExcel(
    rutaArchivo
) {

    // -----------------------------------------
    // 1. Verificar que recibimos una ruta
    // -----------------------------------------

    if (!rutaArchivo) {

        throw new Error(
            'No se recibió la ruta del archivo Excel.'
        );

    }


    // -----------------------------------------
    // 2. Abrir el archivo Excel
    // -----------------------------------------

    const libro =
        XLSX.readFile(
            rutaArchivo
        );


    // -----------------------------------------
    // 3. Verificar que tenga hojas
    // -----------------------------------------

    if (
        !libro.SheetNames ||
        libro.SheetNames.length === 0
    ) {

        throw new Error(
            'El archivo Excel no contiene hojas.'
        );

    }


    // -----------------------------------------
    // 4. Obtener la primera hoja
    // -----------------------------------------

    const nombreHoja =
        libro.SheetNames[0];


    const hoja =
        libro.Sheets[
            nombreHoja
        ];


    // -----------------------------------------
    // 5. Convertir la hoja a objetos
    // -----------------------------------------

    const filas =
        XLSX.utils.sheet_to_json(
            hoja,
            {
                defval: null,
                raw: true
            }
        );


    // -----------------------------------------
    // 6. Verificar que existan productos
    // -----------------------------------------

    if (filas.length === 0) {

        throw new Error(
            'El archivo Excel no contiene productos.'
        );

    }


    // -----------------------------------------
    // 7. Devolver las filas
    // -----------------------------------------

    return filas;

}



/**
 * Limpia un texto recibido desde Excel.
 *
 * Si está vacío devuelve null.
 */
function limpiarTexto(
    valor
) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return null;

    }


    const texto =
        String(valor).trim();


    if (texto === '') {

        return null;

    }


    return texto;

}



/**
 * Convierte SI / NO a boolean.
 *
 * SI  → true
 * NO  → false
 *
 * Si está vacío devuelve el valor por defecto.
 *
 * Si recibe otro valor devuelve null
 * para que posteriormente la validación
 * pueda detectar el error.
 */
function convertirSiNo(
    valor,
    valorPorDefecto
) {

    if (
        valor === null ||
        valor === undefined ||
        String(valor).trim() === ''
    ) {

        return valorPorDefecto;

    }


    const texto =
        String(valor)
            .trim()
            .toUpperCase()
            .normalize('NFD')
            .replace(
                /[\u0300-\u036f]/g,
                ''
            );


    if (texto === 'SI') {

        return true;

    }


    if (texto === 'NO') {

        return false;

    }


    return null;

}



/**
 * Normaliza una fila del Excel.
 *
 * Convierte los nombres de columnas del Excel
 * al formato utilizado por nuestro sistema.
 */
export function normalizarFilaProducto(
    fila
) {

    const tipoProducto =
        limpiarTexto(
            fila.TIPO_PRODUCTO
        );


    const nombre =
        limpiarTexto(
            fila.NOMBRE
        );


    const color =
        limpiarTexto(
            fila.COLOR
        );


    const descripcion =
        limpiarTexto(
            fila.DESCRIPCION
        );


    const tallaTamano =
        limpiarTexto(
            fila.TALLA_TAMANO
        );


    const categoria =
        limpiarTexto(
            fila.CATEGORIA
        );


    // -----------------------------------------
    // Precio
    // -----------------------------------------

    let precio = null;


    if (
        fila.PRECIO !== null &&
        fila.PRECIO !== undefined &&
        String(fila.PRECIO).trim() !== ''
    ) {

        precio =
            Number(
                fila.PRECIO
            );

    }


    // -----------------------------------------
    // Producto destacado
    // -----------------------------------------

    const productoDestacado =
        convertirSiNo(
            fila.DESTACADO,
            false
        );


    // -----------------------------------------
    // Producto activo
    // -----------------------------------------

    const activo =
        convertirSiNo(
            fila.ACTIVO,
            true
        );


    // -----------------------------------------
    // Devolver fila normalizada
    // -----------------------------------------

    return {

        tipo_producto:
            tipoProducto
                ? tipoProducto.toUpperCase()
                : null,

        nombre,

        color,

        descripcion,

        precio,

        talla_tamano:
            tallaTamano,

        categoria,

        producto_destacado:
            productoDestacado,

        activo

    };

}



/**
 * Normaliza todas las filas recibidas
 * desde el archivo Excel.
 */
export function normalizarProductosExcel(
    filas
) {

    return filas.map(
        (
            fila,
            indice
        ) => {

            return {

                // +2 porque:
                // fila 1 = encabezados
                // primer producto = fila 2
                fila_excel:
                    indice + 2,

                ...normalizarFilaProducto(
                    fila
                )

            };

        }
    );

}


export function validarFilaProducto(
    producto
) {

    const errores = [];


    // =========================================
    // TIPO DE PRODUCTO
    // =========================================

    if (!producto.tipo_producto) {

        errores.push({

            campo:
                'TIPO_PRODUCTO',

            mensaje:
                'El tipo de producto es obligatorio.'

        });

    }
    else if (
        ![
            'PRENDA',
            'TELA'
        ].includes(
            producto.tipo_producto
        )
    ) {

        errores.push({

            campo:
                'TIPO_PRODUCTO',

            mensaje:
                'El tipo de producto debe ser PRENDA o TELA.'

        });

    }


    // =========================================
    // NOMBRE
    // =========================================

    if (!producto.nombre) {

        errores.push({

            campo:
                'NOMBRE',

            mensaje:
                'El nombre del producto es obligatorio.'

        });

    }
    else if (
        producto.nombre.length > 150
    ) {

        errores.push({

            campo:
                'NOMBRE',

            mensaje:
                'El nombre no puede superar los 150 caracteres.'

        });

    }


    // =========================================
    // COLOR
    // =========================================

    if (
        producto.color &&
        producto.color.length > 100
    ) {

        errores.push({

            campo:
                'COLOR',

            mensaje:
                'El color no puede superar los 100 caracteres.'

        });

    }


    // =========================================
    // DESCRIPCIÓN
    // =========================================

    if (
        producto.descripcion &&
        producto.descripcion.length > 300
    ) {

        errores.push({

            campo:
                'DESCRIPCION',

            mensaje:
                'La descripción no puede superar los 300 caracteres.'

        });

    }


    // =========================================
    // PRECIO
    // =========================================

    if (
        producto.precio === null
    ) {

        errores.push({

            campo:
                'PRECIO',

            mensaje:
                'El precio es obligatorio.'

        });

    }
    else if (
        !Number.isFinite(
            producto.precio
        )
    ) {

        errores.push({

            campo:
                'PRECIO',

            mensaje:
                'El precio debe ser un número válido.'

        });

    }
    else if (
        producto.precio <= 0
    ) {

        errores.push({

            campo:
                'PRECIO',

            mensaje:
                'El precio debe ser mayor que cero.'

        });

    }


    // =========================================
    // TALLA / TAMAÑO
    // =========================================

    if (
        producto.talla_tamano &&
        producto.talla_tamano.length > 100
    ) {

        errores.push({

            campo:
                'TALLA_TAMANO',

            mensaje:
                'La talla o tamaño no puede superar los 100 caracteres.'

        });

    }


    // =========================================
    // CATEGORÍA
    // =========================================

    if (!producto.categoria) {

        errores.push({

            campo:
                'CATEGORIA',

            mensaje:
                'La categoría es obligatoria.'

        });

    }


    // =========================================
    // DESTACADO
    // =========================================

    if (
        producto.producto_destacado === null
    ) {

        errores.push({

            campo:
                'DESTACADO',

            mensaje:
                'El valor de DESTACADO debe ser SI o NO.'

        });

    }


    // =========================================
    // ACTIVO
    // =========================================

    if (
        producto.activo === null
    ) {

        errores.push({

            campo:
                'ACTIVO',

            mensaje:
                'El valor de ACTIVO debe ser SI o NO.'

        });

    }


    // =========================================
    // Agregar número de fila del Excel
    // =========================================

    return errores.map(
        error => ({
            fila:
                producto.fila_excel,

            ...error
        })
    );

}



/**
 * Valida todas las filas del Excel.
 */
export function validarProductosExcel(
    productos
) {

    const errores = [];


    for (
        const producto
        of productos
    ) {

        const erroresProducto =
            validarFilaProducto(
                producto
            );


        errores.push(
            ...erroresProducto
        );

    }


    return errores;

}