import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthReq } from '../layouts/login/login.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class BeanService {
  private userToken: string;
  private path = '';
  private httpOptions = {};
  constructor(
    @Inject('API_BEAN_URL') public api_url: string,
    private http: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService: AuthService
  ) { }

  getNewToken() {
    this.userToken = localStorage.getItem('token');
  }

  setNewToken(token) {
    this.userToken = token;
  }

  getHttpHeaders(): HttpHeaders {
    if (!this.userToken) this.userToken = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.userToken}`,
    });
  }

  doAuth<T>(body: AuthReq): any {
    // this.spinner.show();
    // return new Promise<T | any>((resolve, reject) => {
    //   this.http
    //     .post(`${environment.API_MAIN}token/generate-token/bo`, body, {
    //       headers: { 'Content-Type': 'application/json' },
    //     })
    //     .subscribe(
    //       (res) => {
    //         this.spinner.hide();
    //         resolve(res);
    //       },
    //       (error) => {
    //         this.spinner.hide();
    //         reject(error);
    //       }
    //     );
    // });
  }

  doGet(url) {
    this.spinner.show();
    return this.http
      .get(`${this.api_url}/${url}`, { headers: this.getHttpHeaders() })
      .pipe(
        map((res: any) => {
          this.spinner.hide();
          return res;
        }),
        catchError(this.doHandleError)
      );
  }

  doPost(url, data) {
    this.spinner.show();
    return this.http
      .post(`${this.api_url}/${url}`, data, { headers: this.getHttpHeaders() })
      .pipe(
        map((res: any) => {
          this.spinner.hide();
          return res;
        }),
        catchError(this.doHandleError)
      );
  }

  doDelete(url) {
    this.spinner.show();
    return this.http
      .delete(`${this.api_url}/${url}`, { headers: this.getHttpHeaders() })
      .pipe(
        map((res: any) => {
          this.spinner.hide();
          return res;
        }),
        catchError(this.doHandleError)
      );
  }

  doPut(url, data) {
    this.spinner.show();
    return this.http
      .put(`${this.api_url}/${url}`, data, { headers: this.getHttpHeaders() })
      .pipe(
        map((res: any) => {
          this.spinner.hide();
          return res;
        }),
        catchError(this.doHandleError)
      );
  }

  doPatch(url, data) {
    this.spinner.show();
    return this.http
      .patch(`${this.api_url}/${url}`, data, { headers: this.getHttpHeaders() })
      .pipe(
        map((res: any) => {
          this.spinner.hide();
          return res;
        }),
        catchError(this.doHandleError)
      );
  }

  private doHandleError = (err, caught) => {
    this.spinner.hide();
    if (err.status === 401) {
      this.userToken = null;
      this.authService.logout();
      this.router.navigate(['/login']);
    }
    return Promise.reject(err.message || err);
  };
}
