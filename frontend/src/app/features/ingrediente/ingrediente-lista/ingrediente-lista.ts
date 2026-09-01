import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { TabelaPesquisa, ColunaTabela } from '../../../shared/components/tabela-pesquisa/tabela-pesquisa';
import { ConfirmacaoDialog } from '../../../shared/components/confirmacao-dialog/confirmacao-dialog';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { IngredienteService } from '../ingrediente.service';
import { Ingrediente } from '../../../core/models/ingrediente.model';

@Component({
  selector: 'app-ingrediente-lista',
  standalone: true,
  imports: [TabelaPesquisa, ConfirmacaoDialog],
  templateUrl: './ingrediente-lista.html',
  styleUrl: './ingrediente-lista.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class IngredienteLista {
  private readonly service = inject(IngredienteService);
  private readonly notificacao = inject(NotificacaoService);
  private readonly router = inject(Router);

  protected readonly ingredientes = signal<Ingrediente[]>([]);
  protected readonly carregando = signal(false);
  protected readonly termo = signal('');
  protected readonly paraExcluir = signal<Ingrediente | null>(null);

  protected readonly colunas: ColunaTabela[] = [
    { campo: 'codigo', titulo: 'Código' },
    { campo: 'descricao', titulo: 'Descrição' },
    { campo: 'precoUnitario', titulo: 'Preço', formato: 'moeda' },
    { campo: 'permiteAdicional', titulo: 'Adicional', formato: 'booleano', rotulos: ['Permitido', 'Não'] },
  ];

  constructor() { this.carregar(); }

  protected carregar(termo = ''): void {
    this.carregando.set(true);
    this.service.listar(termo).subscribe({
      next: (dados) => { this.ingredientes.set(dados); this.carregando.set(false); },
      error: () => this.carregando.set(false),
    });
  }

  protected buscar(termo: string): void { this.termo.set(termo); this.carregar(termo); }
  protected novo(): void { this.router.navigate(['/ingredientes/novo']); }
  protected editar(i: Ingrediente): void { this.router.navigate(['/ingredientes', i.id]); }

  protected confirmarExclusao(): void {
    const item = this.paraExcluir();
    if (!item) return;
    this.service.excluir(item.id).subscribe({
      next: () => {
        this.notificacao.sucesso(`Ingrediente ${item.codigo} excluído.`);
        this.paraExcluir.set(null);
        this.carregar(this.termo());
      },
      error: () => this.paraExcluir.set(null),
    });
  }
}
