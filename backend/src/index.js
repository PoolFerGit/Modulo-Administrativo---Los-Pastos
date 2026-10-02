import express from 'express';
import 'dotenv/config';
import { probarConexion } from './config/db.js';

const app = express();

app.get('/', (request, response) => {
    response.send('¡Hola Mundo!');
});

const PORT = process.env.PORT || 3000;

async function iniciarAplicacion() {

    try {

        await probarConexion();

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });

    } catch (error) {

        console.error('No fue posible iniciar la aplicación.');

    }

}

iniciarAplicacion();