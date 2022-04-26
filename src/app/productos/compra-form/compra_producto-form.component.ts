import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductosService } from '../productos.service';
import { ToastrService } from 'ngx-toastr';
import { IProductos } from '../productos';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalService } from '../../modals/modal/modal.service';

@UntilDestroy()
@Component({
  selector: 'app-compra_producto-form',
  templateUrl: './compra_producto-form.component.html',
  styleUrls: ['./compra_producto-form.component.css']
})
export class CompraProductoFormComponent implements OnInit {
  public modoEdicion: boolean = false;
  formGroup: FormGroup;
  id: number;
  producto: IProductos;

  public parametros_compra : {
    id: number,
    //fecha: Date,
    cantidad_producto: number
   }

  selectedCantidad: number;

    cantidadArreglo = [
        { cantidad_producto: 1, valor: '1' },
        { cantidad_producto: 2, valor: '2' },
        { cantidad_producto: 3, valor: '3' },
        { cantidad_producto: 4, valor: '4' },
        { cantidad_producto: 5, valor: '5' },
        { cantidad_producto: 6, valor: '6' },
        { cantidad_producto: 7, valor: '7' },
        { cantidad_producto: 8, valor: '8' },
        { cantidad_producto: 9, valor: '9' },
        { cantidad_producto: 10, valor: '10' }
    ];
 
  constructor(private productosService: ProductosService, private toast: ToastrService, private activatedRoute: ActivatedRoute, private fb: FormBuilder, private router: Router, private modalService: ModalService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      id: 0,
      nombre: '',
      precio: '',
      cantidad:'',      
      cantidad_producto: 1,            
    });
    this.formGroup.controls['id'].disable();   
    this.formGroup.controls['nombre'].disable();   
    this.formGroup.controls['precio'].disable();
    //this.formGroup.controls['cantidad'].disable();      
    this.activatedRoute.params.pipe(untilDestroyed(this)).subscribe(params => {
      if (params['id'] == undefined) {
        return;
      }
      this.modoEdicion = true;
      this.formGroup.controls['id'].disable();
      this.id = params['id'];
      this.productosService.getProducto(this.id).toPromise().then(producto => this.cargarFormulario(producto));      
    });
  }

  cargarFormulario(producto: IProductos): void {
    this.producto = producto;
    this.formGroup.patchValue({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,      
      cantidad: producto.cantidad      
    });
  }

  comprar() {
    
    let la_cantidad = this.formGroup.controls['cantidad_producto'].value;
    let el_precio = this.formGroup.controls['precio'].value;
    let monto = (el_precio*la_cantidad);

    let data = {
      title: 'Informacion final de esta compra:',
      message: `Usted realizó la compras de: ${this.parametros_compra.cantidad_producto} de ${this.producto.nombre} por ${this.producto.precio} importe: ${monto} `,
      btnText: 'Sí',
      btnCancelText: 'No',
      hasCancelOption: 'Si',
      okBtnClass: 'btn-danger'
    }
    this.modalService.open(data).pipe(
      untilDestroyed(this)
    ).subscribe(result => {
      if (result == "ok click") {        
        this.router.navigate(["/device"]);
        //this.router.navigate(["/pagocontarjeta"]);
      }else{
        this.router.navigate(["/device"]);      
      }
    });
  }

  finalizarCompra(){
    // this.producto.id = this.formGroup.controls['id'].value;    
    // this.producto.cantidad = this.formGroup.controls['cantidad'].value;
     console.log('valor del select'+ this.formGroup.controls['id'].value);
     let idprod = this.formGroup.controls['id'].value; //ESTA LINEA SE PUED BORRAR     
     let la_cantidad = this.formGroup.controls['cantidad_producto'].value; //ESTA LINEA SE PUED BORRAR     
     console.log(idprod+' '+la_cantidad); //ESTA LINEA SE PUED BORRAR
    /*this.parametros_compra = { 
      id: this.formGroup.controls['id'].value,       
      cantidad_producto: this.formGroup.controls['cantidad_producto'].value
     };
    //console.log(this.parametros_compra.id+' - '+ this.parametros_compra.cantidad_producto); 
    this.productosService.compraProducto(this.parametros_compra).toPromise().then(producto => this.onSaveSuccess());
    this.onSaveSuccess();*/
  }

  save() {
    
    if (this.modoEdicion) {      
      this.parametros_compra = { 
        id: this.formGroup.controls['id'].value,        
        cantidad_producto: this.formGroup.controls['cantidad_producto'].value
       };       
      this.productosService.compraProducto(this.parametros_compra).toPromise().then(producto => this.onSaveSuccess());
      this.comprar();
    }
    else {      
     // this.productosService.createProducto(producto).toPromise().then(producto => this.onSaveSuccess());
    }
  }

  onSaveSuccess(): void {
    this.toast.success("Compra realizada con exito!");
    this.router.navigate(["/device"]);
  }

  onCantidadError(): void {
    this.toast.error("Cantidad de su compara es mayor que nuestro stock!");
    this.router.navigate(["/device"]);
  }

}
