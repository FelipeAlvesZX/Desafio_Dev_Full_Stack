import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { TabelaPesquisa, ColunaTabela } from '../../../shared/components/tabela-pesquisa/tabela-pesquisa';
import { ConfirmacaoDialog } from '../../../shared/components/confirmacao-dialog/confirmacao-dialog';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { HamburguerService } from '../hamburguer.service';
import { Hamburguer } from '../../../core/models/hamburguer.model';

@Component({
  selector: 'app-hamburguer-lista',
  standalone: true,
  imports: [TabelaPesquisa, ConfirmacaoDialog],
  templateUrl: './hamburguer-lista.html',
  styleUrl: './hamburguer-lista.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HamburguerLista {
  private readonly service = inject(HamburguerService);
  private readonly notificacao = inject(NotificacaoService);
  private readonly router = inject(Router);

  protected readonly hamburgueres = signal<Hamburguer[]>([]);
  protected readonly carregando = signal(false);
  protected readonly termo = signal('');
  protected readonly paraExcluir = signal<Hamburguer | null>(null);

  protected readonly colunas: ColunaTabela[] = [
    { campo: 'codigo', titulo: 'Código' },
    { campo: 'descricao', titulo: 'Descrição' },
    { campo: 'valor', titulo: 'Valor', formato: 'moeda' },
  ];

  constructor() { this.carregar(); }

  protected carregar(termo = ''): void {
    this.carregando.set(true);
    this.service.listar(termo).subscribe({
      next: (dados) => { this.hamburgueres.set(dados); this.carregando.set(false); },
      error: () => this.carregando.set(false),
    });
  }

  protected buscar(termo: string): void { this.termo.set(termo); this.carregar(termo); }
  protected novo(): void { this.router.navigate(['/hamburgueres/novo']); }
  protected editar(h: Hamburguer): void { this.router.navigate(['/hamburgueres', h.id]); }

  protected confirmarExclusao(): void {
    const item = this.paraExcluir();
    if (!item) return;
    this.service.excluir(item.id).subscribe({
      next: () => {
        this.notificacao.sucesso(`Hambúrguer ${item.codigo} excluído.`);
        this.paraExcluir.set(null);
        this.carregar(this.termo());
      },
      error: () => this.paraExcluir.set(null),
    });
  }
}
