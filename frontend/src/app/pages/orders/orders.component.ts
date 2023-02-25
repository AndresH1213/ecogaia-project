import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../services/shop.service';
import { CombosService } from '../../services/combos.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles: [
    `
      .search-msg {
        font-size: 16px;
        padding-bottom: 0px
      }
      .input-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .search-container {
        display: flex;
        flex-wrap: wrap;
      }
      @media screen and (min-width: 1024px) {
        .search-msg {
          font-size: 22px
        }
      }
    `,
  ],
})
export class OrdersComponent implements OnInit {
  ordersTest: any[] = []
  orders: any[] = [];
  hits = 0;
  

  public queryParam: any= "";
  public prodsToShow: any = []
  public showMore: boolean = false;
  public showMoreOrder: any;
  constructor(private shopService: ShopService,
              private comboService: CombosService,
              private productService: ProductsService) {}

  ngOnInit(): void {
  }

  search() {
    this.shopService.getOrder('email',this.queryParam).subscribe((resp: any) => {
      this.hits = resp.hits
      this.orders = resp.orders.map((order: any) => {
        const {orderNumber, totalPrice, orderDate, shippingAddress} = order
        const address = `${shippingAddress.state}, ${shippingAddress.city} - ${shippingAddress.address}`
        let products = order.cart.map((prod:any) => ({product: prod.product, type: prod.onModel, quantity: prod.quantity}))        
        return {orderNumber, products, totalPrice, orderDate, address }
      });
    })
  }

  searchNames(type: string, prodId: string) {
    return new Promise((resolve, reject) => {
      if (type === 'Combo') {
        this.comboService.getOneCombo('comboId', prodId).subscribe((combo : any) => {
          resolve(combo.name);
        })
      } else if (type === 'Product') {
        this.productService.getSingleProduct(prodId).subscribe(prod => {
          resolve(prod.name)
        })
      } 
    })
  }

  seeProducts(index: number) {
    
    const search = this.fshowMore(index);
    if (!search) return
    for (let i = 0; i < this.orders[index].products.length; i++) {
      const {type, product, quantity} = this.orders[index].products[i];
        this.searchNames(type, product).then((resp: any) => {
          this.prodsToShow.push({product: resp, quantity })
        })
    }
    console.log(this.prodsToShow)
  }

  fshowMore(index: number): boolean {
    this.showMoreOrder = +index
    if (this.showMore) {
      this.showMore = false;
      this.showMoreOrder = undefined;
      this.prodsToShow = [] 
      return false;
    } else {
      this.showMore = true;
      return true;
    }
  }
}
