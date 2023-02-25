import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// Prime NG
import { CarouselModule } from 'primeng/carousel';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

import { CatalogRoutingModule } from './catalog-routing.module';

// Components
import { AddCartInputComponent } from '../components/add-cart-input/add-cart-input.component';
import { ButtonBackProductsComponent } from '../components/button-back-products/button-back-products.component';
import { ImageCarouselComponent } from '../components/image-carousel/image-carousel.component';

// Pages
import { BrushHairComponent } from './CCB/brush-hair.component';
import { ComboComponent } from './combo/combo.component';
import { CupComponent } from './CMT/cup.component';
import { StrawComponent } from './PPG/straw.component';
import { ToothbrushComponent } from './CDD/toothbrush.component';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    // pages
    BrushHairComponent,
    ComboComponent,
    CupComponent,
    StrawComponent,
    ToothbrushComponent,
    // components
    ButtonBackProductsComponent,
    ImageCarouselComponent,
    AddCartInputComponent
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    FormsModule,
    CarouselModule,
    
    DialogModule,

    ReactiveFormsModule,
    ProgressSpinnerModule
  ],
})
export class CatalogModule { }
