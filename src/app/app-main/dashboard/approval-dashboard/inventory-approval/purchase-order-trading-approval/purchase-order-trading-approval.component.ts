import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { ApprovalDashboardService } from "../../approval-dashboard.service";
import { MostUsedMethods, CompanyInfo } from "src/app/shared/Base/mostUsedMethods";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-purchase-order-trading-approval",
  templateUrl: "./purchase-order-trading-approval.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_gridHeading.scss"],
})
export class PurchaseOrderTradingApprovalComponent extends BaseActions implements OnInit {
  @ViewChild("PurchaseOrderTradingApprovalGrid", { static: false })
  PurchaseOrderTradingApprovalGrid: DxDataGridComponent;
  MostUsedMethods: MostUsedMethods
  CompanyData:CompanyInfo 
  constructor(private Service: ApprovalDashboardService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.MostUsedMethods=new MostUsedMethods(commonMethods);
  }

  RecordToBeApproved: any;
  confirmationPopupVisible: boolean = false;
  dataSource = [];
  headerArray = [];
  @Input() ApprovalPopupHeading: string;
  @Input() CompanyId: number
  @Output() onApproval = new EventEmitter();

  async ngOnInit() 
  { 
    this.CompanyData=await this.MostUsedMethods.FetchCompanyInfo(this.CompanyId>0?this.CompanyId: parseInt(sessionStorage.getItem("CompanyId")));
    this.GetUnApprovedData()
  }

  handleYesNoClicked(e) {
    if (e == "true") {
      this.Service.PurchaseOrderTradingApprove({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: this.CompanyData.CompanyId,
        DocumentTypeId: 42,
        EntryUser: sessionStorage.getItem("UserId"),
        PostDate: new Date(),
        Id: this.RecordToBeApproved.Id,
      }).subscribe(
        (result) => {
          this.GetUnApprovedData();
          this.onApproval.emit("1");
          this.confirmationPopupVisible = false;
          this.SuccessPopup("Purchase Order Doc No" + this.RecordToBeApproved.DocNo + " Approved Successfully");
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
    // this.Service.PurchaseOrderTradingForApprove({
    //   OrganizationId: sessionStorage.getItem("OrganizationId"),
    //   CompanyId: this.CompanyData.CompanyId,
    //   DocumentTypeId: 42,
    // }).subscribe(
    //   (result) => {
    //     this.dataSource = [];
    //     this.dataSource = result;
    //     this.headerArray = this.GenerateHeaderData(result, "Id");
    //   },
    //   (error) => {
    //     this.HandleError(error);
    //   }
    // );
  }
  PurchaseOrderTrading_276(e) {
    this.ActivateLoadPanel("Loading Report");
    this.Service.PurchaseOrderTrading_276({
      Id: e.Id,
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: this.CompanyData.CompanyId,
      DocumentTypeId: 42,
      CompanyAddress: this.CompanyData.CompanyAddress,
      CompanyName: this.CompanyData.CompanyName,
      UserName: sessionStorage.getItem("DisplayName"),
      ReportName: "276-PurchaseOrderTrading",
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
    this.GridHeadingInToolbar(event,'GridHeadingTemplate')
    this.FilterButtonInGridToolbar(event)
    this.RefreshButtonInGridToolbar(event,()=>this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("PurchaseOrderTradingApprovalGrid"), this.PurchaseOrderTradingApprovalGrid))

  };

  onApproved(data) {
    this.RecordToBeApproved = data;
    this.confirmationPopupVisible = true;
  }
}
