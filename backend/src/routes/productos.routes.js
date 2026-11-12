import { Router } from 'express';
import { importarProductosExcel, obtenerProductos, crearProducto, obtenerProductoPorId, actualizarProducto, cambiarEstadoProducto, eliminarProducto } from '../controllers/productos.controller.js';
import { validarIdProducto } from '../middlewares/productos.middleware.js';
import uploadExcel from '../middlewares/uploads.middleware.js';
const router = Router();

router.get('/', obtenerProductos);
router.post('/', crearProducto);
router.post('/importar',uploadExcel.single('archivo'),importarProductosExcel);
router.put('/:id', validarIdProducto, actualizarProducto);
router.get('/:id', validarIdProducto, obtenerProductoPorId);
router.patch('/:id/estado', validarIdProducto, cambiarEstadoProducto);
router.delete('/:id', validarIdProducto, eliminarProducto);


    
export default router;