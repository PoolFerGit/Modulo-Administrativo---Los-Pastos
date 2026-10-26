import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import { probarConexion } from './config/db.js';
import {probarConexionCatalogo} from './config/dbCatalogo.js';
import productosRoutes from './routes/productos.routes.js';
import {notFound, errorHandler} from './middlewares/error.middleware.js';
import integracionRoutes from './routes/integracion.routes.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:4300'
}));

app.use(express.json());

// Permite recibir datos JSON
app.use(express.json());

// Ruta principal de prueba
app.get('/', (request, response) => {
    response.send('¡Hola Mundo!');
});

// Rutas de productos
app.use('/api/productos', productosRoutes);

// Rutas de integración
app.use('/api/integracion', integracionRoutes);

// Middleware para manejar rutas no encontradas
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function iniciarAplicacion() {

    try {

        // Primero comprobamos MySQL
        await probarConexion();
        await probarConexionCatalogo();

        // Si la conexión funciona, levantamos Express
        app.listen(PORT, () => {
            console.log(
                `Servidor ejecutándose en http://localhost:${PORT}`
            );
        });

    } catch (error) {

        console.error(
            'No fue posible iniciar la aplicación.'
        );

    }

}

iniciarAplicacion();