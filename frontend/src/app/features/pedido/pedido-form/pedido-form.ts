import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MoedaBrPipe } from '../../../shared/pipes/moeda-br-pipe';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { PedidoService } from '../pedido.service';
import { HamburguerService } from '../../hamburguer/hamburguer.service';
import { BebidaService } from '../../bebida/bebida.service';
import { IngredienteService } from '../../ingrediente/ingrediente.service';
import { Hamburguer } from '../../../core/models/hamburguer.model';
import { Bebida } from '../../../core/models/bebida.model';
import { Ingrediente } from '../../../core/models/ingrediente.model';

interface LinhaItem {
  itemId: number;
  codigo: string;
  descricao: string;
  precoUnitario: number;
  quantidade: number;
}

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [ReactiveFormsModule, MoedaBrPipe, DatePipe],
  templateUrl: './pedido-form.html',
  styleUrl: './pedido-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PedidoForm {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(PedidoService);
  private readonly hamburguerService = inject(HamburguerService);
  private readonly bebidaService = inject(BebidaService);
  private readonly ingredienteService = inject(IngredienteService);
  private readonly notificacao = inject(NotificacaoService);
  private readonly router = inject(Router);
  private readonly rota = inject(ActivatedRoute);

  protected readonly id = signal<number | null>(null);
  protected readonly codigo = signal<string>('');
  protected readonly dataPedido = signal<string | null>(null);
  protected readonly agora = new Date();
  protected readonly salvando = signal(false);

  protected readonly hamburgueres = signal<Hamburguer[]>([]);
  protected readonly bebidas = signal<Bebida[]>([]);
  protected readonly adicionaisDisponiveis = signal<Ingrediente[]>([]);

  protected readonly itensHamburguer = signal<LinhaItem[]>([]);
  protected readonly itensBebida = signal<LinhaItem[]>([]);
  protected readonly itensAdicional = signal<LinhaItem[]>([]);
  protected readonly observacoes = signal<string[]>([]);

  protected readonly hamburguerSelecionado = signal<number | null>(null);
  protected readonly bebidaSelecionada = signal<number | null>(null);
  protected readonly adicionalSelecionado = signal<number | null>(null);
  protected readonly novaObservacao = signal('');

  protected readonly valorTotal = computed(() =>
    this.somar(this.itensHamburguer()) +
    this.somar(this.itensBebida()) +
    this.somar(this.itensAdicional())
  );

  protected readonly form = this.fb.nonNullable.group({
    descricao: [''],
    clienteNome: ['', [Validators.required, Validators.maxLength(120)]],
    clienteEndereco: ['', [Validators.required, Validators.maxLength(255)]],
    clienteTelefone: ['', [Validators.required, Validators.maxLength(20)]],
  });

  constructor() {
    this.hamburguerService.listar().subscribe((l) => this.hamburgueres.set(l));
    this.bebidaService.listar().subscribe((l) => this.bebidas.set(l));
    this.ingredienteService.listarAdicionais().subscribe((l) => this.adicionaisDisponiveis.set(l));

    const param = this.rota.snapshot.paramMap.get('id');
    if (param && param !== 'novo') {
      const id = Number(param);
      this.id.set(id);
      this.service.buscarPorId(id).subscribe((p) => {
        this.codigo.set(p.codigo);
        this.dataPedido.set(p.dataPedido);
        this.form.patchValue({
          descricao: p.descricao ?? '',
          clienteNome: p.clienteNome,
          clienteEndereco: p.clienteEndereco,
          clienteTelefone: p.clienteTelefone,
        });
        this.itensHamburguer.set(p.hamburgueres.map(this.paraLinha));
        this.itensBebida.set(p.bebidas.map(this.paraLinha));
        this.itensAdicional.set(p.adicionais.map(this.paraLinha));
        this.observacoes.set([...p.observacoes]);
      });
    }
  }

  private paraLinha = (i: { itemId: number; codigo: string; descricao: string; precoUnitario: number; quantidade: number }): LinhaItem => ({
    itemId: i.itemId, codigo: i.codigo, descricao: i.descricao,
    precoUnitario: i.precoUnitario, quantidade: i.quantidade,
  });

  private somar(itens: LinhaItem[]): number {
    return itens.reduce((t, i) => t + i.precoUnitario * i.quantidade, 0);
  }

  protected adicionarHamburguer(): void {
    const id = this.hamburguerSelecionado();
    const item = this.hamburgueres().find((h) => h.id === Number(id));
    if (!item) { this.notificacao.aviso('Selecione um hambúrguer.'); return; }
    this.itensHamburguer.update((atual) => this.incluir(atual, {
      itemId: item.id, codigo: item.codigo, descricao: item.descricao,
      precoUnitario: item.valor, quantidade: 1,
    }));
  }

  protected adicionarBebida(): void {
    const id = this.bebidaSelecionada();
    const item = this.bebidas().find((b) => b.id === Number(id));
    if (!item) { this.notificacao.aviso('Selecione uma bebida.'); return; }
    this.itensBebida.update((atual) => this.incluir(atual, {
      itemId: item.id, codigo: item.codigo, descricao: item.descricao,
      precoUnitario: item.precoUnitario, quantidade: 1,
    }));
  }

  protected adicionarAdicional(): void {
    const id = this.adicionalSelecionado();
    const item = this.adicionaisDisponiveis().find((i) => i.id === Number(id));
    if (!item) { this.notificacao.aviso('Selecione um adicional.'); return; }
    this.itensAdicional.update((atual) => this.incluir(atual, {
      itemId: item.id, codigo: item.codigo, descricao: item.descricao,
      precoUnitario: item.precoUnitario, quantidade: 1,
    }));
  }

  private incluir(atual: LinhaItem[], novo: LinhaItem): LinhaItem[] {
    const existente = atual.find((i) => i.itemId === novo.itemId);
    return existente
      ? atual.map((i) => (i.itemId === novo.itemId ? { ...i, quantidade: i.quantidade + 1 } : i))
      : [...atual, novo];
  }

  protected alterarQuantidade(lista: 'hamburguer' | 'bebida' | 'adicional', itemId: number, delta: number): void {
    const alvo = lista === 'hamburguer' ? this.itensHamburguer
               : lista === 'bebida' ? this.itensBebida
               : this.itensAdicional;

    alvo.update((atual) =>
      atual
        .map((i) => (i.itemId === itemId ? { ...i, quantidade: i.quantidade + delta } : i))
        .filter((i) => i.quantidade > 0)
    );
  }

  protected remover(lista: 'hamburguer' | 'bebida' | 'adicional', itemId: number): void {
    const alvo = lista === 'hamburguer' ? this.itensHamburguer
               : lista === 'bebida' ? this.itensBebida
               : this.itensAdicional;
    alvo.update((atual) => atual.filter((i) => i.itemId !== itemId));
  }

  protected adicionarObservacao(): void {
    const texto = this.novaObservacao().trim();
    if (!texto) return;
    this.observacoes.update((atual) => [...atual, texto]);
    this.novaObservacao.set('');
  }

  protected removerObservacao(indice: number): void {
    this.observacoes.update((atual) => atual.filter((_, i) => i !== indice));
  }

  protected invalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  protected salvar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    if (this.itensHamburguer().length === 0 && this.itensBebida().length === 0) {
      this.notificacao.aviso('O pedido deve conter ao menos um hambúrguer ou uma bebida.');
      return;
    }

    const v = this.form.getRawValue();
    const req = {
      descricao: v.descricao.trim() === '' ? null : v.descricao,
      clienteNome: v.clienteNome,
      clienteEndereco: v.clienteEndereco,
      clienteTelefone: v.clienteTelefone,
      hamburgueres: this.itensHamburguer().map((i) => ({ hamburguerId: i.itemId, quantidade: i.quantidade })),
      bebidas: this.itensBebida().map((i) => ({ bebidaId: i.itemId, quantidade: i.quantidade })),
      adicionais: this.itensAdicional().map((i) => ({ ingredienteId: i.itemId, quantidade: i.quantidade })),
      observacoes: this.observacoes().map((texto) => ({ texto })),
    };

    this.salvando.set(true);
    const id = this.id();
    const chamada = id ? this.service.atualizar(id, req) : this.service.criar(req);

    chamada.subscribe({
      next: (p) => {
        this.notificacao.sucesso(`Pedido ${p.codigo} salvo com sucesso.`);
        this.router.navigate(['/pedidos']);
      },
      error: () => this.salvando.set(false),
    });
  }

  protected cancelar(): void { this.router.navigate(['/pedidos']); }
}
