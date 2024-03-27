import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import Menu from '../config/menu';

@Injectable()
export class AuthGuardService implements CanActivate {
  listMenu = Menu;
  constructor(public auth: AuthService, public router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('canActive : run');
    // url
    let url: string = state.url;
    return this.checkLogin();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('canActivateChild run');
    return this.canActivate(route, state);
  }

  checkLogin() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  checkAccess(url) {
    let access = localStorage.getItem('menuAccess').split(',');
    for (let index = 0; index < this.listMenu.length; index++) {
      let children = this.listMenu[index].children;
      for (let index = 0; index < children.length; index++) {
        const element = children[index];
        console.log(element)
        console.log(url)
        console.log(access)
        if (access.find(el => el === element.id && element.path === url.slice(1, url.length))) {
          return true;
        }
      }
    }
    return false;
  }
}
