import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { ApprovalDashboardService } from "../../approval-dashboard.service";
import { MostUsedMethods, CompanyInfo } from "src/app/shared/Base/mostUsedMethods";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "app-purchase-invoice-trading-approval",
  templateUrl: "./purchase-invoice-trading-approval.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_gridHeading.scss"],
})
export class PurchaseInvoiceTradingApprovalComponent extends BaseActions implements OnInit {
  @ViewChild("PurchaseInvoiceTradingApprovalGrid", { static: false })
  PurchaseInvoiceTradingApprovalGrid: DxDataGridComponent;
  MostUsedMethods: MostUsedMethods;
  RecordToBeApproved: any;
  confirmationPopupVisible: boolean = false;
  dataSource = [];
  headerArray = [];
  @Input() ApprovalPopupHeading: string;
  @Input() CompanyId: number
  @Output() onApproval = new EventEmitter();
  CompanyData:CompanyInfo
  constructor(private Service: ApprovalDashboardService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.MostUsedMethods=new MostUsedMethods(commonMethods)
  }
  async ngOnInit() 
  {
    this.CompanyData=await this.MostUsedMethods.FetchCompanyInfo(this.CompanyId>0?this.CompanyId:parseInt(sessionStorage.getItem("CompanyId")))
    this.GetUnApprovedData();
  }
  handleYesNoClicked(e) {
    if (e == "true") {
      this.Service.PurchaseInvoiceTradingApprove({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: this.CompanyData.CompanyId,
        DocumentTypeId: 63,
        EntryUser: sessionStorage.getItem("UserId"),
        PostDate: new Date(),
        Id: this.RecordToBeApproved.Id,
      }).subscribe(
        (result) => {
          this.GetUnApprovedData();
          this.onApproval.emit("1");
          this.confirmationPopupVisible = false;
          this.SuccessPopup("Purchase Invoice Approved Successfully");
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
    this.Service.PurchaseInvoiceTradingForApproval({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: this.CompanyData.CompanyId,
      DocumentTypeId: 63,
    }).subscribe(
      (result) => {
        this.dataSource = [];
        this.dataSource = result;
        this.headerArray = result;
        // this.headerArray = this.GenerateHeaderData(result, "Id");
        console.log(result);
      },
      (error) => {
        this.HandleError(error);
      }
    );
  }

  onPrint(e) {
    this.ActivateLoadPanel("Loading Report");
    this.Service
      .PurchaseInvoiceTrading_230({
        Id: e.Id,
        DocumentTypeId: 63,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: this.CompanyData.CompanyId,
        CompanyAddress: this.CompanyData.CompanyAddress,
        CompanyName: this.CompanyData.CompanyName,
        ReportName: "230-RptPurchaseInvoiceSlip",
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
  DummyMethod() {}
  ApprovalPopupGridToolbarPreparing = (event) => {
    this.GridHeadingInToolbar(event,'GridHeadingTemplate')
    this.FilterButtonInGridToolbar(event);
    this.RefreshButtonInGridToolbar(event,()=>this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("PurchaseInvoiceTradingApprovalGrid"), this.PurchaseInvoiceTradingApprovalGrid))
  };
  onApproved(data) {
    this.RecordToBeApproved = data;
    this.confirmationPopupVisible = true;
  }
}
