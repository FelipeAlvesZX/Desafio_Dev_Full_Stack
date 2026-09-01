import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'moedaBr', standalone: true })
export class MoedaBrPipe implements PipeTransform {
  private readonly formatador = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  transform(valor: number | string | null | undefined): string {
    if (valor === null || valor === undefined || valor === '') return '';
    const numero = typeof valor === 'string' ? Number(valor) : valor;
    return Number.isNaN(numero) ? '' : this.formatador.format(numero);
  }
}
