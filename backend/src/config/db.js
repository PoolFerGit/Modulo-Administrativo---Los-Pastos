import mysql from 'mysql2/promise';
import 'dotenv/config';

console.log('Base configurada:', process.env.DB_NAME);
console.log('Host configurado:', process.env.DB_HOST);


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export async function probarConexion() {
let connection;

    try {

        connection = await pool.getConnection();

        console.log('Conexión a mysql establecida.');

        const [prueba] = await connection.query('SELECT 1 AS resultado');

        console.log('Resultado de prueba:', prueba[0].resultado);

        const [base] = await connection.query('SELECT DATABASE() AS base_1');

        console.log('Base de datos:', base[0].base_1);

        const [tablas] = await connection.query('SHOW TABLES');

        console.log('Tablas:', tablas);

    } catch (error) {

        console.error('Error al conectar con mysql:', error.code);

        console.error('Detalle:', error.message);

        throw error;

    } finally {

        if (connection) {
            connection.release();
        }

    }
}

export default pool;
