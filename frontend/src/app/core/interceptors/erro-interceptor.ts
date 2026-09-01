import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificacaoService } from '../services/notificacao.service';

interface ErroCampo { campo: string; mensagem: string; }
interface ErroResposta { mensagem?: string; campos?: ErroCampo[]; }

export const erroInterceptor: HttpInterceptorFn = (req, next) => {
  const notificacao = inject(NotificacaoService);

  return next(req).pipe(
    catchError((erro: HttpErrorResponse) => {
      notificacao.erro(mensagemDe(erro));
      return throwError(() => erro);
    })
  );
};

function mensagemDe(erro: HttpErrorResponse): string {
  if (erro.status === 0) {
    return 'Não foi possível conectar ao servidor.';
  }

  const corpo = erro.error as ErroResposta | null;

  if (corpo?.campos?.length) {
    return corpo.campos.map((c) => `${c.campo}: ${c.mensagem}`).join(' • ');
  }
  if (corpo?.mensagem) {
    return corpo.mensagem;
  }

  switch (erro.status) {
    case 404: return 'Registro não encontrado.';
    case 409: return 'Operação não permitida pelas regras de negócio.';
    default:  return `Erro inesperado (HTTP ${erro.status}).`;
  }
}
