import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { City } from '../interfaces/cities.interface';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {

  constructor(private router: Router,
              private http: HttpClient) { }

  getTitle() {
    return this.router.events
  }

  getCities(state: string) {
    const url = `https://www.datos.gov.co/resource/xdk5-pm3f.json?departamento=${state}`
    return this.http.get<City[]>(url).pipe(
      map((dataCities)=> {
        return dataCities.map(data => data.municipio)
      })
    )
  }

}
