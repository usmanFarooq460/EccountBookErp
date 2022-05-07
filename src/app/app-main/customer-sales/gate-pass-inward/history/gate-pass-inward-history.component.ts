import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent } from "devextreme-angular";

import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { PdfReportsCommonMethods } from "src/app/shared/base/pdf-reports-common-methods";
import { GatePassInwardService } from "../gate-pass-inward.service";
@Component({
  selector: "gate-pass-inward-history",
  templateUrl: "./gate-pass-inward-history.component.html",
  styleUrls: [],
})
export class GatePassInwardHistoryComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  dataSource = [];

  constructor(private router: Router, private service: GatePassInwardService, private commonMethods: CommonMethodsForCombos, private pdfReportsCommonMethods: PdfReportsCommonMethods) {
    super();
  }
  async ngOnInit() {
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("InwardGatePass"));
    this.GetSpecificNumberOfRecords();
  }

  onEdit(e) {
    if (this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have Right to Update!");
      return;
    }
    this.router.navigate(["/cus-sales/gatepass-inward-form"], {
      queryParams: { Id: e.Id },
    });
  }

  gotoForm() {
    this.UserRightsObject.canSave ? this.router.navigate(["/cus-sales/gatepass-inward-form"]) : this.ErrorPopup("You dont have Right to Save");
  }

  GetSpecificNumberOfRecords() {
    this.GetAllHistoryRecords(21);
  }

  GetAllHistoryRecords(records) {
    this.ActivateLoadPanel("Fethcing Data!");
    this.service
      .GatepassHistory({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 51,
        CanViewAllRecord: this.UserRightsObject.CanView_AllRecord,
        NoOfRecords: records,
        EntryUser: sessionStorage.getItem("UserId"),
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.dataSource = result;
          console.log("History Data Source", result);
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }
  async GatePassInward_Import_Slip_802(e) {
    this.ActivateLoadPanel("Loading Report");
    this.OpenPdfReportInNewTab(await this.pdfReportsCommonMethods.GatePassInward_Import_Slip_802(e.Id).catch((error) => this.HandleError(error)));
    this.DeActivateLoadPanel();
  }
  async onPrint(e) {
    this.ActivateLoadPanel("Loading Report!");
    if (e.OrderType == "Purchase Order") {
      this.OpenPdfReportInNewTab(await this.pdfReportsCommonMethods.GatePassInward_Slip_251(e.Id).catch((error) => this.HandleError(error)));
    } else {
      this.OpenPdfReportInNewTab(await this.pdfReportsCommonMethods.GatePassInward_SupplyOrder_Slip_331(e.Id).catch((error) => this.HandleError(error)));
    }
    this.DeActivateLoadPanel();
  }

  GatePassInwardHistoryGridToolBarPreparing = (e) => {
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.GetAllHistoryRecords(null),
      () => this.RefreshHistoryGridGrid(this.GetSpecificNumberOfRecords.bind(this), this.HistoryGridSateKey("GatePassInwardHistoryGrid"), this.dataGrid)
    );
  };
}
