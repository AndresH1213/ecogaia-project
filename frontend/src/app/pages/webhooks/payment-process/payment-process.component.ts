import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-process',
  templateUrl: './payment-process.component.html',
  styles: [`
   .container {
    width: 100vw;
    height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
  .title-success {
    color: #896F5A;
    font-family: 'Libre Baskerville', Verdana, Serif;
    font-size: 2rem
  }
  .image-status {
    width: 600px;
    height: 400px
  }
  h2 {
    color: #896F5A;
  }
  `
  ]
})
export class PaymentProcessComponent implements OnInit, OnDestroy {

  public counter = 15;
  public status = ''
  public preferenceId = ''
  public orderNumber = ''
  public interval$: Observable<number> = interval(1000);
  public subscription: Subscription | undefined

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((resp:any) => {

      this.status = resp.collection_status
      this.preferenceId = resp.preference_id
    })
    this.subscription = this.interval$.subscribe((value: any) => {
      this.counter = 15 - value;
      if (this.counter === 0) {
        this.router.navigateByUrl('/')
      }
    },
    (error) => {alert(error)}
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
