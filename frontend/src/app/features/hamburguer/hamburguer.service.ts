import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hamburguer, HamburguerRequest } from '../../core/models/hamburguer.model';

@Injectable({ providedIn: 'root' })
export class HamburguerService {
  private readonly http = inject(HttpClient);
  private readonly url = '/hamburgueres';

  listar(termo?: string): Observable<Hamburguer[]> {
    const params = termo ? new HttpParams().set('termo', termo) : undefined;
    return this.http.get<Hamburguer[]>(this.url, { params });
  }

  buscarPorId(id: number): Observable<Hamburguer> {
    return this.http.get<Hamburguer>(`${this.url}/${id}`);
  }

  criar(req: HamburguerRequest): Observable<Hamburguer> {
    return this.http.post<Hamburguer>(this.url, req);
  }

  atualizar(id: number, req: HamburguerRequest): Observable<Hamburguer> {
    return this.http.put<Hamburguer>(`${this.url}/${id}`, req);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
