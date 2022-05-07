import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { labRoutingModule } from "./lab-routing.module";
import { LabItemPerameterComponent } from "./lab-item-perameter/index";
import { LabGroupPerameterComponent } from "./lab-item-group/index";
import { LabGroupAnalysisPerameterComponent } from "./group-analysis-standard";
import { SampleLogRegisterComponent } from "./sample-log-register";
import { SampleAnalysisFormComponent, SampleAnalysisHistoryComponent } from "./sample-analysis/index";
import { PurchaseAnalysisFormComponent, PurchaseAnalysisHistoryComponent } from "./purchase-analysis";
import {
  DxButtonModule,
  DxDataGridModule,
  DxFormModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxPopoverModule,
  DxDateBoxModule,
  DxSpeedDialActionModule,
  DxNumberBoxModule,
  DxLoadPanelModule,
  DxScrollViewModule,
} from "devextreme-angular";
import { UiModule } from "src/app/shared/ui/ui.module";
import { PreShipmentAnalysisFormComponent, PreShipmentHistoryComponent, PreShipmentAnalysisDetailDetailComponent } from "./pre-shipment-analysis";

@NgModule({
  declarations: [
    LabItemPerameterComponent,
    LabGroupPerameterComponent,
    LabGroupAnalysisPerameterComponent,
    SampleLogRegisterComponent,
    SampleAnalysisFormComponent,
    SampleAnalysisHistoryComponent,
    PurchaseAnalysisFormComponent,
    PurchaseAnalysisHistoryComponent,
    PreShipmentAnalysisFormComponent,
    PreShipmentHistoryComponent,
    PreShipmentAnalysisDetailDetailComponent,
  ],
  imports: [
    CommonModule,
    labRoutingModule,
    DxDataGridModule,
    DxButtonModule,
    DxFormModule,
    DxPopupModule,
    CommonModule,
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
    DxLoadPanelModule,
    DxScrollViewModule,
  ],
})
export class labModule {}
