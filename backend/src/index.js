import express from 'express';
import 'dotenv/config';

import { probarConexion } from './config/db.js';
import productosRoutes from './routes/productos.routes.js';

const app = express();

// Permite recibir datos JSON
app.use(express.json());

// Ruta principal de prueba
app.get('/', (request, response) => {
    response.send('¡Hola Mundo!');
});

// Rutas de productos
app.use('/api/productos', productosRoutes);

const PORT = process.env.PORT || 3000;

async function iniciarAplicacion() {

    try {

        // Primero comprobamos MySQL
        await probarConexion();

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