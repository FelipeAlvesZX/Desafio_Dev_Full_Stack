import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BebidaForm } from './bebida-form';

describe('BebidaForm', () => {
  let component: BebidaForm;
  let fixture: ComponentFixture<BebidaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BebidaForm],
    }).compileComponents();

    fixture = TestBed.createComponent(BebidaForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
