import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'pedidos', pathMatch: 'full' },

  {
    path: 'bebidas',
    loadChildren: () => import('./features/bebida/bebida.routes').then((m) => m.bebidaRoutes),
  },
  {
    path: 'ingredientes',
    loadChildren: () => import('./features/ingrediente/ingrediente.routes').then((m) => m.ingredienteRoutes),
  },
  {
    path: 'hamburgueres',
    loadChildren: () => import('./features/hamburguer/hamburguer.routes').then((m) => m.hamburguerRoutes),
  },
  {
    path: 'pedidos',
    loadChildren: () => import('./features/pedido/pedido.routes').then((m) => m.pedidoRoutes),
  },

  { path: '**', redirectTo: 'pedidos' },
];
