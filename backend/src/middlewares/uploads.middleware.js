import multer from 'multer';
import path from 'path';
import fs from 'fs';


const carpetaUploads =
    path.resolve('uploads');

const carpetaProductos =
    path.resolve(
        'uploads',
        'productos'
    );


if (!fs.existsSync(carpetaUploads)) {

    fs.mkdirSync(
        carpetaUploads,
        {
            recursive: true
        }
    );

}


if (!fs.existsSync(carpetaProductos)) {

    fs.mkdirSync(
        carpetaProductos,
        {
            recursive: true
        }
    );

}


const storageExcel =
    multer.diskStorage({

        destination: (
            request,
            file,
            callback
        ) => {

            callback(
                null,
                carpetaUploads
            );

        },

        filename: (
            request,
            file,
            callback
        ) => {

            const extension =
                path.extname(
                    file.originalname
                )
                    .toLowerCase();

            const nombreArchivo =
                `productos-${Date.now()}${extension}`;

            callback(
                null,
                nombreArchivo
            );

        }

    });


const filtrarExcel = (
    request,
    file,
    callback
) => {

    const extension =
        path.extname(
            file.originalname
        )
            .toLowerCase();


    if (
        extension === '.xlsx' ||
        extension === '.xls'
    ) {

        callback(
            null,
            true
        );

        return;

    }


    callback(
        new Error(
            'Solo se permiten archivos Excel .xlsx o .xls.'
        )
    );

};


const uploadExcel =
    multer({

        storage:
            storageExcel,

        fileFilter:
            filtrarExcel,

        limits: {

            fileSize:
                5 * 1024 * 1024

        }

    });


const storageImagenes =
    multer.diskStorage({

        destination: (
            request,
            file,
            callback
        ) => {

            callback(
                null,
                carpetaProductos
            );

        },

        filename: (
            request,
            file,
            callback
        ) => {

            const extension =
                path.extname(
                    file.originalname
                )
                    .toLowerCase();

            const nombreArchivo =
                `producto-${request.idProducto}-${Date.now()}-${Math.round(
                    Math.random() * 100000
                )}${extension}`;

            callback(
                null,
                nombreArchivo
            );

        }

    });


const filtrarImagenes = (
    request,
    file,
    callback
) => {

    const extension =
        path.extname(
            file.originalname
        )
            .toLowerCase();

    const extensionesPermitidas = [
        '.jpg',
        '.jpeg',
        '.png',
        '.webp'
    ];


    if (
        extensionesPermitidas.includes(
            extension
        )
    ) {

        callback(
            null,
            true
        );

        return;

    }


    callback(
        new Error(
            'Solo se permiten imágenes JPG, JPEG, PNG o WEBP.'
        )
    );

};


export const uploadImagenes =
    multer({

        storage:
            storageImagenes,

        fileFilter:
            filtrarImagenes,

        limits: {

            fileSize:
                5 * 1024 * 1024

        }

    });


export default uploadExcel;