import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { BeanService } from 'src/app/service/BeanService.service';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';

const URL = {
  SAVE_SEQ_PRIZE: 'add-yeekee/save-lotto-yeekee-seq-prize',
  GET_ALL: 'add-yeekee/get-lotto-yeekee-seq-prize',
  DELETE_SEQ_PRIZE_BY_CODE: 'add-yeekee/delete-seq-prize-by-code',
}

@Component({
  selector: 'app-yeekee-add-win-seq-prize',
  templateUrl: './yeekee-add-win-seq-prize.component.html',
  styleUrls: ['./yeekee-add-win-seq-prize.component.scss']
})
export class YeekeeAddWinSeqPrizeComponent implements OnInit {

  lottoClassCode: any
  className: any
  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  prizeSeq: FormArray = this.formBuilder.array([]);
  formAddSeqPrize: FormGroup = this.formBuilder.group({
    data: this.prizeSeq
  })

  displayedColumns: any = [
    'seqNumber',
    'prizeWin',
    'action',
  ];

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private routeParam: ActivatedRoute,
    private httpBeanService: BeanService,
    private formBuilder: FormBuilder,
  ) {
    routeParam.queryParams.subscribe(param => {
      this.lottoClassCode = param.lottoClassCode;
      this.className = param.className;
    });
  }

  ngOnInit(): void {
    this.getSeqByCode(this.lottoClassCode);
  }

  addRow() {
    const row = this.formBuilder.group({

      seqNumber: [null, [Validators.required, Validators.min(1)]],
      prizeWin: [null, [Validators.required, Validators.min(1)]],
      lottoClassCode: [this.lottoClassCode],

    });
    this.prizeSeq.push(row);
    this.updateView();
  }

  updateView() {
    this.dataSource.next(this.prizeSeq.controls);
  }

  goBack() {
    this.router.navigate(['lotto-settings/lotto-yeekee']);
  }

  onSave() {
    /** check form */
    const controls = this.formAddSeqPrize.controls;
    if (this.formAddSeqPrize.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAllAsTouched()

      );
      return;
    }
    console.log(this.formAddSeqPrize)
    console.log(this.dataSource)
    this.httpBeanService.doPost(URL.SAVE_SEQ_PRIZE, this.formAddSeqPrize.value.data).subscribe(res => {
      if (res.status = "SUCCESS") {
        this.router.navigate(['lotto-settings/lotto-yeekee/'])
      }
    })
  }

  dropRow(element, index) {

    // let data = this.dataSource1.value[index];
    // let kindCode = data.value.msdLottoKindCode;
    // let groupMaxMinMapCode = data.value.groupMaxMinMapCode;
    // let lottoGroupCode = this.lottoGroupCode;

    if (element.value.yeekeePrizeSeqMappingCode != null) {
      // delete
      DialogSweetAlertService.opentModalSweetAlertConfirm('ยืนยันการลบข้อมูล', 'คุณต้องการยืนยันลบข้อมูลนี้หรือไม่', () => {

        this.httpBeanService.doDelete(`${URL.DELETE_SEQ_PRIZE_BY_CODE}/${element.value.yeekeePrizeSeqMappingCode}`).subscribe(res => {
          console.log(res);
          if (res.status === 'SUCCESS') {
            this.formAddSeqPrize.value.data.splice(index, 1);
            this.dataSource.value.splice(index, 1);
            this.formAddSeqPrize.controls.data.updateValueAndValidity();
            this.updateView();
          }
        });

      });

    }
    else {

      this.formAddSeqPrize.value.data.splice(index, 1);
      this.dataSource.value.splice(index, 1);
      this.formAddSeqPrize.controls.data.updateValueAndValidity();
      this.updateView();

    }


  }


  getSeqByCode(classCode) {

    this.httpBeanService.doGet(`${URL.GET_ALL}/${classCode}`).subscribe(res => {
      console.log(res);
      if (res.data.length != 0) {
        res.data.forEach(element => {
          const row = this.formBuilder.group({
            seqNumber: [element.seqOrder, [Validators.required, Validators.min(1)]],
            prizeWin: [element.prize, [Validators.required, Validators.min(1)]],
            lottoClassCode: [element.classCode, Validators.required],
            yeekeePrizeSeqMappingId: [element.yeekeePrizeSeqMappingId, Validators.required],
            yeekeePrizeSeqMappingCode: [element.yeekeePrizeSeqMappingCode, Validators.required],

          });
          this.prizeSeq.push(row);
        });
        this.updateView()
      }
      else if (res.data.length == 0) {
        const row = this.formBuilder.group({

          seqNumber: [null, [Validators.required, Validators.min(1)]],
          prizeWin: [null, [Validators.required, Validators.min(1)]],
          lottoClassCode: [this.lottoClassCode],

        });
        this.prizeSeq.push(row);
        this.updateView();
      }
    })
  }




}
