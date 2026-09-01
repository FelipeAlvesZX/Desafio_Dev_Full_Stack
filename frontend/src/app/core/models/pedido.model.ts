export interface ItemPedido {
  id: number;
  itemId: number;
  codigo: string;
  descricao: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  codigo: string;
  dataPedido: string;
  descricao: string | null;
  clienteNome: string;
  clienteEndereco: string;
  clienteTelefone: string;
  hamburgueres: ItemPedido[];
  bebidas: ItemPedido[];
  adicionais: ItemPedido[];
  observacoes: string[];
  valorTotal: number;
}

export interface PedidoResumo {
  id: number;
  codigo: string;
  dataPedido: string;
  clienteNome: string;
  valorTotal: number;
}

export interface ItemQuantidadeRequest {
  quantidade: number;
}

export interface ItemHamburguerRequest extends ItemQuantidadeRequest {
  hamburguerId: number;
}

export interface ItemBebidaRequest extends ItemQuantidadeRequest {
  bebidaId: number;
}

export interface AdicionalRequest extends ItemQuantidadeRequest {
  ingredienteId: number;
}

export interface ObservacaoRequest {
  texto: string;
}

export interface PedidoRequest {
  descricao: string | null;
  clienteNome: string;
  clienteEndereco: string;
  clienteTelefone: string;
  hamburgueres: ItemHamburguerRequest[];
  bebidas: ItemBebidaRequest[];
  adicionais: AdicionalRequest[];
  observacoes: ObservacaoRequest[];
}
