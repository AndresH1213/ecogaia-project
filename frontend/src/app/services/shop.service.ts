import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Cart, ProductCart } from '../interfaces/product.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderResp, Product } from '../interfaces/order-resp.interface';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  public cart: Cart | undefined;
  private itemsInCart = new BehaviorSubject<ProductCart[]>(this.getCart?.products || []);
  itemsInCart$ = this.itemsInCart.asObservable();

  constructor(private http: HttpClient) { }

  get getCart() {
    if (localStorage.getItem('cart')) {
      this.cart = JSON.parse(localStorage.getItem('cart')!)
    }
    return this.cart;
  }

  getOrder(query: string, value:string): Observable<OrderResp> {
    const url = `${baseUrl}/shop/order?${query}=${value}`;
    return this.http.get<OrderResp>(url)
  }

  postOrder(orderData: any) {
    const url = `${baseUrl}/shop/order`;

    return this.http.post(url, orderData);
  }

  addProductCart(selectedData: ProductCart) {
    /* Update cart in the localStorage of the user */
    
    const newProduct = selectedData.item;
    const newCharacteristics = selectedData.characteristics;
    // upload the previous cart on the LS
    let newCartData: Cart | undefined = this.getCart;
    let newCant = selectedData.cant;
    // If there is no cart create the cart
    if (!this.getCart) {
      const totalValue = newProduct.price * newCant
      const productObject: ProductCart = {
        item: newProduct,
        cant: newCant,
        characteristics : newCharacteristics,
        combo: selectedData.combo
      }
      newCartData = {
        products: [productObject],
        totalValue
      }
      const cartDataStringify = JSON.stringify(newCartData);
      localStorage.setItem('cart', cartDataStringify);
      this.itemsInCart.next(this.getCart!.products)
      return
    }
    // Search for products that are already in the cart, the match has to be in _id and characteristics
    const oldCartProducts = this.getCart.products.map(product => product.item._id);
    const matchProductIndex = newCartData!.products.findIndex(({item, characteristics}) => {
      return item._id === newProduct._id && 
             JSON.stringify(characteristics) === JSON.stringify(newCharacteristics)
    });
    // If theres already that product (with the same characteristics) in the cart upload it
    if (oldCartProducts.includes(newProduct._id) && matchProductIndex >= 0) {
      // found the product in cart and put the new quantity/cant
      const productInCart = newCartData?.products[matchProductIndex];
      productInCart!.cant += newCant;
      // replace again and change the totalValue of the cart
      newCartData?.products.splice(matchProductIndex, 1, productInCart!);
      newCartData!.totalValue += newProduct.price * newCant

      // save cart
      const newCartDataStringify = JSON.stringify(newCartData);
      localStorage.setItem('cart', newCartDataStringify);
      return
    }
    // if the new product hasn't found in the cart push it to the cart and change totalValue
    newCartData?.products.push({
      item: newProduct,
      cant: newCant,
      characteristics: newCharacteristics,
      combo: selectedData.combo
    });
    newCartData!.totalValue += newProduct.price * newCant;
    const newCartDataStringity = JSON.stringify(newCartData);
    localStorage.setItem('cart', newCartDataStringity);
    this.itemsInCart.next(this.getCart!.products)
  }
  

  deleteProductCart( index: number): boolean {
    /* Delete and entire product in the cart */
    const cartData: any = this.getCart;
    const productRemoved: any = cartData.products.splice(index, 1);
    if (cartData?.products.length === 0) {
      localStorage.removeItem('cart'); 
      this.cart = undefined;
      return false;
    }
    if (productRemoved.length > 0) {
      cartData!.totalValue -= productRemoved[0].cant * productRemoved[0].item.price;
      localStorage.setItem('cart', JSON.stringify(cartData))
      return true;
    } 
    return false
  }

}
