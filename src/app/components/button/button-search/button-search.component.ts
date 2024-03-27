import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'button-search',
  templateUrl: './button-search.component.html',
  styleUrls: ['./button-search.component.scss'],
})
export class ButtonSearchComponent implements OnInit {
  @Input() wording: string = 'Search';
  @Input() disabled: boolean = false;
  @Output() eventClick = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  _onClick(event) {
    this.eventClick.emit(event);
  }
}
