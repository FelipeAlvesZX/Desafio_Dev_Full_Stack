import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido, PedidoRequest, PedidoResumo } from '../../core/models/pedido.model';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly http = inject(HttpClient);
  private readonly url = '/pedidos';

  listar(termo?: string): Observable<PedidoResumo[]> {
    const params = termo ? new HttpParams().set('termo', termo) : undefined;
    return this.http.get<PedidoResumo[]>(this.url, { params });
  }

  buscarPorId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.url}/${id}`);
  }

  criar(req: PedidoRequest): Observable<Pedido> {
    return this.http.post<Pedido>(this.url, req);
  }

  atualizar(id: number, req: PedidoRequest): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.url}/${id}`, req);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
