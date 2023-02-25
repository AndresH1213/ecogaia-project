import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../models/Product';

@Component({
  selector: 'app-cup',
  templateUrl: './cup.component.html',
  styleUrls: ['../catalog.component.css'],
})
export class CupComponent implements OnInit {
  public product!: Product;

  public scrollIcon = true;
  public catalog: string[] = [];
  public tallas!: [string, string];

  public selected: any = {
    code: 'CMT',
    cant: 1,
    talla: '',
  };

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.productService.getSingleProduct('CMT').subscribe((product) => {
      this.catalog = product.allImages;
      this.product = product;
    });
  }

  toggle() {
    this.scrollIcon = true;
  }

  scrolldown() {
    this.scrollIcon = false;
    setTimeout(() => {
      this.toggle();
    }, 2000);
  }
}
