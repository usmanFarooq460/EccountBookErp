import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AccountDefinitionRoutingModule } from "./account-definition-routing.module";
import { AccountsAllocationComponent } from "./accounts-allocation";
import { DefChartOfAccountHistoryComponent, DefineChartOfAccountFormComponent } from "./def-chart-of-account";
import { DefineBankComponent } from "./define-bank";
import { DefineCityComponent } from "./define-city";
import { DefineCountryComponent } from "./define-country";
import { DefineProjectComponent } from "./define-project";
import { DefineProvinceComponent } from "./define-province";

import { OpeningBalanceComponent } from "./opening-balance";
import {
  DxButtonModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxFormModule,
  DxNumberBoxModule,
  DxPopoverModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxSpeedDialActionModule,
  DxTextBoxModule,
  DxScrollViewModule,
  DxDropDownBoxModule,
} from "devextreme-angular";
import { UiModule } from "src/app/shared/ui/ui.module";

import { AccountsBudgetFormComponent, AccountsBudgetHistoryComponent } from "./accounts-budget";
import { CheckBookRegistrationFormComponent, CheckBookRegistrationHistoryComponent, CheckBookRegistrationHistoryDetailComponent } from "./check-book-registration";
import { ChangeAccountStatusComponent } from "./change-account-status/change-account-status.component";
import { CommonPagesModule } from "src/app/app-main/common-pages/common-pages.module"

@NgModule({
  declarations: [
    AccountsAllocationComponent,
    DefChartOfAccountHistoryComponent,
    DefineChartOfAccountFormComponent,
    DefineBankComponent,
    DefineCityComponent,
    DefineCountryComponent,
    DefineProjectComponent,
    DefineProvinceComponent,
    OpeningBalanceComponent,
    AccountsBudgetFormComponent,
    AccountsBudgetHistoryComponent,
    CheckBookRegistrationFormComponent,
    CheckBookRegistrationHistoryComponent,
    CheckBookRegistrationHistoryDetailComponent,
    ChangeAccountStatusComponent,
  ],
  imports: [
    CommonModule,
    AccountDefinitionRoutingModule,
    DxButtonModule,
    DxDataGridModule,
    DxFormModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxPopoverModule,
    DxPopupModule,
    DxDateBoxModule,
    UiModule,
    DxSpeedDialActionModule,
    DxNumberBoxModule,
    DxScrollViewModule,
    DxDropDownBoxModule,
    CommonPagesModule
  ],
  exports: [DefineCountryComponent, DefineCityComponent, DefineBankComponent, DefineProvinceComponent,ChangeAccountStatusComponent],
})
export class AccountDefinitionModule {}
