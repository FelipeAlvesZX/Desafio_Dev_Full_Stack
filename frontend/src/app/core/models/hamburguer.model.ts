import { Ingrediente } from './ingrediente.model';

export interface Hamburguer {
  id: number;
  codigo: string;
  descricao: string;
  valor: number;
  ingredientes: Ingrediente[];
}

export interface HamburguerRequest {
  codigo: string | null;
  descricao: string;
  valor: number;
  ingredienteIds: number[];
}
