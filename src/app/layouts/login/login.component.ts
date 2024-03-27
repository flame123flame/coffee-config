import { log } from 'console';
import { BaseService } from './../../service/BaseService.service';
import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from 'src/app/auth/auth-guard.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BeanService } from 'src/app/service/BeanService.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formLogin: any;

  constructor(
    private router: Router,
    private authGuardService: AuthGuardService,
    private http: BaseService,
    private fb: FormBuilder,
    private beanService: BeanService,
  ) {

  }


  ngOnInit(): void {
    this.formLogin = this.fb.group({
      username: new FormControl({ value: '', disabled: false }, Validators.required),
      password: new FormControl({ value: '', disabled: false }, Validators.required),
    });
  }

  async login() {
    /* Validate Data Required */
    // if (this.formLogin.invalid) return;
    // const data = await this.http.doAuth(this.formLogin.value);
    // if (data != null) {
    //   localStorage.removeItem('token');
    //   localStorage.setItem('token', data.jwttoken);
    //   localStorage.removeItem('menuAccess');
    //   localStorage.setItem('menuAccess', data.menuAccess);
    //   localStorage.removeItem('role');
    //   localStorage.setItem('role', data.role);
    //   this.http.setNewToken(data.jwttoken);
    //   this.beanService.setNewToken(data.jwttoken);
    //   this.router.navigate(['player-management']);
    // }
    console.log("ssss");

    this.router.navigate(['/player-management']);
  }

  onKeyEnter(data) {
    this.login()
  }

}

export interface AuthReq {
  username: string;
  password: string;
}
