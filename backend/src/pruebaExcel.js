import {
    leerProductosExcel,
    normalizarProductosExcel,
    validarProductosExcel
} from './services/excelProductos.service.js';


import {
    generarResultadoImportacion
} from './services/sincronizacionProductos.service.js';


try {

    const filas =
        leerProductosExcel(
            './templates/plantilla_productos.xlsx'
        );


    const productos =
        normalizarProductosExcel(
            filas
        );



    const errores =
        validarProductosExcel(
            productos
        );



    const resultado =
        await generarResultadoImportacion(
            productos,
            errores
        );


    console.log(
        '\nRESULTADO DE LA VALIDACIÓN:\n'
    );


    console.log(
        JSON.stringify(
            resultado,
            null,
            2
        )
    );


} catch (error) {

    console.error(
        '\nError al procesar el Excel:'
    );


    console.error(
        error.message
    );

}