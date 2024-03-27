import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prs-universal-setting',
  templateUrl: './prs-universal-setting.component.html',
  styleUrls: ['./prs-universal-setting.component.scss']
})
export class PrsUniversalSettingComponent implements OnInit {
  mobileOptions: String[] = ['Banner View', 'Grid View'];
  desktopOptions: String[] = ['Banner View', , 'Grid View'];
  mobileAppOptions: string[] = ['Banner View', , 'Grid View'];

  pctsOptions: string[] = [' No Display', 'All Promotion', 'Registration Promotion', 'Deposit Promotion', 'Promotion Posting', 'Live Game', 'RNG Games', 'Lottery', 'MPG', 'Sport Book', ' Finance', 'Animal Sport', 'Chease', 'E-Sports'];
  pctSettingOptions1: string[] = this.pctsOptions;
  pctSettingOptions2: string[] = this.pctsOptions;
  pctSettingOptions3: string[] = this.pctsOptions;
  pctSettingOptions4: string[] = this.pctsOptions;
  pctSettingOptions5: string[] = this.pctsOptions;
  pctSettingOptions6: string[] = this.pctsOptions;
  pctSettingOptions7: string[] = this.pctsOptions;
  pctSettingOptions8: string[] = this.pctsOptions;
  pctSettingOptions9: string[] = this.pctsOptions;
  pctSettingOptions10: string[] = this.pctsOptions;

  constructor() { }

  ngOnInit(): void {
  }

}
