import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BebidaLista } from './bebida-lista';

describe('BebidaLista', () => {
  let component: BebidaLista;
  let fixture: ComponentFixture<BebidaLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BebidaLista],
    }).compileComponents();

    fixture = TestBed.createComponent(BebidaLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
