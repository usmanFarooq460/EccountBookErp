import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { ApprovalDashboardService } from "../../approval-dashboard.service";
import { MostUsedMethods, CompanyInfo } from "src/app/shared/Base/mostUsedMethods";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-wsrm-sale-invoice-approval",
  templateUrl: "./wsrm-sale-invoice-approval.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_gridHeading.scss"],
})
export class WsrmSaleInvoiceApprovalComponent extends BaseActions implements OnInit {
  @ViewChild("WsrmSaleInvoceApprovalGrid", { static: false })
  WsrmSaleInvoceApprovalGrid: DxDataGridComponent;
  @Input() ApprovalPopupHeading: string;
  @Output() onApproval = new EventEmitter();
  dataSource = [];
  headerArray = [];
  RecordToBeApproved: any;
  confirmationPopupVisible: boolean = false;
  //===========================================
  @Input() CompanyId: number;
  MostUsedMethods: MostUsedMethods;
  CompanyData: CompanyInfo
  constructor(private service: ApprovalDashboardService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.MostUsedMethods=new MostUsedMethods(commonMethods);
  }

  async ngOnInit() {
    this.CompanyData=await this.MostUsedMethods.FetchCompanyInfo(this.CompanyId>0?this.CompanyId: parseInt(sessionStorage.getItem("CompanyId")))
    console.log(this.ApprovalPopupHeading)
    this.GetUnApprovedRecord();

  }
  GetUnApprovedRecord() {
    this.service
      .GetUnApprovedWsrmSaleInvoices({
        CompanyId: this.CompanyData.CompanyId,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        ApprovedFilter: "UnApproved",
        IsApproved: false,
        NoOfRecords: null
      })
      .subscribe(
        (result) => {
          console.log(result);
          this.dataSource = result;
          this.headerArray = this.GenerateHeaderData(result, "Id");
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  onApproved(data) {
    this.RecordToBeApproved = data;
    this.confirmationPopupVisible = true;
  }
  onReportSlipClick(data) {}
  handleYesNoClicked(e) {
    if (e == "true") {
      this.service
        .ApproveWsrmSaleInvoice({
          CompanyId: this.CompanyData.CompanyId,
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          PostDate: new Date(),
          PostUser: sessionStorage.getItem("UserId"),
          IsApproved: true,
          Id: this.RecordToBeApproved.Id,
        })
        .subscribe(
          (result) => {
            this.SuccessPopup("Sale Invoice Approved Successfully!");
            this.confirmationPopupVisible = false;
            this.GetUnApprovedRecord();
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

  WsrmSalesInvoiceSlip_700(e) {
    this.ActivateLoadPanel("Loading Report");
    this.service
      .WsrmSalesInvoiceSlip_700({
        Id: e.Id,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: this.CompanyData.CompanyId,
        CompanyAddress: this.CompanyData.CompanyAddress,
        CompanyName: this.CompanyData.CompanyName,
        UserName: sessionStorage.getItem("DisplayName"),
        ReportName: "700-Sp_WsrmSalesInvoiceSlip_Rpt",
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
    this.RefreshButtonInGridToolbar(event, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("ImportInvoiceApprovalGridState"), this.WsrmSaleInvoceApprovalGrid));
  };
}
