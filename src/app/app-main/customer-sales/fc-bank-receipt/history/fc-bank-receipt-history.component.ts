import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import notify from "devextreme/ui/notify";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { FcBankReceiptModel } from "../fc-bank-receipt.model";
import { fcBankReceiptService } from "../fc-bank-receipt.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "fc-bank-receipt-history",
  templateUrl: "./fc-bank-receipt-history.component.html",
  styleUrls: [],
})
export class FcReceiptBankHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("FcBankReceiptForm", { static: false })
  FcBankReceiptForm: DxFormComponent;
  FcBankReceiptData: FcBankReceiptModel;

  @ViewChild("fcBankReceiptHistoryGrid", { static: false })
  fcBankReceiptHistoryGrid: DxDataGridComponent;

  dataSource = [];
  canUpdate: boolean;
  canViewAllRecordUpdate: boolean;
  constructor(private router: Router, private service: fcBankReceiptService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }

  async ngOnInit() {
    this.breadCrumb("Export", "Fcy Bank Receipt History");
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("Acfrmfcbankreceipt"));
    this.FcBankReceiptData = new FcBankReceiptModel();
    // this.userRights();
    this.getSpecificNumberOfrecords();
  }

  onEdit(e) {
    if (this.UserRightsObject.canUpdate) {
      this.router.navigate(["/cus-sales/fc-bank-receipt-form"], {
        queryParams: { Id: e.Id },
      });
    } else {
      this.ErrorPopup("You don't have Right to Update");
      return;
    }
  }
  // userRights() {
  //   this.commonService
  //     .userRights({
  //       UserId: this.commonService.UserId(),
  //       ScreenName: "Acfrmfcbankreceipt",
  //       RightName: this.commonService.RoleName(),
  //     })
  //     .subscribe(
  //       (result) => {
  //         for (let { RightName, Value } of result) {
  //           if (RightName === "Update") {
  //             this.canUpdate = Value;
  //           }
  //           if (RightName === "CanView AllRecord") {
  //             this.canViewAllRecordUpdate = Value;
  //           }
  //         }
  //       },
  //       (error) => console.log(error)
  //     );
  // }

  gotoForm() {
    this.UserRightsObject.canSave ? this.router.navigate(["/cus-sales/fc-bank-receipt-form"]) : this.ErrorPopup("You dont have Right to Save");
  }

  getSpecificNumberOfrecords() {
    this.fcyBankGetAll(21);
  }

  getAllRecords() {
    this.UserRightsObject.CanView_AllRecord ? this.fcyBankGetAll(null) : this.ErrorPopup("You dont have right to view all records");
  }

  fcyBankGetAll(noOfRecords) {
    this.ActivateLoadPanel("Fetching Data!");
    this.service
      .HistoryForm({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        CanViewAllRecord: this.UserRightsObject.CanView_AllRecord,
        NoOfRecords: noOfRecords,
        DocumentTypeId: 203,
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

  FcBankSlip516(e) {
    this.ActivateLoadPanel("Loading Report!");
    this.service
      .EximBankReceipt_516({
        Id: e.Id,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "516-ExImRptFCBankReceipts",
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
  onPrintVoucher(e) {
    this.ActivateLoadPanel("Loading Report!");
    this.service
      .getFcyVoucherPdfReport({
        Id: e.VoucherHeadId,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 203,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ApprovedFilter: "All",
        ReportName: "102-AcRptPaymentReceiptsVoucherSlip",
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
      () => this.getAllRecords(),
      () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("fcBankReceiptHistoryGrid"), this.fcBankReceiptHistoryGrid)
    );
  }
  DummyMethod() {}
}
