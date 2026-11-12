import multer from 'multer';
import path from 'path';
import fs from 'fs';


const carpetaUploads =
    path.resolve('uploads');


if (
    !fs.existsSync(
        carpetaUploads
    )
) {

    fs.mkdirSync(
        carpetaUploads,
        {
            recursive: true
        }
    );

}


const storage =
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
                );

            const nombreArchivo =
                `productos-${Date.now()}${extension}`;

            callback(
                null,
                nombreArchivo
            );

        }

    });


const fileFilter = (
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

        storage,

        fileFilter,

        limits: {

            fileSize:
                5 * 1024 * 1024

        }

    });


export default uploadExcel;