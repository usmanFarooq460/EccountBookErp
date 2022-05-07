import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { AccountReportsRoutingModule } from "./account-reports-routing.module";
import { AccountStatementComponent } from "./account-statement";
import { ActivitySummaryComponent } from "./activity-summary";
import { ChartOfAccountComponent } from "./chart-of-account";
import { GeneralLedgerComponent } from "./general-ledger";
import { PayableAgingComponent } from "./payable-aging";
import { ReceivableAgingComponent } from "./receivable-aging";
import { TrialBalanceComponent } from "./trial-balance";
import { TrialBalanceSelectedComponent } from "./trial-balance-selected";
import { VoucherReportsComponent } from "./voucher-reports";
import { VoucherValidationComponent } from "./voucher-validation";
import { CashBalancesComponent } from "./cash-balances";
import { UnbalancedVoucherDashboardComponent } from "./unbalanced-voucher-dashboard";
import { FcBankReport } from "./fc-bank-reports/fc-bank-report.component";
import { UiModule } from "src/app/shared/ui/ui.module";
import { ReceivableFollowUpHistoryComponent, ReceivableFollowUpFormComponent, RecievableDetailComponent } from "./receivable-follow-up";
import { FcyPayablesRecievablesRptComponent } from "./fcy_Payables_Recievables_Rpt";
import { JobtLotManagmentLedgerComponent, JobManagementRptDetailComponent } from "./joblot-managment-ledger";
import { BalanceSheetComponent } from "./balance-sheet";
import { PayablesRecievablesDetailComponent, PyablesRecievablesAgingFormComponent, PyablesRecievablesAgingHistoryComponent } from "./payables-recievables-aging";
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
  DxDropDownBoxModule,
  DxTreeViewModule,
  DxScrollViewModule
} from "devextreme-angular";
import { ReportDataGridComponent } from "src/app/components";
import { PayableComponent } from "./payable";
import { receivableComponent } from "./receivable";
import { BanksBalanceComponent } from "./banks-balance";
import { TrialBalancesAllLevelsComponent } from "./trial-balances-all-levels/trial-balances-all-levels.component";
import { FcyLedgerComponent } from "./fcy-ledger/fcy-ledger.component";
import { ReceiveablesReportNewComponent } from "./receiveables-report-new/receiveables-report-new.component";
import { PayablesReportNewComponent } from "./payables-report-new/payables-report-new.component";
import { InventoryReportsModule} from "src/app/app-main/inventory-reports/inventory-reports.module"
import { ChartsModule } from "src/app/app-main/charts/charts.module"
import { CommonPagesModule } from "src/app/app-main/common-pages/common-pages.module"
import { CommonFormsCollectionForHeperlinksModule } from "../common-forms-collection-for-heperlinks/common-forms-collection-for-heperlinks.module"
@NgModule({
  declarations: [
    AccountStatementComponent,
    ActivitySummaryComponent,
    ChartOfAccountComponent,
    GeneralLedgerComponent,
    PayableAgingComponent,
    ReceivableAgingComponent,
    TrialBalanceComponent,
    TrialBalanceSelectedComponent,
    VoucherReportsComponent,
    VoucherValidationComponent,
    ReportDataGridComponent,
    PayableComponent,
    receivableComponent,
    UnbalancedVoucherDashboardComponent,
    BanksBalanceComponent,
    CashBalancesComponent,
    FcBankReport,
    TrialBalancesAllLevelsComponent,
    RecievableDetailComponent,
    ReceivableFollowUpHistoryComponent,
    ReceivableFollowUpFormComponent,
    FcyPayablesRecievablesRptComponent,
    JobtLotManagmentLedgerComponent,
    JobManagementRptDetailComponent,
    BalanceSheetComponent,
    PayablesRecievablesDetailComponent,
    PyablesRecievablesAgingFormComponent,
    PyablesRecievablesAgingHistoryComponent,
    FcyLedgerComponent,
    ReceiveablesReportNewComponent,
    PayablesReportNewComponent,
  ],
  imports: [
    DxAccordionModule,
    DxNumberBoxModule,
    DxPopupModule,
    DxSpeedDialActionModule,
    DxTabPanelModule,
    DxSwitchModule,
    CommonModule,
    AccountReportsRoutingModule,
    UiModule,
    DxButtonModule,
    DxDataGridModule,
    DxFormModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxPopoverModule,
    DxDateBoxModule,
    PdfViewerModule,
    DxDropDownBoxModule,
    DxTreeViewModule,
    InventoryReportsModule,
    DxScrollViewModule,
    ChartsModule,
    CommonPagesModule,
    CommonFormsCollectionForHeperlinksModule
  ],
  exports:[
    CashBalancesComponent,
    ActivitySummaryComponent,
    PayablesReportNewComponent,
    ReceiveablesReportNewComponent,
    BanksBalanceComponent,
 
  ]
})
export class AccountReportsModule {}
