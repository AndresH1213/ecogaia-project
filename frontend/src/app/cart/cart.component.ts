import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { User } from '../models/User';

import { HelpersService } from '../services/helpers.service';
import { ShopService } from '../services/shop.service';
import { Cart } from '../interfaces/product.interface';
import { Product } from '../models/Product';
import { Combo } from '../models/Combo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public states: string[] = [];
  public cities = [];

  public theresCart: boolean = false;
  public cart: Cart | undefined;
  public products: (Product | Combo)[] = [];
  public characteristicTags : string[] = [];

  public preferenceId: any;

  public user!: User;

  orderForm: FormGroup = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    phoneNumber: ['', [ Validators.required]],
    state: ['', Validators.required],
    city: ['', Validators.required],
    zip: ['', Validators.required],
    address: ['', Validators.required],
    addressExtra:['']
  })

  selectedState!: String;

  // UI loading box
  loading: boolean = false;
  constructor(private fb: FormBuilder,
              private helper: HelpersService,
              private shopService: ShopService,
              private router: Router) { }
  
  ngOnInit(): void {

    this.states = ['Amazonas','Antioquia','Arauca','Atlántico','Bolívar','Caldas','Caquetá','Casanare','Cauca','Cesar','Chocó',
    'Córdoba','Cundinamarca','Guainía','La Guajira','Guaviare','Huila','Magdalena','Meta','Norte de Santander','Nariño','Putumayo',
    'Quindío','Risaralda','San Andrés','Santander','Sucre','Tolima','Valle del Cauca','Vaupés','Vichada']

    this.orderForm.get('state')?.valueChanges.pipe(
      tap(() => {
        this.orderForm.get('city')?.reset('');
        this.loading = true;
      }),
      switchMap(state => this.helper.getCities(state))
    ).subscribe( (cities: any) => {
      this.cities = cities;
      this.loading = false;
    });

    this.initializatedCart();
  }

  initializatedCart() {
    this.theresCart = this.getCart();
    if (this.theresCart) {
      
      this.productsInstaces(this.cart!)
      this.cart?.products.forEach( product => {
        const values = Object.values(product.characteristics).join(', ');
        this.characteristicTags.push(values);
      })
    };
  }

  removeItem(index: number) {
    this.theresCart = this.shopService.deleteProductCart(index);
    
    // if empty cart reset the variables
    if (!this.theresCart) {
      this.cart = undefined;
      this.products = [];
      this.characteristicTags = [];
    }
    window.location.reload()

  }

  getCart() {
    this.cart = this.shopService.getCart;
    return this.cart ? true : false; 
  }

  productsInstaces(cart: Cart) {
    
    for (let i = 0; i < cart.products.length; i++ ) {
      const item: any = cart.products[i].item
      if (item.code) {
        const {_id, name, price, imageUrl, characteristics, code} = item
        const productCart : any = new Product(_id,name,price,imageUrl,characteristics,code);
        productCart.combo = false;
        this.products.push(productCart)
      }
      if (cart.products[i].combo) {
        const {_id, name, price, image, products } = item; 
        const productCart : any = new Combo(_id, name, price, image, products )
        productCart.combo = true;
        this.products.push(productCart)
      }
    }
  }

  changeCantProduct(index: number, value: 1 | -1) {
    const findProduct = this.cart?.products[index];
    if (findProduct?.cant === 1 && value !== 1) {
      return
    }
    this.cart!.totalValue += value*findProduct!.item.price
    findProduct!.cant += value;
  }

  setOrderData() {
    
    const products = this.cart?.products.map(product => {
      let description = 'No description';
      if (product.characteristics) {
        description = JSON.stringify(product.characteristics) 
      }
      return { productId: product.item._id, 
               quantity: product.cant,
               combo: product.combo,  
               description }
    });
    const cartData = {
      products: products,
      totalValue: this.cart?.totalValue
    }
    const userData = {
      email: this.orderForm.get('email')?.value,
      phoneNumber: this.orderForm.get('phoneNumber')?.value,
      state: this.orderForm.get('state')?.value,
      city: this.orderForm.get('city')?.value,
      zip_code: this.orderForm.get('zip')?.value,
      address: this.orderForm.get('address')?.value,
      addressExtraInfo: this.orderForm.get('addressExtra')?.value
    }
    return [cartData, userData]
  }

  confirm() {
    const [cartData, userData] = this.setOrderData();
    const orderData = {
      cartData,
      userData
    }

    this.shopService.postOrder(orderData).subscribe((resp: any) => {
      if (resp.ok) {
        window.open(resp.init_point)
      }
    });   
  }

}
