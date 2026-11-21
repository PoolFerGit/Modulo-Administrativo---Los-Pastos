import {
    inject
} from '@angular/core';

import {
    CanActivateFn,
    Router
} from '@angular/router';

import {
    PermisosService
} from '../services/permisos';


export const usuariosGuard:
    CanActivateFn =
    () => {

        const permisos =
            inject(
                PermisosService
            );


        const router =
            inject(
                Router
            );


        if (
            permisos
                .puedeVerUsuarios()
        ) {

            return true;

        }


        return router
            .createUrlTree(
                [
                    '/dashboard'
                ]
            );

    };