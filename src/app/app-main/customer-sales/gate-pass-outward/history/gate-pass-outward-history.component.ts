import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent } from "devextreme-angular";
import notify from "devextreme/ui/notify";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { GatePassOutwardService } from "../gate-pass-outward.service";

@Component({
  selector: "gate-pass-outward-history",
  templateUrl: "./gate-pass-outward-history.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class GatePassOutwardFormHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("gatePassOutwardHistory", { static: false })
  gatePassOutwardHistory: DxDataGridComponent;
  dataSource = [];
  canViewAllRecordUpdate: any;

  constructor(private router: Router, private service: GatePassOutwardService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("OutwardGatePass"));
    this.LoadGivenNumbersOfRecords();
  }

  onEdit(e) {
    this.UserRightsObject.canUpdate
      ? this.router.navigate(["/cus-sales/gatepass-outward-form"], {
          queryParams: { Id: e.Id },
        })
      : this.ErrorPopup("You don't have Right to Update");
  }

  gotoForm() {
    this.UserRightsObject.canSave ? this.router.navigate(["/cus-sales/gatepass-outward-form"]) : this.ErrorPopup("You dont have Right to Save!");
  }

  LoadGivenNumbersOfRecords() {
    this.GatepassInwardGetAll(21);
  }

  LoadAllRecords() {
    this.UserRightsObject.CanView_AllRecord ? this.GatepassInwardGetAll(null) : this.ErrorPopup("You don't have Right to see all Records");
  }

  GatepassInwardGetAll(records) {
    this.ActivateLoadPanel("Fetching Data!");
    this.service
      .GatepassHistory({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 91,
        CanViewAllRecord: this.UserRightsObject.CanView_AllRecord,
        NoOfRecords: records,
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
  onPrint(e) {
    this.ActivateLoadPanel("Loading Report!");
    this.service
      .getpdfReport({
        Id: e.Id,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "290-InvRptOutwardGatePassSlip",
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
  onToolbarPreparing(event) {
    this.HistoryGridToolBarPreparing(
      event,
      () => this.filtering(),
      () => this.LoadAllRecords(),
      () => this.RefreshHistoryGridGrid(this.LoadGivenNumbersOfRecords.bind(this), this.HistoryGridSateKey("gatePassOutwardHistory"), this.gatePassOutwardHistory)
    );
  }
}
