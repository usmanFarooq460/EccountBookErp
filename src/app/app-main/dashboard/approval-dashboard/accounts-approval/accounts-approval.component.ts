import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { ApprovalDashboardService } from "../approval-dashboard.service";
import { DxDataGridComponent } from "devextreme-angular";
import { MostUsedMethods,CompanyInfo } from "src/app/shared/Base/mostUsedMethods";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "app-accounts-approval-popup",
  templateUrl: "./accounts-approval.component.html",
  styleUrls: ["./accounts-approval.component.scss", "/src/assets/scss/custom/components/_gridHeading.scss"],
})
export class AccountsApprovalComponent extends BaseActions implements OnInit {
  @ViewChild("AccountsApprovalPopupGrid", { static: false })
  AccountsApprovalPopupGrid: DxDataGridComponent;
  @Input() CompanyId: number;
  @Input() AccountsApprovalName: string;
  
  @Output() RecordApproved = new EventEmitter();
  dataSouce = [];
  @Input() DocTypeId: number;
  ApprovalRecordData: any;
  
  confirmationPopupVisible: boolean = false;
//============================================================

CompanyData: CompanyInfo;
MostUsedMethods:any

  constructor(private service: ApprovalDashboardService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.MostUsedMethods=new MostUsedMethods(commonMethods);
  }

  async ngOnInit() {

    this.CompanyData=await this.MostUsedMethods.FetchCompanyInfo(this.CompanyId>0?this.CompanyId: parseInt(sessionStorage.getItem("CompanyId")));
    console.log(this.CompanyData)
    console.log(this.AccountsApprovalName)
    this.filtering();
    this.getUnApprovedAccountsDataByDocTypeId(this.DocTypeId);
  }
  getUnApprovedAccountsDataByDocTypeId(docType) {
    console.log(docType)
    if (docType) {
      this.DocTypeId = docType;
      this.service
        .getVoucherHistoryList({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: this.CompanyData.CompanyId,
          DocumentTypeId: docType,
          CanViewAllRecord: true,
          PostState: true,
        })
        .subscribe(
          (result) => {
            this.dataSouce = result.filter(({ IsApproved }) => IsApproved == false);
          },
          (error) => {
            this.HandleError(error);
          }
        );
    }
  }

  onApproved(data) {
    this.confirmationPopupVisible = true;
    this.ApprovalRecordData = data;
  }
  onReportSlipClick(data) {
    this.ActivateLoadPanel("Loading Report!")
    this.service
      .getPaymentVoucherPdfReportSlip102({
        Id: data.Id,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: this.CompanyData.CompanyId,
        CompanyAddress: this.CompanyData.CompanyAddress,
        CompanyName: this.CompanyData.CompanyName,
        UserName: sessionStorage.getItem("DisplayName"),
        ReportName: "102-ANewAcRptPaymentReceiptsVoucherSlip",
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel()
          window.open(result)},
        (error) => {
          this.DeActivateLoadPanel()
          this.HandleError(error);
        }
      );
  }
  handleYesNoClicked(e) {
    if (e == "true") {
      this.confirmationPopupVisible = false;
      this.service
        .approvedVouchersbyId({
          CompanyId: this.CompanyData.CompanyId,
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          Id: this.ApprovalRecordData.Id,
          PostDate: new Date(),
          EntryUser: sessionStorage.getItem("UserId"),
        })
        .subscribe(
          (result) => {
            this.SuccessPopup("Record Approved successfully!");
            this.getUnApprovedAccountsDataByDocTypeId(this.DocTypeId);
            this.RecordApproved.emit("1");
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

  AccountsApprovalPopupGridToolbarPreparing(event) {
    this.FilterButtonInGridToolbar(event);
    this.RefreshButtonInGridToolbar(event,()=>this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("AccountsApprovalPopupGrid"), this.AccountsApprovalPopupGrid))

    this.GridHeadingInToolbar(event, "AccountsApprovalPopupGridHeading");
  }
}
