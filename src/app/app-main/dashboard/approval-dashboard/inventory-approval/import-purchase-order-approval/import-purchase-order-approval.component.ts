import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { ApprovalDashboardService } from "../../approval-dashboard.service";
import { MostUsedMethods, CompanyInfo } from "src/app/shared/Base/mostUsedMethods";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-import-purchase-order-approval",
  templateUrl: "./import-purchase-order-approval.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_gridHeading.scss"],
})
export class ImportPurchaseOrderApprovalComponent extends BaseActions implements OnInit {
  @ViewChild("ImportPurchaseOrderApprovalGrid", { static: false })
  ImportPurchaseOrderApprovalGrid: DxDataGridComponent;
  @Input() ApprovalPopupHeading: string;
  @Input() CompanyId: number;
  @Output() onApproval = new EventEmitter();

  dataSource = [];
  headerArray = [];
  RecordToBeApproved: any;
  confirmationPopupVisible: boolean = false;
  MostUsedMethods: MostUsedMethods;
  CompanyData: CompanyInfo;
  constructor(private service: ApprovalDashboardService, private commonMehtods: CommonMethodsForCombos) {
    super();
    this.MostUsedMethods=new MostUsedMethods(commonMehtods)
  }

  async ngOnInit()
  {
    this.CompanyData=await this.MostUsedMethods.FetchCompanyInfo(this.CompanyId>0?this.CompanyId: parseInt(sessionStorage.getItem("CompanyId")));
    this.GetUnApprovedRecord();
  }
  GetUnApprovedRecord() {
    this.service
      .GetUnApprovedImportPurchaseOrders({
        CompanyId: this.CompanyData.CompanyId,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        DocumentTypeId: 236,
        ApprovedFilter: "UnApproved",
        IsApproved: false,
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
    console.log(this.RecordToBeApproved);
    if (e == "true") {
      this.service
        .ApporveImportPurchaseOrder({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: this.CompanyData.CompanyId,
          ApprovedDate: new Date(),
          ApprovedUserId: sessionStorage.getItem("UserId"),
          IsApproved: true,
          Id: this.RecordToBeApproved.Id,
        })
        .subscribe(
          (result) => {
            this.SuccessPopup("Import Purchase Order Approved Successfully!");
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
  PurchaseOrderSlipB_805(e) {
    this.ActivateLoadPanel("Loading Report");
    this.service
      .PurchaseOrderSlipB_805({
        Id: e.Id,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: this.CompanyData.CompanyId,
        DocumentTypeId: 236,
        CompanyAddress: this.CompanyData.CompanyAddress,
        CompanyName: this.CompanyData.CompanyName,
        ReportName: "805-PurchaseOrderSlipB",
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
    this.FilterButtonInGridToolbar(event)
    this.GridHeadingInToolbar(event,'GridHeadingTemplate')
    this.RefreshButtonInGridToolbar(event, ()=> this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("ImportPurchaseOrdersApprovalGrid"), this.ImportPurchaseOrderApprovalGrid))
  };
}
