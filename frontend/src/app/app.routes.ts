import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Usuarios } from './pages/usuarios/usuarios';

import { Productos } from './pages/productos/productos/productos';
import { ProductoCrear } from './pages/productos/producto-crear/producto-crear';
import { ProductoEditar } from './pages/productos/producto-editar/producto-editar';

import { AdminLayout } from './layout/admin-layout/admin-layout';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },

    {
        path: 'login',
        component: Login
    },

    {
        path: '',
        component: AdminLayout,
        children: [

            {
                path: 'dashboard',
                component: Dashboard
            },

            {
                path: 'usuarios',
                component: Usuarios
            },

            {
                path: 'productos',
                component: Productos
            },

            {
                path: 'productos/nuevo',
                component: ProductoCrear
            },

            {
                path: 'productos/:id/editar',
                component: ProductoEditar
            }

        ]
    },

    {
        path: '**',
        redirectTo: 'login'
    }

];