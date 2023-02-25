import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../models/Product';

@Component({
  selector: 'app-pitillo',
  templateUrl: './straw.component.html',
  styleUrls: ['../catalog.component.css']
})
export class StrawComponent implements OnInit {

  public catalog: string[] = []
  public product: any;

  selected: any = {
    code: 'PPG',
    cant: 1,
    color: ''
  }
  constructor(private productService: ProductsService) { }

  ngOnInit(): void {
    this.productService.getSingleProduct('PPG').subscribe(product => {
      this.catalog = product.allImages;
      this.product = product
    })
  }

}
