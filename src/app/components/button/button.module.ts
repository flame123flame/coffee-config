import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module';
import { ButtonAddComponent } from './button-add/button-add.component';
import { ButtonDeleteComponent } from './button-delete/button-delete.component';
import { ButtonEditComponent } from './button-edit/button-edit.component';
import { ButtonSearchComponent } from './button-search/button-search.component';
import { ButtonSaveComponent } from './button-save/button-save.component';
import { ButtonCancelComponent } from './button-cancel/button-cancel.component';
import { ButtonResetComponent } from './button-reset/button-reset.component';
import { ButtonUpdateComponent } from './button-update/button-update.component';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [
    ButtonAddComponent,
    ButtonDeleteComponent,
    ButtonEditComponent,
    ButtonSearchComponent,
    ButtonSaveComponent,
    ButtonCancelComponent,
    ButtonResetComponent,
    ButtonUpdateComponent
  ],
  exports: [
    ButtonAddComponent,
    ButtonDeleteComponent,
    ButtonEditComponent,
    ButtonSearchComponent,
    ButtonSaveComponent,
    ButtonCancelComponent,
    ButtonResetComponent,
    ButtonUpdateComponent
  ],
})
export class ButtonModule {}
