import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
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
import { PayableComponent } from "./payable";
import { receivableComponent } from "./receivable";
import { UnbalancedVoucherDashboardComponent } from "./unbalanced-voucher-dashboard";
import { BanksBalanceComponent } from "./banks-balance";
import { CashBalancesComponent } from "./cash-balances";
import { FcBankReport } from "./fc-bank-reports/fc-bank-report.component";
import { TrialBalancesAllLevelsComponent } from "./trial-balances-all-levels/trial-balances-all-levels.component";
import { ReceivableFollowUpHistoryComponent, ReceivableFollowUpFormComponent, RecievableDetailComponent } from "./receivable-follow-up";
import { FcyPayablesRecievablesRptComponent } from "./fcy_Payables_Recievables_Rpt";
import { JobtLotManagmentLedgerComponent } from "./joblot-managment-ledger";
import { BalanceSheetComponent } from "./balance-sheet";
import { PyablesRecievablesAgingFormComponent } from "./payables-recievables-aging";
import { FcyLedgerComponent } from "./fcy-ledger/fcy-ledger.component";
import { ReceiveablesReportNewComponent } from "./receiveables-report-new/receiveables-report-new.component";
import { PayablesReportNewComponent } from "./payables-report-new/payables-report-new.component";
const routes: Routes = [
  { path: "account-statement", component: AccountStatementComponent },
  { path: "activity-summary", component: ActivitySummaryComponent },
  { path: "coa", component: ChartOfAccountComponent },
  { path: "general-ledger", component: GeneralLedgerComponent },
  { path: "payable-aging", component: PayableAgingComponent },
  { path: "receivable-aging", component: ReceivableAgingComponent },
  { path: "trial-balance", component: TrialBalanceComponent },
  { path: "trial-balance-selected", component: TrialBalanceSelectedComponent },
  { path: "voucher-reports", component: VoucherReportsComponent },
  { path: "voucher-validation", component: VoucherValidationComponent },
  { path: "payable", component: PayableComponent },
  { path: "receivable", component: receivableComponent },
  { path: "unbalanced-voucher-dashboard", component: UnbalancedVoucherDashboardComponent },
  { path: "bank-balances", component: BanksBalanceComponent },
  { path: "cash-balances", component: CashBalancesComponent },
  { path: "fcy-bank-receipt", component: FcBankReport },
  { path: "trial-balance-all-level", component: TrialBalancesAllLevelsComponent },
  { path: "receivableFollowUp-history", component: ReceivableFollowUpHistoryComponent },
  { path: "receivableFollowUp-form", component: ReceivableFollowUpFormComponent },
  { path: "fcy-payables-receivables-rpt", component: FcyPayablesRecievablesRptComponent },
  { path: "job-managment-ledger", component: JobtLotManagmentLedgerComponent },
  { path: "balance-sheet", component: BalanceSheetComponent },

  { path: "payables-recievables-aging", component: PyablesRecievablesAgingFormComponent },
  { path: "fcy-general-ledger", component: FcyLedgerComponent },
  { path: "receivables-report-new", component: ReceiveablesReportNewComponent },
  { path: "payables-report-new", component: PayablesReportNewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountReportsRoutingModule {}
