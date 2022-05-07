import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AdminPanelRoutingModule } from "./admin-panel-routing.module";
import { ReportPanelComponent } from "./report-panel/report-panel.component";
import { SystemConfigurationComponent } from "./system-configuration/system-configuration.component";
import {
  DxAccordionModule,
  DxButtonModule,
  DxRadioGroupModule,
  DxNumberBoxModule,
  DxTabPanelModule,
  DxFormModule,
  DxHtmlEditorModule,
  DxSelectBoxModule,
  DxSwitchModule,
  DxTextBoxModule,
  DxDataGridModule,
  DxDropDownBoxModule,
  DxPopupModule,
  DxScrollViewModule,
  DxTemplateModule,
  DxFileUploaderModule,
} from "devextreme-angular";
import { UiModule } from "src/app/shared/ui/ui.module";
import { SmsTemplateComponent } from "./sms-template/sms-template.component";
import { DefineComapnyFormComponent, DefineCompanyHistoryComponent } from "./define-company";
import { DefineUserFormComponent, DefineUserHistoryComponent } from "./define-user";

import { DefineOrganizationComponent } from "./define-organization/define-organization.component";

@NgModule({
  declarations: [
    ReportPanelComponent,
    SystemConfigurationComponent,
    SmsTemplateComponent,
    DefineComapnyFormComponent,
    DefineCompanyHistoryComponent,
    DefineUserFormComponent,
    DefineUserHistoryComponent,

    DefineOrganizationComponent,
  ],
  imports: [
    CommonModule,
    AdminPanelRoutingModule,
    DxRadioGroupModule,
    DxNumberBoxModule,
    DxAccordionModule,
    DxFormModule,
    DxButtonModule,
    DxSwitchModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxHtmlEditorModule,
    DxDataGridModule,
    DxDropDownBoxModule,
    DxPopupModule,
    DxTabPanelModule,
    UiModule,
    DxTemplateModule,
    DxFileUploaderModule,
    DxScrollViewModule,
  ],
})
export class AdminPanelModule {}
