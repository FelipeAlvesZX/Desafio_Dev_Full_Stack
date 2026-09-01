import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { IngredienteService } from '../ingrediente.service';

@Component({
  selector: 'app-ingrediente-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './ingrediente-form.html',
  styleUrl: './ingrediente-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class IngredienteForm {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(IngredienteService);
  private readonly notificacao = inject(NotificacaoService);
  private readonly router = inject(Router);
  private readonly rota = inject(ActivatedRoute);

  protected readonly id = signal<number | null>(null);
  protected readonly salvando = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    codigo: ['', [Validators.pattern(/^[A-Z]{3}-[0-9]{4}$/)]],
    descricao: ['', [Validators.required, Validators.maxLength(120)]],
    precoUnitario: [0, [Validators.required, Validators.min(0)]],
    permiteAdicional: [false],
  });

  constructor() {
    const param = this.rota.snapshot.paramMap.get('id');
    if (param && param !== 'novo') {
      const id = Number(param);
      this.id.set(id);
      this.service.buscarPorId(id).subscribe((i) => this.form.patchValue(i));
    }
  }

  protected invalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  protected salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.getRawValue();
    const req = {
      codigo: v.codigo.trim() === '' ? null : v.codigo.trim().toUpperCase(),
      descricao: v.descricao,
      precoUnitario: v.precoUnitario,
      permiteAdicional: v.permiteAdicional,
    };

    this.salvando.set(true);
    const id = this.id();
    const chamada = id ? this.service.atualizar(id, req) : this.service.criar(req);

    chamada.subscribe({
      next: (i) => {
        this.notificacao.sucesso(`Ingrediente ${i.codigo} salvo com sucesso.`);
        this.router.navigate(['/ingredientes']);
      },
      error: () => this.salvando.set(false),
    });
  }

  protected cancelar(): void { this.router.navigate(['/ingredientes']); }
}
