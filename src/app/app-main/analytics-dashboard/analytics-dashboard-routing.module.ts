import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ExportAnalyticsComponent } from "./export-analytics";
import { ScreenGuard } from "src/app/account/auth/screen-guard";
import { SalesAnalyticsComponent, SingleGroupComparisonGridComponentForSale, MultiGroupComparisonGridComponentForSale, MultiGroupComparisonDetailForSale } from "./sales-analytics";
const routes: Routes = [
  { path: "export-analytics", component: ExportAnalyticsComponent, canActivate: [ScreenGuard], data: { screenName: ["frmExportAnalytics"] } },
  { path: "sales-analytics", component: SalesAnalyticsComponent, canActivate: [ScreenGuard], data: { screenName: ["frmSalesAnalytics"] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalyticsDashboardRoutingModule {}
