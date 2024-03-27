import { DialogSweetAlertService } from './../../../service/DialogSweetAlert.service';
import { MessageService } from './../../../service/message.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { BaseService } from 'src/app/service/BaseService.service';
import * as moment from 'moment';
const URL = {
  GET_LANDING: 'landing/get-landing',
  DELETE_LAMDING: 'landing/delete-landing/'
}
@Component({
  selector: 'app-landing-setting',
  templateUrl: './landing-setting.component.html',
  styleUrls: ['./landing-setting.component.scss']
})
export class LandingSettingComponent implements OnInit {

  columns = [
    { header: 'Header', field: 'header' },
    { header: 'Detail', field: 'detail' },
    { header: 'Config Path', field: 'configPath' },
    { header: 'Created By', field: 'createdBy' },
    { header: 'Created Date', field: 'createdDate' },
    { header: 'Updated By', field: 'updatedBy' },
    { header: 'UpdatedDate', field: 'updatedDate' },
  ]
  tr: any = [
    'header',
    'detail',
    'configPath',
    'createdBy',
    'createdDate',
    'updatedBy',
    'updatedDate',
    'action',
  ]
  dataTable = [];
  actionSetting = new ActionSetting({
    hideEdit: true,
    // hideDetail: true,
    hideDelete: true,
  });
  constructor(
    private router: Router,
    private httpService: BaseService,
  ) { }

  ngOnInit(): void {
    this.getLandingList()
  }


  onEdit(event) {
    console.log(event);
    this.router.navigate(["frontend-management/landing-setting/landing-setting-add"],
      { queryParams: { id: event.id } });
  }
  openDialogDetail(event) { }
  onDelete(event) {
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.DELETE, () => {
      this.httpService.doDelete(URL.DELETE_LAMDING + event.id).subscribe(res => {
        if (MessageService.MSG.SUCCESS == res.status) {
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message)
          this.getLandingList()
        } else {
          DialogSweetAlertService.opentModalSweetAlertError('', res.message)
        }
      })
    })
  }


  landingAdd() {
    this.router.navigate(["frontend-management/landing-setting/landing-setting-add"]);
  }

  getLandingList() {
    this.httpService.doGet(URL.GET_LANDING).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataTable = res.data.map(data => {
          return {
            id: data.id,
            configPath: data.configPath,
            createdBy: data.createdBy,
            createdDate: moment(data.createdDate).format('DD/MM/YYYY HH:mm:ss'),
            detail: data.detail,
            header: data.header,
            updatedBy: data.updatedBy ?? "-",
            updatedDate: data.updatedDate ? moment(data.updatedDate).format('DD/MM/YYYY HH:mm:ss') : "-",
          }
        })
      }
    })
  }
}
