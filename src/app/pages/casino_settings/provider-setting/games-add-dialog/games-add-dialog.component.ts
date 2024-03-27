import { DialogSweetAlertService } from './../../../../service/DialogSweetAlert.service';
import { MessageService } from './../../../../service/message.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewTagDialogComponent } from 'src/app/pages/player_management/tag-management/new-tag-dialog/new-tag-dialog.component';
import { BaseService } from 'src/app/service/BaseService.service';
import { environment } from 'src/environments/environment';
const URL = {
  SAVE_GAME: 'games/save-game',
  EDIT_GAME: 'games/edit-game',
  GAME_TAG: 'game-tag',
  GET_ALL_PRODUCT: "game-product-type/get-all-product",
  GET_ALL_PROVIDER: "game-provider/get-provider-list",
  GET_GAME_GROUP: "group-mapping-provider/get-all-by-provider-code",
  GET_GAME_TAG: "game-tag-mapping-game/get-by-game-code",
  GET_GAME_TAG_SELECTED: "game-tag-mapping-game/get-by-game-code",
}
@Component({
  selector: 'app-games-add-dialog',
  templateUrl: './games-add-dialog.component.html',
  styleUrls: ['./games-add-dialog.component.scss']
})
export class GamesAddDialogComponent implements OnInit {
  IMG_ENV = environment.API_IMG_URL + '/api/img/get-img?path='
  header = ""
  productList = []
  providerList = []
  form: FormGroup
  constructor(public dialogRef: MatDialogRef<NewTagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private httpService: BaseService) { }

  ngOnInit() {
    this.createHeader();
    this.createForm(this.data)
    if (this.data) {
      console.log("🚀 ~ file: games-add-dialog.component.ts ~ line 38 ~ GamesAddDialogComponent ~ ngOnInit ~ this.data", this.data)
      this.getGameGroup(this.data.gameCode)
      this.getALlGameTagSelected(this.data.gameCode)
      this.getALlGameGroup(this.data.providerCode)
    }
    this.getDropdownProduct()
    this.getDropdownProvider()
    this.getALlGameTag()
  }

  onNoClick(): void {
    console.log(this.form);
    this.dialogRef.close();
  }
  createHeader() {
    if (this.data) {
      this.header = "EDIT GAME"
    } else {
      this.header = "ADD GAME"

    }
  }

  createForm(data) {
    console.log(data);

    if (this.data) {
      this.form = this.fb.group({
        nameTh: [data.nameThG, Validators.required],
        nameEn: [data.nameEnG, Validators.required],
        // code: [data.code],
        gameCode: [{ value: data.gameCode, disabled: true }, Validators.required],
        gameProductTypeCode: [data.gameProduct, Validators.required],
        gameTagMappingGame: [data.gameGroupCode ? data.gameGroupCode : []],
        providerCode: [data.provider, Validators.required],
        // minRtp: [data.data.minRtp, Validators.required],
        // maxRtp: [data.data.maxRtp, Validators.required],
        // gameTag: [data.gameTag],
        displayName: [data.displayName, Validators.required],
        remark: [data.remark,],
        gameGroupCode: [data.gameGroupCode,],
        status: [data.status == MessageService.MSG.ACTIVE ? true : false, Validators.required],
        // enable: [data.enable, Validators.required],
        // platformMapp: [data.data.platformMapp],
        // platformMhFive: [data.data.platformMhFive],
        // platformMini: [data.data.platformMini],
        // platformPcDl: [data.data.platformPcDl],
        // platformPc: [data.data.platformPc],
      })
    } else {
      this.form = this.fb.group({
        gameCode: [null, Validators.required],
        nameTh: [null, Validators.required],
        nameEn: [null, Validators.required],
        displayName: [null, Validators.required],
        // gameTag: [null],
        gameProductTypeCode: [null, Validators.required],
        gameTagMappingGame: [[]],
        providerCode: [null, Validators.required],
        // minRtp: [null, Validators.required],
        // maxRtp: [null, Validators.required],
        remark: [null],
        gameGroupCode: [null],
        status: [true, Validators.required],
        // enable: [true, Validators.required],
        // platformMapp: [false, Validators.required],
        // platformMhFive: [false, Validators.required],
        // platformMini: [false, Validators.required],
        // platformPcDl: [false, Validators.required],
        // platformPc: [false, Validators.required],
      })

    }

  }

  onSave() {
    let data = this.form.getRawValue()

    let group = data.gameTagMappingGame.map(x => { return { gameTagCode: x, gameCode: this.data ? this.data.gameCode : this.form.controls.gameCode.value } })
    data.gameTagMappingGame = group;
    if (this.image1)
      data.image1 = this.image1
    if (this.image2)
      data.image2 = this.image2

    if (this.data) {
      console.log("edit");
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.EDIT, () => {
        this.httpService.doPut(URL.EDIT_GAME, data).subscribe(res => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.dialogRef.close();
            DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
          } else {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message);
          }
        })
      })
    } else {
      console.log("save");
      DialogSweetAlertService.opentModalSweetAlertConfirm('', MessageService.DIALOGMSGCONFIRM.SAVE, () => {
        this.httpService.doPost(URL.SAVE_GAME, data).subscribe(res => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.dialogRef.close();
            DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
          } else {
            DialogSweetAlertService.opentModalSweetAlertError('', res.message);
          }
        })
      })
    }
  }


  image1 = null;
  previewPortrait(files) {
    const reader = new FileReader();
    if (files.length === 0) {
      return;
    }

    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.image1 = reader.result
    };
  }
  image2 = null;

  previewLandscape(files) {
    const reader2 = new FileReader();
    if (files.length === 0) {
      return;
    }

    reader2.readAsDataURL(files[0]);
    reader2.onload = (_event) => {
      this.image2 = reader2.result
    };
  }

  getDropdownProduct() {
    this.httpService.doGet(URL.GET_ALL_PRODUCT).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.productList = res.data
      }
    })
  }
  getDropdownProvider() {
    this.httpService.doGet(URL.GET_ALL_PROVIDER).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.providerList = res.data
      }
    })
  }

  gameTagList = []

  getALlGameTag() {
    this.httpService.doGet(URL.GAME_TAG).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.gameTagList = res.data
      }
    })
  }

  gameGroupList = []

  getALlGameGroup(providerCode) {
    this.httpService.doGet(`${URL.GET_GAME_GROUP}/${providerCode}`).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.gameGroupList = res.data
      }
    })
  }

  getALlGameTagSelected(code) {
    this.httpService.doGet(`${URL.GET_GAME_TAG_SELECTED}/${code}`).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        let value = res.data.map(ele => {
          return ele.gameTagCode
        })
        console.log("🚀 ~ file: games-add-dialog.component.ts ~ line 172 ~ GamesAddDialogComponent ~ this.httpService.doGet ~ value", value)
        this.form.controls.gameTagMappingGame.setValue(value);
      }
    })
  }

  getGameGroup(code) {
    this.httpService.doGet(`${URL.GET_GAME_TAG}/${code}`).subscribe(res => {
      if (MessageService.MSG.SUCCESS == res.status) {
        let value = res.data.map(x => x.gameGroupCode)
        this.form.controls.gameTagMappingGame.setValue(value);
      }
    })
  }
}
