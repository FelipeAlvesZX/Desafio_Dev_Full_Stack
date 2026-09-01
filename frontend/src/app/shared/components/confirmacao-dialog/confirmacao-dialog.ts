import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-confirmacao-dialog',
  standalone: true,
  templateUrl: './confirmacao-dialog.html',
  styleUrl: './confirmacao-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmacaoDialog {
  readonly aberto = input<boolean>(false);
  readonly titulo = input<string>('Confirmar exclusão');
  readonly mensagem = input<string>('Esta ação não poderá ser desfeita. Deseja continuar?');
  readonly textoConfirmar = input<string>('Excluir');
  readonly textoCancelar = input<string>('Cancelar');
  readonly perigoso = input<boolean>(true);

  readonly confirmar = output<void>();
  readonly cancelar = output<void>();
}
