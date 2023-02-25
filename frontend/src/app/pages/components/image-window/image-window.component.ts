import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-image-window',
  templateUrl: './image-window.component.html',
  styleUrls: ['./image-window.component.css']
})
export class imageWindowComponent implements OnInit {

  @Input() imageUrl!: string 
  public loading: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }
  onLoad() {
    this.loading = false;
  }

}
