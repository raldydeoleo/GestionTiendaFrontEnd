import { Component, OnInit, EventEmitter, ChangeDetectorRef, Input} from '@angular/core';
import { ScheduleService } from '../schedule.service';
import { ProductosService } from 'src/app/productos/productos.service';
import { SuplidoresService } from 'src/app/suplidores/suplidores.service';
import { Productos_ProvService } from 'src/app/productos_prov/productos.service';
//import { IProcess } from 'src/app/process/process';
//import { IModule } from 'src/app/module/module';
//import { IShift } from 'src/app/shift/shift';
//import { DeviceService } from 'src/app/device/device.service';
//import { ShiftService } from 'src/app/shift/shift.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ISchedule } from '../schedule';
import { AccountService } from 'src/app/account/account.service';
import { DatePipe } from '@angular/common';
import { ModalService } from '../../modals/modal/modal.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { RolesEnum } from '../../rolesEnum';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
//import { IProducts } from '../../label-printing/label.service';
import { promise } from 'protractor';
import { GlobalService } from '../../services/global-service.service';
import { SpinnerLoaderService } from 'src/app/services/spinner-loader.service';
import { IProductos } from '../productos';
import { ActivatedRoute, Router } from '@angular/router';



@UntilDestroy()
@Component({
      selector: 'app-schedule-form',
      templateUrl: './schedule-form.component.html',
      styleUrls: ['./schedule-form.component.css']
    })
export class ScheduleFormComponent implements OnInit{
  public productos: IProductos[]; //LINEA AGREGADA PARA POBLAR EL COMBO CON LOS PRODUCTOS EXISTENTES
  public modoEdicion: boolean = false;
  public parametros_reposicion : {
    id: number,
    fecha: Date,
    cantidad: number
   }
  //public processes: IProcess[];
  //public modules: IModule[];
  //public optionModules: IModule[];
  //public shifts: IShift[];
  //public cantidadProducto : {id_prod: number, fecha: Date, cantidad : number};
  producto: IProductos;
  formGroup: FormGroup;
  id: number;
  schedule: ISchedule;
  typeahead = new EventEmitter<string>();
  products = [];
  productsLoading = false;
  @Input() selectedModule:string;
  constructor(private scheduleService: ScheduleService, 
            //  private deviceService: DeviceService, 
            //  private shiftService: ShiftService,
              private productosService: ProductosService,
              private suplidioresService: SuplidoresService,
              private productosproveedoresService: Productos_ProvService, 
              private fb: FormBuilder, 
              private toast: ToastrService, 
              private accountService: AccountService, 
              private globalService: GlobalService, 
              private modalService: ModalService, 
              private cd: ChangeDetectorRef, 
              private loaderService: SpinnerLoaderService, private router: Router, private rutaActiva: ActivatedRoute,) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      //idProceso: '',
      //idModulo: '',
      //idTurno: '',
      idProducto: '',
      id: 0,
      fechaProduccion: '',
      fechaRecepcion: '',      
      cantidad: ''
    });
    //this.modoEdicion = true;
    this.formGroup.controls['fechaProduccion'].setValue(new DatePipe("en-US").transform(new Date(), 'yyyy-MM-dd'));
    this.formGroup.controls['fechaRecepcion'].setValue(new DatePipe("en-US").transform(new Date(), 'yyyy-MM-dd')); //LINEA AGREGADA PARA CAPTURAR Fecha_recepcion
    this.formGroup.controls['id'].reset();    
    this.loadData(); //ESTA LINEA ESTABA COMENTADA DESDE ANTES DE EDITAR CODIGO 
  }


  reponer() {
    let data = {
      title: 'Saliendo de Reposicion de productos ',
      message: `¿Estas a punto de abandonar esta pantalla. Deseas realizar otra reposición de producto?`,
      btnText: 'Sí',
      btnCancelText: 'No',
      hasCancelOption: 'Si',
      okBtnClass: 'btn-danger'
    }
    this.modalService.open(data).pipe(
      untilDestroyed(this)
    ).subscribe(result => {
      if (result == "ok click") { 
        this.router.navigate(["/reposicion"]);               
      }else{
        this.router.navigate(["/verlistado"]);      
      }
    });
  }

  updateCantidad() {
       //console.log('valor del select'+ this.formGroup.controls['id'].value);
       //let idprod = this.formGroup.controls['id'].value; //ESTA LINEA SE PUED BORRAR
       //let lafecha = this.formGroup.controls['fechaProduccion'].value; //ESTA LINEA SE PUED BORRAR
       //let la_cantidad = this.formGroup.controls['cantidad'].value; //ESTA LINEA SE PUED BORRAR     
       //console.log(idprod+' '+lafecha+' '+la_cantidad); //ESTA LINEA SE PUED BORRAR

       this.parametros_reposicion = { 
         id: this.formGroup.controls['id'].value, 
         fecha: this.formGroup.controls['fechaProduccion'].value, 
         cantidad: this.formGroup.controls['cantidad'].value
        };

        let productsbycantidad_promise = this.productosproveedoresService.getproductosPorCantidad(this.parametros_reposicion)
        .toPromise();//.then(producto => this.onUpdateSuccess());

        let productsbydate_promise = this.productosproveedoresService.getproductosPorFecha(this.parametros_reposicion)
        .toPromise();//.then(producto => this.onUpdateSuccess());       
        
        productsbycantidad_promise.then(
            productos_por_cantidad =>{
              console.log(productos_por_cantidad);
              productsbydate_promise.then(                
                  productos_por_fecha => { 
                    console.log(productos_por_fecha);                  
                        if(productos_por_cantidad.length > 0){                                                                        
                          //this.onUpdateSuccess();
                          this.productosService.updateCantidad(this.parametros_reposicion).toPromise().then(producto => this.onUpdateSuccess());                        
                        }else{
                          this.onUpdateFail();
                        }
                  }
              );
            }
        );
  }
 
   onUpdateSuccess(): void {
     this.toast.success("Cantidad de producto actualizada");
     this.router.navigate(["/reposicion"]);
   }

   onUpdateFail(): void {
    this.toast.error("No es posible reponer la cantidad de producto");
    this.router.navigate(["/reposicion"]);
  }

  populateProductsControl():Promise<any> {
    this.productsLoading = true;
    this.loaderService.isLoading.next(true);
   // let products_promise = this.scheduleService.getProducts().toPromise();
    //return products_promise;
    let products_promise = this.scheduleService.getProducts()
    .toPromise().then(productos => this.productos = productos);
    console.log(products_promise);
    return products_promise;
  }
  setProductsFullDescription() {
    this.products.map(product => {
       product.fullDescripcion = product.nombre + " (" + product.id+")";
      //product.fullDescripcion = product.descripcion + " (" + product.codigoMaterial+")";
    });
  }
 /* customSearchFn(term: string, item: IProducts) {
    term = term.toLowerCase();
    return item.descripcion.toLowerCase().indexOf(term) > -1 || item.codigoMaterial.toLowerCase() === term;
  }*/

  /*customSearchFn(term: string, item: IProducts) {
    term = term.toLowerCase();
    return item.descripcion.toLowerCase().indexOf(term) > -1 || item.codigoMaterial.toLowerCase() === term;
  }*/


  populateForm(schedule: ISchedule):void{
    this.schedule = schedule;    
    this.formGroup.patchValue({
      idProceso: schedule.idProceso,
      idModulo: schedule.idModulo,
      idTurno: schedule.idTurno,
      fechaProduccion: new DatePipe("en-US").transform(schedule.fechaProduccion,'yyyy-MM-dd'),
      idProducto: schedule.idProducto
    });
    this.disablePrimaryFields(true);
  }

  cancel(){
    this.scheduleService.displayScheduleForm.next(false);    
    this.formGroup.reset();
  } 

  
  //CODIGO MODIFICADO PARA CARGAR LOS PRODUCTOS EN VEZ DE USAR EL OTRO loadData();
  loadData(): void {
      this.populateProductsControl().then(products => {
      this.products = products;
      this.setProductsFullDescription();
      this.productsLoading = false;
      this.loaderService.isLoading.next(false);
      /*if (this.schedule) {
        this.populateForm(this.schedule);
      }*/
    });
  }  
  

  validateAllFormFields(formGroup: FormGroup) {         
    Object.keys(formGroup.controls).forEach(field => {  
      const control = formGroup.get(field);             
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        
        this.validateAllFormFields(control);           
      }
    });
  }

  disablePrimaryFields(option:boolean){
    if(option){
      this.formGroup.controls['idProceso'].disable();
      this.formGroup.controls['idModulo'].disable();
      this.formGroup.controls['idTurno'].disable();
      this.formGroup.controls['fechaProduccion'].disable();
    }else{
      this.formGroup.controls['idProceso'].enable();
      this.formGroup.controls['idModulo'].enable();
      this.formGroup.controls['idTurno'].disable();
      this.formGroup.controls['fechaProduccion'].enable();
    }
  }

 //NOTIFICACION PARA INFORMAR CUANDO EL PROCESO SE HA COMPLETADO CORRECTAMENTE.
 /* finish() {
    if (this.schedule) {
      let data = {
        title: 'Confirmación de finalización',
        message: `¿Está seguro que desea finalizar esta programación?`,
        btnText: 'Sí',
        btnCancelText: 'No',
        hasCancelOption: 'Si',
        okBtnClass: 'btn-danger'
      }
      this.modalService.open(data).pipe(
        untilDestroyed(this)
      ).subscribe(result => {
        if (result == "ok click") {
          this.schedule.usuarioFinalizado = this.accountService.getLoggedInUser();
          this.scheduleService.finishSchedule(this.schedule).pipe(
            untilDestroyed(this)
          ).subscribe(
            result => {
              this.scheduleService.addNewSchedule.next(result);
              this.toast.success("Producto Finalizado Exitosamente!");
              this.cancel();
            }
          );
        }
      });
    }
  }*/
 
}
