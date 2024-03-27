import { DialogSweetAlertService } from './../../../service/DialogSweetAlert.service';
import { MessageService } from './../../../service/message.service';
import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/service/BaseService.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as moment from 'moment';
const URL = {
  FIND_USERNAME: 'customer/get-user/',
  SEARCH_VALID_BET_PROVIDER: 'transaction/get-player-valid-bet-provider',
  SEARCH_VALID_BET_PRODUCT: 'transaction/get-player-valid-bet-product'
}
export interface PlayerValidBetRes {
  gameProvider: string
  validBet: number
}
@Component({
  selector: 'app-player-valid-bets',
  templateUrl: './player-valid-bets.component.html',
  styleUrls: ['./player-valid-bets.component.scss']
})
export class PlayerValidBetsComponent implements OnInit {
  // playerIdList: String[] = ['All', 'Lazy', 'Fuzzy', 'Boa'];
  // timeZoneList: String[] = ['GMT+0800 (System Time Zone)', 'GMT+0700', 'GMT+0630'];
  // reportByList: String[] = ['Product Type', 'Game Provider'];
  playerIdList = [];
  reportByList = new Array('Game Provider', 'Product Type')
  reportBy = this.reportByList[0]

  playerId = new FormControl(null);
  firstDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    0,
    0,
    0)
  lastDate = new Date(new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    23,
    59,
    59)
  startDate = new FormControl(this.firstDate)
  endDate = new FormControl(this.lastDate)
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  form: FormGroup;
  displayedColumns: string[] = ['gameProvider', 'validBet']
  dataInput: PlayerValidBetRes[] = [];
  sumValidBet: number = 0
  tr: any = [
    'gameProvider',
    'validBet',
  ]
  displayedColumns1: string[] = ['productType', 'validBet']
  dataInput1: PlayerValidBetRes[] = [];
  sumValidBet1: number = 0
  tr1: any = [
    'productType',
    'validBet',
  ]
  constructor(
    private httpService: BaseService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
  }
  onKeyup(event: any) {
    if (event.length >= 3)
      this.findUsername(event)
    else if (event.length < 3)
      this.options = []
  }
  onSelectionChanged(event: any) {
    this.findUsername(event)
  }
  changeSearch(data) {
    console.log(data);
    if (this.playerId.value != null) {
      this.searchValidBet()
    }
  }


  searchValidBet() {
    if (this.playerId.value == null || this.playerId.value.length < 3)
      DialogSweetAlertService.opentModalSweetAlertError('', 'กรุณาค้นหาและเลือก Player ID')
    else if (this.startDate.value == null)
      DialogSweetAlertService.opentModalSweetAlertError('', 'กรุณาเลือก Valid Bets Period Strat')
    else if (this.endDate.value == null)
      DialogSweetAlertService.opentModalSweetAlertError('', 'กรุณาะเลือก Valid Bets Period End')
    else {
      if (this.reportBy == 'Game Provider') {
        this.httpService.doPost(URL.SEARCH_VALID_BET_PROVIDER, {
          username: this.playerId.value, startDate: moment(this.startDate.value).format('YYYY/MM/DD HH:mm:ss').toString(),
          endDate: moment(this.endDate.value).format('YYYY/MM/DD HH:mm:ss').toString()
        }).subscribe(res => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.sumValidBet = 0
            this.dataInput = res.data.map(data => {
              this.sumValidBet += data.validBet
              return {
                gameProvider: data.gameProvider,
                validBet: data.validBet
              }
            })
          }
        })
      } else {
        this.httpService.doPost(URL.SEARCH_VALID_BET_PRODUCT, {
          username: this.playerId.value, startDate: moment(this.startDate.value).format('YYYY/MM/DD HH:mm:ss').toString(),
          endDate: moment(this.endDate.value).format('YYYY/MM/DD HH:mm:ss').toString()
        }).subscribe(res => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.sumValidBet1 = 0
            this.dataInput1 = res.data.map(data => {
              this.sumValidBet1 += data.validBet
              return {
                productType: data.productNameEn,
                validBet: data.validBet
              }
            })
          }
        })
      }
    }
  }
  resetData() {
    this.playerId.setValue(null)
    this.startDate.setValue(this.firstDate)
    this.endDate.setValue(this.lastDate)
    this.reportBy = this.reportByList[0]
    this.dataInput = []
    this.dataInput1 = []
    this.sumValidBet = 0
    this.sumValidBet1 = 0
  }
  clearSearchField() {
    this.playerId.setValue(null)
  }
  findUsername(username) {
    this.httpService.doGet(URL.FIND_USERNAME + username).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.options = res.data;
        this.filteredOptions = this.playerId.valueChanges
          .pipe(startWith(''), map(value => this._filter(value)));
      }
    })
  }
  private _filter(value: string): string[] {
    const filterValue = value;
    return this.options.filter(option => option.includes(filterValue))
  }

  findTotalValidBet() { }
}
