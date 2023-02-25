import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  OnDestroy,
} from '@angular/core';

import { fromEvent, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'EcogaiaShop';

  scroll$?: Observable<Event>;
  barSubscription?: Subscription;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // subscription to scrollbar
    this.scroll$ = fromEvent(this.el.nativeElement, 'scroll');
    console.log(this.scroll$);
    this.barSubscription = this.scroll$
      .pipe(
        map((event: Event) => {
          console.log(event);
          return (event.target as HTMLElement).scrollTop;
        }),
        filter((scrollTop) => {
          console.log(scrollTop);
          return scrollTop > 0;
        })
      )
      .subscribe((scrollTop) => {
        console.log(scrollTop);
      });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.barSubscription?.unsubscribe();
  }
}
