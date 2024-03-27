import { element } from 'protractor';
import { PaginateFilter, PaginateSort } from './../../../models/PaginateRequest';
import { SortChangeModel } from './../../../models/MatTableChange';
import { PageChangeModel } from '../../../models/MatTableChange';
import { ActivatedRoute, Router } from '@angular/router';
import { BeanService } from './../../../service/BeanService.service';
import { Component, OnInit } from '@angular/core';
import { LottoConstants } from '../lotto-constants/lotto-constants';
import { ActionSetting, EditIcon } from 'src/app/models/ActionSettingModel';
import { PaginateRequest } from 'src/app/models/PaginateRequest';
import * as moment from 'moment';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';


const URL = {
  GET_ALL: 'transaction-group/get-all-transaction-group',
  GET_PAGINATE: 'transaction-group/paginate',
  GET_PAGINATE_ALL_TRANSACTION: 'transaction-group/paginate-all-transaction',
  GET_ALL_LOTTO_CLASS: 'transaction-group/get-all-dropdown-lotto-class',
  // GET_ALL:"transaction-group/get-transaction-detail-by-code/{groupCode}"
  GET_KIND: 'msd-lotto-kind/get-all-msd',
};

interface table {
  'lct.type_name': string;
  'lcl.class_name': string;
  'tb.lotto_group_transaction_code': string;
  'tb.installment': string;
  'tb.created_at': string;
  'tb.username': string;
  'tb.sum_group_bet': string; // number?
  // 'sumPrizeWin': number;
  'tb.status': string;
  'tb.roundYeekee':String;
}

interface tableAll {
  'tb.lotto_transaction_id': string;
  'tb.lotto_transaction_code': string;
  'tb.username': string;
  'tb.lotto_class_code': string;
  'tb.lotto_kind_code': string;
  'tb.pay_cost': number;
  'tb.prize_cost': number;
  'tb.is_limit': string;
  'tb.has_won': string;
  'tb.created_by': string;
  'tb.created_at': string;
  'tb.paid_by': string;
  'tb.paid_at': string;
  'tb.lotto_group_transaction_code': string;
  'mlk.msd_lotto_kind_name': String;
  'tb.lotto_number': string;
  'tb.status': string;
  'tb.update_wallet': number;
  'tb.installment': string;
  'tb.number_correct': string;
  'tb.prize_correct': number;
  'tb.count_seq': string;
  'tb.type_name': string;
  'lc.class_name': string;
  'tb.roundYeekee':string;
}


@Component({
  selector: 'app-lotto-history',
  templateUrl: './lotto-history.component.html',
  styleUrls: ['./lotto-history.component.scss']
})


export class LottoHistoryComponent implements OnInit {
  actionSetting: ActionSetting = new ActionSetting({});

  constructor(
    private httpBean: BeanService,
    private router: Router,
    private fromBuilder: FormBuilder
  ) {
    this.createFromGroupTransaction();
    this.createFromAllTransaction();
    this.actionSetting.hideDetail = false;
    this.actionSetting.hideDelete = false;
    this.actionSetting.hideEdit = false;

    this.actionSetting.listIcon = [];
    const Icon1: EditIcon = new EditIcon();
    Icon1.icon = 'visibility';
    Icon1.color = '#86dbe3';
    Icon1.action = (data) => {
      this.getLottoDetailPage(data);
    };
    this.actionSetting.listIcon.push(Icon1);
  }
  formFilter: FormGroup;
  formFillterAll: FormGroup;
  data: table[] = [];
  dataAll: tableAll[] = [];
  listKind = [];

  columns: any = [
    { header: 'Lotto Category', field: 'lct.type_name' },
    { header: 'Lotto Name', field: 'lcl.class_name' },
    { header: 'Transaction Group Code', field: 'tb.lotto_group_transaction_code' },
    { header: 'Installment', field: 'tb.installment' },
    { header: 'Round', field: 'tb.roundYeekee' },
    { header: 'Create At Day/Time', field: 'tb.created_at' },
    { header: 'Username', field: 'tb.username' },
    { header: 'Sum bet', field: 'tb.sum_group_bet', type:'pipeNumber' },
    { header: 'Prize win', field: 'sumPrizeWin', type:'pipeNumber' },
    { header: 'Status', field: 'tb.status' },

  ];

  tr: any = [
    'lct.type_name',
    'lcl.class_name',
    'tb.lotto_group_transaction_code',
    'tb.installment',
    'tb.roundYeekee',
    'tb.created_at',
    'tb.username',
    'tb.sum_group_bet',
    // 'sumPrizeWin',
    'tb.status',
    'action',
  ];

  columns2: any = [
    { header: 'Lotto Category', field: 'tb.type_name' },
    { header: 'Lotto Name', field: 'lc.class_name' },
    { header: 'Transaction Group Code', field: 'tb.lotto_group_transaction_code' },
    { header: 'Order', field: 'tb.count_seq' },
    { header: 'Installment', field: 'tb.installment' },
    { header: 'Round', field: 'tb.roundYeekee' },
    { header: 'Create At Day/Time', field: 'tb.created_at' },
    { header: 'Username', field: 'tb.username' },
    { header: 'Lotto Kind Name', field: 'mlk.msd_lotto_kind_name' },
    { header: 'Lotto Number', field: 'tb.lotto_number' },
    { header: 'Pay Cost', field: 'tb.pay_cost',type:'pipeNumber' },
    { header: 'Prize Cost', field: 'tb.prize_cost',type:'pipeNumber' },
    { header: 'Correct Number', field: 'tb.number_correct' },
    { header: 'Prize Correct', field: 'tb.prize_correct',type:'pipeNumber' },
    { header: 'Status', field: 'tb.status' },

  ];

  tr2: any = [
    'tb.type_name',
    'lc.class_name',
    'tb.lotto_group_transaction_code',
    'tb.count_seq',
    'tb.installment',
    'tb.roundYeekee',
    'tb.username',
    'mlk.msd_lotto_kind_name',
    'tb.lotto_number',
    'tb.pay_cost',
    'tb.prize_cost',
    'tb.number_correct',
    'tb.prize_correct',
    'tb.created_at',
    'tb.status',
  ];

  length = 0;
  lengthAll = 0;
  paginateReq: PaginateRequest = new PaginateRequest();
  paginateAllReq: PaginateRequest = new PaginateRequest();
  paginateSort: PaginateSort = new PaginateSort();
  paginateAllSort: PaginateSort = new PaginateSort();

  lottoClassCode;
  ngOnInit(): void {
    this.loadTabHistory();
    this.getLottoClass();
    this.getKind();
  }

  getKind() {
    this.httpBean.doGet(URL.GET_KIND).subscribe((data) => {
      this.listKind = data?.data ?? [];
    });
  }

  createFromGroupTransaction() {
    this.formFilter = this.fromBuilder.group({
      selected: '',
      selectedClassCode: '',
      selectedCategory: '',
      usernameSearch: [null],
      installmentSearch: [null],
      transactionGroupSearch: [null],
      roundNumber:[null],
    });
  }

  createFromAllTransaction() {
    this.formFillterAll = this.fromBuilder.group({
      selected: '',
      selectedClassCode: '',
      selectedCategory: '',
      selectedKindCode: '',
      usernameSearch: [null],
      lottoNumberSearch: [null],
      installmentSearch: [null],
      transactionCodeSearch: [null],
      roundNumber:[null],
    });
  }

  loadTabHistory() {
    this.loadGroupTransaction();
    this.loadAllTransaction();
  }

  loadGroupTransaction() {
    this.paginateReq.sort = [];
    this.paginateSort.column = 'tb.created_at';
    this.paginateSort.order = 'desc';
    this.paginateReq.sort.push(this.paginateSort);
    this.getPaginateGroupTransation();
  }

  loadAllTransaction() {
    this.paginateAllReq.sort = [];
    this.paginateAllSort.column = 'tb.created_at';
    this.paginateAllSort.order = 'desc';
    this.paginateAllReq.sort.push(this.paginateAllSort);
    this.getPaginateAllTransation();
  }

  getLottoDetailPage(data) {
    this.router.navigate(['lotto-settings/lotto-history/lotto-history-detail'],
      { queryParams: { lottoClassCode: data['tb.lotto_group_transaction_code'], username: data['tb.username'] } });
  }

  getLottoClass() {
    this.httpBean.doGet(URL.GET_ALL_LOTTO_CLASS).subscribe(data => {
      console.log(data);
      this.lottoClassCode = data.data;
    });
  }

  getPaginateGroupTransation() {
    this.data = [];
    let wordFilter: PaginateFilter = new PaginateFilter();
    this.paginateReq.filter = [];
    if (this.formFilter.controls.selected.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.status';
      wordFilter.op = 'contain';
      wordFilter.value = this.formFilter.controls.selected.value;
      this.paginateReq.filter.push(wordFilter);
    }

    if (this.formFilter.controls.usernameSearch.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.username';
      wordFilter.op = 'contain';
      wordFilter.value = this.formFilter.controls.usernameSearch.value;
      this.paginateReq.filter.push(wordFilter);
    }

    if (this.formFilter.controls.installmentSearch.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.installment';
      wordFilter.op = 'contain';
      wordFilter.value = this.formFilter.controls.installmentSearch.value;
      this.paginateReq.filter.push(wordFilter);
    }

    if (this.formFilter.controls.transactionGroupSearch.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.lotto_group_transaction_code';
      wordFilter.op = 'contain';
      wordFilter.value = this.formFilter.controls.transactionGroupSearch.value;
      this.paginateReq.filter.push(wordFilter);
    }
    if (this.formFilter.controls.selectedCategory.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'lcl.lotto_category_code';
      wordFilter.op = 'contain';
      wordFilter.value = this.formFilter.controls.selectedCategory.value;
      this.paginateReq.filter.push(wordFilter);
    }
    if (this.formFilter.controls.selectedClassCode.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.lotto_class_code';
      wordFilter.op = 'contain';
      wordFilter.value = this.formFilter.controls.selectedClassCode.value;
      this.paginateReq.filter.push(wordFilter);
    }
    if (this.formFilter.controls.roundNumber.value) {
      wordFilter = new PaginateFilter();
      wordFilter.column = 'tb.round_yeekee';
      wordFilter.op = 'contain';
      wordFilter.value = this.formFilter.controls.roundNumber.value;
      this.paginateReq.filter.push(wordFilter);
    }



    this.httpBean.doPost(URL.GET_PAGINATE, this.paginateReq).subscribe(data => {
      if (data.status === 'SUCCESS') {
        const arr: table[] = [];
        const element = data.data.data 
        for(let i =0;i<element.length;i++)
        {
          arr.push({
            'lct.type_name': element[i].typeName,
            'lcl.class_name': element[i].className,
            'tb.lotto_group_transaction_code': element[i].lottoGroupTransactionCode,
            'tb.installment': element[i].installment,
            'tb.created_at': moment(element[i].createdAt).format('DD/MM/YYYY HH:mm:ss'),
            'tb.username': element[i].username,
            'tb.sum_group_bet': element[i].sumGroupBet,
            // 'sumPrizeWin',
            'tb.status': element[i].status,
            'tb.roundYeekee':element[i].roundYeekee??'-',
          });
        }
        // data.data.data.forEach(element => {
          
        // });
        this.data = arr;
        this.length = data.data.recordsTotal;
      }
    });
  }

  getPaginateAllTransation() {
    this.dataAll = [];
    let wordFilterAll: PaginateFilter = new PaginateFilter();
    this.paginateAllReq.filter = [];
    if (this.formFillterAll.controls.selected.value) {
      wordFilterAll = new PaginateFilter();
      wordFilterAll.column = 'tb.status';
      wordFilterAll.op = 'contain';
      wordFilterAll.value = this.formFillterAll.controls.selected.value;
      this.paginateAllReq.filter.push(wordFilterAll);
    }

    if (this.formFillterAll.controls.usernameSearch.value) {
      wordFilterAll = new PaginateFilter();
      wordFilterAll.column = 'tb.username';
      wordFilterAll.op = 'contain';
      wordFilterAll.value = this.formFillterAll.controls.usernameSearch.value;
      this.paginateAllReq.filter.push(wordFilterAll);
    }
    if (this.formFillterAll.controls.lottoNumberSearch.value) {
      wordFilterAll = new PaginateFilter();
      wordFilterAll.column = 'tb.lotto_number';
      wordFilterAll.op = 'contain';
      wordFilterAll.value = this.formFillterAll.controls.lottoNumberSearch.value;
      this.paginateAllReq.filter.push(wordFilterAll);
    }

    if (this.formFillterAll.controls.installmentSearch.value) {
      wordFilterAll = new PaginateFilter();
      wordFilterAll.column = 'tb.installment';
      wordFilterAll.op = 'contain';
      wordFilterAll.value = this.formFillterAll.controls.installmentSearch.value;
      this.paginateAllReq.filter.push(wordFilterAll);
    }

    if (this.formFillterAll.controls.transactionCodeSearch.value) {
      wordFilterAll = new PaginateFilter();
      wordFilterAll.column = 'tb.lotto_group_transaction_code';
      wordFilterAll.op = 'contain';
      wordFilterAll.value = this.formFillterAll.controls.transactionCodeSearch.value;
      this.paginateAllReq.filter.push(wordFilterAll);
    }
    if (this.formFillterAll.controls.selectedCategory.value) {
      wordFilterAll = new PaginateFilter();
      wordFilterAll.column = 'lcl.lotto_category_code';
      wordFilterAll.op = 'contain';
      wordFilterAll.value = this.formFillterAll.controls.selectedCategory.value;
      this.paginateAllReq.filter.push(wordFilterAll);
    }
    if (this.formFillterAll.controls.selectedClassCode.value) {
      wordFilterAll = new PaginateFilter();
      wordFilterAll.column = 'tb.lotto_class_code';
      wordFilterAll.op = 'contain';
      wordFilterAll.value = this.formFillterAll.controls.selectedClassCode.value;
      this.paginateAllReq.filter.push(wordFilterAll);
    }
    if (this.formFillterAll.controls.selectedKindCode.value) {
      wordFilterAll = new PaginateFilter();
      wordFilterAll.column = 'tb.lotto_kind_code';
      wordFilterAll.op = 'contain';
      wordFilterAll.value = this.formFillterAll.controls.selectedKindCode.value;
      this.paginateAllReq.filter.push(wordFilterAll);
    }
    if (this.formFillterAll.controls.roundNumber.value) {
      wordFilterAll = new PaginateFilter();
      wordFilterAll.column = 'tb.round_yeekee';
      wordFilterAll.op = 'contain';
      wordFilterAll.value = this.formFillterAll.controls.roundNumber.value;
      this.paginateAllReq.filter.push(wordFilterAll);
    }


    this.httpBean.doPost(URL.GET_PAGINATE_ALL_TRANSACTION, this.paginateAllReq).subscribe(data => {
      if (data.status === 'SUCCESS') {
        const arr: tableAll[] = [];
        const element = data.data.data 
        for(let i =0;i<element.length;i++)
        {
          arr.push({
            'tb.lotto_transaction_id': element[i].lottoTransactionId,
            'tb.lotto_transaction_code': element[i].lottoTransactionCode,
            'tb.username': element[i].username,
            'tb.lotto_class_code': element[i].lottoClassCode,
            'lc.class_name': element[i].lottoClassName,
            'tb.lotto_kind_code': element[i].lottoKindCode,
            'mlk.msd_lotto_kind_name': element[i].msdLottoKindName,
            'tb.pay_cost': element[i].payCost,
            'tb.prize_cost': element[i].prizeCost,
            'tb.is_limit': element[i].isLimit,
            'tb.has_won': element[i].hasWon,
            'tb.created_by': element[i].createdBy,
            'tb.created_at': moment(element[i].createdAt).format('DD/MM/YYYY HH:mm:ss'),
            'tb.paid_by': element[i].paidBy,
            'tb.paid_at': element[i].paidAt,
            'tb.lotto_group_transaction_code': element[i].lottoGroupTransactionCode,
            'tb.lotto_number': element[i].lottoNumber,
            'tb.status': element[i].status,
            'tb.update_wallet': element[i].updateWallet,
            'tb.installment': element[i].installment,
            'tb.number_correct': (!element[i].numberCorrect) ? '-' : element[i].numberCorrect,
            'tb.prize_correct': element[i].prizeCorrec || element[i].status!='WIN' || element[i].status!='SEQWIN'?'0':element[i].prizeCorrect,
            'tb.count_seq': element[i].countSeq,
            'tb.type_name': element[i].typeName,
            'tb.roundYeekee':element[i].roundYeekee??'-',
          });
        }
        this.dataAll = arr;
        this.lengthAll = data.data.recordsTotal;
      }
    });
  }
  resetSearch() {
    this.createFromGroupTransaction();
    this.getPaginateGroupTransation();
  }

  resetSearchAll() {
    this.createFromAllTransaction();
    this.getPaginateAllTransation();
  }



  pageChange(event: PageChangeModel) {
    this.paginateReq.page = event.pageIndex;
    this.paginateReq.length = event.pageSize;
    this.getPaginateGroupTransation();
  }

  sortChange(event: SortChangeModel) {
    this.paginateReq.sort = [];
    if (event.direction) {
      const sort: PaginateSort = new PaginateSort();
      sort.column = event.active;
      sort.order = event.direction;
      this.paginateReq.sort.push(sort);
    }
    this.getPaginateGroupTransation();
  }

  pageAllChange(event: PageChangeModel) {
    this.paginateAllReq.page = event.pageIndex;
    this.paginateAllReq.length = event.pageSize;
    this.getPaginateAllTransation();
  }

  sortAllChange(event: SortChangeModel) {
    this.paginateAllReq.sort = [];
    if (event.direction) {
      const sort: PaginateSort = new PaginateSort();
      sort.column = event.active;
      sort.order = event.direction;
      this.paginateAllReq.sort.push(sort);
    }
    this.getPaginateAllTransation();
  }

}
