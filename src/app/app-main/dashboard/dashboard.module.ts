import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AccountsDashboardComponent } from "./accounts-dashboard";
import {
  ApprovalDashboardComponent,
  DeliverOrderApprovalDetailComponent,
  AccountsApprovalComponent,
  WsrmRequisitionOrderApprovalComponent,
  WsrmRequisitionOrderApprovalDetailComponent,
} from "./approval-dashboard";
import { PendingWorkingComponent } from "./pending-working/pending-working.component";
import { AccountsDasboardTradeProComponent } from "./accounts-dashboard-tradePro";
import { InventoryDasboardTradeProComponent } from "./inventory-dashboard-tradepro";
import { ExportDashboardComponent } from "./export-dashboard";
import { UiModule } from "src/app/shared/ui/ui.module";
import {
  DxButtonModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxFormModule,
  DxPopoverModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxNumberBoxModule,
  DxPopupModule,
  DxSpeedDialActionModule,
  DxSwitchModule,
  DxTabPanelModule,
  DxAccordionModule,
  DxTooltipModule,
  DxScrollViewModule
} from "devextreme-angular";

import { InventoryDashboardComponent, InventoryDasboardGridsComponent } from "./inventory-dashboard";
import { InventoryApprovalModule } from "./approval-dashboard/inventory-approval/inventory-approval.module";
import { ImportDashboardComponent } from "./import-dashboard";
import { AccountsDashboardNewComponent } from "./accounts-dashboard-new";
import { ApprovalDashboardNewComponent } from './approval-dashboard-new/approval-dashboard-new.component';

@NgModule({
  declarations: [
    DashboardComponent,
    InventoryDashboardComponent,
    InventoryDasboardGridsComponent,
    AccountsDashboardComponent,
    ApprovalDashboardComponent,
    DeliverOrderApprovalDetailComponent,
    WsrmRequisitionOrderApprovalComponent,
    WsrmRequisitionOrderApprovalDetailComponent,
    PendingWorkingComponent,
    AccountsDasboardTradeProComponent,
    InventoryDasboardTradeProComponent,
    ExportDashboardComponent,
    AccountsApprovalComponent,
    ImportDashboardComponent,
    AccountsDashboardNewComponent,
    ApprovalDashboardNewComponent,
  ],

  imports: [
    CommonModule,
    DashboardRoutingModule,
    DxAccordionModule,
    DxNumberBoxModule,
    DxPopupModule,
    DxSpeedDialActionModule,
    DxTabPanelModule,
    DxSwitchModule,
    CommonModule,
    UiModule,
    DxButtonModule,
    DxDataGridModule,
    DxFormModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxPopoverModule,
    DxDateBoxModule,
    DxTooltipModule,
    InventoryApprovalModule,
    DxScrollViewModule
  ],
  exports:[ApprovalDashboardComponent]
})
export class DashboardModule {}
