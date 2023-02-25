import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { User } from '../models/User';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { OrderResp } from '../interfaces/order-resp.interface';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  public user!: User;

  get token() {
    return localStorage.getItem('tokenEGS') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
        Origin: '*',
        'Access-Control-Request-Method': '*',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    };
  }

  get getRole(): 'ADMINISTRATOR' | 'CLIENT' {
    return this.user.role!;
  }

  constructor(private http: HttpClient, private router: Router) {}

  saveLocalStorage(token: string) {
    localStorage.setItem('tokenEGS', token);
  }

  loginUser(formData: { email: string; password: string }) {
    return this.http.post(`${baseUrl}/auth/login`, formData).pipe(
      tap((resp: any) => {
        this.saveLocalStorage(resp.token);
      })
    );
  }

  logOut() {
    localStorage.removeItem('tokenEGS');
    this.router.navigateByUrl('/');
  }

  getAllOrders() {
    const url = `${baseUrl}/shop/orders`;
    return this.http.get<OrderResp>(url, this.headers).pipe(
      map((resp) => {
        return resp.orders;
      }),
      catchError((err) => err.msg)
    );
  }

  validateToken() {
    return this.http.get(`${baseUrl}/auth/renew`, this.headers).pipe(
      map((data: any) => {
        const { email, role, uid } = data.user;
        this.user = new User(email, role, uid);
        this.saveLocalStorage(data.token);
        return true;
      }),
      catchError((err) => {
        console.log(err);
        return of(false);
      })
    );
  }
}
