import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'button-edit',
  templateUrl: './button-edit.component.html',
  styleUrls: ['./button-edit.component.scss'],
})
export class ButtonEditComponent implements OnInit {
  @Input() wording: string = 'แก้ไข';
  @Input() disabled: boolean = false;
  @Output() eventClick = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  _onClick(event) {
    this.eventClick.emit(event);
  }
}
