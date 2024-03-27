import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'button-add',
  templateUrl: './button-add.component.html',
  styleUrls: ['./button-add.component.scss'],
})
export class ButtonAddComponent implements OnInit {
  @Input() wording: string = 'เพิ่มข้อมูล';

  @Input() disabled: boolean = false;
  @Output() eventClick = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {}

  _onClick(event) {
    this.eventClick.emit(event);
  }
}
