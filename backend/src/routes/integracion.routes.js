import { Router }
    from 'express';

import {prepararProducto} from '../controllers/integracion.controller.js';

import {validarIdProducto} from '../middlewares/productos.middleware.js';

const router = Router();

router.get('/productos/:id/preparar', validarIdProducto, prepararProducto);

export default router;