import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MascaraCodigoDirective } from '../../../shared/directives/mascara-codigo.directive';
import { MoedaBrPipe } from '../../../shared/pipes/moeda-br-pipe';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { HamburguerService } from '../hamburguer.service';
import { IngredienteService } from '../../ingrediente/ingrediente.service';
import { Ingrediente } from '../../../core/models/ingrediente.model';

@Component({
  selector: 'app-hamburguer-form',
  standalone: true,
  imports: [ReactiveFormsModule, MoedaBrPipe, MascaraCodigoDirective],
  templateUrl: './hamburguer-form.html',
  styleUrl: './hamburguer-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HamburguerForm {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(HamburguerService);
  private readonly ingredienteService = inject(IngredienteService);
  private readonly notificacao = inject(NotificacaoService);
  private readonly router = inject(Router);
  private readonly rota = inject(ActivatedRoute);

  protected readonly id = signal<number | null>(null);
  protected readonly salvando = signal(false);
  protected readonly ingredientes = signal<Ingrediente[]>([]);
  protected readonly selecionados = signal<Set<number>>(new Set());

  protected readonly form = this.fb.nonNullable.group({
    codigo: ['', [Validators.pattern(/^[A-Z]{3}-[0-9]{4}$/)]],
    descricao: ['', [Validators.required, Validators.maxLength(120)]],
    valor: [0, [Validators.required, Validators.min(0)]],
  });

  constructor() {
    this.ingredienteService.listar().subscribe((lista) => this.ingredientes.set(lista));

    const param = this.rota.snapshot.paramMap.get('id');
    if (param && param !== 'novo') {
      const id = Number(param);
      this.id.set(id);
      this.service.buscarPorId(id).subscribe((h) => {
        this.form.patchValue({ codigo: h.codigo, descricao: h.descricao, valor: h.valor });
        this.selecionados.set(new Set(h.ingredientes.map((i) => i.id)));
      });
    }
  }

  protected alternar(id: number): void {
    this.selecionados.update((atual) => {
      const novo = new Set(atual);
      novo.has(id) ? novo.delete(id) : novo.add(id);
      return novo;
    });
  }

  protected invalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  protected salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    if (this.selecionados().size === 0) {
      this.notificacao.aviso('Selecione ao menos um ingrediente.');
      return;
    }

    const v = this.form.getRawValue();
    const req = {
      codigo: v.codigo.trim() === '' ? null : v.codigo.trim().toUpperCase(),
      descricao: v.descricao,
      valor: v.valor,
      ingredienteIds: [...this.selecionados()],
    };

    this.salvando.set(true);
    const id = this.id();
    const chamada = id ? this.service.atualizar(id, req) : this.service.criar(req);

    chamada.subscribe({
      next: (h) => {
        this.notificacao.sucesso(`Hambúrguer ${h.codigo} salvo com sucesso.`);
        this.router.navigate(['/hamburgueres']);
      },
      error: () => this.salvando.set(false),
    });
  }

  protected cancelar(): void { this.router.navigate(['/hamburgueres']); }
}
