import { Routes } from '@angular/router';

export const hamburguerRoutes: Routes = [
  { path: '', loadComponent: () => import('./hamburguer-lista/hamburguer-lista').then((m) => m.HamburguerLista) },
  { path: 'novo', loadComponent: () => import('./hamburguer-form/hamburguer-form').then((m) => m.HamburguerForm) },
  { path: ':id', loadComponent: () => import('./hamburguer-form/hamburguer-form').then((m) => m.HamburguerForm) },
];
