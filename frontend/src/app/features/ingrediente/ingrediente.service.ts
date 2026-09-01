import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingrediente, IngredienteRequest } from '../../core/models/ingrediente.model';

@Injectable({ providedIn: 'root' })
export class IngredienteService {
  private readonly http = inject(HttpClient);
  private readonly url = '/ingredientes';

  listar(termo?: string): Observable<Ingrediente[]> {
    const params = termo ? new HttpParams().set('termo', termo) : undefined;
    return this.http.get<Ingrediente[]>(this.url, { params });
  }

  
  listarAdicionais(): Observable<Ingrediente[]> {
    return this.http.get<Ingrediente[]>(`${this.url}/adicionais`);
  }

  buscarPorId(id: number): Observable<Ingrediente> {
    return this.http.get<Ingrediente>(`${this.url}/${id}`);
  }

  criar(req: IngredienteRequest): Observable<Ingrediente> {
    return this.http.post<Ingrediente>(this.url, req);
  }

  atualizar(id: number, req: IngredienteRequest): Observable<Ingrediente> {
    return this.http.put<Ingrediente>(`${this.url}/${id}`, req);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
