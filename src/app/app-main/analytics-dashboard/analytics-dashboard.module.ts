import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DxButtonModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxFormModule,
  DxNumberBoxModule,
  DxPopoverModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxSpeedDialActionModule,
  DxTextBoxModule,
  DxDropDownBoxModule,
  DxScrollViewModule,
  DxTooltipModule,
  DxChartModule,
} from "devextreme-angular";
import { AnalyticsDashboardRoutingModule } from "./analytics-dashboard-routing.module";
import { ExportAnalyticsComponent, SingleGroupComparisonGridComponent, MultiGroupComparisonGridComponent, MultiGroupComparisonDetail } from "./export-analytics";
import { SalesAnalyticsComponent, SingleGroupComparisonGridComponentForSale, MultiGroupComparisonGridComponentForSale, MultiGroupComparisonDetailForSale } from "./sales-analytics";
import { UiModule } from "src/app/shared/ui/ui.module";

@NgModule({
  declarations: [
    ExportAnalyticsComponent,
    SingleGroupComparisonGridComponent,
    MultiGroupComparisonGridComponent,
    MultiGroupComparisonDetail,
    SalesAnalyticsComponent,
    SingleGroupComparisonGridComponentForSale,
    MultiGroupComparisonGridComponentForSale,
    MultiGroupComparisonDetailForSale,
  ],
  imports: [
    CommonModule,
    AnalyticsDashboardRoutingModule,
    DxButtonModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxFormModule,
    DxNumberBoxModule,
    DxPopoverModule,
    DxPopupModule,
    DxSelectBoxModule,
    DxSpeedDialActionModule,
    DxTextBoxModule,
    DxDropDownBoxModule,
    DxScrollViewModule,
    DxTooltipModule,
    UiModule,
    DxChartModule,
  ],
})
export class AnalyticsDashboardModule {}
