import { CKEditorModule } from 'ng2-ckeditor';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material-module';
import { TableMatComponent } from './table-mat/table-mat.component';
import { ContentComponent } from './content/content.component';
import { ButtonModule } from './button/button.module';
import { CardStatusComponent } from './card-status/card-status.component';
import { MenuDropdownComponent } from './menu-dropdown/menu-dropdown.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ChartsModule } from 'ng2-charts';
import { LineChartComponent } from './line-chart/line-chart.component';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from './loading/loading.component';
import { MatMultipleSelectChipComponent } from './mat-multiple-select-chip/mat-multiple-select-chip.component';

@NgModule({
  declarations: [
    TableMatComponent,
    ContentComponent,
    CardStatusComponent,
    MenuDropdownComponent,
    BarChartComponent,
    LineChartComponent,
    DoughnutChartComponent,
    PieChartComponent,
    TextEditorComponent,
    LoadingComponent,
    MatMultipleSelectChipComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ButtonModule,
    ChartsModule,
    AngularEditorModule,
    HttpClientModule,
    CKEditorModule,
    ReactiveFormsModule
  ],
  exports: [
    TableMatComponent,
    ContentComponent,
    ButtonModule,
    CardStatusComponent,
    MenuDropdownComponent,
    BarChartComponent,
    LineChartComponent,
    DoughnutChartComponent,
    PieChartComponent,
    TextEditorComponent,
    MatMultipleSelectChipComponent,
  ],
})
export class ComponentsModule {}
