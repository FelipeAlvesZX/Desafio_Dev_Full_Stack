import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmacaoDialog } from '../../../shared/components/confirmacao-dialog/confirmacao-dialog';
import { MoedaBrPipe } from '../../../shared/pipes/moeda-br-pipe';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { PedidoService } from '../pedido.service';
import { PedidoResumo } from '../../../core/models/pedido.model';

@Component({
  selector: 'app-pedido-lista',
  standalone: true,
  imports: [ConfirmacaoDialog, MoedaBrPipe, DatePipe],
  templateUrl: './pedido-lista.html',
  styleUrl: './pedido-lista.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidoLista {
  private readonly service = inject(PedidoService);
  private readonly notificacao = inject(NotificacaoService);
  private readonly router = inject(Router);

  protected readonly pedidos = signal<PedidoResumo[]>([]);
  protected readonly carregando = signal(false);
  protected readonly termo = signal('');
  protected readonly paraExcluir = signal<PedidoResumo | null>(null);

  constructor() { this.carregar(); }

  protected carregar(termo = ''): void {
    this.carregando.set(true);
    this.service.listar(termo).subscribe({
      next: (dados) => { this.pedidos.set(dados); this.carregando.set(false); },
      error: () => this.carregando.set(false),
    });
  }

  protected buscar(valor: string): void { this.termo.set(valor); this.carregar(valor); }
  protected novo(): void { this.router.navigate(['/pedidos/novo']); }
  protected editar(p: PedidoResumo): void { this.router.navigate(['/pedidos', p.id]); }

  protected confirmarExclusao(): void {
    const item = this.paraExcluir();
    if (!item) return;
    this.service.excluir(item.id).subscribe({
      next: () => {
        this.notificacao.sucesso(`Pedido ${item.codigo} excluído.`);
        this.paraExcluir.set(null);
        this.carregar(this.termo());
      },
      error: () => this.paraExcluir.set(null),
    });
  }
}
