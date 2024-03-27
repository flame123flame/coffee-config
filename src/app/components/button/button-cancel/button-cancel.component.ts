import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'button-cancel',
  templateUrl: './button-cancel.component.html',
  styleUrls: ['./button-cancel.component.scss'],
})
export class ButtonCancelComponent implements OnInit {
  @Input() wording: string = 'ยกเลิก';

  @Input() disabled: boolean = false;
  @Output() eventClick = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}
  
  _onClick(event) {
    this.eventClick.emit(event);
  }
}
