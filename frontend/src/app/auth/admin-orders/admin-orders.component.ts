import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ProductsService } from '../../services/products.service';
import { CombosService } from '../../services/combos.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styles: [
  ]
})
export class AdminOrdersComponent implements OnInit {

  orders : any = []
  public prodsToShow: any = []
  public showMore: boolean = false;
  public showMoreOrder: any;

  constructor(private adminService: AdminService,
              private productService: ProductsService,
              private comboService: CombosService) { }

  ngOnInit(): void {
    this.adminService.getAllOrders().subscribe((orders: any) => {
      console.log(orders)
      this.orders = orders.map((order: any) => {
        const {orderNumber, totalPrice, orderDate, shippingAddress, delivered, payment} = order;
        const address = `${shippingAddress.state}, ${shippingAddress.city} - ${shippingAddress.address}`
        let products = order.cart.map((prod:any) => ({product: prod.product, type: prod.onModel, quantity: prod.quantity}))        
        return {orderNumber, products, totalPrice, delivered, payment, orderDate, address }
      })
      console.log(this.orders)
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
