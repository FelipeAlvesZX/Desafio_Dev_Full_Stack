export interface Ingrediente {
  id: number;
  codigo: string;
  descricao: string;
  precoUnitario: number;
  permiteAdicional: boolean;
}

export interface IngredienteRequest {
  codigo: string | null;
  descricao: string;
  precoUnitario: number;
  permiteAdicional: boolean;
}
