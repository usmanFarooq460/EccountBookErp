import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
// import { WsrmTransferNotesHistoryDetailComponent } from "src/app/app-main/whole-sale-retail-management/wsrm-transfer-notes";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { PdfReportsCommonMethods } from "src/app/shared/base/pdf-reports-common-methods";
import { PreProductionLabService } from "../pre-production-lab.service";
import { preProductionLabHistoryModel } from "./pre-production-lab-history.model";
@Component({
  selector: "app-pre-production-lab-history",
  templateUrl: "./pre-production-lab-history.component.html",
  styleUrls: [],
})
export class PreProductionLabHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("PreShipmentSearchCritereas", { static: false })
  PreShipmentSearchCritereas: DxFormComponent;
  PreShipmentSearchCritereasData: preProductionLabHistoryModel;
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
    private service: PreProductionLabService,
    private commonService: CommonBaseService,
    private pdfReportCommonMethods: PdfReportsCommonMethods
  ) {
    super();
    this.filter = true;
  }
  async ngOnInit() {
    this.PreShipmentSearchCritereasData=new preProductionLabHistoryModel()
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("EximPreProductionLab"));
    this.History(21);
  }



  onEdit(e) {
    this.UserRightsObject.canUpdate
      ? this.router.navigate(["/cus-sales/pre-production-form"], {
          queryParams: { Id: e.Id, Type: e.IsApproved == true ? 2 : 1 },
        })
      : this.ErrorPopup("You dont have Right to Update!");
  }

  gotoSaleOrderForm() {
    this.UserRightsObject.canSave ? this.router.navigate(["/cus-sales/pre-production-form"]) : this.WarningPopup("You dont have Right To Save");
  }
  History(Records) {
    console.log("Pre Shipment Search Criterea Data", this.PreShipmentSearchCritereasData);

    this.ActivateLoadPanel("Loading History!");
    this.service
      .Getformhistory({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        ApprovedFilter: "All",
        ReportStatus: this.PreShipmentSearchCritereasData.ReportStatus,
        InspectionStatus: this.PreShipmentSearchCritereasData.InspectionStatus,
        IsApproved: true,
        CanViewAllRecord: this.UserRightsObject.CanView_AllRecord,
        EntryUser: sessionStorage.getItem("UserId"),
        NoOfRecords: Records,
      })
      .subscribe(
        (resp) => {
          this.DeActivateLoadPanel();
          console.log(resp);
          this.dataSource = resp;
        },
        (error) => {
          this.DeActivateLoadPanel;
          this.HandleError(error);
        }
      );
  }
  LoadAllRecords() {
    this.History(null);
  }
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
    this.HistoryGridToolBarPreparing(
      event,
      () => this.filtering(),
      () => this.LoadAllRecords(),
      () => this.RefreshHistoryGridGrid(this.GetSpecificNumberOfRecords.bind(this), this.HistoryGridSateKey("ExportPreProductionLabHistoryGridState"), this.dataGrid)
    );
  }
}
