import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CombosService } from '../../../services/combos.service';
import { Combo } from '../../../models/Combo';
import { ProductsService } from '../../../services/products.service';
import { Product } from 'src/app/models/Product';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrls: ['./combo.component.css','../catalog.component.css','../../components/add-cart-input/add-cart-input.component.css']
})
export class ComboComponent implements OnInit {

  

  public combos: Combo[] = [];
  public actualCombo!: Combo;

  public displayAddCart: boolean = false;

  public nextPage: string = ''
  public previuosPage: string = ''
  
  products : Product[] = []
  
  public characteristicsProducts: any = {};
  public title = '';
  public selectedData: any = {
    cant: 1,
    characteristics: this.characteristicsProducts,
    combo: true
  };

  constructor(private combosService: CombosService,
              private productService: ProductsService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param => this.title = param.title)
    this.combosService.getCombos().subscribe((resp: any) => {
      this.combos = resp.combos;
      const combosTitle = this.combos.map((combo:any) => combo.title);
      if (!combosTitle.includes(this.title.replace(/\+/g," "))) {
        this.router.navigateByUrl('not-found')
      }
      this.setPagination()
    })
    this.combosService.getOneCombo('title',this.title).subscribe((combo: Combo) => {
      this.actualCombo = combo;
      this.selectedData.item = this.actualCombo;
      this.setCharacteristic();
    });
  }

  setPagination() {
    const titles = this.combos.map((combo:any) => combo.title);
    const lg = titles.length
    const actualIndex = titles.findIndex(title => this.title === title)
    this.previuosPage = actualIndex === 0 ? `/combo/${titles[lg - 1]}` : `/combo/${titles[actualIndex - 1]}`;
    this.nextPage = actualIndex === lg - 1 ? `/combo/${titles[0]}` : `/combo/${titles[actualIndex + 1]}`
  }

  setCharacteristic() {
    this.actualCombo.products.forEach(product => {
      this.productService.getSingleProduct(product._id).subscribe((product: Product) => {
        this.products.push(product)
        const prodName = product.name
        this.characteristicsProducts[prodName] = {}
      })
    })
  }

  changeValue(value: number) {
    if ((this.selectedData.cant + value) < 1 ) {
      return
    }
    this.selectedData.cant += value;
  }

  validCantValue(value: any) {
    if (!value || value < 0) {
      this.selectedData.cant = 1
    }
  }

  displayDialog() {
    this.displayAddCart = true;
    setTimeout(()=> {
      this.displayAddCart = false;
    }, 1200)
  }

  addCart() {
    if (!this.selectedData.characteristics) {
      Swal.fire('Te falto algo', 'Escoge una caracteristica', 'info'); return
    }
    this.selectedData.characteristics
    this.combosService.addComboCart(this.selectedData);
    this.displayDialog();
  }

  reload() {
    setTimeout(() => {
      window.location.reload()
    }, 100);
  }

}
