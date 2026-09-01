import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngredienteLista } from './ingrediente-lista';

describe('IngredienteLista', () => {
  let component: IngredienteLista;
  let fixture: ComponentFixture<IngredienteLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredienteLista],
    }).compileComponents();

    fixture = TestBed.createComponent(IngredienteLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
