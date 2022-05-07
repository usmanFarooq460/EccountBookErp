import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { InventoryDefinitionRoutingModule } from "./inventory-definition-routing.module";

import { DefineItemFormComponent, DefineItemHistoryComponent } from "./define-item";
import { DefineItemcatagoryComponent } from "./define-itemcatagory";
import { DefineItemtaxscheduleComponent } from "./define-itemtaxschedule";
import { DefineItemtypeComponent } from "./define-itemtype";
import { DefineItemuomComponent } from "./define-itemuom";
import { DefineItemuomscheduleComponent } from "./define-itemuomschedule";
import { DefineLotsComponent } from "./define-lots";
import { DefineItemOthersComponent } from "./define-item-others";
import { DefineWarehouseComponent } from "./define-warehouse";
import { ItemGroupComponent } from "./item-group";
import { ItemGroupScheduleComponent } from "./item-group-schedule";
import { ItemPricingScheduleComponent } from "./item-pricing-schedule";
import { DipChartComponent } from "./dip-chart";
//Reatail

import { DxButtonModule, DxDataGridModule,DxDropDownBoxModule ,DxDateBoxModule, DxFormModule, DxPopupModule, DxSelectBoxModule, DxTextBoxModule } from "devextreme-angular";
import { UiModule } from "src/app/shared/ui/ui.module";
import { StockAdjustmentReasonsComponent} from "./stock-adjustment-reasons/stock-adjustment-reasons.component"

@NgModule({
  declarations: [
    DefineItemFormComponent,
    DefineItemHistoryComponent,
    DefineItemcatagoryComponent,
    DefineItemtaxscheduleComponent,
    DefineItemtypeComponent,
    DefineItemuomComponent,
    DefineItemuomscheduleComponent,
    DefineLotsComponent,
    DefineWarehouseComponent,
    ItemGroupComponent,
    ItemGroupScheduleComponent,
    ItemPricingScheduleComponent,
    DefineItemOthersComponent,
    DipChartComponent,
    StockAdjustmentReasonsComponent
  ],
  imports: [CommonModule, DxDropDownBoxModule,InventoryDefinitionRoutingModule, DxButtonModule, DxDataGridModule, DxFormModule, DxSelectBoxModule, DxTextBoxModule, DxPopupModule, DxDateBoxModule, UiModule],
  exports: [
    DefineItemHistoryComponent,
    DefineItemOthersComponent,
    DefineItemcatagoryComponent,
    DefineItemtypeComponent,
    ItemGroupComponent,
    ItemGroupScheduleComponent,
    DefineItemuomComponent,
    DefineItemuomscheduleComponent,
    DefineLotsComponent,
    DefineWarehouseComponent,
    StockAdjustmentReasonsComponent
  ],
})
export class InventoryDefinitionModule {}
