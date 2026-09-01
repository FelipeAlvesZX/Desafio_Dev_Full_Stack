import { Routes } from '@angular/router';

export const bebidaRoutes: Routes = [
  { path: '', loadComponent: () => import('./bebida-lista/bebida-lista').then((m) => m.BebidaLista) },
  { path: 'novo', loadComponent: () => import('./bebida-form/bebida-form').then((m) => m.BebidaForm) },
  { path: ':id', loadComponent: () => import('./bebida-form/bebida-form').then((m) => m.BebidaForm) },
];
