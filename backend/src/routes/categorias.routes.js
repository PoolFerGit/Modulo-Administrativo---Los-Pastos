import { Router } from 'express';

import {
    obtenerCategorias
} from '../controllers/categorias.controller.js';


const router = Router();


router.get(
    '/',
    obtenerCategorias
);


export default router;