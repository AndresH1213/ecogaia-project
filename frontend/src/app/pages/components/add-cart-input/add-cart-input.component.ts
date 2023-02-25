import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Product } from '../../../models/Product';
import { ShopService } from '../../../services/shop.service';
import Swal from 'sweetalert2';
import { ProductCart } from '../../../interfaces/product.interface';


@Component({
  selector: 'app-add-cart-input',
  templateUrl: './add-cart-input.component.html',
  styleUrls: ['./add-cart-input.component.css']
})
export class AddCartInputComponent implements OnInit {

  @Input() product!: Product;
  @Input() displayCart: boolean = true;
  
  @Output() OutputValue: EventEmitter<any> = new EventEmitter(); 

  public productCharacteristics: any;

  rangeCantControl = new FormControl("", [Validators.max(20), Validators.min(1)])

  characteristicProperties: string[] = []

  public displayAddCart = false;
  public styleGridRows = ''

  public cant: number = 1;
  public selectedData: ProductCart = {
    item: this.product,
    cant: 1,
    characteristics: ''
  };
  public valuesProperties: any = {}

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    if (this.product.characteristics) {
      this.productCharacteristics = {...this.product.characteristics}
      this.characteristicProperties = Object.keys(this.product.characteristics);
    }
    // setting earch property as a key of the object
    this.characteristicProperties.forEach(property => {
      this.valuesProperties[property] = ''
    });
    this.styleGridRows = `repeat(${this.characteristicProperties.length + 1}, 1fr)`;
    
    this.selectedData.item = this.product
  }

  changeValue(value: number) {
    if ((this.selectedData.cant + value) < 1 ) {
      return
    }
    this.selectedData.cant += value;
  }

  validCantValue(value: any) {
    if (!value || value < 0) {
      this.selectedData.cant = 1
    }
  }

  changeValueProp(key: any,value: string) {
    this.productCharacteristics = {...this.product.characteristics}
    // hard code tooth brush product exception
    if (this.product.name === 'Cepillo Dental de Bambú' && value !== 'blanco') {
      this.productCharacteristics['dureza'] = ['cerdas normales']
    }
    
    this.selectedData.characteristics = this.valuesProperties;
    this.OutputValue.emit(this.selectedData.characteristics)
  }

  displayDialog() {
    this.displayAddCart = true;
    setTimeout(()=> {
      this.displayAddCart = false;
    }, 1200)
  }

  addCart() {
    if (!this.selectedData.characteristics && this.selectedData.item.code !== "CCB") {
      Swal.fire('Te falto algo', 'Escoge una caracteristica', 'info'); return
    }
    this.shopService.addProductCart(this.selectedData);
    this.displayDialog();
  }

}
