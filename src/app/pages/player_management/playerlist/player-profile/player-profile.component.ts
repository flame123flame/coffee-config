import { DialogSweetAlertService } from './../../../../service/DialogSweetAlert.service';
import { MatDatePickerService } from './../../../../service/MatDatePickerService.service';
import { FormControl, Validators } from '@angular/forms';
import {
  GameProviderRes,
  productTypeRes,
} from './../../../rebate_management/rebate-setting-new-add/rebate-setting-new-add.component';
import { MessageService } from './../../../../service/message.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseService } from './../../../../service/BaseService.service';
import * as moment from 'moment';
import {
  FilterOp,
  PaginateFilter,
  PaginateRequest,
  PaginateSort,
} from 'src/app/models/PaginateRequest';
import {
  PageChangeModel,
  SortChangeModel,
} from 'src/app/models/MatTableChange';
import { RequestRespond } from 'src/app/models/RequestRespond';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
const URL = {
  GET_CUSTOMER_BY_ID: 'customer/get-customer-by-id/',
  GET_WALLET: 'wallet/get-all-wallet/',
  GET_PROMOTION: 'promotion/get-promotion-by-username/',
  GET_WITHDRAW_CONDITION: 'withdraw-condition/get-withdraw-condition',
  GET_TRANSACTION_GAME: 'transaction/get-transaction-game',
  GET_TRANSACTION_LOG: 'transaction/get-transaction-log',
  GET_DROPDOWN_GROUP: 'groupLevel/get-dropdown-group',
  GET_DROPDOWN_TAG: 'tag-management',
  SAVE_TAG: 'customer/change-tag',
  SAVE_GROUP: 'customer/change-group/',
  GET_ALL_PROVIDER: 'game-provider/get-provider-list',
  GET_DEPOSIT_INFORMATION: 'deposit-information/get-by-username',
  GET_WITHDRAWAL_INFORMATION: 'withdrawal-information/get-by-username',
  GET_BONUS_INFORMATION: 'bonus-information/get-by-username',
  GET_TOTAL_INFORMATION: 'provider-summary/get-by-username',
  CHANGE_STATUS_WITHDRAW_CONDITION:
    'withdraw-condition/change-status-withdraw-condition',
  GET_DROPDOWN_BANK: 'bank/get-bank-all',
  SAVE_BANK: 'customer/change-bank',
  SAVE_BANK_ACCOUNT: 'customer/change-bank-account',
  SAVE_ACCOUNT_NAME: 'customer/change-account-name',
};
@Component({
  selector: 'app-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.scss'],
})
export class PlayerProfileComponent implements OnInit {
  constructor(
    private router: Router,
    private httpService: BaseService,
    private route: ActivatedRoute
  ) {}
  profileInfo: any = {};
  bankInfo: any = {};
  walletInfo: any[] = [];
  promoInfo: any = {};

  gameCol = [
    { header: 'Ticket ID', field: 'gameSessionId' },
    { header: 'Bet time', field: 'createdDate' },
    { header: 'Game Provider', field: 'gameProvider' },
    { header: 'Product Type', field: 'productType' },
    // { header: "Game Group", field: 'gameGroup' },
    { header: 'Game', field: 'gameName' },
    { header: 'Total Bets', field: 'totalBet' },
    { header: 'Valid Bets', field: 'validBet' },
    { header: 'Win/Loss', field: 'winLoss' },
    // { header: "Result Status", field: 'resultStatus' },
  ];
  gameTr: any = [
    'gameSessionId',
    'createdDate',
    'gameProvider',
    'productType',
    // 'gameGroup',
    'gameName',
    'totalBet',
    'validBet',
    'winLoss',
    // 'resultStatus',
  ];
  gameData = [];

  transactionCol = [
    { header: 'Transaction Time', field: 'transactionTime' },
    { header: 'Transaction Type', field: 'transactionType' },
    { header: 'Player', field: 'player' },
    { header: 'Subwallet', field: 'subwallet' },
    { header: 'Transaction Amount', field: 'transactionAmount' },
    { header: 'Before Balance', field: 'beforeBalance' },
    { header: 'After Balance', field: 'afterBalance' },
    { header: 'Remark', field: 'remark' },
    { header: 'ActionBy', field: 'createdBy' },
  ];
  transactionTr: any = [
    'transactionTime',
    'transactionType',
    'player',
    'subwallet',
    'transactionAmount',
    'beforeBalance',
    'afterBalance',
    'remark',
    'createdBy',
  ];
  transactionData = [];

  withdrawalCol = [
    { header: 'Started At', field: 'createdDate' },
    { header: 'Condition Type', field: 'conditionType' },
    { header: 'Current Turnover', field: 'currentTurnover' },
    { header: 'Target Turnover', field: 'targetTurnover' },
    { header: 'Promotion Name', field: 'promoTitle' },
    { header: 'Username', field: 'username' },
    { header: 'Condition Status', field: 'conditionStatus' },
    { header: 'Created By', field: 'createdBy' },
    { header: 'Remark', field: 'remark' },
  ];
  withdrawalTr: any = [
    'createdDate',
    'conditionType',
    'currentTurnover',
    'targetTurnover',
    'promoTitle',
    'username',
    'conditionStatus',
    'createdBy',
    'remark',
    'action',
  ];
  withdrawalData = [];
  actionSettingWithdrawal: ActionSetting = new ActionSetting({
    type: 'choice',
    textConfirm: 'Pass',
    // onCancel: (data) => {
    //   // this.changeStatus(data, 'REJECT');
    // },
    onConfirm: (data) => {
      this.changeStatusWithdrawal(data, 'PASS');
    },
    showFunction: (row) => {
      if (row['conditionStatus'] == 'NOT_PASS') {
        return true;
      }
      return false;
    },
  });

  editGroupType = true;
  groupCode = new FormControl(null, Validators.required);
  vipGroupOptions = [];

  editTagType = true;
  tagCode = new FormControl(null, Validators.required);
  tagOptions = [];

  editBankType = true;
  bankCode = new FormControl(null, Validators.required);
  bankOptions = [];

  editBankAccountType = true;
  bankAccount = new FormControl(null, Validators.required);

  editAccountNameType = true;
  accountName = new FormControl(null, Validators.required);

  tempUsername: any;

  gamesLength: number = 0;
  transactionGamePg: PaginateRequest = new PaginateRequest();

  logLength: number = 0;
  transactionLogPg: PaginateRequest = new PaginateRequest();

  withdrawalLength: number = 0;
  withdrawalPg: PaginateRequest = new PaginateRequest();

  gameLogSearch = {
    dateFrom: null,
    dateTo: null,
    provider: null,
  };

  gameTransectionLogSearch = {
    dateFrom: null,
    dateTo: null,
    type: null,
  };

  ngOnInit(): void {
    const username = this.route.snapshot.queryParams['username'];
    if (username != null) {
      this.tempUsername = username;
      this.getDropDownGroup();
      this.getDropDownTag();
      this.getDropDownProvider();
      this.dropdownBank();
      this.getById(username);
      this.getWalleByUsername(username);
      this.getPromotion(username);
      this.getDepositInformation(username);
      this.getWithdrawalInformation(username);
      this.getBonusInformation(username);
      this.getTotalInformation(username);
      this.getWithdrawalCondition();
      this.getTransactionGame();
      this.getTransactionLog();
    }
  }

  getById(username) {
    this.httpService
      .doGet(URL.GET_CUSTOMER_BY_ID + username)
      .subscribe((res) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          this.profileInfo = res.data;
          this.profileInfo.affiliateCode =
            this.profileInfo.affiliateCode ?? '-';
          this.profileInfo.affiliateCodeUp =
            this.profileInfo.affiliateCodeUp ?? '-';
          this.profileInfo.groupName = this.profileInfo.groupName ?? '-';
          this.profileInfo.tagName = this.profileInfo.tagName ?? '-';
          this.profileInfo.loginStatus =
            this.profileInfo.loginStatus == true ? 'Online' : 'Offline';
          this.profileInfo.realName = this.profileInfo.realName ?? '-';
          this.bankInfo.bankNameTh = res.data.bankNameTh ?? '-';
          this.bankInfo.bankNameEn = res.data.bankNameEn ?? '-';
          this.bankInfo.bankCode = res.data.bankCode ?? '-';
          this.bankInfo.bankAccount = res.data.bankAccount ?? '-';
          this.bankInfo.realName = res.data.realName ?? '-';
        }
        console.log(this.bankInfo);
      });
  }

  walletTr = ['wallet', 'cashBalance', 'bonus', 'availableBalance'];
  walletCol = [
    { header: 'Wallet', field: 'wallet' },
    { header: 'Cash Balance', field: 'cashBalance' },
    { header: 'Bonus', field: 'bonus' },
    { header: 'Available Balance', field: 'availableBalance' },
  ];
  getWalleByUsername(username) {
    this.httpService.doGet(URL.GET_WALLET + username).subscribe((res) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        this.walletInfo = res.data.map((ele) => {
          return {
            wallet: ele.walletName,
            cashBalance: ele.balance,
            bonus: ele.bonus,
            availableBalance: ele.balance,
          };
        });
      }
    });
  }

  getPromotion(username) {
    this.httpService.doGet(URL.GET_PROMOTION + username).subscribe((res) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        this.promoInfo = res.data;
        this.promoInfo.dateActive = this.promoInfo.dateActive
          ? moment(this.promoInfo.dateActive).format('YYYY-MM-DD HH:mm:ss')
          : '-';
        // this.promoInfo = res.data.map(data => {
        //   return {
        //     promoTitle: data.promotion.promoTitle ?? '-',
        //     status: data.status ?? '-',
        //     dateActive: data.dateActive ? moment(data.dateActive).format('YYYY-MM-DD hh:mm:ss') : '-',
        //     deskBanner: data.postSetting?.deskBanner ?? '-',
        //   }
        // });
        // this.promoInfo.promoTitle = res.data.promotion.promoTitle;
        // this.promoInfo.createdDate = moment(this.promoInfo.createdDate).format('YYYY-MM-DD HH:mm:ss')
        // this.promoInfo = [
        //   { title: 'Promotion Name', value: res?.data?.promotion?.promoTitle ?? '-' },
        //   { title: 'Status', value: res?.data?.status ?? '-' },
        //   { title: 'Date Active', value: res?.data?.dateActive != null ? moment(res?.data?.dateActive).format('YYYY-MM-DD hh:mm:ss') : '-' },
        //   { title: '', value: res?.data.postSetting?.deskBanner }
        // ]
        // console.log(this.promoInfo);
      }
    });
  }

  getTransactionGame() {
    this.transactionGamePg.filter = [];
    const wordFilter: PaginateFilter = new PaginateFilter();
    wordFilter.column = 'username';
    wordFilter.op = FilterOp.EQUAL;
    wordFilter.value = this.tempUsername;
    this.transactionGamePg.filter.push(wordFilter);

    if (this.gameLogSearch.dateFrom) {
      const filter: PaginateFilter = new PaginateFilter();
      filter.column = 'created_date';
      filter.op = FilterOp.MORE_EQUAL;
      filter.value = MatDatePickerService.fixDateReduceOneDay(
        this.gameLogSearch.dateFrom,
        MatDatePickerService.DateOption.START_OF_DAY
      );
      this.transactionGamePg.filter.push(filter);
    }
    if (this.gameLogSearch.dateTo) {
      const filter: PaginateFilter = new PaginateFilter();
      filter.column = 'created_date';
      filter.op = FilterOp.LESS_EQUAL;
      filter.value = MatDatePickerService.fixDateReduceOneDay(
        this.gameLogSearch.dateTo,
        MatDatePickerService.DateOption.END_OF_DAY
      );
      this.transactionGamePg.filter.push(filter);
    }
    if (this.gameLogSearch.provider) {
      const filter: PaginateFilter = new PaginateFilter();
      filter.column = 'game_provider';
      filter.op = FilterOp.EQUAL;
      filter.value = this.gameLogSearch.provider;
      this.transactionGamePg.filter.push(filter);
    }

    this.httpService
      .doPost(URL.GET_TRANSACTION_GAME, this.transactionGamePg)
      .subscribe((res) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          this.gameData = res.data.data.map((data, idx) => {
            return {
              gameSessionId: data.gameSessionId ?? '-',
              createdDate: moment(data.createdDate).format(
                'YYYY-MM-DD HH:mm:ss'
              ),
              gameProvider: data.gameProvider ?? '-',
              productType: data.gameProductType?.nameEn ?? '-',
              // gameGroup: data.gameGroup?.nameEn ?? '-',
              gameName: data.games?.displayName ?? '-',
              totalBet:
                data?.bet?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) ?? '0.00',
              validBet:
                data?.bet?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) ?? '0.00',
              winLoss:
                data?.winLoss?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) ?? '0.00',
            };
          });
          this.gamesLength = res.data.recordsTotal;
        }
      });
  }
  pageGameChange(event: PageChangeModel) {
    this.transactionGamePg.page = event.pageIndex;
    this.transactionGamePg.length = event.pageSize;
    this.getTransactionGame();
  }

  resetGameLogSearch() {
    this.gameLogSearch = {
      dateFrom: null,
      dateTo: null,
      provider: null,
    };
  }
  resetTransactionLogSearch() {
    this.gameTransectionLogSearch = {
      dateFrom: null,
      dateTo: null,
      type: null,
    };
  }

  sortGameChange(event: SortChangeModel) {
    this.transactionGamePg.sort = [];
    if (event.direction) {
      const sort: PaginateSort = new PaginateSort();
      sort.column = this.convertCaseToSnake(event.active);
      sort.order = event.direction;
      this.transactionGamePg.sort.push(sort);
    }
    this.getTransactionGame();
  }

  convertCaseToSnake(str: string) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  getTransactionLog() {
    this.transactionLogPg.filter = [];
    const wordFilter: PaginateFilter = new PaginateFilter();
    wordFilter.column = 'username';
    wordFilter.op = FilterOp.EQUAL;
    wordFilter.value = this.tempUsername;
    this.transactionLogPg.filter.push(wordFilter);

    if (this.gameTransectionLogSearch.dateFrom) {
      const filter: PaginateFilter = new PaginateFilter();
      filter.column = 'created_date';
      filter.op = FilterOp.MORE_EQUAL;
      filter.value = MatDatePickerService.fixDateReduceOneDay(
        this.gameTransectionLogSearch.dateFrom,
        MatDatePickerService.DateOption.START_OF_DAY
      );
      this.transactionLogPg.filter.push(filter);
    }
    if (this.gameTransectionLogSearch.dateTo) {
      const filter: PaginateFilter = new PaginateFilter();
      filter.column = 'created_date';
      filter.op = FilterOp.LESS_EQUAL;
      filter.value = MatDatePickerService.fixDateReduceOneDay(
        this.gameTransectionLogSearch.dateTo,
        MatDatePickerService.DateOption.END_OF_DAY
      );
      this.transactionLogPg.filter.push(filter);
    }
    if (this.gameTransectionLogSearch.type) {
      const filter: PaginateFilter = new PaginateFilter();
      filter.column = 'transaction_type';
      filter.op = FilterOp.EQUAL;
      filter.value = this.gameTransectionLogSearch.type;
      this.transactionLogPg.filter.push(filter);
    }
    this.httpService
      .doPost(URL.GET_TRANSACTION_LOG, this.transactionLogPg)
      .subscribe((res) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          this.transactionData = res.data.data.map((data, idx) => {
            return {
              transactionTime: moment(data.transactionDate).format(
                'YYYY-MM-DD HH:mm:ss'
              ),
              transactionType: data.transactionType,
              player: data.username,
              subwallet: data.subWallet,
              transactionAmount: data.transactionAmount.toLocaleString(
                undefined,
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              ),
              beforeBalance: data.beforeBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              afterBalance: data.afterBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              remark: data.remark ? data.remark : '-',
              createdBy: data.createdBy,
            };
          });
          this.logLength = res.data.recordsTotal;
        }
      });
  }

  pageLogChange(event: PageChangeModel) {
    this.transactionLogPg.page = event.pageIndex;
    this.transactionLogPg.length = event.pageSize;
    this.getTransactionLog();
  }

  sortLogChange(event: SortChangeModel) {
    this.transactionLogPg.sort = [];
    if (event.direction) {
      const sort: PaginateSort = new PaginateSort();
      sort.column = event.active;
      sort.order = event.direction;
      this.transactionLogPg.sort.push(sort);
    }
    this.getTransactionLog();
  }

  getWithdrawalCondition() {
    const wordFilter: PaginateFilter = new PaginateFilter();
    wordFilter.column = 'username';
    wordFilter.op = ' = ';
    wordFilter.value = this.tempUsername;
    this.withdrawalPg.filter.push(wordFilter);
    this.httpService
      .doPost(URL.GET_WITHDRAW_CONDITION, this.withdrawalPg)
      .subscribe((res) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          this.withdrawalData = res.data.data.map((data, idx) => {
            return {
              createdDate: moment(data.createdDate).format(
                'YYYY-MM-DD HH:mm:ss'
              ),
              conditionType: data.conditionType,
              currentTurnover: data.currentTurnover.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              targetTurnover: data.targetTurnover.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              promoTitle: data?.promotion?.promoTitle ?? '-',
              username: data.username,
              conditionStatus: data.conditionStatus,
              createdBy: data.createdBy,
              remark: data.remark ?? '-',
            };
          });
          this.withdrawalLength = res.data.recordsTotal;
        }
      });
  }
  pagewithdrawalChange(event: PageChangeModel) {
    this.withdrawalPg.page = event.pageIndex;
    this.withdrawalPg.length = event.pageSize;
    this.getWithdrawalCondition();
  }
  sortwithdrawalChange(event: SortChangeModel) {
    this.withdrawalPg.sort = [];
    if (event.direction) {
      const sort: PaginateSort = new PaginateSort();
      sort.column = event.active;
      sort.order = event.direction;
      this.withdrawalPg.sort.push(sort);
    }
    this.getWithdrawalCondition();
  }

  depositInformation = null;
  withdrawalInformation = null;
  bonusInformation = null;
  totalInformation = {
    totalBets: 0,
    totalValidBets: 0,
    winLoss: 0,
    totalJpWinLoss: 0,
    totalProfit: 0,
  };
  getDepositInformation(username) {
    this.httpService
      .doGet(`${URL.GET_DEPOSIT_INFORMATION}/${username}`)
      .subscribe((res) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          this.depositInformation = res.data;
        }
      });
  }
  getWithdrawalInformation(username) {
    this.httpService
      .doGet(`${URL.GET_WITHDRAWAL_INFORMATION}/${username}`)
      .subscribe((res) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          this.withdrawalInformation = res.data;
        }
      });
  }
  getBonusInformation(username) {
    this.httpService
      .doGet(`${URL.GET_BONUS_INFORMATION}/${username}`)
      .subscribe((res) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          this.bonusInformation = res.data;
        }
      });
  }
  getTotalInformation(username) {
    this.httpService
      .doGet(`${URL.GET_TOTAL_INFORMATION}/${username}`)
      .subscribe((res: RequestRespond<any[]>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          this.totalInformation.totalBets = res.data.reduce((pre, cur) => {
            return pre + cur.totalValidsBet;
          }, 0);
          this.totalInformation.totalValidBets = res.data.reduce((pre, cur) => {
            return pre + cur.totalStake;
          }, 0);
          this.totalInformation.winLoss = res.data.reduce((pre, cur) => {
            return pre + cur.winLoss;
          }, 0);
        }
      });
  }
  getDropDownGroup() {
    this.httpService.doGet(URL.GET_DROPDOWN_GROUP).subscribe((res) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        this.vipGroupOptions = res.data;
      }
    });
  }
  transectionList = [
    { display: 'DEPOSIT', code: 'DEPOSIT' },
    { display: 'MANUAL ADD', code: 'MANUAL_ADD' },
    { display: 'PROMOTION BALANCE', code: 'PROMOTION_BALANCE' },
    { display: 'PROMOTION BONUS', code: 'PROMOTION_BONUS' },
    { display: 'WITHDRAW', code: 'WITHDRAW' },
    { display: 'WITHDRAW AF', code: 'WITHDRAW_AF' },
    { display: 'MANUAL SUB', code: 'MANUAL_SUB' },
    { display: 'REBATE', code: 'REBATE' },
    { display: 'CASHBACK', code: 'CASHBACK' },
    { display: 'TRANFER TO SUB', code: 'TRANFER_TO_SUB' },
    { display: 'TRANFER TO MAIN', code: 'TRANFER_TO_MAIN' },
  ];
  providerList = [];
  getDropDownProvider() {
    this.httpService.doGet(URL.GET_ALL_PROVIDER).subscribe((res) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        this.providerList = res.data;
      }
    });
  }

  editGroup(code) {
    console.log(code);
    this.editGroupType = false;
    this.groupCode.setValue(code);
  }
  cancelGroup() {
    this.editGroupType = true;
    this.groupCode.reset();
  }
  saveGroup(data) {
    console.log(data.value, this.tempUsername);
    DialogSweetAlertService.opentModalSweetAlertConfirm(
      '',
      MessageService.DIALOGMSGCONFIRM.SAVE,
      () => {
        this.httpService
          .doPut(URL.SAVE_GROUP, {
            groupCode: data.value,
            username: this.tempUsername,
          })
          .subscribe((res) => {
            if (MessageService.MSG.SUCCESS === res.status) {
              DialogSweetAlertService.opentModalSweetAlertSuccess(
                '',
                res.message
              );
              this.getById(this.tempUsername);
              this.editGroupType = true;
            } else {
              DialogSweetAlertService.opentModalSweetAlertError(
                '',
                res.message
              );
            }
          });
      }
    );
  }

  getDropDownTag() {
    this.httpService.doGet(URL.GET_DROPDOWN_TAG).subscribe((res) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        this.tagOptions = res.data;
      }
    });
  }
  editTag(code) {
    console.log(code);
    this.editTagType = false;
    if (code != null) {
      this.tagCode.setValue(code.split(','));
    } else {
      this.tagCode.setValue(code);
    }
  }
  cancelTag() {
    this.editTagType = true;
    this.tagCode.reset();
  }
  saveTag(data) {
    console.log(data.value, this.tempUsername);
    DialogSweetAlertService.opentModalSweetAlertConfirm(
      '',
      MessageService.DIALOGMSGCONFIRM.SAVE,
      () => {
        this.httpService
          .doPut(URL.SAVE_TAG, {
            tagCode: data.value,
            username: this.tempUsername,
          })
          .subscribe((res) => {
            if (MessageService.MSG.SUCCESS === res.status) {
              DialogSweetAlertService.opentModalSweetAlertSuccess(
                '',
                res.message
              );
              this.getById(this.tempUsername);
              this.editTagType = true;
            } else {
              DialogSweetAlertService.opentModalSweetAlertError(
                '',
                res.message
              );
            }
          });
      }
    );
  }
  tabAction(event) {
    console.log(event.index);
    if (event.index == 0) this.getTransactionGame();
    else this.getTransactionLog();
  }

  getAvg(amount, count) {
    let data = amount / count;

    if (!isNaN(data)) {
      return data;
    }
    return 0;
  }

  formatDate(date) {
    if (date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
    }
    return '-';
  }

  changeStatusWithdrawal(data, status) {
    DialogSweetAlertService.opentModalSweetAlertConfirm(
      '',
      MessageService.DIALOGMSGCONFIRM.SAVE,
      () => {
        this.httpService
          .doPut(URL.CHANGE_STATUS_WITHDRAW_CONDITION, {
            username: data.username,
            conditionStatus: status,
          })
          .subscribe((res) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              this.getWithdrawalCondition();
              DialogSweetAlertService.opentModalSweetAlertSuccess(
                '',
                res.message
              );
            } else {
              DialogSweetAlertService.opentModalSweetAlertError(
                '',
                res.message
              );
            }
          });
      }
    );
  }

  dropdownBank() {
    this.httpService.doGet(URL.GET_DROPDOWN_BANK).subscribe((res) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.bankOptions = res.data;
      }
    });
  }
  editBank(code) {
    this.editBankType = false;
    this.bankCode.setValue(code);
  }
  cancelBank() {
    this.editBankType = true;
    this.bankCode.reset();
  }
  saveBank(data) {
    console.log(data);
    DialogSweetAlertService.opentModalSweetAlertConfirm(
      '',
      MessageService.DIALOGMSGCONFIRM.SAVE,
      () => {
        this.httpService
          .doPut(URL.SAVE_BANK, { username: this.tempUsername, bankCode: data })
          .subscribe((res) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              this.getById(this.tempUsername);
              this.editBankType = true;
              DialogSweetAlertService.opentModalSweetAlertSuccess(
                '',
                res.message
              );
            } else {
              DialogSweetAlertService.opentModalSweetAlertError(
                '',
                res.message
              );
            }
          });
      }
    );
  }
  editBankAccount(code) {
    this.editBankAccountType = false;
    this.bankAccount.setValue(code);
  }
  cancelBankAccount() {
    this.editBankAccountType = true;
    this.bankAccount.reset();
  }

  saveBankAccount(data) {
    console.log(data);
    DialogSweetAlertService.opentModalSweetAlertConfirm(
      '',
      MessageService.DIALOGMSGCONFIRM.SAVE,
      () => {
        this.httpService
          .doPut(URL.SAVE_BANK_ACCOUNT, {
            username: this.tempUsername,
            bankAccount: data,
          })
          .subscribe((res) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              this.getById(this.tempUsername);
              this.editBankAccountType = true;
              DialogSweetAlertService.opentModalSweetAlertSuccess(
                '',
                res.message
              );
            } else {
              DialogSweetAlertService.opentModalSweetAlertError(
                '',
                res.message
              );
            }
          });
      }
    );
  }

  editAccountName(code) {
    this.editAccountNameType = false;
    this.accountName.setValue(code);
  }

  cancelAccountName() {
    this.editAccountNameType = true;
    this.accountName.reset();
  }

  saveAccountName(data) {
    console.log(data);
    DialogSweetAlertService.opentModalSweetAlertConfirm(
      '',
      MessageService.DIALOGMSGCONFIRM.SAVE,
      () => {
        this.httpService
          .doPut(URL.SAVE_ACCOUNT_NAME, {
            username: this.tempUsername,
            accountName: data,
          })
          .subscribe((res) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              this.getById(this.tempUsername);
              this.editAccountNameType = true;
              DialogSweetAlertService.opentModalSweetAlertSuccess(
                '',
                res.message
              );
            } else {
              DialogSweetAlertService.opentModalSweetAlertError(
                '',
                res.message
              );
            }
          });
      }
    );
  }
}
