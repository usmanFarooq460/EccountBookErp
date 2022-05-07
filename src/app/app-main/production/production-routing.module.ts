import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FoodProductionFormComponent } from "./food-production";
import { ProductionJobOrderHistoryComponent, ProductionJobOrderFormComponent } from "./production-job-order";
import { VarietyConversionFormComponent, VarietyConversionHistoryComponent } from "./variety-conversion";
import { VarietyConversionTradeProFormComponent, VarietyConversionTradeProHistoryComponent } from "./variety-conversion-trade-pro";
import { ScreenGuard } from "src/app/account/auth/screen-guard";
import { AuthGuard } from "src/app/account/auth/auth.guard";
const routes: Routes = [
  { path: "food-production-form", component: FoodProductionFormComponent, canActivate: [ScreenGuard], data: { screenName: ["frmFoodProduction"] } },
  { path: "production-job-order-history", component: ProductionJobOrderHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["frmProductionJobOrder"] } },
  { path: "production-job-order-form", component: ProductionJobOrderFormComponent, canActivate: [ScreenGuard], data: { screenName: ["frmProductionJobOrder"] } },
  { path: "variety-conversion-form", component: VarietyConversionFormComponent, canActivate: [ScreenGuard], data: { screenName: ["invfrmStockConversionProduction"] } },
  { path: "variety-conversion-history", component: VarietyConversionHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["invfrmStockConversionProduction"] } },
  { path: "variety-conversion-trade-pro-form", component: VarietyConversionTradeProFormComponent, canActivate: [ScreenGuard], data: { screenName: ["frmInvStockConversionTrade"] } },
  { path: "variety-conversion-trade-pro-history", component: VarietyConversionTradeProHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["frmInvStockConversionTrade"] } },
  { path: "inv-food-production",
  loadChildren: () => import("./inv-food-production/inv-food-production.module").then((m) => m.InvFoodProductionModule),
  canActivate: [AuthGuard],}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionRoutingModule {}
