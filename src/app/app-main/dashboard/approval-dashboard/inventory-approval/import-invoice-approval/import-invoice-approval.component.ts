import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { ApprovalDashboardService } from "../../approval-dashboard.service";
import { MostUsedMethods, CompanyInfo } from "src/app/shared/Base/mostUsedMethods";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-import-invoice-approval",
  templateUrl: "./import-invoice-approval.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_gridHeading.scss"],
})
export class ImportInvoiceApprovalComponent extends BaseActions implements OnInit {
  @ViewChild("ImportInoviceApprovalGrid", { static: false })
  ImportInoviceApprovalGrid: DxDataGridComponent;

  @Input() ApprovalPopupHeading: string;
  @Input() DocumentTypeId;
  @Input() CompanyId: number
  @Output() onApproval = new EventEmitter();
  MostUsedMethods: MostUsedMethods;
  CompanyData: CompanyInfo;
  dataSource = [];
  RecordToBeApproved: any;
  confirmationPopupVisible: boolean = false;
  constructor(private service: ApprovalDashboardService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.MostUsedMethods=new MostUsedMethods(commonMethods);
  }

  async ngOnInit() 
  {
    this.CompanyData=await this.MostUsedMethods.FetchCompanyInfo(this.CompanyId>0?this.CompanyId: parseInt(sessionStorage.getItem("CompanyId")))  ;
    this.GetUnApprovedRecord()
  }

  GetUnApprovedRecord() {
    this.service
      .GetUnApprovedImportInvoices({
        CompanyId: this.CompanyData.CompanyId,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        ApprovedFilter: "UnApproved",
        IsApproved: false,
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

  onApproved(data) {
    this.RecordToBeApproved = data;
    this.confirmationPopupVisible = true;
  }
  onReportSlipClick(data) {}
  handleYesNoClicked(e) {
    if (e == "true") {
      this.service
        .ApproveImportInvoice({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: this.CompanyData.CompanyId,
          ApprovedDate: new Date(),
          ApprovedUser: sessionStorage.getItem("UserId"),
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
  ImInvoiceSlip_806(e) {
    this.ActivateLoadPanel("Loading Report");
    this.service
      .ImInvoiceSlip_806({
        Id: e.Id,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: this.CompanyData.CompanyId,
        CompanyAddress: this.CompanyData.CompanyAddress,
        CompanyName: this.CompanyData.CompanyName,
        ReportName: "806-ImInvoiceSlip",
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
    this.RefreshButtonInGridToolbar(event,()=> this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("ImportInvoiceApprovalGridState"), this.ImportInoviceApprovalGrid))

  };
}
