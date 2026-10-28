import { Router } from 'express';

import {
    obtenerCategorias
} from '../controllers/categorias.controller.js';
import {
    crearCategoria
} from '../controllers/categorias.controller.js';


const router = Router();


router.get(
    '/',
    obtenerCategorias
);

router.post(
    '/',
    crearCategoria
);


export default router;