import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styles: [`
  .image {
    height: 20rem;
    width: 20rem;
    border-radius: 50%;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 2px 0px;
}
  `
  ]
})
export class ImageCarouselComponent implements OnInit {

  @Input('arrayImgs') catalog: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
