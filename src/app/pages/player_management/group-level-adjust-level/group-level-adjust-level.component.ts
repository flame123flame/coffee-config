import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-group-level-adjust-level',
  templateUrl: './group-level-adjust-level.component.html',
  styleUrls: ['./group-level-adjust-level.component.scss']
})
export class GroupLevelAdjustLevelComponent implements OnInit {

  options: string[] = ['Layzy', 'Fuzzy', 'Boa'];
  constructor() { }

  ngOnInit(): void {
  }

}
