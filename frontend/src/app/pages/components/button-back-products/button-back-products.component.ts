import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-back-products',
  templateUrl: './button-back-products.component.html',
  styles: [`
  .btn-cart {
    background-color: var(--color-button);
    border: none;
    padding: 10px;
    top: 15%;
    position: absolute;
    left: 20px;
    color: white;
    font-family: verdana;
    border-radius: 10px;
  } 
.btn-cart:hover {
  opacity: 80%;
}
  `
  ]
})
export class ButtonBackProductsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
