import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BaseService } from 'src/app/service/BaseService.service';
import { FileNameConstant } from '../../../constant/filename.constant';
import { Location } from '@angular/common';
import { MessageService } from 'src/app/service/message.service';
import { MatStepper } from '@angular/material/stepper';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlattener,
  MatTreeFlatDataSource,
} from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { MatTable } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { DialogSweetAlertService } from 'src/app/service/DialogSweetAlert.service';
import { PromotionRuleSettingReviewDialogComponent } from '../promotion-rule-setting-review-dialog/promotion-rule-setting-review-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { PromotionDetailModel } from 'src/app/models/respons-interface/PromotionDetail';
interface Promotion {
  id: number;
  promoCode: string;
  promoType: string;
  promoTitle: string;
  appPlatform: string;
  promoPeriodType: string;
  startDate: Date;
  endDate: Date;
  status: string;
  viewStatus: string;
  createdBy: string;
  createdDate: Date;
  updatedBy?: any;
  updatedDate?: any;
}

interface PostSetting {
  id: number;
  promoCode: string;
  ecPromotionTitle: string;
  lang: string;
  deskBanner: string;
  deskGrid?: any;
  deskDetail: string;
  mobileBanner?: any;
  mobileGrid?: any;
  mobileDetail?: any;
  mobileAppBanner?: any;
  mobileAppDetail?: any;
  createdBy: string;
  createdDate: Date;
  updatedBy?: any;
  updatedDate?: any;
}

interface IssueSetting {
  id: number;
  promoCode: string;
  providerName: string;
}

interface AppSetting {
  id: number;
  promoCode: string;
  validPeriod: number;
  verificationType: string;
  depositSequence?: any;
  limitation?: any;
  repeatLimit?: any;
  allowApp: string;
  groupList?: any;
  notAllowTag: string;
  riskOptions?: any;
  violationSetting?: any;
  createdBy: string;
  createdDate: Date;
  updatedBy?: any;
  updatedDate?: any;
  timeGapLimitationEnable?: boolean;
  timeGapLimitationValue?: number;
  timeGapLimitationType?: string;
  violationCountSetting?: number;
  sameRealName?: boolean;
  sameIP?: boolean;
  reciveLimitType?: any;
  reciveLimit: number;
}

interface RuleSetting {
  id: number;
  promoCode: string;
  selfSelectMode: string;
  bonusType: string;
  conditionType: string;
  singleBonusLimit: number;
  singleBonusLimitType: number;
  maxApprovalLimit: number;
  maxApprovalLimitType: number;
  maxBonusLimit: number;
  depositAmt?: any;
  receiveBonusWallet?: any;
  bonusCalculation: number;
  withdrawCondition: number;
  conditionRemoval?: any;
  bonusRecycle?: any;
  productType?: any;
  createdBy: string;
  createdDate: Date;
  updatedBy?: any;
  updatedDate?: any;
  maxBonusLimitType?: any;
  removeGeneral?: string;
  amountLimitType: string;
  amountLimit: number;
}
interface BonusLevelSetting {
  id?: number;
  promoCode?: string;
  bonusLevel?: number;
  depositAmount?: number;
  bonusCalculation?: number;
  withdrawCondition?: number;
  createdBy?: string;
  createdDate?: Date;
  updatedBy?: any;
  updatedDate?: any;
}

interface DialogReqData {
  promotion: Promotion;
  postSetting: PostSetting;
  appSetting: AppSetting;
  ruleSetting: RuleSetting;
  issueSetting: IssueSetting[];
  bonusLevelSettings: BonusLevelSetting[];
}

/**
 * Node for to-do item
 */
class TodoItemNode {
  children: TodoItemNode[];
  item: Item;
}

/** Flat to-do item node with expandable and level information */
class TodoItemFlatNode {
  item: Item;
  level: number;
  expandable: boolean;
}
class Item {
  displayValue: string = null;
  gpCode: string = null;
  gpNameEn: string = null;
  gptCode: string = null;
  gptNameEn: string = null;
}

interface walletListReq {
  productType: string;
  providerName: string;
  providerCode: string;
}

interface depositLevelData {
  depositAmount: number;
  bonusRatio: number;
  multiplier: number;
}

interface BonusLevelDetail {
  level: number;
  depositAmount: number;
  bonusCalculation: number;
  withdrawCondition: number;
}

const URL = {
  GET_TREE_DATA: 'game-product-type/get-product-type-with-provider',
  PROVIDER: 'game-provider',
};

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }

  constructor() { }

  initialize(treeData) {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(treeData, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      let newItem = new Item();
      newItem.displayValue = key;
      node.item = newItem;

      if (value != null) {
        if (typeof value === 'object' && Array.isArray(value)) {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          newItem.displayValue = value.provider;
          newItem.gptNameEn = value.product_type;
          newItem.gptCode = value.product_type_code;
          newItem.gpNameEn = value.provider;
          newItem.gpCode = value.provider_code;
          node.item = newItem;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}

@Component({
  selector: 'app-promotion-rule-setting-add-first-and-second-deposit',
  templateUrl:
    './promotion-rule-setting-add-first-and-second-deposit.component.html',
  styleUrls: [
    './promotion-rule-setting-add-first-and-second-deposit.component.scss',
  ],
  providers: [ChecklistDatabase],
})
export class PromotionRuleSettingAddFirstAndSecondDepositComponent
  implements OnInit {
  operation = null;
  promoCode = null;
  constructor(
    private formBuilder: FormBuilder,
    private httpCli: BaseService,
    private location: Location,
    public dialog: MatDialog,
    private _database: ChecklistDatabase,
    private activeRoute: ActivatedRoute
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    _database.dataChange.subscribe((data) => {
      this.dataSource.data = data;
    });

    this.httpCli.doGet('groupLevel/getAllGroupLevel').subscribe((res) => {
      this.listGroup = res?.data ?? [];
    });
    this.httpCli.doGet('tag-management').subscribe((res) => {
      this.listTag = res?.data ?? [];
    });
    this.setTreeData();
    this.activeRoute.queryParams.subscribe((param) => {
      if (param.op) {
        this.operation = param.op;
        if (param.op == 'EDIT') {
          this.setDisabledForm();
        }
      }
      if (param.promoCode) {
        this.promoCode = param.promoCode;
        this.createForm(true);
        this.getPromoDetail(param.promoCode);
      } else {
        this.createForm();
      }
    });
  }

  // maps the appropriate column to fields property
  public field: Object = {
    dataSource: [],
    id: 'id',
    parentID: 'pid',
    text: 'name',
    hasChildren: 'hasChild',
  };
  // set the CheckBox to the TreeView
  public showCheckBox: boolean = true;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  @ViewChild('stepper') private myStepper: MatStepper;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  postSettingFG: FormGroup;
  ecPromoTitle = '';
  fileNameAccept = FileNameConstant.uploadFile;
  fileDesktopBanner;
  fileDesktopGride;
  fileMobileBanner;
  fileMobileGride;
  fileMobileAppBanner;

  showError = false;

  isEditable = false;
  selected1 = '1';
  selected2 = '1';
  readonly validPeriodList = [
    { text: '1 Day', value: 1 },
    { text: '2 Day', value: 2 },
    { text: '3 Day', value: 3 },
    { text: '1 Week', value: 7 },
    { text: '1 Month', value: 30 },
  ];
  readonly allowApplicantList = [
    { text: 'All', value: 'All' },
    { text: 'VIP Group', value: 'VIPGroup' },
  ];

  listGroup = [];
  listTag = [];

  walletTransferList = ['Main Wallet'];
  walletSubList = ['Sub Wallet'];
  providerList = [];

  disabledBtn = false;

  ngOnInit(): void {
    this.setTreeData();
    this.getProviderList();
  }

  createForm(setEmptyString = false) {
    this.firstFormGroup = this.formBuilder.group({
      promoTitle: new FormControl(
        { value: setEmptyString ? '' : null, disabled: false },
        Validators.required
      ),
      promoType: ['1st&2ndDeposit'],
      appPlatform: new FormControl(
        { value: 'All', disabled: false },
        Validators.required
      ),
      promoPeriodType: new FormControl(
        { value: 'DatePeriod', disabled: false },
        Validators.required
      ),
      startDate: new FormControl(
        {
          value: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            0,
            0
          ),
          disabled: false,
        },
        Validators.required
      ),
      endDate: new FormControl(
        {
          value: new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            1,
            0,
            0
          ),
          disabled: false,
        },
        Validators.required
      ),
    });

    this.postSettingFG = this.formBuilder.group({
      lang: new FormControl({ value: 'TH', disabled: false }),
      deskBanner: new FormControl(
        { value: setEmptyString ? '' : null, disabled: false },
        Validators.required
      ),
      deskGrid: new FormControl({
        value: setEmptyString ? '' : null,
        disabled: false,
      }),
      deskDetail: new FormControl(
        { value: setEmptyString ? '' : null, disabled: false },
        Validators.required
      ),
      mobileBanner: new FormControl({
        value: setEmptyString ? '' : null,
        disabled: false,
      }),
      mobileGrid: new FormControl({
        value: setEmptyString ? '' : null,
        disabled: false,
      }),
      mobileDetail: new FormControl({
        value: setEmptyString ? '' : null,
        disabled: false,
      }),
      mobileAppBanner: new FormControl({
        value: setEmptyString ? '' : null,
        disabled: false,
      }),
      mobileAppDetail: new FormControl({
        value: setEmptyString ? '' : null,
        disabled: false,
      }),
    });

    this.secondFormGroup = this.formBuilder.group({
      validPeriod: [1],
      verificationType: ['Auto'],
      depositSequence: ['1st'],
      limitation: [],
      allowApp: ['All'],
      groupList: new FormControl({
        value: setEmptyString ? '' : null,
        disabled: (this.secondFormGroup?.value?.allowApp ?? '') === 'All',
      }),
      notAllowTag: [[]],
      sameIP: [false],
      sameRealName: [false],
      riskOption: new FormControl({ value: [] }),
      violationCountSetting: new FormControl({
        value: setEmptyString ? '' : null,
        disabled: true,
      }),
      reciveLimitType: ['Unlimited'],
      reciveLimit: [9999999999, Validators.required],
    });

    this.thirdFormGroup = this.formBuilder.group({
      bonusType: ['FixedAmount'],
      conditionType: ['MultiplierCondition'],
      /**
       * Step 2: Set Parameter
       */
      maxApprovalLimitType: ['Unlimited'],
      maxApprovalLimit: [9999999999, Validators.required],

      maxBonusLimitType: ['Unlimited'],
      maxBonusLimit: [9999999999, Validators.required],

      singleBonusLimitType: ['Unlimited'],
      singleBonusLimit: [9999999999, Validators.required],

      depositAmt: [, Validators.required],
      bonusCalculate: [, Validators.required],
      // multiplierCondition: [, Validators.required],

      // sub
      wallet: [setEmptyString ? '' : null],
      receiveBonusWallet: [setEmptyString ? '' : null, Validators.required],

      turnoverAmt: [],
      conditionRemoval: [],
      bonusRecycle: [],
      productType: [],
      otherInput: [],
    });
    this.onChangeMaxLimit('maxApprovalLimitType', 'maxApprovalLimit');
    this.onChangeMaxLimit('maxBonusLimitType', 'maxBonusLimit');
    this.onChangeMaxLimit('singleBonusLimitType', 'singleBonusLimit');
    this.disValidationCountSetting();
  }

  disValidationCountSetting() {
    const listener = (change, other) => {
      change.valueChanges.subscribe((val) => {
        if (val || other.value) {
          this.secondFormGroup.controls.violationCountSetting.enable();
          this.secondFormGroup.controls.violationCountSetting.setValidators(
            Validators.required
          );
        } else {
          this.secondFormGroup.controls.violationCountSetting.disable();
          this.secondFormGroup.controls.violationCountSetting.clearAsyncValidators();
          this.secondFormGroup.controls.violationCountSetting.clearAsyncValidators();
        }
        this.secondFormGroup.controls.violationCountSetting.updateValueAndValidity();
      });
    };
    listener(
      this.secondFormGroup.controls.sameIP,
      this.secondFormGroup.controls.sameRealName
    );
    listener(
      this.secondFormGroup.controls.sameRealName,
      this.secondFormGroup.controls.sameIP
    );
  }

  onChangeMaxLimit(control, controlChange) {
    this.thirdFormGroup.get(control).valueChanges.subscribe((val) => {
      if (val === 'Unlimited') {
        this.thirdFormGroup.get(controlChange).patchValue(9999999999);
      } else {
        this.thirdFormGroup.get(controlChange).patchValue(null);
      }
    });
  }

  onSelectFile(event, control) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size >= 104857600) {
        // log
      }
      const reader = new FileReader();
      reader.onload = (onload: any) => {
        // src: onload.target.result,
        // console.log(onload.target.result);
        this.postSettingFG.get(control).patchValue(onload.target.result);
      };
      console.log(event.target.files[0]);
      reader.readAsDataURL(event.target.files[0]);
      // this.images.push(event.target.files[i]);
    }
    // this.formGroup.patchValue({ image: this.images });
  }

  changeDateType() {
    if (this.firstFormGroup.value.promoPeriodType === 'DatePeriod') {
      this.firstFormGroup.get('endDate').setValidators(Validators.required);
    } else {
      this.firstFormGroup.get('endDate').clearValidators();
      this.firstFormGroup.get('endDate').clearAsyncValidators();
    }
    this.firstFormGroup.get('endDate').updateValueAndValidity();
  }

  validateNextStepper1() {
    this.showError = true;
    this.firstFormGroup.markAllAsTouched();
    if (this.postSettingFG.invalid) return;
    this.myStepper.next();
  }

  validateNextStepper2() {
    this.secondFormGroup.markAllAsTouched();
    if (this.secondFormGroup.invalid) return;
    this.myStepper.next();
  }

  onChange($event) {
    console.log($event);
    this.postSettingFG.get('deskDetail').patchValue($event);
  }

  onChange2($event) {
    console.log(this.ecPromoTitle);
    this.postSettingFG.get('ecPromotionTitle').patchValue($event);
  }

  onReceiveBonusChange($event: MatSelectChange) {
    if ($event.value === 'BONUS') {
      this.firstFormGroup.get('wallet').setValidators(Validators.required);
    } else {
      this.firstFormGroup.get('wallet').clearValidators();
      this.firstFormGroup.get('wallet').clearAsyncValidators();
    }
    this.firstFormGroup.get('wallet').updateValueAndValidity();
  }

  onSave() {
    this.disabledBtn = true;
    console.log(this.thirdFormGroup);
    this.thirdFormGroup.controls.wallet.setValue(this.getCheckListValue());
    this.thirdFormGroup.markAllAsTouched();
    if (this.thirdFormGroup.invalid) {
      this.disabledBtn = false;
      return;
    }
    const riskOption = [];
    if (this.secondFormGroup.get('sameIP').value) {
      riskOption.push('IP');
    }
    if (this.secondFormGroup.get('sameRealName').value) {
      riskOption.push('RealName');
    }
    this.secondFormGroup.get('riskOption').patchValue(riskOption.toString());

    let issueSetting: IssueSetting[] = [];
    let a: walletListReq[] = this.getCheckListValue();
    a.forEach((element) => {
      issueSetting.push({
        id: null,
        promoCode: element.providerCode,
        providerName: element.providerName,
      });
    });

    let bonusLevelSettings: BonusLevelSetting[] = [];
    let b: BonusLevelDetail[] = this.getDepositArray();
    b.forEach((element) => {
      bonusLevelSettings.push({
        id: null,
        promoCode: null,
        bonusLevel: element.level,
        depositAmount: element.depositAmount,
        bonusCalculation: element.bonusCalculation,
        withdrawCondition: element.withdrawCondition,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
      });
    });

    const previewDailog: DialogReqData = {
      promotion: {
        id: null,
        promoCode: null,
        promoType: this.firstFormGroup.controls.promoType.value,
        promoTitle: this.firstFormGroup.controls.promoTitle.value,
        appPlatform: this.firstFormGroup.controls.appPlatform.value,
        promoPeriodType: this.firstFormGroup.controls.promoPeriodType.value,
        startDate: this.firstFormGroup.controls.startDate.value,
        endDate: this.firstFormGroup.controls.endDate.value,
        status: null,
        viewStatus: null,
        createdBy: null,
        createdDate: null,
        updatedBy: null,
        updatedDate: null,
      },
      postSetting: this.postSettingFG.value,
      appSetting: this.secondFormGroup.value,
      ruleSetting: this.thirdFormGroup.value,
      issueSetting: issueSetting,
      bonusLevelSettings: bonusLevelSettings,
    };
    this.openDialogShowSetting(previewDailog);
    this.disabledBtn = false;
  }

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(
    true /* multiple */
  );

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) =>
    _nodeData.item === null;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some((child) =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach((child) => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every((child) => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  getCheckListValue() {
    let arr: walletListReq[] = [];
    this.checklistSelection.selected.forEach((element) => {
      console.log(element);
      if (element.level == 1) {
        arr.push({
          productType: element.item.gptNameEn,
          providerName: element.item.gpNameEn,
          providerCode: element.item.gpCode,
        });
      }
    });
    return arr;
  }

  setTreeData() {
    let tree = {};
    this.httpCli.doGet(`${URL.GET_TREE_DATA}`).subscribe((data) => {
      if (data.status == 'SUCCESS') {
        data.data.forEach((element) => {
          if (!tree.hasOwnProperty(element.gptNameEn)) {
            tree[element.gptNameEn] = [];
          }
          tree[element.gptNameEn].push({
            provider: element.gpNameEn,
            provider_code: element.gpCode,
            product_type: element.gptNameEn,
            product_type_code: element.gptCode,
          });
        });
        this._database.initialize(tree);
      }
    });
  }

  getProviderList() {
    this.httpCli.doGet(`${URL.PROVIDER}`).subscribe((data) => {
      if (data.status == 'SUCCESS') {
        this.providerList = data.data;
      }
    });
  }

  findInNotAllowTag(code) {
    let index = this.listTag.findIndex((x) => x.tagCode == code);
    return this.listTag[index].name;
  }

  removeNotAllowTagSecondFormGroup(value: string): void {
    const index = this.secondFormGroup.controls.notAllowTag.value.indexOf(
      value
    );

    let arr = this.secondFormGroup.controls.notAllowTag.value;
    if (index >= 0) {
      arr.splice(index, 1);
    }
    this.secondFormGroup.controls.notAllowTag.setValue(null);
    this.secondFormGroup.controls.notAllowTag.setValue(arr);
  }

  findInGroupList(code) {
    let index = this.listGroup.findIndex((x) => x.groupCode == code);
    return this.listGroup[index].groupName;
  }

  removeGroupListSecondFormGroup(value: string): void {
    const index = this.secondFormGroup.controls.groupList.value.indexOf(value);

    let arr = this.secondFormGroup.controls.groupList.value;
    if (index >= 0) {
      arr.splice(index, 1);
    }
    this.secondFormGroup.controls.groupList.setValue(null);
    this.secondFormGroup.controls.groupList.setValue(arr);
  }

  displayedColumns: string[] = [
    'level',
    'depositAmount',
    'bonusRatio',
    'multiplier',
    'remove',
  ];
  depositLevelSource: depositLevelData[] = [
    { depositAmount: null, bonusRatio: null, multiplier: null },
  ];

  add() {
    if (this.depositLevelSource.length >= 10) {
      return;
    }
    // get last level
    this.depositLevelSource.push({
      depositAmount: null,
      bonusRatio: null,
      multiplier: null,
    });
    this.table.renderRows();
  }

  reset() {
    this.depositLevelSource = [
      { depositAmount: null, bonusRatio: null, multiplier: null },
    ];
  }

  del(index: number) {
    this.depositLevelSource.splice(index, 1);
    this.table.renderRows();
  }

  getDepositArray() {
    let reqData: BonusLevelDetail[] = [];
    this.depositLevelSource.forEach((ele, index) => {
      let reqItem: BonusLevelDetail = {
        level: index + 1,
        depositAmount: ele.depositAmount,
        bonusCalculation: ele.bonusRatio,
        withdrawCondition: ele.multiplier,
      };
      reqData.push(reqItem);
    });
    return reqData;
  }

  openDialogShowSetting(data: DialogReqData = null) {
    const dialogRef = this.dialog.open(
      PromotionRuleSettingReviewDialogComponent,
      {
        data: data,
        width: '95%',
        height: '95%',
        maxHeight: '98%',
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      const body = {
        ...this.firstFormGroup.value,
        postSetting: this.postSettingFG.value,
        appSetting: this.secondFormGroup.value,
        ruleSetting: this.thirdFormGroup.value,
      };
      body.ruleSetting['level'] = this.getDepositArray();
      if (this.operation == 'EDIT') {
        this.editOne(body);
      } else {
        this.insertOne(body);
      }
    });
  }

  insertOne(body) {
    let dialogMes = MessageService.DIALOGMSGCONFIRM.SAVE;
    let url = 'promotion/new-promotion';
    if (this.operation == 'CLONE') {
      MessageService.DIALOGMSGCONFIRM.CLONE;
      url = 'promotion/clone-promotion';
    }
    DialogSweetAlertService.opentModalSweetAlertConfirm('', dialogMes, () => {
      this.httpCli.doPost(url, body).subscribe((res) => {
        if (res.status === MessageService.MSG.SUCCESS) {
          this.location.back();
          this.disabledBtn = false;
          DialogSweetAlertService.opentModalSweetAlertSuccess('', res.message);
        } else {
          DialogSweetAlertService.opentModalSweetAlertError('', res.message);
        }
      });
    });
  }

  editOne(body) {
    DialogSweetAlertService.opentModalSweetAlertConfirm(
      '',
      MessageService.DIALOGMSGCONFIRM.EDIT,
      () => {
        this.httpCli
          .doPut(`promotion/edit-promotion/${this.promoCode}`, body)
          .subscribe((res) => {
            if (res.status === MessageService.MSG.SUCCESS) {
              this.location.back();
              this.disabledBtn = false;
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

  getPromoDetail(promoCode) {
    this.httpCli
      .doGet(`promotion/get-by-promo-code?promoCode=${promoCode}`)
      .subscribe((res) => {
        if (res.status === MessageService.MSG.SUCCESS) {
          this.setForm(res.data);
        }
      });
  }

  setDisabledForm() { }

  cdkData = null
  setForm(data: PromotionDetailModel) {
    this.firstFormGroup.patchValue({
      promoTitle: data.promotion.promoTitle,
      promoType: data.promotion.promoType,
      appPlatform: data.promotion.appPlatform,
      promoPeriodType: data.promotion.promoPeriodType,
      startDate: data.promotion.startDate,
      endDate: data.promotion.endDate,
    });

    console.log(data.postSetting.deskDetail);

    this.postSettingFG.patchValue({
      lang: data.postSetting.lang,
      deskBanner: data.postSetting.deskBanner,
      deskDetail: data.postSetting.deskDetail,
    });

    this.cdkData = data.postSetting.deskDetail

    this.secondFormGroup.patchValue({
      validPeriod: data.appSetting.validPeriod,
      verificationType: data.appSetting.verificationType,
      limitation: data.appSetting.allowApp,
      allowApp: data.appSetting.allowApp,
      groupList: this.strToArr(data.appSetting.groupList),
      notAllowTag: this.strToArr(data.appSetting.notAllowTag),
      sameIP: data.appSetting.sameIP,
      sameRealName: data.appSetting.sameRealName,
      riskOption: data.appSetting.riskOptions,
      violationCountSetting: data.appSetting.violationCountSetting,
      reciveLimitType:
        data.appSetting.reciveLimit == 9999999999 ? 'Unlimited' : 'Limit',
      reciveLimit: data.appSetting.reciveLimit,
    });

    this.thirdFormGroup.patchValue({
      bonusType: data.ruleSetting.bonusType,
      conditionType: data.ruleSetting.conditionType,
      depositAmt: data.ruleSetting.depositAmount,
      bonusCalculate: data.ruleSetting.bonusCalculation,
      receiveBonusWallet: data.ruleSetting.receiveBonusWallet,
      maxApprovalLimitType:
        data.ruleSetting.maxApprovalLimit == 9999999999 ? 'Unlimited' : 'Limit',
      maxBonusLimitType:
        data.ruleSetting.maxBonusLimit == 9999999999 ? 'Unlimited' : 'Limit',
      singleBonusLimitType:
        data.ruleSetting.singleBonusLimit == 9999999999 ? 'Unlimited' : 'Limit',

      singleBonusLimit: data.ruleSetting.singleBonusLimit,
      maxApprovalLimit: data.ruleSetting.maxApprovalLimit,
      maxBonusLimit: data.ruleSetting.maxBonusLimit,
      // multiplierCondition:data.ruleSetting.multiplierCondition,
      // wallet:data.ruleSetting.wallet,
      // turnoverAmt:data.ruleSetting.turnoverAmt,
      // conditionRemoval:data.ruleSetting.conditionRemoval,
      // bonusRecycle:data.ruleSetting.bonusRecycle,
      // productType:data.ruleSetting.productType,
      // otherInput:data.ruleSetting.otherInput,
    });

    data.issueSetting.forEach((element) => {
      let node = this.treeControl.dataNodes.find(
        (ele) =>
          ele.item.gpCode == element.providerCode &&
          ele.item.gpNameEn == element.providerName
      );
      if (node) this.checklistSelection.select(node);
    });
    this.initTable(data.bonusLevelSettings);
  }

  log() {
    console.log(this.firstFormGroup);
    console.log(this.postSettingFG);
    console.log(this.secondFormGroup);
    console.log(this.thirdFormGroup);
  }

  findValidPeriod(value) {
    return this.validPeriodList.find((x) => x.value == value).text;
  }

  strToArr(str) {
    if (str instanceof Array) {
      return str;
    }
    if (str) {
      return str.split(',');
    }
    return [];
  }
  initTable(data: BonusLevelSetting[]) {
    let ds: depositLevelData[] = [];

    if (data.length != 0) {
      data.forEach((element) => {
        ds.push({
          depositAmount: element.depositAmount,
          bonusRatio: element.bonusCalculation,
          multiplier: element.withdrawCondition,
        });
      });
      this.depositLevelSource = ds;
      // this.table.renderRows();
    }
  }
}
