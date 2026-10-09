import { Router } from 'express';
import { obtenerProductos, crearProducto } from '../controllers/productos.controller.js';

const router = Router();

router.get('/', obtenerProductos);
router.post('/', crearProducto);
    
export default router;