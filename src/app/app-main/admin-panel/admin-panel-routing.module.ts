import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ScreenGuard } from "src/app/account/auth/screen-guard";
import { ReportPanelComponent } from "./report-panel/report-panel.component";
import { SmsTemplateComponent } from "./sms-template/sms-template.component";
import { SystemConfigurationComponent } from "./system-configuration/system-configuration.component";
import { DefineComapnyFormComponent, DefineCompanyHistoryComponent } from "./define-company";
import { DefineUserFormComponent, DefineUserHistoryComponent } from "./define-user";
import { DefineOrganizationComponent } from "./define-organization/define-organization.component";

const routes: Routes = [
  { path: "system-configuration", component: SystemConfigurationComponent, canActivate: [ScreenGuard], data: { screenName: ["frmSystemConfiguration"] } },
  { path: "report-panel", component: ReportPanelComponent, canActivate: [ScreenGuard], data: { screenName: ["GeneralReportsPanel"] } },
  { path: "sms-template", component: SmsTemplateComponent, canActivate: [ScreenGuard], data: { screenName: ["frmSMSTemplate"] } },
  { path: "define-company-form", component: DefineComapnyFormComponent, canActivate: [ScreenGuard], data: { screenName: ["frmDefineCompany"] } },
  { path: "define-company-history", component: DefineCompanyHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["frmDefineCompany"] } },
  { path: "define-user-form", component: DefineUserFormComponent },
  { path: "define-user-history", component: DefineUserHistoryComponent },
  { path: "define-organization", component: DefineOrganizationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPanelRoutingModule {}
