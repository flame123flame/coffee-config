import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from './../../../service/BaseService.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
interface CustomerDetail {
  id: number;
  username: string;
  password: string;
  mobilePhone: string;
  realName: string;
  bankCode: string;
  bankAccount: string;
  groupCode: string;
  tagCode: string;
  depositCount: number;
  createdBy: string;
  createdDate: string;
  updatedBy?: any;
  updatedDate?: any;
  enable: boolean;
  registerStatus: number;
  lastLoginDate: Date;
  loginStatus: boolean;
}

interface AffiliateNetworkList {
  id: number;
  username: string;
  affiliateCode: string;
  affiliateCodeUp: string;
  registerDate: Date;
  customerDetail: CustomerDetail;
}

interface resObj {
  id: number;
  username: string;
  affiliateCode: string;
  affiliateGroupCode?: any;
  groupName?: any;
  detail: string;
  banner?: any;
  clickCount: number;
  totalIncome?: any;
  income?: any;
  pendingWithdraw?: any;
  createdBy: string;
  createdDate: string;
  updatedBy?: any;
  updatedDate?: any;
  affiliateCodeUp?: any;
  affiliateNetworkList: AffiliateNetworkList[];
  channelDetailList?: any;
  selfDetail?: Customer;
  upLineDetail?: Customer;
}

interface Customer {
  id: number;
  username: string;
  mobilePhone: string;
  realName: string;
  bankCode: string;
  bankNameEn?: any;
  bankNameTh?: any;
  bankAccount: string;
  bankImg?: any;
  groupCode: string;
  groupName: string;
  tagCode?: any;
  tagName: string;
  createdBy: string;
  createdDate: string;
  updatedBy?: any;
  updatedDate: string;
  enable: boolean;
  lastLoginDate: string;
  loginStatus: boolean;
  balance?: any;
  bonus?: any;
  pendingWithdrawal?: any;
  affiliateCode?: any;
  affiliateCodeUp?: any;
  registerDate?: any;
  groupLevelRes?: any;
}

class dataTable {
  playerId: string = null;
  realname: string = null;
  registerOn: string = null;
}

const URL = {
  GET_BY_USER: 'affiliate/get-affiliate',
  GET_GROUP: 'affiliate-group/get-affiliate-group-all',
  SAVE: 'affiliate',
};
@Component({
  selector: 'app-affiliate-profile',
  templateUrl: './affiliate-profile.component.html',
  styleUrls: ['./affiliate-profile.component.scss'],
})
export class AffiliateProfileComponent implements OnInit {
  affiliateId = null;
  playerId = null;
  realName = null;
  playerStatus = null;
  affiliateLink = null;
  affiliateUpline = null;
  playerGroup = null;
  email = null;
  mobile = null;
  registeredOn = null;
  lastLoginTime = null;
  registrationIp = null;
  lastLoginIp = null;
  registeredFp = null;
  lastLoginFp = null;

  columns = [
    {
      header: 'playerId',
      field: 'playerId',
      type: 'link',
      onClick: (event) => {
        this.goToPlayerProfile(event.playerId);
      },
    },
    { header: 'realname', field: 'realname' },
    { header: 'registerOn', field: 'registerOn' },
  ];
  dataInput = [];
  tr = ['playerId', 'realname', 'registerOn'];

  groupList = [];
  selectedGroup = '';
  id = null;

  constructor(
    private baseSer: BaseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((data) => {
      this.loadData(data.affiliateCode);
    });
    this.getGroup();
  }

  getGroup() {
    this.baseSer.doGet(URL.GET_GROUP).subscribe((data) => {
      if (data.status == 'SUCCESS') {
        this.groupList = data.data;
      }
    });
  }

  onSaveGroup() {
    let data = {
      id: this.id,
      affiliateGroupCode: this.selectedGroup,
    };
    this.baseSer.doPut(URL.SAVE, data).subscribe((data) => {
      if (data.status == 'SUCCESS') {
        alert('success');
      }
    });
  }

  loadData(username) {
    this.baseSer.doGet(`${URL.GET_BY_USER}/${username}`).subscribe((data) => {
      if (data.status == 'SUCCESS') {
        let res: resObj = data.data;
        this.id = res.id;
        this.selectedGroup = res.affiliateGroupCode;
        this.affiliateId = res.affiliateCode;
        this.playerId = res.selfDetail.username;
        this.realName = res.selfDetail.realName;
        this.playerStatus = res.selfDetail.loginStatus;
        this.affiliateLink = `http://finnbet.com/#/invitation-register-user?af=${res.affiliateCode}`;
        this.affiliateUpline = res.upLineDetail
          ? res.upLineDetail.username
          : 'ไม่มี';
        this.playerGroup = res.selfDetail.groupLevelRes
          ? res.selfDetail.groupLevelRes.groupName
          : null;
        this.mobile = res.selfDetail.mobilePhone;
        this.registeredOn = res.selfDetail.createdDate;
        this.lastLoginTime = res.selfDetail.lastLoginDate;

        // datatable
        let table = [];
        if (res.affiliateNetworkList.length != 0) {
          res.affiliateNetworkList.forEach((element) => {
            let one: dataTable = new dataTable();
            one.playerId = element.customerDetail.username;
            one.realname = element.customerDetail.realName;
            one.registerOn = moment(element.customerDetail.createdDate).format(
              'YYYY-MM-DD HH:mm:ss'
            );
            table.push(one);
          });
        }
        this.dataInput = table;
      }
    });
  }

  goToPlayerProfile(username) {
    this.router.navigate([`player-management/player-list/player-profile`], {
      queryParams: {
        username: username,
      },
    });
  }
}
