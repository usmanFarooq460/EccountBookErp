import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductionRoutingModule } from "./production-routing.module";
import { ProductionJobOrderHistoryComponent, ProductionJobOrderFormComponent, ProductionJobOrderDetailComponent } from "./production-job-order";
import { VarietyConversionFormComponent, VarietyConversionHistoryComponent, VarietyConversionDetail } from "./variety-conversion";
import { VarietyConversionTradeProFormComponent, VarietyConversionTradeProHistoryComponent, VarietyConversionTradeProDetail } from "./variety-conversion-trade-pro";
import {
  DxButtonModule,
  DxCheckBoxModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxFormModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
  DxSpeedDialActionModule,
  DxTabPanelModule,
  DxTextAreaModule,
  DxTextBoxModule,
  DxLoadPanelModule,
  DxPopupModule,


} from "devextreme-angular";
import { UiModule } from "src/app/shared/ui/ui.module";
import { DataGridComponent } from "src/app/components/data-grid/data-grid.component";
import { FoodProductionFormComponent, FoodProductionHistoryComponent } from "./food-production";
// import { InvFoodProductionInputFormComponent, InvFoodProductionInputHistoryComponent } from "./inv-food-production-input";
// import { LoaderForAvailableTransactionsForIssuanceComponent } from "./loader-for-available-transactions-for-issuance/loader-for-available-transactions-for-issuance.component";

@NgModule({
  declarations: [
    DataGridComponent,
    FoodProductionFormComponent,
    FoodProductionHistoryComponent,
    ProductionJobOrderHistoryComponent,
    ProductionJobOrderFormComponent,
    ProductionJobOrderDetailComponent,
    VarietyConversionFormComponent,
    VarietyConversionHistoryComponent,
    VarietyConversionDetail,
    VarietyConversionTradeProFormComponent,
    VarietyConversionTradeProHistoryComponent,
    VarietyConversionTradeProDetail,
    // InvFoodProductionInputFormComponent,
    // InvFoodProductionInputHistoryComponent,
    // LoaderForAvailableTransactionsForIssuanceComponent,
  ],
  imports: [
    CommonModule,
    ProductionRoutingModule,
    DxButtonModule,
    DxDataGridModule,
    DxButtonModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxDateBoxModule,
    DxFormModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxTextAreaModule,
    DxSpeedDialActionModule,
    DxTabPanelModule,
    UiModule,
    DxLoadPanelModule,
    DxPopupModule
  ],
})
export class ProductionModule {}
