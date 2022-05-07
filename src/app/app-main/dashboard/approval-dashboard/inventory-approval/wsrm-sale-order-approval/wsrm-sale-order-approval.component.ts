import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { ApprovalDashboardService } from "../../approval-dashboard.service";
import { MostUsedMethods, CompanyInfo } from "src/app/shared/Base/mostUsedMethods";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-wsrm-sale-order-approval",
  templateUrl: "./wsrm-sale-order-approval.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_gridHeading.scss"],
})
export class WsrmSaleOrderApprovalComponent extends BaseActions implements OnInit {
  @ViewChild("WsrmSaleOrderApprovalGrid", { static: false })
  WsrmSaleOrderApprovalGrid: DxDataGridComponent;
  MostUsedMethods: MostUsedMethods;
  CompanyData:CompanyInfo
  constructor(private Service: ApprovalDashboardService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.MostUsedMethods=new MostUsedMethods(commonMethods)
  }

  RecordToBeApproved: any;
  confirmationPopupVisible: boolean = false;
  dataSource = [];
  headerArray = [];
  @Input() CompanyId: number;
  @Input() ApprovalPopupHeading: string;
  
  @Output() onApproval = new EventEmitter();

  async ngOnInit() 
  {
    this.CompanyData=await this.MostUsedMethods.FetchCompanyInfo(this.CompanyId>0?this.CompanyId: parseInt(sessionStorage.getItem("CompanyId")));
    this.GetUnApprovedData()
  }

  handleYesNoClicked(e) {
    if (e == "true") {
      this.Service.ApproveWsrmSaleOrder({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: this.CompanyData.CompanyId,
        ApprovedUserId: sessionStorage.getItem("UserId"),
        ApprovedDate: new Date(),
        IsApproved: true,
        Id: this.RecordToBeApproved.Id,
      }).subscribe(
        (result) => {
          this.GetUnApprovedData();
          this.onApproval.emit("1");
          this.confirmationPopupVisible = false;
          this.SuccessPopup("Wsrm Sale Order No" + this.RecordToBeApproved.DocNo + " Approved Successfully");
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
    this.Service.WsrmSalesOrderSlipAndRegister({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: this.CompanyData.CompanyId,
      ApprovedFilter: "Not Approved",
      IsApproved: false,
    }).subscribe(
      (result) => {
        this.dataSource = [];
        this.headerArray = [];
        this.dataSource = result;
        this.headerArray = this.GenerateHeaderData(result, "Id");
        console.log(result);
      },
      (error) => {
        this.HandleError(error);
      }
    );
  }
  WsrmSalesOrderSlip_701(e) {

      this.ActivateLoadPanel("Loading Report");
      this.Service
        .WsrmSalesOrderSlip_701({
          Id: e.Id,
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          ReportName: "701-Sp_WsrmSalesOrderSlip_Rpt",
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
    this.GridHeadingInToolbar(event,'GridHeadingTemplate');
    this.FilterButtonInGridToolbar(event);
    this.RefreshButtonInGridToolbar(event,()=>this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("WsrmSaleOrderApprovalGrid"), this.WsrmSaleOrderApprovalGrid))
  };


  onApproved(data) {
    this.RecordToBeApproved = data;
    this.confirmationPopupVisible = true;
  }
}
