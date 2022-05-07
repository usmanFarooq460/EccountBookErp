import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InvFoodProductionRoutingModule } from "./inv-food-production-routing.module";
import { InvFoodProductionMainComponent } from "./inv-food-production-main/inv-food-production-main.component";
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
  DxTabsModule,
  DxToolbarModule,
} from "devextreme-angular";
import { UiModule } from "./../../../shared/ui/ui.module";

import { InvFoodProductionInputFormComponent } from "./Input/inv-food-production-input-form.component";
import { InvFoodProductionOutputFormComponent } from "./output/inv-food-production-output-form.component";
// import { TransactionalHistoryOfInputOutputComponent } from "./transactional-history/transactional-history-of-input-output.component";
import { InvFoodProductionPackingTypeComponent } from "./packing-type/inv-food-production-packing-type.component";
import { InvFoodProductionOverHeadComponent } from "./over-head/inv-food-production-over-head.component";
import { InvFoodProductionSummaryComponent } from "./summary/inv-food-production-summary.component";
import { InvFoodProductionSettlementComponent } from "./settlement/inv-food-production-settlement.component";
import { TransactionalHistoryOfInputOutputComponent } from "./transactional-history/transactional-history-of-input-output.component";
import { ProductionJobOrderMainFormComponent, ProductionJobOrderMainHistoryComponent } from "./production-job-order-main";
import { DefinePlantComponent } from './define-plant/define-plant.component';
// import { }

@NgModule({
  declarations: [
    InvFoodProductionInputFormComponent,
    InvFoodProductionMainComponent,
    InvFoodProductionOutputFormComponent,
    TransactionalHistoryOfInputOutputComponent,
    InvFoodProductionPackingTypeComponent,
    InvFoodProductionOverHeadComponent,
    InvFoodProductionSummaryComponent,
    InvFoodProductionSettlementComponent,
    ProductionJobOrderMainHistoryComponent,
    ProductionJobOrderMainFormComponent,
    DefinePlantComponent,
  ],
  imports: [
    CommonModule,
    InvFoodProductionRoutingModule,
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
    DxTabsModule,
    UiModule,
    DxToolbarModule,
  ],
})
export class InvFoodProductionModule {}
