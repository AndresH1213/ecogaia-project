import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, Router, RouterModule } from '@angular/router';
import { ToothbrushComponent } from './CDD/toothbrush.component';
import { BrushHairComponent } from './CCB/brush-hair.component';
import { CupComponent } from './CMT/cup.component';
import { StrawComponent } from './PPG/straw.component';
import { ComboComponent } from './combo/combo.component';

const routes: Routes = [
  {path: 'CCB', component: BrushHairComponent},
  {path: 'CDD', component: ToothbrushComponent},
  {path: 'CMT', component: CupComponent},
  {path: 'PPG', component: StrawComponent},
  {path: 'combo', component: ComboComponent},
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CatalogRoutingModule { }
