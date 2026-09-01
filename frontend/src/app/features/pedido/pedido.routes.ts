import { Routes } from '@angular/router';

export const pedidoRoutes: Routes = [
  { path: '', loadComponent: () => import('./pedido-lista/pedido-lista').then((m) => m.PedidoLista) },
  { path: 'novo', loadComponent: () => import('./pedido-form/pedido-form').then((m) => m.PedidoForm) },
  { path: ':id', loadComponent: () => import('./pedido-form/pedido-form').then((m) => m.PedidoForm) },
];
