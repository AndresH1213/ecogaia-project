import { Component,OnInit } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { ShopService } from '../../services/shop.service';
import { CombosService } from 'src/app/services/combos.service';
import { ProductCart } from '../../interfaces/product.interface';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  title: string= 'ECOGAIA';
  subtitle: boolean = true;
  itemsInCart: ProductCart[] = [];
  role: string = ''

  public comboRoute = ''
  
  constructor( private router: Router,
               private shopService: ShopService,
               private comboService: CombosService) {}

  itemsMenu!: MenuItem[];

  ngOnInit(): void {
    
    this.comboService.getFirstRoute().subscribe(route => {
      this.comboRoute = route;
      this.setRoutesDDMenu();
    });
    
    // Change the title of the navbar depending on the route
    this.router.events.pipe(
      filter<any>(e => e instanceof NavigationEnd),
      map( eventdata => {
        this.subtitle = false;
        switch (eventdata.url) {
          case '/products':
            return 'PRODUCTOS'
          case '/about-us':
            return 'NOSOTROS'
          case '/carrito':
            return 'CART'
          default:
            this.subtitle = true;
            return 'ECOGAIA'
        }
      }),
    ).subscribe(data => {
        this.title = data
      });
  }

  setRoutesDDMenu() {
        
    this.shopService.itemsInCart$.subscribe(value => this.itemsInCart = value)
    this.itemsMenu = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: '/'
      },
      {
        label: 'Productos',
        icon: 'pi pi-fw pi-slack',
        routerLink: '/products'
      },
      {
        label: 'Combos',
        icon: 'pi pi-fw pi-slack',
        routerLink: this.comboRoute
      },
      {
        label: 'Ordenes',
        icon: 'pi pi-ticket',
        routerLink: '/orders'
      },
      {
        label: 'Sobre Nosotros',
        icon: 'pi pi-globe',
        routerLink: '/about-us' 
      }
    ]
  }

}
