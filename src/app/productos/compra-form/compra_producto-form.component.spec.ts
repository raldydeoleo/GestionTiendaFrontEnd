import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraProductoFormComponent } from './compra_producto-form.component';

describe('ProductoFormComponent', () => {
  let component: CompraProductoFormComponent;
  let fixture: ComponentFixture<CompraProductoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompraProductoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraProductoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
