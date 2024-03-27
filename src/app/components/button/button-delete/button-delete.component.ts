import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'button-delete',
  templateUrl: './button-delete.component.html',
  styleUrls: ['./button-delete.component.scss'],
})
export class ButtonDeleteComponent implements OnInit {
  @Input() wording: string = 'ลบ';
  @Input() disabled: boolean = false;
  @Output() eventClick = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  _onClick(event) {
    this.eventClick.emit(event);
  }
}
