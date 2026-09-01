import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HamburguerLista } from './hamburguer-lista';

describe('HamburguerLista', () => {
  let component: HamburguerLista;
  let fixture: ComponentFixture<HamburguerLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HamburguerLista],
    }).compileComponents();

    fixture = TestBed.createComponent(HamburguerLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
