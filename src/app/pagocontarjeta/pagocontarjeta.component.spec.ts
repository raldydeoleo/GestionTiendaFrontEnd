import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagocontarjetaComponent } from './pagocontarjeta.component';

describe('PagocontarjetaComponent', () => {
  let component: PagocontarjetaComponent;
  let fixture: ComponentFixture<PagocontarjetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagocontarjetaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagocontarjetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
