import { DialogData } from './../pages/player_management/hot-issue/hot-issue-dialog/hot-issue-dialog.component';
import { Injectable } from '@angular/core';
@Injectable()
export class MessageService {
  public static MSG = {
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    DUPLICATE_DATA: 'DUPLICATE_DATA',
    FAILED_CALLBACK: 'กรุณาติดต่อผู้ดูแลระบบ',
    REQUIRE_FIELD: 'กรุณากรอกข้อมูลให้ถูกต้อง',
    DUPLICATE_USER: 'DUPLICATE_USER',
    WRONG_PASSWORD: 'WRONG_PASSWORD',
    PENDING: 'PENDING',
    APPROVE: 'APPROVE',
    REJECT: 'REJECT',
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',

  };
  public static DIALOGMSGCONFIRM = {
    CONFIRM: 'ต้องการยืนยันการทำรายการหรือไม่',
    SAVE: 'ต้องการบันทึกรายการนี้หรือไม่',
    CLONE: 'ต้องการสร้างรายการนี้หรือไม่',
    EDIT: 'ต้องการแก้ไขรายการนี้หรือไม่',
    DELETE: 'ต้องการลบรายการนี้หรือไม่',
    DANGER: '(กรุณาตรวจสอบข้อมูลกับผู้ดูแลระบบก่อนลบ อาจมีผลกระทบต่อระบบ)',
    SYNCDATA: 'ต้องการซิงค์ข้อมูลหรือไม่',
    DELETE_SUCCESS: 'ลบรายการสำเร็จ',
    BLOCK_USERNAME: 'ต้องการปิดการใช้งาน Player Id นี้หรือไม่',
    UN_BLOCK_USERNAME: 'ต้องการเปิดการใช้งาน Player Id นี้หรือไม่',
  };

  public static SAVE = {
    SUCCESS: "บันทึกเรียบร้อยแล้ว",
    FAILED: "บันทึกไม่สำเร็จ",
    DUPLICATE_DATA: "มีอยู่ในระบบแล้ว",
    DUPLICATE_USERNAME_DATA: "มีอยู่USERNAMEในระบบแล้ว",
    DUPLICATE_MOBILE_DATA: "มีเบอร์นี้อยู่ในระบบแล้ว",
  };

  public static GET = {
    SUCCESS: "แสดงข้อมูลสำเร็จ",
    FAILED: "แสดงข้อมูลไม่สำเร็จ",
  }

  public static EDIT = {
    SUCCESS: "แก้ไขเรียบร้อยแล้ว",
    FAILED: "แก้ไขไม่สำเร็จ",
  }

  public static DELETE = {
    SUCCESS: "ลบเรียบร้อยแล้ว",
    FAILED: "ลบไม่สำเร็จ",
  }

  /**
   * 
   * @param status     
   * CLOSED = 0,
     TRYING = 1,
     CONNECTED = 2,
     DISCONNECTING = 3,
   */
  public static GET_STATUS_SOCKET(status) {
    let statusText = '';
    switch (status) {
      case 0:
        statusText = "ไม่สามารถเชื่อมต่อ SERVER ได้";
        break;
      case 1:
        statusText = "กำลังเชื่อมต่อ SERVER..";
        break;
      case 2:
        statusText = "เชื่อมต่อ SERVER สำเร็จ";
        break;
      case 3:
        statusText = "กำลังหยุดการชื่อต่อ SERVER";
        break;
    }
    return statusText;
  }

}
