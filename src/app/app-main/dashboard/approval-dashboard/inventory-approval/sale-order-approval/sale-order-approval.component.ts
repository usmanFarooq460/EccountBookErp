import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { ApprovalDashboardService } from "../../approval-dashboard.service";
@Component({
  selector: "app-sale-order-approval",
  templateUrl: "./sale-order-approval.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_gridHeading.scss"],
})
export class SaleOrderApprovalComponent extends BaseActions implements OnInit {
  @ViewChild("SaleOrderApprovalPopupGrid", { static: false })
  SaleOrderApprovalPopupGrid: DxDataGridComponent;
  @Input()
  ApprovalPopupVisible: boolean;
  @Input() ApprovalPopupHeading: string;
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

  GetUnApprovedSaleOrders() {
    this.service
      .saleorderhistory({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocId: 81,
        FilterType: "Not Approved",
        IsApproved: false,
        DocumentTypeId: 81,
      })
      .subscribe(
        (result) => {
          this.dataSource = result;
        },
        (error) => {
          console.log(error);
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
    this.service
      .SaleOrderSlip_272({
        //Compulosry
        Id: data.Id,
        DocumentTypeId: 81,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ApprovedFilter: "Not Approved",
        IsApproved: false,
        ReportName: "272-InvRptSaleOrderSlipWithDespatchDetail",
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
        .AppoveSaleOrder({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          ReqType: "Approve",
          Id: this.RecordToBeApproved.Id,
        })
        .subscribe(
          (result) => {
            this.GetUnApprovedSaleOrders();
            this.onApproval.emit("1");
            this.confirmationPopupVisible = false;
            this.SuccessPopup("Sale Order No" + this.RecordToBeApproved.DocNo + " Approved Successfully");
          },
          (error) => {
            this.confirmationPopupVisible = false;
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
      () => this.GetUnApprovedSaleOrders(),
      () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("SaleOrderApprovalPopupGrid"), this.SaleOrderApprovalPopupGrid)
    );
  };
}
