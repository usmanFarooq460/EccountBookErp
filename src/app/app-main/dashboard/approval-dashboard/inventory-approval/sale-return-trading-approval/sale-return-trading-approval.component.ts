import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { ApprovalDashboardService } from "../../approval-dashboard.service";

@Component({
  selector: "app-sale-return-trading-approval",
  templateUrl: "./sale-return-trading-approval.component.html",
  styleUrls: [],
})
export class SaleReturnTradingApprovalComponent extends BaseActions implements OnInit {
  @ViewChild("SaleReturnTradingApprovalGrid", { static: false })
  SaleReturnTradingApprovalGrid: DxDataGridComponent;

  constructor(private Service: ApprovalDashboardService) {
    super();
  }

  RecordToBeApproved: any;
  confirmationPopupVisible: boolean = false;
  dataSource = [];
  headerArray = [];
  @Input()
  ApprovalPopupVisible: boolean;
  @Input() ApprovalPopupHeading: string;
  @Output() ClosePopup = new EventEmitter();
  @Output() onApproval = new EventEmitter();

  ngOnInit(): void {}

  handleYesNoClicked(e) {
    if (e == "true") {
      this.Service.InvPurchaseInvoiceandVoucherApprove({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 104,
        EntryUser: sessionStorage.getItem("UserId"),
        PostDate: new Date(),
        Id: this.RecordToBeApproved.Id,
      }).subscribe(
        (result) => {
          this.GetUnApprovedData();
          this.onApproval.emit("1");
          this.confirmationPopupVisible = false;
          this.SuccessPopup("Sale Return Trading Doc No" + this.RecordToBeApproved.DocNo + " Approved Successfully");
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
  GetUnApprovedData() {
    this.Service.GetSaleInvoiceReturnForApproval({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      DocumentTypeId: 104,
    }).subscribe(
      (result) => {
        this.dataSource = [];
        this.dataSource = result;
        this.headerArray = this.GenerateHeaderData(result, "Id");
        console.log(result);
      },
      (error) => {
        this.HandleError(error);
      }
    );
  }
  // GenerateHeaderArray(data) {
  //   if (data != null && data != undefined) {
  //     for (let i = 0; i < data.length; i++) {
  //       if (i == 0) {
  //         this.headerArray.push(data[i]);
  //       } else if (i > 0) {
  //         let flag = false;
  //         for (let j = 0; j < this.headerArray.length; j++) {
  //           if (this.headerArray[j].Id == data[i].Id) {
  //             flag = true;
  //             break;
  //           }
  //         }
  //         if (flag == false) {
  //           this.headerArray.push(data[i]);
  //         }
  //       }
  //     }
  //   }
  // }
  DummyMethod() {}
  ApprovalPopupGridToolbarPreparing = (event) => {
    this.HistoryGridToolBarPreparing(
      event,
      () => this.filtering(),
      () => this.GetUnApprovedData(),
      () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("SaleReturnTradingApprovalGrid"), this.SaleReturnTradingApprovalGrid)
    );
  };
  CloseApprovalPopup() {
    this.ClosePopup.emit("1");
  }
  onApproved(data) {
    this.RecordToBeApproved = data;
    this.confirmationPopupVisible = true;
  }
}
