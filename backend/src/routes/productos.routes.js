import { Router } from 'express';
import { importarProductosExcel, obtenerProductos, crearProducto, obtenerProductoPorId, actualizarProducto, cambiarEstadoProducto, eliminarProducto, subirImagenesProducto, obtenerImagenesProducto, eliminarImagenDeProducto, establecerImagenPrincipal } from '../controllers/productos.controller.js';
import { validarIdProducto } from '../middlewares/productos.middleware.js';
import uploadExcel, { uploadImagenes } from '../middlewares/uploads.middleware.js';

const router = Router();

router.get('/', obtenerProductos);
router.post('/', crearProducto);
router.post('/importar', uploadExcel.single('archivo'), importarProductosExcel);

router.post('/:id/imagenes', validarIdProducto, uploadImagenes.array('imagenes', 10), subirImagenesProducto);
router.get('/:id/imagenes', validarIdProducto, obtenerImagenesProducto);
router.delete('/:id/imagenes/:idImagen', validarIdProducto, eliminarImagenDeProducto);
router.patch('/:id/imagenes/:idImagen/principal', validarIdProducto, establecerImagenPrincipal);

router.put('/:id', validarIdProducto, actualizarProducto);
router.get('/:id', validarIdProducto, obtenerProductoPorId);
router.patch('/:id/estado', validarIdProducto, cambiarEstadoProducto);
router.delete('/:id', validarIdProducto, eliminarProducto);

    
export default router;