import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent } from "devextreme-angular";
import notify from "devextreme/ui/notify";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { PurcahseAnalysisService } from "../purchase-analysis.service";

@Component({
  selector: "purchase-analysis-history",
  templateUrl: "./purchase-analysis-history.component.html",
  styleUrls: [],
})
export class PurchaseAnalysisHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("purchaseAnalysisHistoryGrid", { static: false })
  purchaseAnalysisHistoryGrid: DxDataGridComponent;
  dataSource = [];

  constructor(private router: Router, private service: PurcahseAnalysisService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = false;
  }

  async ngOnInit() {
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("InvLabPurchaseAnalysis"));
    this.getSpecificNumberOfRecords();
  }

  onEdit(e) {
    this.UserRightsObject.canUpdate
      ? this.router.navigate(["/lab/purchase-analysis-form"], {
          queryParams: { Id: e.Id },
        })
      : this.WarningPopup("you dont have Right to Update");
  }

  gotoForm() {
    this.UserRightsObject.canSave ? this.router.navigate(["/lab/purchase-analysis-form"]) : this.WarningPopup("You dont have right to Save");
  }

  getAllRecords() {
    this.UserRightsObject.CanView_AllRecord ? this.ProformaInvoiceGetAll(null) : this.WarningPopup("You dont have rihgt to View All Records");
  }

  getSpecificNumberOfRecords() {
    this.ProformaInvoiceGetAll(21);
  }

  ProformaInvoiceGetAll(noOfRecords) {
    this.ActivateLoadPanel("Loading Data!");
    this.service
      .purchaseAnalysisGetAll({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        NoOfRecords: noOfRecords,
        CanViewAllRecord: this.UserRightsObject.CanView_AllRecord,
        EntryUser: sessionStorage.getItem("UserId"),
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.dataSource = result;
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }
  PurchaseAnalysisSlip(e) {
    this.ActivateLoadPanel("Loading Report!");
    this.service
      .PDFReportSlip653({
        Id: e.Id,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "653-RptInvLabPurchaseAnalysisSlip",
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          window.open(result);
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }

  onToolbarPreparing = (e) => {
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.getAllRecords(),
      () => this.RefreshHistoryGridGrid(this.getSpecificNumberOfRecords.bind(this), this.HistoryGridSateKey("purchaseAnalysisHistoryGrid"), this.purchaseAnalysisHistoryGrid)
    );
  };
}
