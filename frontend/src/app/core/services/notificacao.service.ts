import { Injectable, signal } from '@angular/core';

export type TipoNotificacao = 'sucesso' | 'erro' | 'aviso';

export interface Notificacao {
  id: number;
  tipo: TipoNotificacao;
  mensagem: string;
}

@Injectable({ providedIn: 'root' })
export class NotificacaoService {
  private readonly lista = signal<Notificacao[]>([]);
  private proximoId = 1;

  readonly notificacoes = this.lista.asReadonly();

  sucesso(mensagem: string): void { this.adicionar('sucesso', mensagem); }
  erro(mensagem: string): void { this.adicionar('erro', mensagem); }
  aviso(mensagem: string): void { this.adicionar('aviso', mensagem); }

  remover(id: number): void {
    this.lista.update((atual) => atual.filter((n) => n.id !== id));
  }

  private adicionar(tipo: TipoNotificacao, mensagem: string): void {
    const id = this.proximoId++;
    this.lista.update((atual) => [...atual, { id, tipo, mensagem }]);
    setTimeout(() => this.remover(id), 4000);
  }
}
