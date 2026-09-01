import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bebida, BebidaRequest } from '../../core/models/bebida.model';

@Injectable({ providedIn: 'root' })
export class BebidaService {
  private readonly http = inject(HttpClient);
  private readonly url = '/bebidas';

  listar(termo?: string): Observable<Bebida[]> {
    const params = termo ? new HttpParams().set('termo', termo) : undefined;
    return this.http.get<Bebida[]>(this.url, { params });
  }

  buscarPorId(id: number): Observable<Bebida> {
    return this.http.get<Bebida>(`${this.url}/${id}`);
  }

  criar(req: BebidaRequest): Observable<Bebida> {
    return this.http.post<Bebida>(this.url, req);
  }

  atualizar(id: number, req: BebidaRequest): Observable<Bebida> {
    return this.http.put<Bebida>(`${this.url}/${id}`, req);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
