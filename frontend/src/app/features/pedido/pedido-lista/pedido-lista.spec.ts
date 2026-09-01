import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidoLista } from './pedido-lista';

describe('PedidoLista', () => {
  let component: PedidoLista;
  let fixture: ComponentFixture<PedidoLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoLista],
    }).compileComponents();

    fixture = TestBed.createComponent(PedidoLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
