import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import * as moment from 'moment';
import { BeanService } from 'src/app/service/BeanService.service';
import { MessageService } from 'src/app/service/message.service';
import { LottoConstants } from '../lotto-constants/lotto-constants';

const URLS = {
  LOTTO_CLASS: 'draft-lotto-class/get-lotto-class',
  GET_BY_CODE: 'add-lotto/get-lotto-time-by-code/',
  CHANGE_STATUS: 'add-lotto/change-status-lotto',
  SYNC_LOTTO_RESULT: 'lotto-result/sync-lotto-result'
};

@Component({
  selector: 'app-lotto-draft-class',
  templateUrl: './lotto-draft-class.component.html',
  styleUrls: ['./lotto-draft-class.component.scss']
})
export class LottoDraftClassComponent implements OnInit {
  category;
  data = [];
  actionSetting: ActionSetting = new ActionSetting({
    hideEdit: false,
    hideDelete: false,
    hideDetail: true,
  });
  readonly tr: any = [
    'className',
    'createStatusStr',
    'createdBy',
    'createdAt',
    'remarkVersion',
    'action',
  ];
  columns: any = [
    { header: '#', field: 'id' },
    { header: 'Lotto Name', field: 'className', type: 'link' },
    { header: 'Status', field: 'createStatusStr' },
    { header: 'Create By', field: 'createdBy' },
    { header: 'Create At', field: 'createdAt' },
    { header: 'Remark Version', field: 'remarkVersion' },
  ];

  constructor(
    private router: Router,
    private httpBean: BeanService,
    private activateRoute: ActivatedRoute,
  ) {
    this.category = this.activateRoute.snapshot.queryParams.category;
    this.getLottoClass();
  }

  ngOnInit(): void {
  }

  checkStatus(status): string {
    let statusStr = '-';
    switch (status) {
      case 'INIT':
        statusStr = 'PENDING';
        break;
      default:
        statusStr = status;
        break;
    }
    return statusStr;
  }

  getLottoClass() {
    this.httpBean.doGet(URLS.LOTTO_CLASS + '/' + this.category).subscribe(res => {
      if (MessageService.MSG.SUCCESS === res.status) {
        res.data.forEach(element => {
          element.createStatusStr = this.checkStatus(element.createStatus);
          element.createdAt = moment(element.createdAt).format('DD/MM/YYYY HH:mm:ss');
        });
        this.data = res.data;
      }
    });
  }

  goDetail(data) {
    this.router.navigate(['lotto-settings/lotto-government/lotto-government-add'],
      {
        queryParams: {
          isDraft: true,
          lottoClassCode: data.lottoClassCode,
          draftCode: data.draftCode,
          lottoCategoryCode: 'GOVERNMENT',
        }
      });
  }

  goBack() {
    if (this.category == LottoConstants.LOTTO_GOVERNMENT) {
      this.router.navigate(['lotto-settings/lotto-government']);
    } else if (this.category == LottoConstants.LOTTO_STOCK) {
      this.router.navigate(['lotto-settings/lotto-stock']);
    }
  }

}
