import { SelectionModel } from '@angular/cdk/collections';
import { CdkStepper } from '@angular/cdk/stepper';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActionSetting } from 'src/app/models/ActionSettingModel';
import { PageChangeModel, SortChangeModel } from 'src/app/models/MatTableChange';
import { PaginateFilter, PaginateRequest, PaginateSort } from 'src/app/models/PaginateRequest';
import { BaseService } from 'src/app/service/BaseService.service';
import { BeanService } from 'src/app/service/BeanService.service';
interface IssueSetting {
  id: number;
  promoCode: string;
  providerName: string;
}

const URL = {
  GET_CUSTOMER: 'customer/get-customer-all',
  ADD_BALANCE: 'wallet/add-balance/',
  REDUCE_BALANCE: 'wallet/reduce-balance/',
  GET_MANUAL_ADJUSTMENT_PG: "manual-adjustment/get-paginate",

  ADD_BALANCE_WALLET: 'wallet/add-balance-wallet/',
  ADD_BONUS_WALLET: 'wallet/add-bonus-wallet/',
  SUBTRACT_BALANCE_WALLET: 'wallet/subtract-balance-wallet/',
  SUBTRACT_BONUS_WALLET: 'wallet/subtract-bonus-wallet/',

  MANUAL_ADD_SUBTRACT: 'wallet/manual-add-subtract/',
  MANUAL_ADJUST_ADD_SUBTRACT: 'wallet/manual-adjust-add-subtract',

  // POO
  FIND_USERNAME: 'customer/get-user/',
  GET_TREE_DATA: 'game-product-type/get-product-type-with-provider',
  PROVIDER: 'game-provider',
}

/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  item: Item;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: Item;
  level: number;
  expandable: boolean;
}
export class Item {
  displayValue: string = null;
  gpCode: string = null;
  gpNameEn: string = null;
  gptCode: string = null;
  gptNameEn: string = null;
}

export interface walletListReq {
  productType: string;
  providerName: string;
  providerCode: string;
}


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
  selector: 'app-manual-adjustment',
  templateUrl: './manual-adjustment.component.html',
  styleUrls: ['./manual-adjustment.component.scss'],
  providers: [ChecklistDatabase, CdkStepper],
})
export class ManualAdjustmentComponent implements OnInit {
  actionSetting: ActionSetting = new ActionSetting({});



  selected1 = '1';
  selected2 = '1';
  selected3 = '1';
  selected4 = '1';
  selected5 = '1';
  selected6 = '1';
  selected7 = '1';
  selected8 = '1';

  // MAH
  selectedAdjustType = '';
  adjustTypeList = [{ value: null, name: 'ALL' }, { value: 2, name: '+' }, { value: 3, name: '-' }]
  adjustTypeList1st = [{ value: 1, name: 'ALL' }, { value: 2, name: '+' }, { value: 3, name: '-' }];
  adjustTypeList2nd = [{ value: 1, name: 'ALL' }, { value: 2, name: '+' }, { value: 3, name: '-' }];
  adjustTypeList3rt = [];

  // Manual And Subtract
  customerList = [];
  selectedWalletType = 'BALANCE';
  selectedWallet = 'MAIN';
  turnoverType = '';
  // selectedMethod = 'mAdd';
  remark = '';
  selectedUser = '';
  balance = 0;
  subStatus = true;
  addStatus = false;
  form: FormGroup;
  listGroup = [];
  listTag = [];
  columnsBatch: any = [
    {
      header: 'Wallet', field: 'wallet', isSelected: (data) => {
        this.changeStatus(data);
      }
    },
    { header: 'Balance', field: 'balance' },
    { header: 'Safety', field: 'safety' },
  ];

  trBatch: any = [
    'select',
    'wallet',
    'balance',
    'safety',
  ];
  dataBatch: any = [
    {
      wallet: 'Main',
      balance: '-',
      safety: 'YES',
    },
    {
      wallet: 'AFFILIATE',
      balance: '-',
      safety: 'YES',
    },
    {
      wallet: 'AE_LOT',
      balance: '-',
      safety: 'No',
    }
  ];
  providerList: any;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private routeParam: ActivatedRoute,
    private httpBeanService: BeanService,
    private httpBaseService: BaseService,
    private formBuilder: FormBuilder,
    private _database: ChecklistDatabase,

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

    this.httpBaseService.doGet('groupLevel/getAllGroupLevel').subscribe((res) => {
      this.listGroup = res?.data ?? [];
    });
    this.httpBaseService.doGet('tag-management').subscribe((res) => {
      this.listTag = res?.data ?? [];
    });
    this.setTreeData();
    this.getDataPaginateManualAdjust();

  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({

      username: ['', Validators.required],
      balance: [null, Validators.required],
      wallet: ['', Validators.required],
      walletType: ['', Validators.required],
      turnoverType: ['', Validators.required],
      turnoverAmount: ['', Validators.required],
      game: [null, Validators.required],
      status: ['ADD'],
    });
  }

  checkFrom() {
    if (this.form.status == 'VALID') {
      return false;
    }
    else {
      return true;
    }
  }

  resetForm() {
    this.form.reset();
  }

  saveManualAddSubtract() {

    let issueSetting: IssueSetting[] = [];
    let a: walletListReq[] = this.getCheckListValue();
    a.forEach((element) => {
      issueSetting.push({
        id: null,
        promoCode: element.providerCode,
        providerName: element.providerName,
      });
    });
    this.form.get('game').setValue(a);
    console.log(a);
    console.log(this.form);
    if (this.form.status == "VALID") {
      this.httpBaseService.doPost(URL.MANUAL_ADJUST_ADD_SUBTRACT, this.form.value).subscribe(res => {
        console.log(res);
      })
    }
    // this.httpBaseService.doGet(URL.MANUAL_ADD_SUBTRACT
    //   + this.form.value.selectedUser + "/" + this.form.value.balance + "/" + this.form.value.selectedWallet + "/"
    //   + this.form.value.selectedWalletType + "/" + !this.addStatus + "/" + !this.subStatus
    // ).subscribe(res => {
    //   if (res.status == 'SUCCESS') {

    //   }
    // });
  }

  addOrSubtract(data) {
    console.log(data);
    if (data == "ADD") {
      this.addStatus = false;
      this.subStatus = true;
      this.form.get('status').setValue("ADD");
      this.form.updateValueAndValidity();
    }
    else if (data == "SUB") {
      this.addStatus = true;
      this.subStatus = false;
      this.form.get('status').setValue("SUBTRACT");
      this.form.updateValueAndValidity();
    }
  }

  changeStatus(data) {
    console.log(data);
  }


  filterCustomer() {
    this.customerList = this.customerList.filter(filter => filter.username == this.selectedUser);
  }


  // Manual Adjust History
  changeAdjType() {

    if (this.selectedAdjustType == 'ALL') {
      console.log("ALL");
      this.adjustTypeList3rt = [{ value: 1, name: 'All' }]
    }
    else if (this.selectedAdjustType == '+') {
      console.log("++++++++");
      this.adjustTypeList3rt = this.adjustTypeList1st;
    }
    else if (this.selectedAdjustType == '-') {
      console.log("--------");
      this.adjustTypeList3rt = this.adjustTypeList2nd;
    }
  }




  // search player id 
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  onKeyup(event: any) {
    if (event.length >= 3) this.findUsername(event);
    else if (event.length < 3) this.options = [];
  }
  onSelectionChanged(event: any) {
    this.findUsername(event);
  }
  clearSearchField() {
    this.form.controls.playerId.setValue(null);
  }
  findUsername(username) {
    this.httpBaseService.doGet(URL.FIND_USERNAME + username).subscribe((res) => {
      if ('SUCCESS' == res.status) {
        this.options = res.data;
        this.filteredOptions = this.form.controls.username.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value))
        );
      }
    });
  }
  private _filter(value: string): string[] {
    const filterValue = value;
    return this.options.filter((option) => option.includes(filterValue));
  }




  // tree bonus


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
    console.log(parent);
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
    this.httpBaseService.doGet(`${URL.GET_TREE_DATA}`).subscribe((data) => {
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
    this.httpBaseService.doGet(`${URL.PROVIDER}`).subscribe((data) => {
      if (data.status == 'SUCCESS') {
        this.providerList = data.data;
      }
    });
  }



  columns: any = [

    {
      header: '#',
      field: 'id',
    },

    { header: 'Create date', field: 'mj.created_at' },
    { header: 'Username', field: 'mj.username' },
    { header: '+/-', field: 'mj.add_subtract' },
    { header: 'Adjustment Type', field: 'mj.adjustment_type' },
    { header: 'Wallet', field: 'mj.wallet' },
    { header: 'Amount', field: 'mj.amount' },
  ];

  tr: any = [
    'mj.created_at',
    'mj.username',
    'mj.add_subtract',
    'mj.adjustment_type',
    'mj.wallet',
    'mj.amount',
  ];

  data: any = [

  ];



  paramManualAdjust: PaginateRequest = new PaginateRequest({
    sort: [
      {
        column: 'mj.created_at',
        order: 'desc',
      }
    ]
  });

  lengthManualAdjust: number = 0;
  getDataPaginateManualAdjust() {
    this.httpBaseService.doPost(URL.GET_MANUAL_ADJUSTMENT_PG, this.paramManualAdjust).subscribe(data => {
      if (data.status == "SUCCESS") {
        this.lengthManualAdjust = data.data.length
        this.data = data.data.data.map(ele => {
          return {
            'mj.id': ele.id,
            'mj.code': ele.code,
            'mj.created_at': ele.created_at,
            'mj.updated_at': ele.updated_at,
            'mj.created_by': ele.created_by,
            'mj.updated_by': ele.updated_by,
            'mj.username': ele.username,
            'mj.adjustment_type': ele.adjustment_type,
            'mj.wallet': ele.wallet,
            'mj.amount': ele.amount,
            'mj.add_subtract': ele.add_subtract,
          }
        })
      }
    })
  }

  actionSettingManualAdjust: ActionSetting = new ActionSetting({
    hideEdit: false,
    hideDelete: false,
  })

  manualAdjustSearch = {
    startDate: null,
    endDate: null,
    username: null,
    wallet: null,
    addOrSubtract: null,
    amountFrom: null,
    amountToo: null,

  }

  search() {
    this.paramManualAdjust.filter = []

    if (this.manualAdjustSearch.startDate) {
      let filter: PaginateFilter = new PaginateFilter();
      filter.column = 'mj.created_date'
      filter.op = '>='
      filter.value = this.manualAdjustSearch.startDate
      this.paramManualAdjust.filter.push(filter);
    }
    if (this.manualAdjustSearch.endDate) {
      let filter: PaginateFilter = new PaginateFilter();
      filter.column = 'mj.created_date'
      filter.op = '>='
      filter.value = this.manualAdjustSearch.endDate
      this.paramManualAdjust.filter.push(filter);
    }
    if (this.manualAdjustSearch.username) {
      let filter: PaginateFilter = new PaginateFilter();
      filter.column = 'mj.username'
      filter.op = '='
      filter.value = this.manualAdjustSearch.username
      this.paramManualAdjust.filter.push(filter);
    }
    if (this.manualAdjustSearch.wallet) {
      let filter: PaginateFilter = new PaginateFilter();
      filter.column = 'mj.wallet'
      filter.op = '='
      filter.value = this.manualAdjustSearch.wallet
      this.paramManualAdjust.filter.push(filter);
    }
    if (this.manualAdjustSearch.addOrSubtract) {
      let filter: PaginateFilter = new PaginateFilter();
      filter.column = 'mj.add_subtract'
      filter.op = '='
      filter.value = this.manualAdjustSearch.addOrSubtract
      this.paramManualAdjust.filter.push(filter);
    }
    if (this.manualAdjustSearch.amountFrom) {
      let filter: PaginateFilter = new PaginateFilter();
      filter.column = 'mj.amount'
      filter.op = '>='
      filter.value = this.manualAdjustSearch.amountFrom
      this.paramManualAdjust.filter.push(filter);
    }
    if (this.manualAdjustSearch.amountToo) {
      let filter: PaginateFilter = new PaginateFilter();
      filter.column = 'mj.amount'
      filter.op = '<='
      filter.value = this.manualAdjustSearch.amountToo
      this.paramManualAdjust.filter.push(filter);
    }

    this.getDataPaginateManualAdjust()
  }

  reset() {
    this.manualAdjustSearch = {
      startDate: null,
      endDate: null,
      username: null,
      wallet: null,
      addOrSubtract: null,
      amountFrom: null,
      amountToo: null,

    }

    this.getDataPaginateManualAdjust()
  }

  pageChangeManualAdjust(event: PageChangeModel) {
    this.paramManualAdjust.page = event.pageIndex
    this.paramManualAdjust.length = event.pageSize
    this.getDataPaginateManualAdjust();
  }

  sortChangeManualAdjust(event: SortChangeModel) {
    this.paramManualAdjust.sort = []
    if (event.direction) {
      let sort: PaginateSort = new PaginateSort();
      sort.column = event.active
      sort.order = event.direction
      this.paramManualAdjust.sort.push(sort)
    }
    this.getDataPaginateManualAdjust();
  }

}
