import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { ApprovalDashboardService } from "../../approval-dashboard.service";
@Component({
  selector: "app-sale-invoice-approval",
  templateUrl: "./sale-invoice-approval.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_gridHeading.scss"],
})
export class SaleInoviceApprovalComponent extends BaseActions implements OnInit {
  @ViewChild("SaleOrderApprovalPopupGrid", { static: false })
  SaleInvoiceApprovalPopupGrid: DxDataGridComponent;
  @Input()
  ApprovalPopupVisible: boolean;
  @Input() ApprovalPopupHeading: string;
  @Input() DocumentTypeId;
  @Output() ClosePopup = new EventEmitter();
  @Output() onApproval = new EventEmitter();

  dataSource = [];
  RecordToBeApproved: any;
  confirmationPopupVisible: boolean = false;
  constructor(private service: ApprovalDashboardService) {
    super();
  }

  ngOnInit(): void {
    this.filtering();
  }

  GetUnApprovedRecord(DocTypeId) {
    this.DocumentTypeId = DocTypeId;
    this.service
      .PendingInvSaleInvoiceForApproval({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        DocumentTypeId: DocTypeId,
        FromDate: null,
        ToDate: null,
        ItemId: null,
        SupplierCustomerId: null,
      })
      .subscribe(
        (result) => {
          this.dataSource = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  CloseApprovalPopup() {
    this.ClosePopup.emit("1");
  }
  onApproved(data) {
    this.RecordToBeApproved = data;
    this.confirmationPopupVisible = true;
  }
  onReportSlipClick(data) {
    if (this.DocumentTypeId == 95) {
      this.SaleInvoiceSlip_301(data);
    } else if (this.DocumentTypeId == 99) {
      this.SaleInvoiceDirectSlip_301(data);
    }
  }
  SaleInvoiceSlip_301(e) {
    this.service
      .InvSaleInvoiceCustomerBillReport301({
        DocumentTypeId: 95,
        Id: e.Id,
        HeaderId: e.Id,
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        FromDate: null,
        ToDate: null,
        FromDocNo: null,
        ToDocNo: null,
        SupplierCustomerId: null,
        BranchesId: null,
        ReportName: "301-InvRepSaleBillCustomer",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => {
          this.HandleError(error);
        }
      );
  }
  SaleInvoiceDirectSlip_301(e) {
    this.service
      .InvRptSaleBillDirectWithoutSO_294({
        DocumentTypeId: 99,
        Id: e.Id,
        HeaderId: e.Id,
        //Compulosry
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        FromDate: null,
        ToDate: null,
        FromDocNo: null,
        ToDocNo: null,
        SupplierCustomerId: null,
        BranchesId: null,
        ReportName: "301-InvRepSaleBillCustomer",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => console.log(error)
      );
  }
  onVoucherRptClick(data) {
    this.service
      .getPurhcaseInvoiceVoucherpdfReport({
        Id: data.Id,
        //Compulosry
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: this.DocumentTypeId,
        ApprovedFilter: "All",
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "103-AcRptPurchaseSalesVoucherSlip",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => {
          this.HandleError(error);
        }
      );
  }

  handleYesNoClicked(e) {
    if (e == "true") {
      this.service
        .InvSaleInvoiceandVoucherApproved({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          Id: this.RecordToBeApproved.Id,
          DocumentTypeId: this.DocumentTypeId,
          PostDate: new Date(),
          EntryUser: sessionStorage.getItem("UserId"),
        })
        .subscribe(
          (result) => {
            this.SuccessPopup("Sale Invoice Approved Successfully!");
            this.confirmationPopupVisible = false;
            this.GetUnApprovedRecord(this.DocumentTypeId);
            this.onApproval.emit("1");
          },
          (error) => {
            this.HandleError(error);
          }
        );
    } else if (e == "false") {
      this.confirmationPopupVisible = false;
    }
  }
  DummyMethod() {}

  ApprovalPopupGridToolbarPreparing = (event) => {
    this.HistoryGridToolBarPreparing(
      event,
      () => this.filtering(),
      () => this.GetUnApprovedRecord(this.DocumentTypeId),
      () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("SaleInoviceApprovalPopupGrid"), this.SaleInvoiceApprovalPopupGrid)
    );
  };
}
