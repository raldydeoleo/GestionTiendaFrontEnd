import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LoginComponent } from './account/login/login.component';

import { ScheduleComponent } from './schedule/schedule.component';
import { ProductosComponent } from './productos/productos.component'; 
import { SuplidoresComponent } from './suplidores/suplidores.component'; 
import { SuplidorFormComponent } from './suplidores/suplidor-form/suplidor-form.component'; 
import { Productos_ProvComponent } from './productos_prov/productos.component'; 
import { SpinnerComponent } from './spinner/spinner.component';
import { DeviceComponent } from './device/device.component';
import { ModalComponent } from './modals/modal/modal.component';
import { ScheduleFormComponent } from './schedule/schedule-form/schedule-form.component';
import { ProductoFormComponent } from './productos/productos-form/producto-form.component'; 
import { CompraProductoFormComponent } from './productos/compra-form/compra_producto-form.component'; 
import { Producto_provFormComponent } from './productos_prov/productos_prov-form/producto_prov-form.component'; 
import { TableEditableComponent } from './table-editable/table-editable.component';
import { ConfigurationAppComponent } from './configuration-app/configuration-app.component';
import { ModuleConfirmationComponent } from './modals/module-confirmation/module-confirmation.component';

import { AccountService } from './account/account.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { LoaderInterceptor } from './loader.interceptor';
import { ScheduleService } from './schedule/schedule.service';
import { SpinnerLoaderService} from './services/spinner-loader.service';
import { SuplidoresService } from './suplidores/suplidores.service';
import { ProductosService } from './productos/productos.service';
import { Productos_ProvService } from './productos_prov/productos.service';

import { GlobalService } from './services/global-service.service';
import { DeviceService } from './device/device.service';
import { ModalService } from './modals/modal/modal.service';
//import { ConfigurationService } from './configuration-app/configuration.service';
 
import { FormInvalidInputFocusDirective } from './form-invalid-input-focus.directive';
import { SortScheduleDirective } from './schedule/sort-schedule.directive';
import { SortDirective } from './directives/sort.directive';
import { TableViewModeDirective } from './directives/table-view-mode.directive';
import { TableEditModeDirective } from './directives/table-edit-mode.directive';
import { EditableOnEnterDirective } from './directives/editable-on-enter.directive';
import { CustomAdapter, CustomDateParserFormatter } from './services/custom-date.helpers';
import { PagocontarjetaComponent } from './pagocontarjeta/pagocontarjeta.component';
import { PagocontcComponent } from './pagocontc/pagocontc.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LoginComponent,    
    ScheduleComponent,
    SpinnerComponent, 
    ProductosComponent,
    SuplidoresComponent,
    SuplidorFormComponent, 
    Productos_ProvComponent, 
    CompraProductoFormComponent,    
    DeviceComponent,
    FormInvalidInputFocusDirective,    
    ModalComponent,    
    ScheduleFormComponent,    
    SortScheduleDirective,
    SortDirective,    
    ProductoFormComponent,   
    Producto_provFormComponent,     
    TableViewModeDirective,
    TableEditModeDirective,
    TableEditableComponent,
    EditableOnEnterDirective,
    ConfigurationAppComponent,
    ModuleConfirmationComponent,    
    PagocontarjetaComponent,
    PagocontcComponent
  ],
  entryComponents:[
    ModalComponent,
    ModuleConfirmationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    NgbModule,
    FormsModule,
    NgSelectModule,
    FontAwesomeModule,    
    ToastrModule.forRoot({
      preventDuplicates: true,
      positionClass: 'toast-top-center',
      enableHtml:true,
      timeOut:20000
    }),
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },      
      { path: 'registrar', component: ProductoFormComponent, canActivate: [AuthGuardService] },
      { path: 'verlistado', component: ProductosComponent, canActivate: [AuthGuardService] },
      { path: 'reposicion', component: ScheduleComponent, canActivate: [AuthGuardService] }, 
      { path: 'pagocontarjeta', component: PagocontcComponent, canActivate: [AuthGuardService] }, 
      { path: 'listadesuplidores', component: SuplidoresComponent, canActivate: [AuthGuardService] }, 
      { path: 'registrarsuplidor', component: SuplidorFormComponent, canActivate: [AuthGuardService] },      
      { path: 'listadeproductossuplidor', component: Productos_ProvComponent, canActivate: [AuthGuardService] }, 
      { path: 'suplidor-edit/:id', component: SuplidorFormComponent, canActivate: [AuthGuardService] }, 
      { path: 'suplidor-add', component: SuplidorFormComponent, canActivate: [AuthGuardService] }, 
      { path: 'productos-add', component: ProductoFormComponent, canActivate: [AuthGuardService] }, 
      { path: 'productos_prov-add', component: Producto_provFormComponent, canActivate: [AuthGuardService] }, 
      { path: 'productos-edit/:id', component: ProductoFormComponent, canActivate: [AuthGuardService] }, 
      { path: 'comprar_producto-edit/:id', component: CompraProductoFormComponent, canActivate: [AuthGuardService] }, 
      { path: 'productos_prov-edit/:id', component: Producto_provFormComponent, canActivate: [AuthGuardService] }, 
      { path: 'device', component: DeviceComponent, canActivate: [AuthGuardService] }, 
      { path: '', redirectTo: 'login', pathMatch: 'full'},
      { path: 'boxtracklabel', redirectTo: 'login', pathMatch: 'full' }

    ])
  ],
  providers: [
    SpinnerLoaderService,
    AccountService,
    AuthGuardService,        
    ProductosService,
    Productos_ProvService,
    SuplidoresService,    
    DeviceService,
    ModalService,    
    CustomAdapter,
    CustomDateParserFormatter,    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },    
    ScheduleService,
    GlobalService,    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
