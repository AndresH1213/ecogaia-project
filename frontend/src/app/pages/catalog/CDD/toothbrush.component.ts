import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../models/Product';

@Component({
  selector: 'app-individual',
  templateUrl: './toothbrush.component.html',
  styleUrls: ['../catalog.component.css']
})
export class ToothbrushComponent implements OnInit {

  public catalog: string[] = []
  public product!: Product;

  constructor(
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    this.productService.getSingleProduct('CDD').subscribe(product => {
      this.catalog = product.allImages;
      this.product = product;
    })
  }

}
