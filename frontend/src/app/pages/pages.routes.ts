import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';

const routes: Routes = [
    {  path: '',
       component: PagesComponent,
       loadChildren: () => import('./childs-routing.module').then(m => m.ChildRoutingModule)    
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }