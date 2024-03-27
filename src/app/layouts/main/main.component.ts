import { LottoConstants } from './../../pages/lotto-setting/lotto-constants/lotto-constants';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import Menu from '../../config/menu';
import { from } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { BeanService } from 'src/app/service/BeanService.service';
import { SocketServiceWebPlayer } from 'src/app/service/SocketServiceWebPlayer.service';
import { MessageService } from 'src/app/service/message.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  @ViewChild(MatDrawer) public drawer: MatDrawer;

  sumCountLotto = 0;
  countLottoStocksApprove = 0;
  countLottoGovApprove = 0;
  countConfirmLottoTransaction = 0;
  countNotifyYeeKeeApprove = 0;
  showFiller = false;
  menuItemIndex: number = 0;
  supItemIndex: number = 0;
  listMenu = Menu;
  showSupMenu = true;
  newListMenu = [];

  countRegister = 0;
  countDeposit = 0;
  countWithdraw = 0;
  countPromotion = 0;

  constructor(
    private authService: AuthService
    , private router: Router
    , private beanSer: BeanService,
    private socketPlayer: SocketServiceWebPlayer,
  ) {
    this.newListMenu = this.listMenu
    // this.listMenu.forEach(element => {
    //   let menu = localStorage.getItem('menuAccess');
    //   let children = []
    //   element.children.forEach(ele => {
    //     if (menu.match(ele.id) != null) {
    //       children.push(ele)
    //     }
    //   });
    //   if (children.length != 0) {
    //     this.newListMenu.push({ icon: element.icon, id: element.id, path: element.path, title: element.title, children: children })
    //   }
    // });

    this.getCountNotifyYeeKeeApprove();
    this.getCountLottoConfirmTransaction()
    this.getCountGov()
    this.getCountStocks()
    this.initAudio()

  }

  ngOnInit(): void {
    this.socketPlayer.initConnect();
    this.socketPlayer.promotionList.subscribe(data => {
      this.countPromotion += 1
      console.log(data)
      this.playAudioPromotion();
    });
    this.socketPlayer.registerList.subscribe(data => {
      this.countRegister += 1
      console.log(data)
      this.playAudioRegister();
    });
    this.socketPlayer.depositList.subscribe(data => {
      this.countDeposit += 1
      console.log(data)
      this.playAudioDeposit();
    });
    this.socketPlayer.withdrawList.subscribe(data => {
      this.countWithdraw += 1
      console.log(data)
      this.playAudioWithdraw();
    });
  }

  ngOnDestroy() {
    this.socketPlayer.disconnect();
  }

  getCountNotifyYeeKeeApprove() {
    this.beanSer.doGet('yeekee-approve/get-count-checking-yeekee')
      .subscribe((res) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.countNotifyYeeKeeApprove = res.data;
          this.sumCountLotto += this.countNotifyYeeKeeApprove
        }
      });
  }

  getCountLottoConfirmTransaction() {
    this.beanSer.doGet('confirm-transaction/get-count-confirm-transaction')
      .subscribe((res) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.countConfirmLottoTransaction = res.data;
          this.sumCountLotto += this.countConfirmLottoTransaction
        }
      });
  }

  getCountApproveLottoResult() {
    this.beanSer.doGet('confirm-transaction/get-count-confirm-transaction')
      .subscribe((res) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.countConfirmLottoTransaction = res.data;
          this.sumCountLotto += this.countConfirmLottoTransaction
        }
      });
  }

  getCountGov() {
    this.beanSer.doGet('draft-lotto-class/get-count-init/' + LottoConstants.LOTTO_GOVERNMENT)
      .subscribe((res) => {
        this.countLottoGovApprove = res?.data ?? 0;
        this.sumCountLotto += this.countLottoGovApprove
      });
  }

  getCountStocks() {
    this.beanSer.doGet('draft-lotto-class/get-count-init/' + LottoConstants.LOTTO_STOCK)
      .subscribe((res) => {
        this.countLottoStocksApprove = res?.data ?? 0;
        this.sumCountLotto += this.countLottoStocksApprove
      });
  }

  selectMenuItem(index) {
    if (this.menuItemIndex != index) {
      this.supItemIndex = 0;
      this.showSupMenu = false;
      this.checkRoutPage(index)
    }
    this.showSupMenu = !this.showSupMenu;
    this.menuItemIndex = index;
  }
  checkRoutPage(index = 0) {
    // let children = this.newListMenu[index].children;
    // console.log(children);

    // for (let index = 0; index < children.length; index++) {
    //   const element = children[index];
    //   {
    //     this.router.navigate(['/' + element.path])

    //   }
    // }
    // if (children) this.router.navigate(['/' + children[0].path]);
    // else this.router.navigate(['/' + this.listMenu[index].path]);
  }
  selectSupMenuItem(index, path) {
    if (this.supItemIndex != index) this.supItemIndex = index;
    this.router.navigate(['/' + path]);
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  setDrawerMode() {
    return window.screen.width >= 1024 ? 'side' : 'over';
  }

  audioRegister = new Audio("../../../assets/sound/register.mp3")
  audioPromotion = new Audio("../../../assets/sound/promotion_req.mp3")
  audioDeposit = new Audio("../../../assets/sound/deposit_req.mp3")
  audioWithdraw = new Audio("../../../assets/sound/withdrawal_req.mp3")

  initAudio() {
    this.audioRegister.load();
    this.audioPromotion.load();
    this.audioDeposit.load();
    this.audioWithdraw.load();
  }

  playAudioRegister() {
    this.audioRegister.play()
  }
  playAudioPromotion() {
    this.audioPromotion.play()
  }
  playAudioDeposit() {
    this.audioDeposit.play()
  }
  playAudioWithdraw() {
    this.audioWithdraw.play()
  }
  clickNotificationRegister() {
    this.countRegister = 0
    this.router.navigate(['/player-management/bank-verify'])
  }
  clickNotificationPromotion() {
    this.countPromotion = 0
    this.router.navigate(['/promotion-management/promotion-request'])
  }
  clickNotificationDeposit() {
    this.countDeposit = 0
    this.router.navigate(['/finance-management/deposit-list'])
  }
  clickNotificationWithdraw() {
    this.countWithdraw = 0
    this.router.navigate(['/finance-management/withdrawal-list'])
  }
  clickNotifyLottoGov() {
    this.countLottoGovApprove = 0
    this.router.navigate(['/lotto-settings/lotto-draft-class'], { queryParams: { category: LottoConstants.LOTTO_GOVERNMENT } }).then(() => {
      window.location.reload();
    });
  }

  clickNotifyLottoStocks() {
    this.countLottoStocksApprove = 0
    this.router.navigate(['/lotto-settings/lotto-draft-class'], { queryParams: { category: LottoConstants.LOTTO_STOCK } }).then(() => {
      window.location.reload();
    });
  }

  clickConfirmTransaction() {
    this.countConfirmLottoTransaction = 0
    this.router.navigate(['/lotto-settings/confirm-transaction'])
  }

  clickApproveYeekee() {
    this.countConfirmLottoTransaction = 0
    this.router.navigate(['/lotto-settings/lotto-yeekee-approved'])
  }


}
