import { Router } from 'express';
import { obtenerUsuarios, obtenerUsuarioPorId, crearUsuario, actualizarUsuario, cambiarEstadoUsuario } from '../controllers/usuarios.controller.js';
import { validarIdUsuario } from '../middlewares/usuarios.middleware.js';

const router = Router();

router.get('/', obtenerUsuarios);
router.post('/', crearUsuario);
router.get('/:id', validarIdUsuario, obtenerUsuarioPorId);
router.put('/:id', validarIdUsuario, actualizarUsuario);
router.patch('/:id/estado', validarIdUsuario, cambiarEstadoUsuario);

export default router;