import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { CardModule } from 'primeng/card'
import {TooltipModule} from 'primeng/tooltip';
import { CartComponent } from './cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    TooltipModule
  ],
  exports: [
    CartComponent
  ]
})
export class CartModule { }
