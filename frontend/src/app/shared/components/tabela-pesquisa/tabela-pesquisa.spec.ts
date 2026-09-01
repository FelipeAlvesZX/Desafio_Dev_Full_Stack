import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabelaPesquisa } from './tabela-pesquisa';

describe('TabelaPesquisa', () => {
  let component: TabelaPesquisa;
  let fixture: ComponentFixture<TabelaPesquisa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaPesquisa],
    }).compileComponents();

    fixture = TestBed.createComponent(TabelaPesquisa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
