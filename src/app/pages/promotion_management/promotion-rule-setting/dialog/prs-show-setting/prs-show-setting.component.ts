import { resData } from './../../../../rebate_management/rebate-setting-new-add/rebate-setting-new-add.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from './../../../../../service/BaseService.service';
import { Component, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { MatTable } from '@angular/material/table';
import * as moment from 'moment';

const URL = {
  PROMO_CODE: "promotion/get-by-promo-code",
  GET_TREE_DATA: 'game-product-type/get-product-type-with-provider',
  PROVIDER: 'game-provider'
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
timeGapLimitationEnable? : boolean
timeGapLimitationValue? : number
  timeGapLimitationType? : string
violationCountSetting? : number
sameRealName? : boolean
sameIP? : boolean
}

 interface RuleSetting {
  id: number;
  promoCode: string;
  selfSelectMode: string;
  bonusType: string;
  conditionType: string;
  singleBonusLimit?: any;
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
  amountLimitType:string;
amountLimit:number;
}

 interface ResData {
  promotion: Promotion;
  postSetting: PostSetting;
  appSetting: AppSetting;
  ruleSetting: RuleSetting;
  issueSetting: IssueSetting[];
  bonusLevelSettings: BonusLevelSetting[];
}

export interface BonusLevelSetting {
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
}


/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor() {
  }

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
      newItem.displayValue = key
      node.item = newItem;

      if (value != null) {
        if (typeof value === 'object' && Array.isArray(value)) {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          newItem.displayValue = value.provider
          newItem.gptNameEn = value.product_type
          newItem.gptCode = value.product_type_code
          newItem.gpNameEn = value.provider
          newItem.gpCode = value.provider_code
          node.item = newItem;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

}



@Component({
  selector: 'app-prs-show-setting',
  templateUrl: './prs-show-setting.component.html',
  styleUrls: ['./prs-show-setting.component.scss'],
  providers:[ChecklistDatabase]})
export class PrsShowSettingComponent implements OnInit {

  readonly = true;
  resData : ResData = null;
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  readonly TYPE_REGISTER ='Registration'
  readonly TYPE_FIRST_ANDS_SECOND ='1st&2ndDeposit'
  readonly TYPE_CUSTOMIZE = 'Customized'
  readonly TYPE_GENERAL_DEPOSIT = 'GeneralDeposit'

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

  maxApprove : string;
  maxBonus : string;
  listGroup = []
  listTag = []

  constructor(public dialogRef: MatDialogRef<PrsShowSettingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private baseSer: BaseService,
    private _database: ChecklistDatabase
    ) {
      this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
        this.isExpandable, this.getChildren);
      this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

      _database.dataChange.subscribe(data => {
        this.dataSource.data = data;
      });
      this.getByPromoCode(data);
      this.baseSer.doGet('groupLevel/getAllGroupLevel').subscribe((res) => {
        this.listGroup = res?.data ?? [];
      });
      this.baseSer.doGet('tag-management').subscribe((res) => {
        this.listTag = res?.data ?? [];
      });
    }

    ngOnInit(): void {
      this.setTreeData()
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  getByPromoCode(code){
    this.baseSer.doGet(URL.PROMO_CODE+'?promoCode='+code).subscribe(res=>{
      if(res.status = 'SUCCESS'){
        this.resData = res.data
        this.initTable(this.resData.bonusLevelSettings)
      }
    })
  }

  findInNotAllowTag(code){
    let index = this.listTag.findIndex(x=>x.tagCode==code);
    return this.listTag[index].name
  }

  findInGroupList(code){
    let index = this.listGroup.findIndex(x=>x.groupCode==code);
    return this.listGroup[index].groupName
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
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === null;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
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
    descendants.forEach(child => this.checklistSelection.isSelected(child));
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
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
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
    this.checklistSelection.selected.forEach(element => {
      console.log(element)
      if (element.level == 1) {
        arr.push({ productType: element.item.gptNameEn , providerName: element.item.gpNameEn});
      }
    })
    return arr
  }

  setTreeData() {
    let tree = {};
    this.baseSer.doGet(`${URL.GET_TREE_DATA}`).subscribe(data => {
      if (data.status == "SUCCESS") {
        data.data.forEach(element => {
          if (!tree.hasOwnProperty(element.gptNameEn)) {
            tree[element.gptNameEn] = []
          }
          tree[element.gptNameEn].push({ provider: element.gpNameEn, provider_code: element.gpCode, product_type: element.gptNameEn, product_type_code: element.gptCode })
        });
        console.log(tree)
        this._database.initialize(tree);
        this.treeControl.expandAll()
      }
    })
  }

  isCheck(node){
    if (this.resData.issueSetting) {
      let index = this.resData.issueSetting.findIndex(x=>x.providerName== node.item.gpNameEn)
      if (index>=0) {
        this.checklistSelection.select(node);
      }
      return
    }
    return false;
  }


  strToArr(str){
    if (str instanceof (Array)) {
      return str
    }
    if(str){
      return str.split(',');
    }
    return []
  }


  displayedColumns: string[] = [
    "level",
    "depositAmount",
    "bonusRatio",
    "multiplier"
  ];
  depositLevelSource: depositLevelData[] = [];

  initTable(data:BonusLevelSetting[]) {
    if (data.length!=0) {
      data.forEach(element => {
        this.depositLevelSource.push({
          depositAmount: element.depositAmount,
          bonusRatio: element.bonusCalculation,
          multiplier: element.withdrawCondition
        });
      });
      this.table.renderRows();
    }
  }

  formateDate(date){
    return moment(date).format("DD/MM/YYYY")
  }

  findValidPeriod(value){
    return this.validPeriodList.find(x=>x.value==value).text
  }


}
