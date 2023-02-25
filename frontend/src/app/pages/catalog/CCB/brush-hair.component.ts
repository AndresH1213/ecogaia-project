import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../models/Product';

@Component({
  selector: 'app-brush-hair',
  templateUrl: './brush-hair.component.html',
  styleUrls: ['../catalog.component.css']
})
export class BrushHairComponent implements OnInit {

  public product!: Product;

  public images: string[] = [];
 

  constructor(private productService: ProductsService) { }

  ngOnInit(): void {
    this.productService.getSingleProduct('CCB').subscribe(product => {      
      this.images = product.allImages;
      this.product = product
    })
  }

}
