import { Component, OnInit } from '@angular/core';
import { CombosService } from '../../../services/combos.service';


@Component({
  selector: 'app-combos-link',
  templateUrl: './combos-link.component.html',
  styleUrls: ['./combos-link.component.css']
})
export class CombosLinkComponent implements OnInit {

  routesLinkCombos: any = []
  constructor(private combosService: CombosService) { }

  ngOnInit(): void {
    this.combosService.getCombos().subscribe(({combos} : any) => {
      combos.forEach((combo:any) => {
        const route = `/combo/${combo.title}`
        this.routesLinkCombos.push(route)
      })
    });
  }

}

