import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LabItemPerameterComponent } from "./lab-item-perameter/index";
import { LabGroupPerameterComponent } from "./lab-item-group/index";
import { LabGroupAnalysisPerameterComponent } from "./group-analysis-standard";
import { SampleLogRegisterComponent } from "./sample-log-register";
import { SampleAnalysisFormComponent, SampleAnalysisHistoryComponent } from "./sample-analysis/index";
import { PurchaseAnalysisFormComponent, PurchaseAnalysisHistoryComponent } from "./purchase-analysis";
import { ScreenGuard } from "src/app/account/auth/screen-guard";
import { PreShipmentHistoryComponent, PreShipmentAnalysisFormComponent } from "./pre-shipment-analysis";

const routes: Routes = [
  { path: "lab-item-perameter", component: LabItemPerameterComponent, canActivate: [ScreenGuard], data: { screenName: ["InvLabAnalysisItems"] } },
  { path: "lab-item-group", component: LabGroupPerameterComponent, canActivate: [ScreenGuard], data: { screenName: ["InvLabAnalysisGroup"] } },
  { path: "anlysis-group-standard", component: LabGroupAnalysisPerameterComponent, canActivate: [ScreenGuard], data: { screenName: ["InvLabGroupAnalysisStandards"] } },
  { path: "sample-log-register", component: SampleLogRegisterComponent }, //, canActivate: [ScreenGuard], data: { screenName: ["InvLabSampleLogRegister"] }
  { path: "sample-analysis-form", component: SampleAnalysisFormComponent }, //, canActivate: [ScreenGuard], data: { screenName: ["frmGDNHistory"] }
  { path: "sample-analysis-history", component: SampleAnalysisHistoryComponent }, // canActivate: [ScreenGuard], data: { screenName: ["InvLabSampleAnalysis"] }
  { path: "purchase-analysis-form", component: PurchaseAnalysisFormComponent }, //, canActivate: [ScreenGuard], data: { screenName: ["InvLabPurchaseAnalysis"] }
  { path: "purchase-analysis-history", component: PurchaseAnalysisHistoryComponent }, //, canActivate: [ScreenGuard], data: { screenName: ["InvLabPurchaseAnalysis"] }
  { path: "pre-shipment-analysis-form", component: PreShipmentAnalysisFormComponent, canActivate: [ScreenGuard], data: { screenName: ["EximPreProductionLab"] } },
  { path: "pre-shipment-analysis-history", component: PreShipmentHistoryComponent, canActivate: [ScreenGuard], data: { screenName: ["EximPreProductionLab"] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class labRoutingModule {}
