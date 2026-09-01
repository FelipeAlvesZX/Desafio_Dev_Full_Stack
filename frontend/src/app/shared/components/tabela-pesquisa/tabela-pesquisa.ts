import { Component, input, output, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MoedaBrPipe } from '../../pipes/moeda-br-pipe';

export type FormatoColuna = 'texto' | 'moeda' | 'booleano';

export interface ColunaTabela {
  campo: string;
  titulo: string;
  formato?: FormatoColuna;
  rotulos?: [string, string];
}

@Component({
  selector: 'app-tabela-pesquisa',
  standalone: true,
  imports: [NgTemplateOutlet, MoedaBrPipe],
  templateUrl: './tabela-pesquisa.html',
  styleUrl: './tabela-pesquisa.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabelaPesquisa<T extends object = object> {
  readonly colunas = input.required<ColunaTabela[]>();
  readonly dados = input.required<readonly T[]>();
  readonly termo = input<string>('');
  readonly placeholder = input<string>('Buscar por código ou descrição...');
  readonly carregando = input<boolean>(false);
  readonly textoVazio = input<string>('Nenhum registro encontrado.');
  readonly rotuloNovo = input<string>('Novo');

  readonly acoesTemplate = input<TemplateRef<unknown> | null>(null);

  readonly termoChange = output<string>();
  readonly novo = output<void>();

  aoDigitar(valor: string): void {
    this.termoChange.emit(valor);
  }

  valor(linha: T, campo: string): unknown {
    return (linha as Record<string, unknown>)[campo];
  }

  numeroDe(linha: T, campo: string): number {
    return Number((linha as Record<string, unknown>)[campo] ?? 0);
  }

  boolDe(linha: T, campo: string): boolean {
    return (linha as Record<string, unknown>)[campo] === true;
  }

  alinhaDireita(coluna: ColunaTabela): boolean {
    return coluna.formato === 'moeda';
  }

  rotuloSim(coluna: ColunaTabela): string {
    return coluna.rotulos ? coluna.rotulos[0] : 'Sim';
  }

  rotuloNao(coluna: ColunaTabela): string {
    return coluna.rotulos ? coluna.rotulos[1] : 'Não';
  }
}
