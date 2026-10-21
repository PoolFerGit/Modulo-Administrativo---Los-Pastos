import mysql from 'mysql2/promise';
import 'dotenv/config';

const catalogoPool = mysql.createPool({

    host: process.env.CATALOGO_DB_HOST,

    port: Number(
        process.env.CATALOGO_DB_PORT
    ),

    user: process.env.CATALOGO_DB_USER,

    password:
        process.env.CATALOGO_DB_PASSWORD,

    database:
        process.env.CATALOGO_DB_NAME,

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0

});

export async function probarConexionCatalogo() {

    let connection;

    try {

        connection =
            await catalogoPool.getConnection();

        const [base] =
            await connection.query(
                'SELECT DATABASE() AS base_actual'
            );

        console.log(
            'Base del catálogo:',
            base[0].base_actual
        );

    } catch (error) {

        console.error(
            'Error al conectar con la base del catálogo:',
            error.message
        );

        throw error;

    } finally {

        if (connection) {
            connection.release();
        }

    }

}

export default catalogoPool;