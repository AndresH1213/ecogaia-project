import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Product } from '../models/Product';
import { environment } from 'src/environments/environment';
import { AdminService } from './admin.service';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  productImage(imageUrl: string, type: string) {
    const url = `${baseUrl}/products/image/${type}/${imageUrl}`;
    return this.http.get(url);
  }

  toProductData(productForm: any) {
    const formData = new FormData();

    // setting all the productform values to formData, in case that a file come in the form can be
    // send as file and not as json;
    const { name, code, imageUrl, price, characteristics } = productForm;

    // append the values
    formData.append('name', name);
    if (code) {
      formData.append('code', code);
    }
    if (imageUrl) {
      formData.append('imageUrl', imageUrl);
    }
    formData.append('price', price);
    if (characteristics) {
      formData.append('characteristics', characteristics);
    }

    return formData;
  }

  constructor(private http: HttpClient, private admin: AdminService) {}

  /* CRUD OPERATIONS */

  getProducts() {
    const url = `${baseUrl}/products/all`;
    return this.http.get<{ ok: boolean; products: Product[] }>(url).pipe(
      map(({ products }) => products),
      map((products) => {
        const productsIntances = products.map((product) => {
          const { _id, code, name, price, imageUrl, characteristics } = product;
          const newProduct = new Product(
            _id,
            name,
            price,
            imageUrl,
            characteristics,
            code
          );
          return newProduct;
        });
        return productsIntances;
      })
    );
  }

  getSingleProduct(query: string) {
    let url = `${baseUrl}/products?code=${query}`;
    if (query.length > 3) {
      url = `${baseUrl}/products?id=${query}`;
    }

    return this.http.get<{ ok: Boolean; product: Product }>(url).pipe(
      map(({ product }) => {
        return new Product(
          product._id,
          product.name,
          product.price,
          product.imageUrl,
          product.characteristics,
          product.code
        );
      })
    );
  }
  addProduct(productForm: any) {
    const url = `${baseUrl}/products`;
    const formData = this.toProductData(productForm);
    return this.http.post(url, formData, this.admin.headers);
  }

  deleteProduct(id: string) {
    const url = `${baseUrl}/products/${id}`;
    return this.http.delete<{ ok: Boolean; msg: string }>(
      url,
      this.admin.headers
    );
  }

  updateProduct(id: string, data: any) {
    const { replaceImage, ...form } = data;
    const queryReplace = replaceImage ? '?replace=true' : '';
    const url = `${baseUrl}/products/${id}` + queryReplace;
    const formData = this.toProductData(form);
    return this.http.put<{ ok: Boolean; msg: string }>(
      url,
      formData,
      this.admin.headers
    );
  }
}
