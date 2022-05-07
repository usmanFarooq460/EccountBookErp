import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DefineItemFormComponent, DefineItemHistoryComponent } from "./define-item";
import { DefineItemcatagoryComponent } from "./define-itemcatagory";
import { DefineItemtaxscheduleComponent } from "./define-itemtaxschedule";
import { DefineItemtypeComponent } from "./define-itemtype";
import { DefineItemuomComponent } from "./define-itemuom";
import { DefineItemuomscheduleComponent } from "./define-itemuomschedule";
import { DefineLotsComponent } from "./define-lots";
import { DefineWarehouseComponent } from "./define-warehouse";
import { ItemGroupComponent } from "./item-group";
import { ItemGroupScheduleComponent } from "./item-group-schedule";
import { ItemPricingScheduleComponent } from "./item-pricing-schedule";
import { DefineItemOthersComponent } from "./define-item-others";
import { DipChartComponent } from "./dip-chart";
import { ScreenGuard } from "src/app/account/auth/screen-guard";
//RetailItem

const routes: Routes = [
  { path: "item-form", component: DefineItemFormComponent, canActivate: [ScreenGuard], data: { screenName: ["InvDefrmAddItem"] } },
  { path: "item-history", component: DefineItemHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["InvDefrmAddItem"] } },
  { path: "item-category", component: DefineItemcatagoryComponent, canActivate: [ScreenGuard], data: { screenName: ["InvDeffrmItemCatagory"] } },
  { path: "item-tax-schedule", component: DefineItemtaxscheduleComponent },
  { path: "item-type", component: DefineItemtypeComponent, canActivate: [ScreenGuard], data: { screenName: ["InvDeffrmItemType"] } },
  { path: "item-uom", component: DefineItemuomComponent, canActivate: [ScreenGuard], data: { screenName: ["InvDeffrmItemItemUom"] } },
  { path: "item-uom-schedule", component: DefineItemuomscheduleComponent, canActivate: [ScreenGuard], data: { screenName: ["InvDeffrmItemUomSchedule"] } },
  { path: "lots", component: DefineLotsComponent, canActivate: [ScreenGuard], data: { screenName: ["AcfrmDefineLots"] } },
  { path: "warehouse", component: DefineWarehouseComponent, canActivate: [ScreenGuard], data: { screenName: ["InvDeffrmWarehouse"] } },
  { path: "item-group", component: ItemGroupComponent },
  { path: "item-group-schedule", component: ItemGroupScheduleComponent },
  { path: "item-pricing-schedule", component: ItemPricingScheduleComponent },
  { path: "define-other-item", component: DefineItemOthersComponent },
  { path: "dip-chart", component: DipChartComponent, canActivate: [ScreenGuard], data: { screenName: ["InvDipReadingChart"] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryDefinitionRoutingModule {}
