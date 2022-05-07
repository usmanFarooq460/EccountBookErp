import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AccountsAllocationComponent } from "./accounts-allocation";
import { AccountsBudgetFormComponent, AccountsBudgetHistoryComponent } from "./accounts-budget";
import { DefChartOfAccountHistoryComponent } from "./def-chart-of-account";
import { DefineBankComponent } from "./define-bank";
import { DefineCityComponent } from "./define-city";
import { DefineCountryComponent } from "./define-country";
import { DefineProjectComponent } from "./define-project";
import { DefineProvinceComponent } from "./define-province";
import { OpeningBalanceComponent } from "./opening-balance";
import { ScreenGuard } from "src/app/account/auth/screen-guard";
import { CheckBookRegistrationFormComponent, CheckBookRegistrationHistoryComponent} from "./check-book-registration"

const routes: Routes = [
  { path: "accounts-allocation", component: AccountsAllocationComponent, canActivate: [ScreenGuard], data: { screenName: ["AcfrmAcAllocation"] } },
  { path: "chart-of-account", component: DefChartOfAccountHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["AcfrmDefCoa"] } },
  { path: "bank", component: DefineBankComponent, canActivate: [ScreenGuard], data: { screenName: ["AcfrmDefineBank"] } },
  { path: "country", component: DefineCountryComponent, canActivate: [ScreenGuard], data: { screenName: ["DefineCountry"] } },
  { path: "city", component: DefineCityComponent },
  { path: "project", component: DefineProjectComponent },
  { path: "province", component: DefineProvinceComponent },
  { path: "opening-balance", component: OpeningBalanceComponent, canActivate: [ScreenGuard], data: { screenName: ["AcfrmOpeningBalance"] } },
  { path: "accounts-budget-form", component: AccountsBudgetFormComponent, canActivate: [ScreenGuard], data: { screenName: ["AccountBudget"] } },
  { path: "accounts-budget-history", component: AccountsBudgetHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["AccountBudget"] } },
  // { path: "cheque-book-registration-form", component: CheckBookRegistrationFormComponent},
  { path: "cheque-book-registration-history", component: CheckBookRegistrationHistoryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountDefinitionRoutingModule {}
