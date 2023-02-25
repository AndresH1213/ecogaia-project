import { Component, OnInit } from '@angular/core';
import { HelpersService } from '../../services/helpers.service';
import { ProductsService } from '../../services/products.service';

interface imgsPaths {
  name: string;
  path: string;
  productUrl: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  images : imgsPaths[] = [];
  constructor(private help: HelpersService,
              private productService: ProductsService) { 
  }
  

  ngOnInit(): void {

    this.productService.getProducts().subscribe(products => {
      this.images = products.map(product => {
        return {name: product.name, path: product.oneImage, productUrl: `/product/${product.code}`}
      })
    })
  }

}
