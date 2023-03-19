import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { OrdersComponent } from './orders/orders.component';
import { ComboComponent } from './catalog/combo/combo.component';
import { PaymentProcessComponent } from './webhooks/payment-process/payment-process.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  {
    path: 'product',
    loadChildren: () =>
      import('./catalog/catalog.module').then((m) => m.CatalogModule),
  },
  { path: 'combo/:pageUrl', component: ComboComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'payment-process', component: PaymentProcessComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChildRoutingModule {}
