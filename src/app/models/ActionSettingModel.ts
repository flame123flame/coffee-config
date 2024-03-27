import { element } from 'protractor';
export class ActionSetting {
  hideEdit: boolean = true;
  hideDelete: boolean = true;
  hideDetail: boolean = false;
  hideAction: any = null;
  type: string = null;
  textCancel: string = null;
  textConfirm: string = null;
  onCancel: any = null;
  onConfirm: any = null;
  showFunction: any = (row, i) => { return true };
  listIcon?: EditIcon[]

  constructor(config: any = {}) {
    config.hideEdit != null ? this.hideEdit = config.hideEdit : null;
    config.hideDelete != null ? this.hideDelete = config.hideDelete : null;
    config.hideDetail != null ? this.hideDetail = config.hideDetail : null;
    config.hideAction != null ? this.hideAction = config.hideAction : null;
    config.type != null ? this.type = config.type : null;
    config.textCancel != null ? this.textCancel = config.textCancel : null;
    config.textConfirm != null ? this.textConfirm = config.textConfirm : null;
    config.onCancel != null ? this.onCancel = config.onCancel : null;
    config.onConfirm != null ? this.onConfirm = config.onConfirm : null;
    config.showFunction != null ? this.showFunction = config.showFunction : null;
    if (config.listIcon) {
      this.listIcon = [];
      config.listIcon.forEach(element => {
        let iconItem: EditIcon = new EditIcon
        element.color != null ? iconItem.color = element.color : null;
        element.icon != null ? iconItem.icon = element.icon : null;
        element.showFunction != null ? iconItem.showFunction = element.showFunction : null;
        element.action != null ? iconItem.action = element.action : null;
        element.type != null ? iconItem.type = element.type : null;
        element.text != null ? iconItem.text = element.text : null;
        element.tooltip !=null ? iconItem.tooltip = element.tooltip : null;
        this.listIcon.push(iconItem)
      });
    }
  }
}

export class EditIcon {
  color: string = 'black';
  icon: string = null;
  showFunction: any = (row, i) => { return true };
  action: any = null;
  type : string = 'icon';
  text : string = 'click';
  tooltip: string = null;
}
