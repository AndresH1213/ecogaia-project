import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Prime NG
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuModule } from 'primeng/menu'
import { ButtonModule } from 'primeng/button'
import {BadgeModule} from 'primeng/badge';

import { NavbarComponent } from './navbar/navbar.component';




@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    TieredMenuModule,
    MenuModule,
    ButtonModule,
    BadgeModule,
    BrowserAnimationsModule,
  ],
  exports: [
    NavbarComponent
  ]
})
export class SharedModule { }
