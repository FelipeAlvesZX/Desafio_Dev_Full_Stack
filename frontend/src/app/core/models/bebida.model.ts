export interface Bebida {
  id: number;
  codigo: string;
  descricao: string;
  precoUnitario: number;
  contemAcucar: boolean;
}

export interface BebidaRequest {
  codigo: string | null;
  descricao: string;
  precoUnitario: number;
  contemAcucar: boolean;
}
