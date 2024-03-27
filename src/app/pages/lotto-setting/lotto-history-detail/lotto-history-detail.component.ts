import { BeanService } from './../../../service/BeanService.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSetting } from 'src/app/models/ActionSettingModel';

const URL = {
  GET_DETAIL: "transaction-group/get-transaction-detail-by-code/"
  // GET_ALL:"transaction-group/get-transaction-detail-by-code/{groupCode}"
}

@Component({
  selector: 'app-lotto-history-detail',
  templateUrl: './lotto-history-detail.component.html',
  styleUrls: ['./lotto-history-detail.component.scss']
})

export class LottoHistoryDetailComponent implements OnInit {

  constructor(
    private routeParam: ActivatedRoute,
    private router: Router,
    private httpBean: BeanService,
  ) { }

  actionSetting = new ActionSetting({

  });

  Codeusername = []
  data: any = []

  columns: any = [
    { header: 'Lotto Type', field: "kindName" },
    { header: 'Lotto Number', field: "lottoNumber" },
    { header: 'PayCost', field: "payCost" },
    { header: 'Prize Cost', field: "prize" },
    { header: 'Correct Number', field: "correctNumber" },
    { header: 'Prize Result', field: "prizeResult" },
    { header: 'Status', field: "status" },


  ];

  tr: any = [
    'kindName',
    'lottoNumber',
    'payCost',
    'prize',
    'correctNumber',
    'prizeResult',
    'status',
  ];

  dataList = []

  codeParam;
  ngOnInit(): void {
    this.routeParam.queryParams.subscribe(data => {
      if (data) {
        console.log(data);
        this.codeParam = data.lottoClassCode
        this.Codeusername = data.username

      }
    });
    this.getLottoGroupDetail()
  }

  getLottoGroupDetail() {
    this.httpBean.doGet(URL.GET_DETAIL + this.codeParam).subscribe(data => {
      if (data.status == "SUCCESS") {

        this.data = data.data.listTrantsaction
        console.log(this.data)
      }
    })
  }

  goBack() {
    this.router.navigate(['lotto-settings/lotto-history'])
  }

}
