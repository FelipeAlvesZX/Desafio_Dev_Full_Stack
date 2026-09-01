import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { TabelaPesquisa, ColunaTabela } from '../../../shared/components/tabela-pesquisa/tabela-pesquisa';
import { ConfirmacaoDialog } from '../../../shared/components/confirmacao-dialog/confirmacao-dialog';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { BebidaService } from '../bebida.service';
import { Bebida } from '../../../core/models/bebida.model';

@Component({
  selector: 'app-bebida-lista',
  standalone: true,
  imports: [TabelaPesquisa, ConfirmacaoDialog],
  templateUrl: './bebida-lista.html',
  styleUrl: './bebida-lista.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BebidaLista {
  private readonly service = inject(BebidaService);
  private readonly notificacao = inject(NotificacaoService);
  private readonly router = inject(Router);

  protected readonly bebidas = signal<Bebida[]>([]);
  protected readonly carregando = signal(false);
  protected readonly termo = signal('');
  protected readonly paraExcluir = signal<Bebida | null>(null);

  protected readonly colunas: ColunaTabela[] = [
    { campo: 'codigo', titulo: 'Código' },
    { campo: 'descricao', titulo: 'Descrição' },
    { campo: 'precoUnitario', titulo: 'Preço', formato: 'moeda' },
    { campo: 'contemAcucar', titulo: 'Contém açúcar', formato: 'booleano', rotulos: ['Sim', 'Não'] },
  ];

  constructor() {
    this.carregar();
  }

  protected carregar(termo = ''): void {
    this.carregando.set(true);
    this.service.listar(termo).subscribe({
      next: (dados) => { this.bebidas.set(dados); this.carregando.set(false); },
      error: () => this.carregando.set(false),
    });
  }

  protected buscar(termo: string): void {
    this.termo.set(termo);
    this.carregar(termo);
  }

  protected novo(): void { this.router.navigate(['/bebidas/novo']); }
  protected editar(b: Bebida): void { this.router.navigate(['/bebidas', b.id]); }

  protected confirmarExclusao(): void {
    const bebida = this.paraExcluir();
    if (!bebida) return;
    this.service.excluir(bebida.id).subscribe({
      next: () => {
        this.notificacao.sucesso(`Bebida ${bebida.codigo} excluída.`);
        this.paraExcluir.set(null);
        this.carregar(this.termo());
      },
      error: () => this.paraExcluir.set(null),
    });
  }
}
