import { BaseService } from './service/BaseService.service';
import { BeanService } from './service/BeanService.service';
import { environment } from './../environments/environment';
// import { TagManagementService } from './service/tag-management.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { LoginComponent } from './layouts/login/login.component';
import { MainComponent } from './layouts/main/main.component';
import { ComponentsModule } from './components/components.module';
import { LoginRoutingModule } from './modules/login-routing/login-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [AppComponent, LoginComponent, MainComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ComponentsModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
  providers: [
    BaseService,
    BeanService,
    { provide: 'API_BASE_URL', useValue: environment.API_BASE_URL },
    { provide: 'API_URL', useValue: environment.API_URL },
    { provide: 'API_IMG_URL', useValue: environment.API_IMG_URL },
    { provide: 'API_WEBPLAYER_URL', useValue: environment.API_WEBPLAYER_URL },
    { provide: 'API_WEBPLAYER_MAIN', useValue: environment.API_WEBPLAYER_MAIN },
    { provide: 'API_BEAN_URL', useValue: environment.API_BEAN_URL },
    { provide: 'API_BEAN_MAIN', useValue: environment.API_BEAN_MAIN },
    { provide: 'FILE_UPLOAD_URL', useValue: environment.FILE_UPLOAD_URL },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
