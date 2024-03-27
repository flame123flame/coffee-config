import { Component, OnInit, Input } from '@angular/core';
import { MenuDropdownItem } from '../../models/MenuDropdownItem';
@Component({
  selector: 'menu-dropdown',
  templateUrl: './menu-dropdown.component.html',
  styleUrls: ['./menu-dropdown.component.scss'],
})
export class MenuDropdownComponent implements OnInit {
  @Input() icon: string = 'more_vert';
  @Input() listItems: Array<MenuDropdownItem> = [];
  constructor() {}

  ngOnInit(): void {}
}
