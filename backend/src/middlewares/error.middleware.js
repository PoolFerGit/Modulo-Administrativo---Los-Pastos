import ApiError from '../utils/ApiError.js';


export const notFound = (request, response, next) => {

    next(
        new ApiError(
            404,
            `Ruta no encontrada: ${request.originalUrl}`
        )
    );

};


export const errorHandler = (
    error,
    request,
    response,
    next
) => {

    const statusCode = error.statusCode || 500;

    const message =
        error.message || 'Error interno del servidor.';

    console.error(
        `[ERROR ${statusCode}] ${message}`
    );

    response.status(statusCode).json({
        error: message,
        status: statusCode,
        path: request.originalUrl
    });

};