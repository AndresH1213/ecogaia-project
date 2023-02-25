import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from '../services/admin.service';

@Injectable({
  providedIn: 'root',
})
export class loginGuard implements CanActivate {
  constructor(private admin: AdminService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.admin.validateToken()) {
      return true;
    } else {
      console.log('hee');
      this.router.navigateByUrl('/admin/products');
      return false;
    }
  }
}
