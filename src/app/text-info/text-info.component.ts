import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-text-info',
  templateUrl: './text-info.component.html',
  styleUrls: ['./text-info.component.scss']
})
export class TextInfosComponent implements OnInit {
  // faCoffee = faCoffee;
  today: string = new Date().getDate() + '/' + (new Date().getMonth() + 1) + '/' + (new Date().getFullYear() - 1);

  constructor() { }

  ngOnInit() {
  }

}
