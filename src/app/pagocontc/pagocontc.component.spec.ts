import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagocontcComponent } from './pagocontc.component';

describe('PagocontcComponent', () => {
  let component: PagocontcComponent;
  let fixture: ComponentFixture<PagocontcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagocontcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagocontcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
