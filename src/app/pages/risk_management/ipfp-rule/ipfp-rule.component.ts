import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ipfp-rule',
  templateUrl: './ipfp-rule.component.html',
  styleUrls: ['./ipfp-rule.component.scss']
})
export class IpfpRuleComponent implements OnInit {
  
  constructor() { }
  radio1 = 'IP';
  selected1 = 'IP';
  radio2 = 'All';
  ngOnInit(): void {
  }

}
