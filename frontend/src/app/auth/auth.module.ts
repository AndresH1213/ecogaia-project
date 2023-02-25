import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {DropdownModule} from 'primeng/dropdown';
import { CardModule } from 'primeng/card';

import { LogInComponent } from './log-in/log-in.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { ButtonModule } from 'primeng/button';
import {TooltipModule} from 'primeng/tooltip';
import { AdminComboComponent } from './admin-combo/admin-combo.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';



@NgModule({
  declarations: [
    LogInComponent,
    AdminProductsComponent,
    AdminComboComponent,
    AdminOrdersComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // PrimeNG
    DropdownModule,
    CardModule,
    ButtonModule,
    TooltipModule
  ]
})
export class AuthModule { }
