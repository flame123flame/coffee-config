import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { PaginateFilter, PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { BeanService } from 'src/app/service/BeanService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { MessageService } from 'src/app/service/message.service';
import { LottoRemarkComponent } from '../lotto-government/lotto-remark/lotto-remark.component';

const URL = {
  GET_ALL_CONFIRM_TRANSACTION: 'confirm-transaction/get-all-confirm-transaction',
  GET_ALL_TRANSACTION: 'confirm-transaction/get-all-transaction',
  CONFIRM_TRANSACTION: 'confirm-transaction/confirm-lotto-transaction',
  GET_ALL_LOTTO_CLASS: 'transaction-group/get-all-dropdown-lotto-class',
  GET_ALL_PAGINATE_CONFIRM_TRANSACTION: 'confirm-transaction/get-all-paginate-confirm-transaction',
  GET_PAGINATE_TRANSACTION: 'confirm-transaction/get-paginate-transaction',
  SUBMIT_ALL_TRANSACTION: 'lotto-result/submit-all-confirm-transaction',
  SUBMIT_SELECT_TRANSACTION: 'lotto-result/submit-select-confirm-transaction',
  SUBMIT_DE_SELECT_TRANSACTION: 'lotto-result/submit-de-select-confirm-transaction',
  SUBMIT_BY_ID_TRANSACTION: 'lotto-result/submit-by-id-confirm-transaction',
  GET_KIND: 'msd-lotto-kind/get-all-msd',
}


interface tableConfirm {
  'lc.class_name': string;
  'mlk.msd_lotto_kind_name': string;
  'tb.lotto_transaction_id': string;
  'tb.lotto_transaction_code': string;
  'tb.username': string;
  'tb.lotto_class_code': string;
  'tb.lotto_kind_code': string;
  'tb.pay_cost': string;
  'tb.prize_cost': string;
  'tb.is_limit': string;
  'tb.created_at': string;
  'tb.paid_by': string;
  'tb.paid_at': string;
  'tb.lotto_group_transaction_code': string;
  'tb.lotto_number': string;
  'tb.status': string;
  'tb.update_wallet': string;
  'tb.installment': string;
  'tb.number_correct': string;
  'tb.prize_corroect': string;
  'tb.count_seq': string;
  'tb.reject_remark': string;
  data: any
}


@Component({
  selector: 'app-confirm-transaction',
  templateUrl: './confirm-transaction.component.html',
  styleUrls: ['./confirm-transaction.component.scss']
})
export class ConfirmTransactionComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator
  dataSource2: any = [];
  dataBp: any = [];
  dataSource: any = [];
  allTrasaction: any = null;
  lottoClassCode
  formFilter: FormGroup;
  formFillterAll: FormGroup;
  selection = new SelectionModel<any>(true, []);
  selecttionKeep = new SelectionModel<any>(true, []);
  length: number = 0;
  lengthAll: number = 0;
  paginateReq: PaginateRequest = new PaginateRequest();
  paginateAllReq: PaginateRequest = new PaginateRequest();
  paginateSort: PaginateSort = new PaginateSort();
  paginateAllSort: PaginateSort = new PaginateSort();
  selectAll: any = false;
  selectAllTransaction: any = false;
  pageIndex = 0;
  numberSelect = 0;

  ConfirmResultReq = {
    status: true,
    remark: '',
    kindCode: '',
    classCode: '',
    categoryCode: '',
    username: '',
    transactionCode: '',
    transactionId: '',
    transactionIdList: [],
    detransactionIdList: [],
  }


  listKind = [];

  actionSetting: ActionSetting = new ActionSetting({
    type: 'choice',
    textCancel: 'Reject',
    textConfirm: 'Approved',
    onCancel: (data) => {
      console.log(data);
      this.setApprovedSubmit(false, data['tb.lotto_transaction_id'],);
    },
    onConfirm: (data) => {
      this.setApprovedSubmit(true, data['tb.lotto_transaction_id']);
    },
  });


  constructor(
    private beanSer: BeanService,
    public dialog: MatDialog,
    private httpBean: BeanService,
    private fromBuilder: FormBuilder
  ) {
    this.createFormConfirmTransaction();
    this.creatFormAllTransaction();
    this.getLottoClass()
    this.getKind()
  }

  listSelect: any = [];
  tr2: any = [
    'selected',
    'lc.class_name',
    'tb.username',
    'tb.lotto_group_transaction_code',
    'mlk.msd_lotto_kind_name',
    'tb.lotto_number',
    'tb.installment',
    'tb.pay_cost',
    'tb.prize_cost',
    'tb.prize_corroect',
    'tb.status',
    'action'

  ];

  tr3: any = [
    'lc.class_name',
    'tb.username',
    'tb.lotto_group_transaction_code',
    'mlk.msd_lotto_kind_name',
    'tb.lotto_number',
    'tb.installment',
    'tb.pay_cost',
    'tb.prize_cost',
    'tb.prize_corroect',
    'tb.paid_at',
    'tb.status',
    'tb.reject_remark'

  ];


  displayedColumnsTr2: any = [
    // { header: 'ลำดับ', field: 'select' },
    { header: 'หวย', field: 'lc.class_name' },
    { header: 'username', field: 'tb.username' },
    { header: 'เลขที่โพย', field: 'tb.lotto_group_transaction_code' },
    { header: 'ประเภท', field: 'mlk.msd_lotto_kind_name' },
    { header: 'เลขที่ถูก', field: 'tb.lotto_number' },
    { header: 'งวด', field: 'tb.installment' },
    { header: 'ราคาซื้อ', field: 'tb.pay_cost', type: 'pipeNumber' },
    { header: 'ราคาที่ถูก', field: 'tb.prize_cost', type: 'pipeNumber' },
    { header: 'รางวัล', field: 'tb.prize_corroect', type: 'pipeNumber' },
    { header: 'Status', field: 'tb.status' },
    { header: 'Paid At', field: 'tb.paid_at' },
    { header: 'หมายเหตุ', field: 'tb.reject_remark' },

  ];
  displayedColumnsTr: any = [
    { header: 'ลำดับ', field: 'selected' },
    { header: 'หวย', field: 'lc.class_name' },
    { header: 'username', field: 'tb.username' },
    { header: 'เลขที่โพย', field: 'tb.lotto_group_transaction_code' },
    { header: 'ประเภท', field: 'mlk.msd_lotto_kind_name' },
    { header: 'เลขที่ถูก', field: 'tb.lotto_number' },
    { header: 'ราคาซื้อ', field: 'tb.pay_cost', type: 'pipeNumber' },
    { header: 'ราคาที่ถูก', field: 'tb.prize_cost', type: 'pipeNumber' },
    { header: 'งวด', field: 'tb.installment' },
    { header: 'รางวัล', field: 'tb.prize_corroect', type: 'pipeNumber' },
    { header: 'Status', field: 'tb.status' },

  ];

  displayedColumns: any = [
    'selected',
    'lc.class_name',
    'tb.username',
    'tb.lotto_group_transaction_code',
    'mlk.msd_lotto_kind_name',
    'tb.lotto_number',
    'tb.installment',
    'tb.pay_cost',
    'tb.prize_cost',
    'tb.prize_corroect',
    'tb.status',
    'action'
  ];

  ngOnInit(): void {
    this.loadList()
  }

  getKind() {
    this.httpBean.doGet(URL.GET_KIND).subscribe((data) => {
      this.listKind = data?.data ?? [];
    });
  }


  // getConfirmTransaction() {
  //   this.beanSer.doGet(`${URL.GET_ALL_CONFIRM_TRANSACTION}`).subscribe(data => {
  //     if (data.status == 'SUCCESS') {
  //       this.dataSource = data.data;

  //     }
  //   });
  // }

  // getTransaction() {
  //   this.beanSer.doGet(`${URL.GET_ALL_TRANSACTION}`).subscribe(data => {
  //     if (data.status == 'SUCCESS') {
  //       this.allTrasaction = data.data;
  //     }
  //   });
  // }

  setApprovedSubmit(confirm, id) {
    console.log(confirm, id);
    let status;
    // console.log(status)
    if (!confirm) {
      // กดปิด
      // status = confirm;
      this.loadList()
      let remark = '';
      const dialogRef = this.dialog.open(LottoRemarkComponent, {
        width: '250px',
        data: { remark }
      });
      console.log(remark)

      dialogRef.afterClosed().subscribe(result => {

        console.log('The dialog was closed', result);
        if (result) {
          this.callConfirmTransabctionStatus(confirm, id, result);

        }
      });
    }
    else {
      // กดเปิด
      status = confirm;
      // console.log(status)
      DialogSweetAlertService.opentModalSweetAlertConfirm(
        'ยืนยันการทำรายการ',
        'คุณต้องการอนุมัติรายการนี้ ?',
        () => {
          this.callConfirmTransabctionStatus(status, id, null);
        });
    }
  }

  callConfirmTransabctionStatus(status, id, remark) {
    this.httpBean.doPost(`${URL.CONFIRM_TRANSACTION}/${status}/${id}`, { remark }).subscribe(res => {
      if (res.status == 'SUCCESS') {
        this.loadList()
      }
    });
  }

  loadList() {
    this.selectAll = false
    this.selectAllTransaction = false
    this.selection.clear()
    this.selecttionKeep.clear()
    this.loadsearchConfirmTransation()
    this.loadAllTransaction()
  }

  loadsearchConfirmTransation() {
    
    this.paginateReq.filter = []
    this.paginateReq.sort = []
    this.paginateSort.column = 'tb.created_at'
    this.paginateSort.order = 'desc'
    this.paginateReq.sort.push(this.paginateSort)
    this.getsearchConfirmTransation()

    this.ConfirmResultReq.categoryCode = this.formFilter.controls.selectedCategory.value
    this.ConfirmResultReq.classCode = this.formFilter.controls.selectedClassCode.value
    this.ConfirmResultReq.kindCode = this.formFilter.controls.selectedKindCode.value;
    this.ConfirmResultReq.transactionCode = this.formFilter.controls.transactionGroupSearch.value
    this.ConfirmResultReq.username = this.formFilter.controls.usernameSearch.value
  }

  getSerchTransaction()
  {
    this.paginator.pageIndex = 0
    this.paginateReq.page = 0
    this.loadsearchConfirmTransation()
  }

  loadAllTransaction() {
    this.paginateAllReq.filter = []
    this.paginateAllReq.sort = []
    this.paginateAllSort.column = 'tb.paid_at'
    this.paginateAllSort.order = 'desc'
    this.paginateAllReq.sort.push(this.paginateAllSort)
    this.getsearchAllTransation()
  }

  createFormConfirmTransaction() {
    this.formFilter = this.fromBuilder.group({
      selectedClassCode: '',
      selectedCategory: '',
      selectedKindCode: '',
      usernameSearch: '',
      installmentSearch: '',
      transactionGroupSearch: ''
    })
  }
  creatFormAllTransaction() {
    this.formFillterAll = this.fromBuilder.group({
      selectedClassCode: '',
      selectedCategory: '',
      selectedKindCode: '',
      usernameSearch: '',
      installmentSearch: '',
      transactionGroupSearch: ''
    })
  }

  getLottoClass() {
    this.httpBean.doGet(URL.GET_ALL_LOTTO_CLASS).subscribe(data => {
      console.log(data);
      this.lottoClassCode = data.data
    })
  }

  resetSearch() {
    this.paginator.pageIndex = 0
    this.paginateReq.page = 0
    this.createFormConfirmTransaction();
    this.creatFormAllTransaction();
    this.getsearchConfirmTransation()
    this.getsearchAllTransation()

    this.ConfirmResultReq.categoryCode = this.formFilter.controls.selectedCategory.value
    this.ConfirmResultReq.classCode = this.formFilter.controls.selectedClassCode.value
    this.ConfirmResultReq.kindCode = this.formFilter.controls.selectedKindCode.value;
    this.ConfirmResultReq.transactionCode = this.formFilter.controls.transactionGroupSearch.value
    this.ConfirmResultReq.username = this.formFilter.controls.usernameSearch.value
  }
  resetSearch2() {

    this.paginateAllReq.page = 0
    this.creatFormAllTransaction();
    this.getsearchAllTransation()
  }



  getsearchConfirmTransation() {
    this.numberSelect = 0
    this.paginateReq.length=10;
    let wordFilter: PaginateFilter = new PaginateFilter();
    this.paginateReq.filter = []
    wordFilter = new PaginateFilter();
    wordFilter.column = 'tb.status'
    wordFilter.op = 'contain'
    wordFilter.value = 'WIN'
    this.paginateReq.filter.push(wordFilter)
    wordFilter = new PaginateFilter();
    wordFilter.column = 'tb.update_wallet'
    wordFilter.op = 'IS NULL'
    wordFilter.value = ''
    this.paginateReq.filter.push(wordFilter)
    wordFilter = new PaginateFilter();
    wordFilter.column = 'lc.lotto_category_code'
    wordFilter.op = '!='
    wordFilter.value = 'YEEKEE'
    this.paginateReq.filter.push(wordFilter)

    if (this.formFilter.controls.usernameSearch.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.username'
      wordFilter.op = 'contain'
      wordFilter.value = this.formFilter.controls.usernameSearch.value
      this.paginateReq.filter.push(wordFilter)
    }

    if (this.formFilter.controls.installmentSearch.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.installment'
      wordFilter.op = 'contain'
      wordFilter.value = this.formFilter.controls.installmentSearch.value
      this.paginateReq.filter.push(wordFilter)
    }

    if (this.formFilter.controls.transactionGroupSearch.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.lotto_group_transaction_code'
      wordFilter.op = 'contain'
      wordFilter.value = this.formFilter.controls.transactionGroupSearch.value
      this.paginateReq.filter.push(wordFilter)
    }
    if (this.formFilter.controls.selectedCategory.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'lc.lotto_category_code'
      wordFilter.op = 'contain'
      wordFilter.value = this.formFilter.controls.selectedCategory.value
      this.paginateReq.filter.push(wordFilter)
    }
    if (this.formFilter.controls.selectedClassCode.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.lotto_class_code'
      wordFilter.op = 'contain'
      wordFilter.value = this.formFilter.controls.selectedClassCode.value
      this.paginateReq.filter.push(wordFilter)
    }
    if (this.formFilter.controls.selectedKindCode.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.lotto_kind_code';
      wordFilter.op = 'contain';
      wordFilter.value = this.formFilter.controls.selectedKindCode.value;
      this.paginateReq.filter.push(wordFilter);
    }
    
    this.httpBean.doPost(URL.GET_ALL_PAGINATE_CONFIRM_TRANSACTION, this.paginateReq).subscribe(data => {
      if (data.status === 'SUCCESS') {
        let arr: tableConfirm[] = []
        data.data.data.forEach(element => {
          arr.push({
            'lc.class_name': element.className,
            'mlk.msd_lotto_kind_name': element.msdLottoKindName,
            'tb.lotto_transaction_id': element.lottoTransactionId,
            'tb.lotto_transaction_code': element.lottoTransactionCode,
            'tb.username': element.username,
            'tb.lotto_class_code': element.lottoClassCode,
            'tb.lotto_kind_code': element.lottoKindCode,
            'tb.pay_cost': element.payCost,
            'tb.prize_cost': element.prizeCost,
            'tb.is_limit': element.isLimit,
            'tb.created_at': moment(element.createdAt).format('DD/MM/YYYY HH:mm:ss'),
            'tb.paid_by': element.paidBy,
            'tb.paid_at': element.paidAt,
            'tb.lotto_group_transaction_code': element.lottoGroupTransactionCode,
            'tb.lotto_number': element.lottoNumber,
            'tb.status': element.status,
            'tb.update_wallet': element.updateWallet,
            'tb.installment': element.installment,
            'tb.number_correct': element.numberCorrect,
            'tb.prize_corroect': element.prizeCorrect,
            'tb.count_seq': element.countSeq,
            'tb.reject_remark': element.rejectRemark,
            data: element
          })
        });
        this.dataSource = arr
        this.length = data.data.recordsTotal
        if (this.selectAllTransaction) {
          this.dataSource.forEach(row => {
            this.selection.select(row['tb.lotto_transaction_id'])

          });
          if (this.selecttionKeep.selected.length) {
            this.selecttionKeep.selected.forEach(rowdeselect => {
              this.selection.deselect(rowdeselect)

            })
          }
        }
        this.dataSource.forEach(rowid => {
          this.selection.selected.forEach(row => {
            if (rowid['tb.lotto_transaction_id'] == row) {
              this.numberSelect += 1
            }
          })

        });
        // if(!data.data.data.length)
        // {
        //   this.paginator.pageIndex -=1
        //   this.paginateReq.page -= 1
        // }

      }
    })
  }

  getsearchAllTransation() {
    this.paginateAllReq.length=10;
    let wordFilter: PaginateFilter = new PaginateFilter();
    this.paginateAllReq.filter = []

    wordFilter = new PaginateFilter();
    wordFilter.column = 'tb.status'
    wordFilter.op = 'contain'
    wordFilter.value = 'WIN'
    this.paginateAllReq.filter.push(wordFilter)
    wordFilter = new PaginateFilter();
    wordFilter.column = 'tb.update_wallet'
    wordFilter.op = 'IS NOT NULL'
    wordFilter.value = ''
    this.paginateAllReq.filter.push(wordFilter)
    wordFilter = new PaginateFilter();
    wordFilter.column = 'lc.lotto_category_code'
    wordFilter.op = '!='
    wordFilter.value = 'YEEKEE'
    this.paginateAllReq.filter.push(wordFilter)
    

    if (this.formFillterAll.controls.usernameSearch.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.username'
      wordFilter.op = 'contain'
      wordFilter.value = this.formFillterAll.controls.usernameSearch.value
      this.paginateAllReq.filter.push(wordFilter)
    }

    if (this.formFillterAll.controls.installmentSearch.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.installment'
      wordFilter.op = 'contain'
      wordFilter.value = this.formFillterAll.controls.installmentSearch.value
      this.paginateAllReq.filter.push(wordFilter)
    }

    if (this.formFillterAll.controls.transactionGroupSearch.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.lotto_group_transaction_code'
      wordFilter.op = 'contain'
      wordFilter.value = this.formFillterAll.controls.transactionGroupSearch.value
      this.paginateAllReq.filter.push(wordFilter)
    }
    if (this.formFillterAll.controls.selectedCategory.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'lc.lotto_category_code'
      wordFilter.op = 'contain'
      wordFilter.value = this.formFillterAll.controls.selectedCategory.value
      this.paginateAllReq.filter.push(wordFilter)
    }
    if (this.formFillterAll.controls.selectedClassCode.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.lotto_class_code'
      wordFilter.op = 'contain'
      wordFilter.value = this.formFillterAll.controls.selectedClassCode.value
      this.paginateAllReq.filter.push(wordFilter)
    }
    if (this.formFillterAll.controls.selectedKindCode.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.lotto_kind_code';
      wordFilter.op = 'contain';
      wordFilter.value = this.formFillterAll.controls.selectedKindCode.value;
      this.paginateAllReq.filter.push(wordFilter);
    }


    this.httpBean.doPost(URL.GET_PAGINATE_TRANSACTION, this.paginateAllReq).subscribe(data => {
      if (data.status === 'SUCCESS') {
        let arr: tableConfirm[] = []
        data.data.data.forEach(element => {
          arr.push({
            'lc.class_name': element.className,
            'mlk.msd_lotto_kind_name': element.msdLottoKindName,
            'tb.lotto_transaction_id': element.lottoTransactionId,
            'tb.lotto_transaction_code': element.lottoTransactionCode,
            'tb.username': element.username,
            'tb.lotto_class_code': element.lottoClassCode,
            'tb.lotto_kind_code': element.lottoKindCode,
            'tb.pay_cost': element.payCost,
            'tb.prize_cost': element.prizeCost,
            'tb.is_limit': element.isLimit,
            'tb.created_at': moment(element.createdAt).format('DD/MM/YYYY HH:mm:ss'),
            'tb.paid_by': element.paidBy,
            'tb.paid_at': moment(element.paidAt).format('DD/MM/YYYY HH:mm:ss') ? moment(element.paidAt).format('DD/MM/YYYY HH:mm:ss') : '-',
            'tb.lotto_group_transaction_code': element.lottoGroupTransactionCode,
            'tb.lotto_number': element.lottoNumber,
            'tb.status': element.status,
            'tb.update_wallet': element.updateWallet,
            'tb.installment': element.installment,
            'tb.number_correct': element.numberCorrect,
            'tb.prize_corroect': element.prizeCorrect,
            'tb.count_seq': element.countSeq,
            'tb.reject_remark': element.rejectRemark,
            data: element
          })
        });
        this.dataSource2 = arr
        this.lengthAll = data.data.recordsTotal
      }
    })
  }

  pageChange(event: PageChangeModel) {
    this.paginateReq.page = event.pageIndex
    this.paginateReq.length = event.pageSize
    console.log(this.paginateReq)
    this.getsearchConfirmTransation();
  }

  sortChange(event: SortChangeModel) {
    this.paginateReq.sort = [];
    if (event.direction) {
      const sort: PaginateSort = new PaginateSort();
      sort.column = event.active;
      sort.order = event.direction;
      this.paginateReq.sort.push(sort);
    }
    this.getsearchConfirmTransation();
  }

  pageAllChange(event: PageChangeModel) {
    this.paginateAllReq.page = event.pageIndex;
    this.paginateAllReq.length = event.pageSize;
    this.getsearchAllTransation();
  }

  sortAllChange(event: SortChangeModel) {
    this.paginateAllReq.sort = [];
    if (event.direction) {
      const sort: PaginateSort = new PaginateSort();
      sort.column = event.active;
      sort.order = event.direction;
      this.paginateAllReq.sort.push(sort);
    }
    this.getsearchAllTransation();
  }

  logSelection() {
    console.log(this.selection)
    this.selection.selected.forEach(s => console.log(s["tb.lotto_transaction_id"]));
  }

  submitBySelectButton(status, id) {
    this.ConfirmResultReq.transactionId = id
    this.ConfirmResultReq.status = status
    if (!status) {
      // กดปิด
      // status = confirm;
      let remark = '';
      const dialogRef = this.dialog.open(LottoRemarkComponent, {
        width: '250px',
        data: { remark }
      });
      console.log(remark)

      dialogRef.afterClosed().subscribe(result => {

        console.log('The dialog was closed', result);
        if (result) {
          this.ConfirmResultReq.remark = result;
          console.log(result)
          this.httpBean.doPost(`${URL.SUBMIT_BY_ID_TRANSACTION}`, this.ConfirmResultReq).subscribe(data => {
            if (data.status == "SUCCESS") {
              if (this.dataSource.length == 1) {
                this.paginator.pageIndex -= 1
                this.paginateReq.page -= 1
                this.loadList()
              }
              else if (this.length <= 1) {
                this.paginator.pageIndex = 0
                this.paginateReq.page = 0
                this.loadList()
              }
              else {
                this.loadList()
              }


            }
          })
        }
      });
    }
    else {
      DialogSweetAlertService.opentModalSweetAlertConfirm(
        'ยืนยันการทำรายการ',
        'คุณต้องการอนุมัติรายการนี้ ?',
        () => {
          this.httpBean.doPost(`${URL.SUBMIT_BY_ID_TRANSACTION}`, this.ConfirmResultReq).subscribe(data => {
            if (data.status == "SUCCESS") {
              if ((this.length - this.dataSource.length) < this.paginator.pageSize) {
                this.paginateReq.page = 0
                this.paginator.pageIndex = 0
                this.loadList()
              }
              else
              {
                if(this.dataSource.length!=1)
                {
                  this.loadList()
                }
                else
                {
                  this.paginateReq.page -= 1
                  this.paginator.pageIndex -= 1
                  this.loadList()
                }
              }

            }
          })
        });
    }
  }

  submitAllTransaction(status) {
    this.ConfirmResultReq.status = status
    console.log(this.ConfirmResultReq)
    if (!status) {
      // กดปิด
      // status = confirm;
      let remark = '';
      const dialogRef = this.dialog.open(LottoRemarkComponent, {
        width: '250px',
        data: { remark }
      });
      console.log(remark)

      dialogRef.afterClosed().subscribe(result => {

        console.log('The dialog was closed', result);
        if (result) {
          this.ConfirmResultReq.remark = result;
          console.log(result)
          this.httpBean.doPost(`${URL.SUBMIT_ALL_TRANSACTION}`, this.ConfirmResultReq).subscribe(data => {
            if (data.status == "SUCCESS") {
              this.loadList()
            }
          })
        }
      });
    }
    else {
      DialogSweetAlertService.opentModalSweetAlertConfirm(
        'ยืนยันการทำรายการ',
        'คุณต้องการอนุมัติรายการนี้ ?',
        () => {
          this.httpBean.doPost(`${URL.SUBMIT_ALL_TRANSACTION}`, this.ConfirmResultReq).subscribe(data => {
            if (data.status == "SUCCESS") {
              this.loadList()
            }
          })
        });
    }

  }

  test() {
    const idSelect: any = [];
    for (let i = 0; i < this.selection.selected.length; i++) {
      idSelect.push(this.selection.selected[i]);
    }
    console.log(this.selection)
    console.log(this.selecttionKeep)
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle($event) {
    this.selectAll = $event.checked
    this.selectAllTransaction = $event.checked
    if (!$event.checked) {
      this.selection.clear()
      this.selecttionKeep.clear()
      this.selectAll = false
    } else {
      this.selecttionKeep.clear()
      this.dataSource.forEach(row => {
        this.selection.select(row['tb.lotto_transaction_id'])
      });
    }
  }

  selectToggle($event, row) {
    console.log(row);
    if ($event.checked) {
      this.selection.select(row['tb.lotto_transaction_id'])
      this.selecttionKeep.deselect(row['tb.lotto_transaction_id'])
      this.numberSelect += 1
    }
    else {
      this.selection.deselect(row['tb.lotto_transaction_id'])
      this.selecttionKeep.select(row['tb.lotto_transaction_id'])
      this.numberSelect -= 1
    }
    this.checkedAll()
  }

  checkedAll() {
    if (this.selection.selected.length != this.length) {
      this.selectAll = false;
    }
    else {
      this.selectAll = true;
      this.selectAllTransaction = true
    }

  }

  submitSelect(status) {
    const idSelect: any = [];
    const idDisSelect: any = [];
    this.ConfirmResultReq.status = status

    if (this.selecttionKeep.selected.length) {
      this.selectAll = false
      this.selecttionKeep.selected.forEach(deselect => {
        this.selection.deselect(deselect)
      })
    }

    for (let i = 0; i < this.selection.selected.length; i++) {
      idSelect.push(this.selection.selected[i]);
    }

    this.ConfirmResultReq.transactionIdList = idSelect;

    console.log(this.ConfirmResultReq)

    if (this.selectAll) {
      this.submitAllTransaction(status)
    }
    else if(this.selectAllTransaction) 
    {
      for (let i = 0; i < this.selecttionKeep.selected.length; i++) {
        idDisSelect.push(this.selecttionKeep.selected[i]);
      }
      this.ConfirmResultReq.detransactionIdList = idDisSelect
      if (!status) {
        // กดปิด
        // status = confirm;
        let remark = '';
        const dialogRef = this.dialog.open(LottoRemarkComponent, {
          width: '250px',
          data: { remark }
        });
        console.log(remark)

        dialogRef.afterClosed().subscribe(result => {

          console.log('The dialog was closed', result);
          if (result) {
            this.ConfirmResultReq.remark = result;
            console.log(result)
            console.log(this.ConfirmResultReq)
            this.httpBean.doPost(`${URL.SUBMIT_DE_SELECT_TRANSACTION}`, this.ConfirmResultReq).subscribe(data => {
              if (this.dataSource.length == this.numberSelect) {
                this.paginateReq.page -= 1
                this.paginator.pageIndex -= 1
                this.loadList()
              }
              else {
                if ((this.length - this.selection.selected.length) < this.paginator.pageSize) {
                  this.paginateReq.page = 0
                  this.paginator.pageIndex = 0
                }
                this.loadList()
              }
            })
          }
        });
      }
      else {
        DialogSweetAlertService.opentModalSweetAlertConfirm(
          'ยืนยันการทำรายการ',
          'คุณต้องการอนุมัติรายการนี้ ?',
          () => {
            this.httpBean.doPost(`${URL.SUBMIT_DE_SELECT_TRANSACTION}`, this.ConfirmResultReq).subscribe(data => {
              if (data.status == "SUCCESS") {
                if (this.dataSource.length == this.numberSelect) {
                  this.paginateReq.page -= 1
                  this.paginator.pageIndex -= 1
                  this.loadList()
                }
                else {
                  if ((this.length - this.selection.selected.length) < this.paginator.pageSize) {
                    this.paginateReq.page = 0
                    this.paginator.pageIndex = 0
                  }
                  this.loadList()
                }
              }
            })
          });
      }
    }
    else
    {
      if (!status) {
        // กดปิด
        // status = confirm;
        let remark = '';
        const dialogRef = this.dialog.open(LottoRemarkComponent, {
          width: '250px',
          data: { remark }
        });
        console.log(remark)

        dialogRef.afterClosed().subscribe(result => {

          console.log('The dialog was closed', result);
          if (result) {
            this.ConfirmResultReq.remark = result;
            console.log(result)
            this.httpBean.doPost(`${URL.SUBMIT_SELECT_TRANSACTION}`, this.ConfirmResultReq).subscribe(data => {
              if (this.dataSource.length == this.numberSelect) {
                this.paginateReq.page -= 1
                this.paginator.pageIndex -= 1
                this.loadList()
              }
              else {
                if ((this.length - this.selection.selected.length) < this.paginator.pageSize) {
                  this.paginateReq.page = 0
                  this.paginator.pageIndex = 0
                }
                this.loadList()
              }
            })
          }
        });
      }
      else {
        DialogSweetAlertService.opentModalSweetAlertConfirm(
          'ยืนยันการทำรายการ',
          'คุณต้องการอนุมัติรายการนี้ ?',
          () => {
            this.httpBean.doPost(`${URL.SUBMIT_SELECT_TRANSACTION}`, this.ConfirmResultReq).subscribe(data => {
              if (data.status == "SUCCESS") {
                if (this.dataSource.length == this.numberSelect) {
                  this.paginateReq.page -= 1
                  this.paginator.pageIndex -= 1
                  this.loadList()
                }
                else {
                  if ((this.length - this.selection.selected.length) < this.paginator.pageSize) {
                    this.paginateReq.page = 0
                    this.paginator.pageIndex = 0
                  }
                  this.loadList()
                }
              }
            })
          });
      }
    }
  }
  test2() {
    console.log("SELECT ALL TRAN:",this.selectAllTransaction)
    console.log("SELECT ALL :",this.selectAll)
  }



} 
