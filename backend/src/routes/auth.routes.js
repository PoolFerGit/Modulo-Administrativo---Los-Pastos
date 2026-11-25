import {
    Router
} from 'express';

import {
    validarAccesoUsuario, iniciarSesionGoogle
} from '../controllers/auth.controller.js';


const router =
    Router();


router.post(
    '/validar-usuario',
    validarAccesoUsuario
);

router.post(
    '/google',
    iniciarSesionGoogle
);

export default router;