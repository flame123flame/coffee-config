import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'button-update',
  templateUrl: './button-update.component.html',
  styleUrls: ['./button-update.component.scss']
})
export class ButtonUpdateComponent implements OnInit {
@Input() disabled : boolean = false;
@Output() eventClick = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  _onClick(event) {
    this.eventClick.emit(event);
  }
}
