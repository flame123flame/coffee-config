import { DialogSweetAlertService } from './../../../service/DialogSweetAlert.service';
import { LottoConstants } from './../lotto-constants/lotto-constants';
import { MessageService } from './../../../service/message.service';
import { LottoGroupListDialogComponent } from './lotto-group-list-dialog/lotto-group-list-dialog.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { BaseService } from 'src/app/service/BaseService.service';
import { BeanService } from 'src/app/service/BeanService.service';

const URL = {
  GET_ALL_LOTTO: 'lotto-class/get-all-lotto-class',
  GET_GROUP_LIST: 'group-list/list',
  DELETE_LOTTO_GROUP_LIST: 'group-list/delete',
  
}

@Component({
  selector: 'app-lotto-group-list-mapping',
  templateUrl: './lotto-group-list-mapping.component.html',
  styleUrls: ['./lotto-group-list-mapping.component.scss']
})

export class LottoGroupListMappingComponent implements OnInit {

  lottoClassCode: any;
  lottoData: any;
  lottoHit=[];
  lottoStocks=[];
  lottoSet=[];
  className: any;
  formAddLottoGroupList:FormGroup
  columns = [
    { header: 'Lotto Name', field: 'className' },
  ];
  tr: any = [
    'className',
    'action',
  ];

  actionSetting: ActionSetting = new ActionSetting({
    hideEdit: false
  });

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private routeParam: ActivatedRoute,
    private httpBeanService: BeanService,
    private formBuilder: FormBuilder,
  ) { 
    
  }

  ngOnInit(): void {
    this.getAllLotto();
    this.getAllGroupList();
  }

  setFromAddDummy() {
    this.formAddLottoGroupList = this.formBuilder.group({
      lottoClassCode: ['', [Validators.required]],
      lottoGroupListCode:['',[Validators.required]]
    });
  }

  getAllGroupList(){
    this.httpBeanService.doGet(`${URL.GET_GROUP_LIST}/${LottoConstants.GROUP_HIT}`).subscribe(res=>{
      if(res.status === MessageService.MSG.SUCCESS)
      {
        this.lottoHit = res.data
        console.log(this.lottoHit);
      }
    })
    this.httpBeanService.doGet(`${URL.GET_GROUP_LIST}/${LottoConstants.GROUP_STOCKS}`).subscribe(res=>{
      if(res.status == MessageService.MSG.SUCCESS)
      {
        this.lottoStocks = res.data
      }
    })
    this.httpBeanService.doGet(`${URL.GET_GROUP_LIST}/${LottoConstants.GROUP_SET}`).subscribe(res=>{
      if(res.status == MessageService.MSG.SUCCESS)
      {
        this.lottoSet = res.data
      }
    })
  }

  getAllLotto() {
    this.httpBeanService.doGet(URL.GET_ALL_LOTTO).subscribe(res => {
      console.log(res.data);
      if (res.status == 'SUCCESS') {
        this.lottoData = res.data;
        console.log(this.lottoData)
      }
    });
  }

  addRow() {
    this.openDialogAddLotto()
  }

  deleteOne(data) {
    console.log(data)
    DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.DELETE, () => {
      this.httpBeanService.doDelete(`${URL.DELETE_LOTTO_GROUP_LIST}/${data.id}`).subscribe(res => {
        if (res.status == MessageService.MSG.SUCCESS) {
          DialogSweetAlertService.opentModalSweetAlertSuccess('DELETE STATUS',MessageService.DELETE.SUCCESS)
          this.ngOnInit();
        }
        else
        {
          DialogSweetAlertService.opentModalSweetAlertSuccess('DELETE STATUS',MessageService.DELETE.FAILED)
          
        }
      });
    });
    
  }

  openDialogAddLotto(data = null, http = 'post'): void {
    const dataIn = {};
    if (data) {
      dataIn['data'] = data;
    }
    dataIn['http'] = http;
    const dialogRef = this.dialog.open(LottoGroupListDialogComponent, { data: dataIn, width: '600px' });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }


}
