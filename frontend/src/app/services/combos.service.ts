import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AdminService } from './admin.service';
import { map } from 'rxjs/operators';
import { Combo } from '../models/Combo';
import { ShopService } from './shop.service';

const baseUrl = environment.baseUrl
interface ResponseCombo {
  resp:Boolean;
  combo:Combo
}

@Injectable({
  providedIn: 'root'
})
export class CombosService {

  constructor(private http: HttpClient,
              private admin: AdminService,
              private shopService: ShopService) { }

  createCombo(comboData: any) {
    const url = `${baseUrl}/combos`;
    const formData = new FormData();
    const {title, price, products, image } = comboData;
    formData.append('title', title);
    formData.append('price', price);
    formData.append('products', products);
    formData.append('image', image);
    return this.http.post(url, formData, this.admin.headers)
  }

  getFirstRoute() {
    const url = `${baseUrl}/combos`
    return this.http.get(url).pipe(
      map((resp: any) => {
        if (resp.ok) {
          const url = `/combo/${resp.combos[0].title}`
          return url
        }
        return resp.msg
      })
    )
  }

  getCombos() {
    const url = `${baseUrl}/combos`;
    return this.http.get(url)
  }

  getOneCombo(query: string,value: string) {
    const url = `${baseUrl}/combos/one?${query}=${value}`;
    return this.http.get<ResponseCombo>(url).pipe(
      map(({combo}: any) => {
        const comboInstance = new Combo(combo._id,combo.title,combo.price,combo.image,combo.products);
        return comboInstance
      })
    )
  }

  removeCombo(id: string) {
    const url = `${baseUrl}/combos/${id}`;
    console.log(this.admin.headers)
    return this.http.patch(url, 'nothing',this.admin.headers)
  }

  addComboCart(comboData: any) {
    console.log(comboData)
    this.shopService.addProductCart(comboData)
  }
}
