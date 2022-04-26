import { Component, OnInit, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { PagocontarjetaService } from '../pagocontarjeta/pagocontarjeta.service';
import { ModalService } from '../modals/modal/modal.service';
import { AccountService } from '../account/account.service';
import {faSort} from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';


@Component({
  selector: 'app-pagocontarjeta',
  templateUrl: './pagocontarjeta.component.html',
  styleUrls: ['./pagocontarjeta.component.css']
})
export class PagocontarjetaComponent implements OnInit {

  displayForm:boolean; 
  total$: Observable<number>;
  faSort = faSort;   
  constructor(public pagocontarjetaService: PagocontarjetaService, 
                     private modalService: ModalService, 
                     private accountService: AccountService) { 
  
  }

  ngOnInit(): void {
  
  }

}
