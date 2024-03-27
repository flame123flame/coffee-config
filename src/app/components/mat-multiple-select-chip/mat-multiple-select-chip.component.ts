import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-mat-multiple-select-chip',
  templateUrl: './mat-multiple-select-chip.component.html',
  styleUrls: ['./mat-multiple-select-chip.component.scss']
})
export class MatMultipleSelectChipComponent implements OnInit {

  // [{id:1,name:'test'},{id:2,name:'test2'},{id:3,name:'test3'}]
  @Input() selectList: any[] = []
  // 'name'
  @Input() selectDisplay: string = ''
  // 'id'
  @Input() selectValue: string = ''
  // '1,2'
  @Input() selectedList: string[] = []
  // 'name'
  @Input() selectedDisplay: string = null
  // 'id'
  @Input() mapDisplayField: string = null

  @Input() disabled : boolean = false
  @Input() useFromControl : boolean = false

  @Input() formGroup : FormGroup
  @Input() formName : string

  @Input() label : string = 'Simple'

  constructor() {
  }


  ngOnInit(): void {
    if (!this.selectedDisplay){this.selectedDisplay=this.selectDisplay};
    if (!this.mapDisplayField){this.mapDisplayField=this.selectValue};
  }

  findSelectedDisplayValue(findValue) {
    let index = this.selectList.findIndex(x => x[this.mapDisplayField] == findValue);
    return this.selectList[index][this.selectedDisplay]
  }

  strToArr(str: string) {
    if (str) {
      return str.split(',');
    }
    return []
  }

  removeGroupListFormGroup(value: string): void {
    if (this.useFromControl) {
      let index = this.formGroup.controls[this.formName].value.indexOf(value);
      let arr = this.formGroup.controls[this.formName].value
      if (index >= 0) {
        arr.splice(index, 1);
      }
      this.formGroup.controls[this.formName].setValue(null)
      this.formGroup.controls[this.formName].setValue(arr)
    }else{
      let index = this.selectedList.indexOf(value);
      let arr = this.selectedList
      if (index >= 0) {
        arr.splice(index, 1);
      }
      this.selectedList = null
      this.selectedList = arr
    }
  }

}
