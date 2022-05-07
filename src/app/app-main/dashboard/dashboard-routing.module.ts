import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AccountsDashboardComponent } from "./accounts-dashboard";
import { ApprovalDashboardComponent } from "./approval-dashboard";
import { PendingWorkingComponent } from "./pending-working/pending-working.component";
import { InventoryDashboardComponent } from "./inventory-dashboard";
import { AccountsDasboardTradeProComponent } from "./accounts-dashboard-tradePro";
import { InventoryDasboardTradeProComponent } from "./inventory-dashboard-tradepro";
import { ExportDashboardComponent } from "./export-dashboard";
import { ImportDashboardComponent } from "./import-dashboard";
import { AccountsDashboardNewComponent } from "./accounts-dashboard-new";
import { ScreenGuard } from "src/app/account/auth/screen-guard";
import { ApprovalDashboardNewComponent } from "./approval-dashboard-new/approval-dashboard-new.component";
const routes: Routes = [
  { path: "", component: DashboardComponent },

  { path: "accounts-dashboard", component: AccountsDashboardComponent, canActivate: [ScreenGuard], data: { screenName: ["AcFrmDashboard"] } },
  { path: "Approval-Dashboard", component: ApprovalDashboardComponent },
  { path: "Approval-Dashboard-new", component: ApprovalDashboardNewComponent },
  { path: "Pending-Working", component: PendingWorkingComponent, canActivate: [ScreenGuard], data: { screenName: ["InventoryPendingWorkDashboard"] } },
  { path: "inventory-dasboard", component: InventoryDashboardComponent, canActivate: [ScreenGuard], data: { screenName: ["InventoryDashboard"] } },
  { path: "accounts-dashboard-trade-pro", component: AccountsDasboardTradeProComponent, canActivate: [ScreenGuard], data: { screenName: ["AccountsDashboardTradePro"] } },
  { path: "inventory-dashboard-trade-pro", component: InventoryDasboardTradeProComponent, canActivate: [ScreenGuard], data: { screenName: ["ProfitLossDashboardTradePro"] } },
  { path: "export-dashboard", component: ExportDashboardComponent, canActivate: [ScreenGuard], data: { screenName: ["ExportDashboard"] } },
  { path: "import-dashboard", component: ImportDashboardComponent, canActivate: [ScreenGuard], data: { screenName: ["ImportDashboard"] } },
  { path: "accounts-dashboard-new", component: AccountsDashboardNewComponent, canActivate: [ScreenGuard], data: { screenName: ["AccountsDashboardNew"] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
