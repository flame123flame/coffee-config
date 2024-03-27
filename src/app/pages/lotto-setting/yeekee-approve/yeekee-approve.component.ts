import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { PageChangeModel } from 'src/app/models/MatTableChange';
import { PaginateRequest } from 'src/app/models/PaginateRequest';
import { BeanService } from 'src/app/service/BeanService.service';

const URL = {

  GET_YEEKEE_APPROVED: 'yeekee-approve/get-yeekee-sum-number-is-approved',
  GET_YEEKEE_APPROVED_PAGINATE: 'yeekee-approve/get-yeekee-paginate',

}
@Component({
  selector: 'app-yeekee-approve',
  templateUrl: './yeekee-approve.component.html',
  styleUrls: ['./yeekee-approve.component.scss']
})
export class YeekeeApproveComponent implements OnInit {
  columns: any = [
    {
      header: '#',
      field: 'id'
    },
    {
      header: 'Yee kee',
      field: 'className'
    },
    {
      header: 'Installment',
      field: 'installment'
    },
    {
      header: 'Round',
      field: 'roundNumber'
    },
  ];

  tr: any = [
    'className',
    'installment',
    'roundNumber',
    'action',
  ];
  dataInput = [
    // {
    //   className: 'ยี่กีวันนี้',
    //   installment: '02/12/63',
    //   roundYeekee: 1,
    // },
    // {
    //   className: 'ยี่กีวันนี้',
    //   installment: '02/12/63',
    //   roundYeekee: 1,
    // },
    // {
    //   className: 'ยี่กีวันนี้',
    //   installment: '02/12/63',
    //   roundYeekee: 1,
    // }
  ];
  length = 0
  paginateReq: PaginateRequest = new PaginateRequest();
  actionSetting: ActionSetting = new ActionSetting({
    hideEdit: false,
    hideDelete: false,
    hideDetail: true
  });
  constructor(
    private router: Router,
    private httpBeanService: BeanService,
    private activateRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getYeekeeApprovedPaginate();
  }

  // getYeekeeApproved() {
  //   this.httpBeanService.doGet(URL.GET_YEEKEE_APPROVED).subscribe(data => {
  //     if (data.status == 'SUCCESS') {
  //       this.dataInput = data.data;
  //     }
  //   });
  // }

  getYeekeeApprovedPaginate() {
    this.httpBeanService.doPost(URL.GET_YEEKEE_APPROVED_PAGINATE,this.paginateReq).subscribe(res => {
      if (res.status == 'SUCCESS') {
        this.dataInput = res.data.data;
        this.length = res.data.recordsTotal
      }
    });
  }

  pageChange(event: PageChangeModel) {
    this.paginateReq.page = event.pageIndex
    this.paginateReq.length = event.pageSize
    this.getYeekeeApprovedPaginate();
  }

  goDetail(data) {
    console.log(data);
    this.router.navigate(['lotto-settings/lotto-yeekee-approved/lotto-yeekee-approved-detail'],
      {
        queryParams: {
          className: data.className,
          classCode: data.classCode,
          yeekeeSumNumberCode: data.yeekeeSumNumberCode,
          roundNumber: data.roundNumber,
          installment: data.installment,
        }
      }
    );
  }

}
