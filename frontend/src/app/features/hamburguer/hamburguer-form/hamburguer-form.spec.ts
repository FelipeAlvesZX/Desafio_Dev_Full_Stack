import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HamburguerForm } from './hamburguer-form';

describe('HamburguerForm', () => {
  let component: HamburguerForm;
  let fixture: ComponentFixture<HamburguerForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HamburguerForm],
    }).compileComponents();

    fixture = TestBed.createComponent(HamburguerForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
