import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'button-reset',
  templateUrl: './button-reset.component.html',
  styleUrls: ['./button-reset.component.scss']
})
export class ButtonResetComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() wording: string = 'reset';
  @Output() eventClick = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  _onClick(event) {
    this.eventClick.emit(event);
  }
}
