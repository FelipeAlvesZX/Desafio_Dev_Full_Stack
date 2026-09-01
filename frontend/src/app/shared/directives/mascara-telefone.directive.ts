import { Directive, HostListener, OnInit, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMascaraTelefone]',
  standalone: true,
})
export class MascaraTelefoneDirective implements OnInit {
  private readonly ngControl = inject(NgControl, { optional: true });

  ngOnInit(): void {
    const atual = this.ngControl?.control?.value;
    if (atual) {
      this.escrever(this.formatar(String(atual)));
    }
  }

  @HostListener('input', ['$event'])
  aoDigitar(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const formatado = this.formatar(input.value);

    input.value = formatado;
    this.escrever(formatado);
    input.setSelectionRange(formatado.length, formatado.length);
  }

  private formatar(valor: string): string {
    const digitos = (valor ?? '').replace(/\D/g, '').slice(0, 11);

    if (digitos.length === 0) return '';
    if (digitos.length <= 2) return `(${digitos}`;
    if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
    if (digitos.length <= 10) {
      return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
    }
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }

  private escrever(valor: string): void {
    this.ngControl?.control?.setValue(valor, { emitEvent: false });
  }
}
