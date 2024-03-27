import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'button-save',
  templateUrl: './button-save.component.html',
  styleUrls: ['./button-save.component.scss'],
})
export class ButtonSaveComponent implements OnInit {
  @Input() wording: string = 'บันทึก';

  @Input() disabled: boolean = false;
  @Output() eventClick = new EventEmitter<string>();


  constructor() {}

  ngOnInit() {}

  _onClick(event) {
    this.eventClick.emit(event);
  }
}
