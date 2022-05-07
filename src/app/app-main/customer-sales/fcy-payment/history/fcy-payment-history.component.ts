import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { FcyPaymentService } from "../fcy-payment.service";

@Component({
  selector: "app-fcy-payment-history",
  templateUrl: "./fcy-payment-history.component.html",
  styleUrls: [],
})
export class FcyPaymentHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("dataGrid", { static: false })
  dataGrid: DxDataGridComponent;
  dataSource = [];
  CanViewAllRecord: boolean = false;
  constructor(private router: Router, private service: FcyPaymentService, private commonMethods: CommonMethodsForCombos) {
    super();
  }

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmFcyPaymentVoucher"));
    this.GetSpecificNumberOfRecords();
  }

  gotoForm() {
    this.UserRightsObject.canSave ? this.router.navigate(["/cus-sales/fcy-payment-voucher-form"]) : this.ErrorPopup("You Dont have Right to Save!");
  }
  onEdit(e) {
    this.UserRightsObject.canUpdate
      ? this.router.navigate(["/account-transaction/fcy-payment-voucher-form"], {
          queryParams: { Id: e.Id },
        })
      : this.ErrorPopup("You dont have Right To Update");
  }

  GetSpecificNumberOfRecords() {
    this.History(21);
  }

  OnSlipButtonClick(data) {}

  GetAllRecords() {
    this.UserRightsObject.CanView_AllRecord ? this.History(null) : this.WarningPopup("You don't have Right to View All Recrods");
  }

  History(records) {
    this.service
      .History({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 204,
        CanViewAllRecord: this.CanViewAllRecord,
        NoOfRecords: records,
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
  FcyPaymentVoucherHistoryGridToolbarPreparing = (e) => {
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.GetAllRecords(),
      () => this.RefreshHistoryGridGrid(this.GetSpecificNumberOfRecords.bind(this), this.HistoryGridSateKey("FcyPaymentVoucherHistoryGridState"), this.dataGrid)
    );
  };
}
