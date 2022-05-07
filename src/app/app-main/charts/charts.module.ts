import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NestedPieChartComponent } from './nested-pie-chart/nested-pie-chart.component';
import { NgxEchartsModule } from "ngx-echarts";
import { PieChartComponent } from './pie-chart/pie-chart.component';


@NgModule({
  declarations: [NestedPieChartComponent, PieChartComponent],
  imports: [
    CommonModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts")
    }),
  ],
  exports:[
    NestedPieChartComponent,
    PieChartComponent
  ]
})
export class ChartsModule { }
