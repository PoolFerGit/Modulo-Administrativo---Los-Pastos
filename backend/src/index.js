import express from 'express';

const app = express();

app.get('/', (request, response) => {
    response.send('¡Hola Mundo!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});