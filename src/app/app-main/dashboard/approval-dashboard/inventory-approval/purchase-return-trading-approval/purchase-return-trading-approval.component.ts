import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { ApprovalDashboardService } from "../../approval-dashboard.service";
import { MostUsedMethods,CompanyInfo } from "src/app/shared/Base/mostUsedMethods";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { ThrowStmt } from "@angular/compiler";

@Component({
  selector: "app-purchase-return-trading-approval",
  templateUrl: "./purchase-return-trading-approval.component.html",
  styleUrls: [],
})
export class PurchaseReturnTradingApprovalComponent extends BaseActions implements OnInit {
  @ViewChild("PurchaseReturnTradingApprovalGrid", { static: false })
  PurchaseReturnTradingApprovalGrid: DxDataGridComponent;
  RecordToBeApproved: any;
  confirmationPopupVisible: boolean = false;
  dataSource = [];
  headerArray = [];

  @Input() CompanyId: number;
  @Input() ApprovalPopupHeading: string;
  @Output() onApproval = new EventEmitter();
  MostUsedMethods: MostUsedMethods
  CompanyData:CompanyInfo 

  constructor(private Service: ApprovalDashboardService, private commonMethod: CommonMethodsForCombos) {
    super();
    this.MostUsedMethods=new MostUsedMethods(commonMethod);
  }


  async   ngOnInit() 
  {
    this.CompanyData=await this.MostUsedMethods.FetchCompanyInfo(this.CompanyId>0?this.CompanyId:parseInt(sessionStorage.getItem("CompanyId")));
    this.GetUnApprovedData();
  }

  handleYesNoClicked(e) {
    if (e == "true") {
      this.Service.InvSaleInvoiceandVoucherApprove({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: this.CompanyData.CompanyId,
        DocumentTypeId: 60,
        EntryUser: sessionStorage.getItem("UserId"),
        PostDate: new Date(),
        Id: this.RecordToBeApproved.Id,
      }).subscribe(
        (result) => {
          this.GetUnApprovedData();
          this.onApproval.emit("1");
          this.confirmationPopupVisible = false;
          this.SuccessPopup("Purchase Return Trading Doc No" + this.RecordToBeApproved.DocNo + " Approved Successfully");
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
    this.Service.GetPurchaseInvoiceReturnForApproval({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: this.CompanyData.CompanyId,
      DocumentTypeId: 60,
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
  PurchaseInvoiceReturn_279(e) {
    this.ActivateLoadPanel("Loading Report");
    this.Service.PurchaseInvoiceReturn_279({
      Id: e.Id,
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: this.CompanyData.CompanyId,
      DocumentTypeId: 60,
      CompanyAddress:this.CompanyData.CompanyAddress,
      CompanyName: this.CompanyData.CompanyName,
      UserName: sessionStorage.getItem("DisplayName"),
      ReportName: "279-PurchaseInvoiceReturn",
    }).subscribe(
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
  DummyMethod() {}
  ApprovalPopupGridToolbarPreparing = (event) => {
    this.HistoryGridToolBarPreparing(
      event,
      () => this.filtering(),
      () => this.GetUnApprovedData(),
      () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("PurchaseReturnTradingApprovalGrid"), this.PurchaseReturnTradingApprovalGrid)
    );
  };

  onApproved(data) {
    this.RecordToBeApproved = data;
    this.confirmationPopupVisible = true;
  }
}
