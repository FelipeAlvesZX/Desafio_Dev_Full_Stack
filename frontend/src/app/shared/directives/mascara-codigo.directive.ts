import { Directive, HostListener, OnInit, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMascaraCodigo]',
  standalone: true,
})

export class MascaraCodigoDirective implements OnInit {
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
    const limpo = (valor ?? '').toUpperCase();

    let letras = '';
    let digitos = '';

    for (const caractere of limpo) {
      if (letras.length < 3) {
        if (caractere >= 'A' && caractere <= 'Z') {
          letras += caractere;
        }
      } else if (digitos.length < 4) {
        if (caractere >= '0' && caractere <= '9') {
          digitos += caractere;
        }
      }
    }

    return digitos.length > 0 ? `${letras}-${digitos}` : letras;
  }

  private escrever(valor: string): void {
    this.ngControl?.control?.setValue(valor, { emitEvent: false });
  }
}
