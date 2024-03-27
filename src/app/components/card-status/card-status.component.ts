import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-status',
  templateUrl: './card-status.component.html',
  styleUrls: ['./card-status.component.scss']
})
export class CardStatusComponent implements OnInit {
  @Input() icon: string = '';
  @Input() content: string = '';
  @Input() title: string = '';

  @Input() iconStyle:object = {};

  constructor() { }

  ngOnInit(): void {
  }

}
