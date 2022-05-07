import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { PdfReportsCommonMethods } from "src/app/shared/base/pdf-reports-common-methods";
import { PreShipmentAnalysisService } from "../pre-shipment-analysis.service";
import { PreShipmentAnalysisHistoryFilterCriteriasModel } from "../pre-shipment-analysis.model";
@Component({
  selector: "app-pre-shipment-analysis-history",
  templateUrl: "./pre-shipment-analysis-history.component.html",
  styleUrls: [],
})
export class PreShipmentHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("PreShipmentSearchCritereas", { static: false })
  PreShipmentSearchCritereas: DxFormComponent;
  PreShipmentSearchCritereasData: PreShipmentAnalysisHistoryFilterCriteriasModel;
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  dataSource = [];
  InspectionStatusList = [
    { Id: 1, Label: "Pending" },
    { Id: 2, Label: "Confirmed" },
  ];
  ApprovalStatusList = [
    { Id: true, Label: "Approved" },
    { Id: false, Label: "Not Approved" },
  ];
  constructor(
    private router: Router,
    private commonMethods: CommonMethodsForCombos,
    private service: PreShipmentAnalysisService,
    private commonService: CommonBaseService,
    private pdfReportCommonMethods: PdfReportsCommonMethods
  ) {
    super();
  }
  async ngOnInit() {
    this.PreShipmentSearchCritereasData = new PreShipmentAnalysisHistoryFilterCriteriasModel();
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("EximPreProductionLab"));
    this.History(21);
  }
  onEdit(e) {
    if (this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have Right to Update!");
      return;
    } else if (this.UserRightsObject.canUpdate == true && e.IsApproved == "Approved" && e.ReportStatus == "Confirmed") {
      this.WarningPopup("You cannot Edit Record as it is Approved and Confirmed!");
      return;
    }
    this.router.navigate(["/lab/pre-shipment-analysis-form"], {
      queryParams: { Id: e.Id, Type: e.IsApproved == "Approved" ? 2 : 1 },
    });
  }
  gotoSaleOrderForm() {
    this.UserRightsObject.canSave ? this.router.navigate(["/lab/pre-shipment-analysis-form"]) : this.WarningPopup("You dont have Right To Save");
  }
  History(Records) {
    this.ActivateLoadPanel("Loading History!");
    this.service
      .Getformhistory({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        ApprovedFilter: this.PreShipmentSearchCritereasData.ReportStatus != null && this.PreShipmentSearchCritereasData.ReportStatus != undefined ? "GetAccordingToStatus" : "All",
        ReportStatus: this.PreShipmentSearchCritereasData.ReportStatus,
        InspectionStatus: this.PreShipmentSearchCritereasData.InspectionStatus,
      })
      .subscribe(
        (resp) => {
          this.DeActivateLoadPanel();
          this.dataSource = this.GenerateHeaderData(resp, "Id");
        },
        (error) => {
          console.log(error);
          this.DeActivateLoadPanel;
          this.HandleError(error);
        }
      );
  }
  LoadAllRecords = (e) => {
    this.History(null);
  };
  GetSpecificNumberOfRecords() {
    this.History(21);
  }
  async Slip513(e) {
    this.ActivateLoadPanel("Loading Report!");
    this.OpenPdfReportInNewTab(await this.pdfReportCommonMethods.ExportPreShipmentAnalysisSlip_513(e.Id).catch((error) => this.HandleError(error)));
    this.DeActivateLoadPanel();
  }
  async Register514() {
    this.ActivateLoadPanel("Loading Report!");
    this.OpenPdfReportInNewTab(await this.pdfReportCommonMethods.ExportPreShipmentAnalysisRegister_514().catch((error) => this.HandleError(error)));
    this.DeActivateLoadPanel();
  }
  DummyMethod() {}
  onToolbarPreparing(event) {
    this.ReportButtonInGridToolbar(event, "PreShipmentAnalysisRegister-514", this.Register514.bind(this));
    this.RefreshButtonInGridToolbar(event, () =>
      this.RefreshHistoryGridGrid(this.GetSpecificNumberOfRecords.bind(this), this.HistoryGridSateKey("ExportPreProductionLabHistoryGridState"), this.dataGrid)
    );
  }
}
