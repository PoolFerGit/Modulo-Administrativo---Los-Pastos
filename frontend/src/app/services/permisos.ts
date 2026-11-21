import {
    Injectable,
    signal
} from '@angular/core';

import {
    RolUsuario
} from '../models/usuario';


@Injectable({
    providedIn: 'root'
})
export class PermisosService {


    private rol =
        signal<RolUsuario>(
            this.obtenerRolInicial()
        );


    rolActual =
        this.rol.asReadonly();


    private obtenerRolInicial():
        RolUsuario {

        const rolGuardado =
            localStorage.getItem(
                'rolUsuario'
            );


        if (
            rolGuardado === 'ADMIN' ||
            rolGuardado === 'DEVELOPER' ||
            rolGuardado === 'EDITOR'
        ) {

            return rolGuardado;

        }


        localStorage.setItem(
            'rolUsuario',
            'ADMIN'
        );


        return 'ADMIN';

    }


    establecerRol(
        rol: RolUsuario
    ): void {

        localStorage.setItem(
            'rolUsuario',
            rol
        );


        this.rol.set(
            rol
        );

    }


    puedeVerUsuarios():
        boolean {

        return (
            this.rol() === 'ADMIN' ||
            this.rol() === 'DEVELOPER'
        );

    }


    puedeGestionarUsuarios():
        boolean {

        return (
            this.rol() === 'ADMIN'
        );

    }


    puedeEliminarProductos():
        boolean {

        return (
            this.rol() === 'ADMIN' ||
            this.rol() === 'DEVELOPER'
        );

    }


    puedeGestionarProductos():
        boolean {

        return true;

    }

}