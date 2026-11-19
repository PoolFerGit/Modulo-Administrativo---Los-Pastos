import pool from '../config/db.js';


export async function listarUsuarios(
    buscar = ''
) {

    let consulta = `
        SELECT
            id_usuario,
            nombre,
            correo,
            google_id,
            rol,
            activo
        FROM usuarios
    `;


    const parametros = [];


    if (
        buscar &&
        buscar.trim() !== ''
    ) {

        consulta += `
            WHERE
                LOWER(nombre) LIKE LOWER(?)
                OR
                LOWER(correo) LIKE LOWER(?)
        `;

        parametros.push(
            `%${buscar.trim()}%`,
            `%${buscar.trim()}%`
        );

    }


    consulta += `
        ORDER BY id_usuario ASC
    `;


    const [usuarios] =
        await pool.query(
            consulta,
            parametros
        );


    return usuarios;

}


export async function buscarUsuarioPorId(
    idUsuario
) {

    const [usuarios] =
        await pool.query(
            `SELECT
                id_usuario,
                nombre,
                correo,
                google_id,
                rol,
                activo
            FROM usuarios
            WHERE id_usuario = ?`,
            [
                idUsuario
            ]
        );


    return usuarios[0];

}


export async function buscarUsuarioPorCorreo(
    correo
) {

    const [usuarios] =
        await pool.query(
            `SELECT
                id_usuario,
                nombre,
                correo,
                google_id,
                rol,
                activo
            FROM usuarios
            WHERE LOWER(correo) = LOWER(?)`,
            [
                correo
            ]
        );


    return usuarios[0];

}


export async function registrarUsuario(
    usuario
) {

    const {
        nombre,
        correo,
        google_id = null,
        rol,
        activo = true
    } = usuario;


    const [resultado] =
        await pool.query(
            `INSERT INTO usuarios
            (
                nombre,
                correo,
                google_id,
                rol,
                activo
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                nombre,
                correo,
                google_id,
                rol,
                activo
            ]
        );


    return {

        id_usuario:
            resultado.insertId

    };

}


export async function actualizarUsuarioPorId(
    idUsuario,
    usuario
) {

    const {
        nombre,
        correo,
        rol
    } = usuario;


    const [resultado] =
        await pool.query(
            `UPDATE usuarios
            SET
                nombre = ?,
                correo = ?,
                rol = ?
            WHERE id_usuario = ?`,
            [
                nombre,
                correo,
                rol,
                idUsuario
            ]
        );


    return resultado;

}


export async function actualizarEstadoUsuarioID(
    idUsuario,
    activo
) {

    const [resultado] =
        await pool.query(
            `UPDATE usuarios
            SET activo = ?
            WHERE id_usuario = ?`,
            [
                activo,
                idUsuario
            ]
        );


    return resultado;

}