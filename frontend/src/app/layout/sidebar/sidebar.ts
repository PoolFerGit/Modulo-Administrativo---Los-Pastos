import {
    Component,
    inject
} from '@angular/core';

import {
    Router,
    RouterLink,
    RouterLinkActive
} from '@angular/router';

import {
    PermisosService
} from '../../services/permisos';

import {
    RolUsuario
} from '../../models/usuario';


@Component({
    selector: 'app-sidebar',

    imports: [
        RouterLink,
        RouterLinkActive
    ],

    templateUrl:
        './sidebar.html',

    styleUrl:
        './sidebar.css'
})
export class Sidebar {


    permisos =
        inject(PermisosService);


    private router =
        inject(Router);


    cambiarRol(
        event: Event
    ): void {

        const select =
            event.target as
                HTMLSelectElement;


        const rol =
            select.value as
                RolUsuario;


        this.permisos
            .establecerRol(
                rol
            );


        if (
            !this.permisos
                .puedeVerUsuarios() &&
            this.router.url
                .startsWith(
                    '/usuarios'
                )
        ) {

            this.router.navigate(
                [
                    '/dashboard'
                ]
            );

        }

    }

}