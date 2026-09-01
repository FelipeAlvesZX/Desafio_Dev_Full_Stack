import { Routes } from '@angular/router';

export const ingredienteRoutes: Routes = [
  { path: '', loadComponent: () => import('./ingrediente-lista/ingrediente-lista').then((m) => m.IngredienteLista) },
  { path: 'novo', loadComponent: () => import('./ingrediente-form/ingrediente-form').then((m) => m.IngredienteForm) },
  { path: ':id', loadComponent: () => import('./ingrediente-form/ingrediente-form').then((m) => m.IngredienteForm) },
];
