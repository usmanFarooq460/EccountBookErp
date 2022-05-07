import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./account/auth/auth.guard";

import { LayoutComponent } from "./layouts/layout/layout.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    loadChildren: () => import("./app-main/dashboard/dashboard.module").then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: "account",
    loadChildren: () => import("./account/account.module").then((m) => m.AccountModule),
  },
  {
    path: "accounts-definition",
    component: LayoutComponent,
    loadChildren: () => import("./app-main/account-definition/account-definition.module").then((m) => m.AccountDefinitionModule),
    canActivate: [AuthGuard],
  },
  {
    path: "account-reports",
    component: LayoutComponent,
    loadChildren: () => import("./app-main/account-reports/account-reports.module").then((m) => m.AccountReportsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "inventory-definition",
    component: LayoutComponent,
    loadChildren: () => import("./app-main/inventory-definition/inventory-definition.module").then((m) => m.InventoryDefinitionModule),
    canActivate: [AuthGuard],
  },
  {
    path: "inventory-reports",
    component: LayoutComponent,
    loadChildren: () => import("./app-main/inventory-reports/inventory-reports.module").then((m) => m.InventoryReportsModule),
    canActivate: [AuthGuard],
  },
  {
    path: "admin-panel",
    component: LayoutComponent,
    loadChildren: () => import("./app-main/admin-panel/admin-panel.module").then((m) => m.AdminPanelModule),
    canActivate: [AuthGuard],
  },
  {
    path: "production",
    component: LayoutComponent,
    loadChildren: () => import("./app-main/production/production.module").then((m) => m.ProductionModule),
    canActivate: [AuthGuard],
  },

  {
    path: "analytics",
    component: LayoutComponent,
    loadChildren: () => import("./app-main/analytics-dashboard/analytics-dashboard.module").then((m) => m.AnalyticsDashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: "cus-sales",
    component: LayoutComponent,
    loadChildren: () => import("./app-main/customer-sales/customer-sales.module").then((m) => m.CustomerSalesModule),
    canActivate: [AuthGuard],
  },
  {
    path: "lab",
    component: LayoutComponent,
    loadChildren: () => import("./app-main/lab/lab.module").then((m) => m.labModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "top" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
