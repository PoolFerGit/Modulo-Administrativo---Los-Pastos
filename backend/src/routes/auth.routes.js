import {
    Router
} from 'express';

import {
    validarAccesoUsuario
} from '../controllers/auth.controller.js';


const router =
    Router();


router.post(
    '/validar-usuario',
    validarAccesoUsuario
);


export default router;