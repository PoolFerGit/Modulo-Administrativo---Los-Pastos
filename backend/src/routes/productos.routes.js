import { Router } from 'express';
import { obtenerProductos, crearProducto, obtenerProductoPorId, actualizarProducto, cambiarEstadoProducto } from '../controllers/productos.controller.js';
import { validarIdProducto } from '../middlewares/productos.middleware.js';
const router = Router();

router.get('/', obtenerProductos);
router.post('/', crearProducto);
router.put('/:id', validarIdProducto, actualizarProducto);
router.get('/:id', validarIdProducto, obtenerProductoPorId);
router.patch('/:id/estado', validarIdProducto, cambiarEstadoProducto);

    
export default router;