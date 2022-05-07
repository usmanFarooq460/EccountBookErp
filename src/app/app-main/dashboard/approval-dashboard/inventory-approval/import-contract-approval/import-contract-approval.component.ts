import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { ApprovalDashboardService } from "../../approval-dashboard.service";
import { MostUsedMethods, CompanyInfo } from "src/app/shared/Base/mostUsedMethods";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-import-contract-approval",
  templateUrl: "./import-contract-approval.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_gridHeading.scss"],
})
export class ImportContractApprovalComponent extends BaseActions implements OnInit {
  @ViewChild("ImportContractApprovalGrid", { static: false })
  ImportContractApprovalGrid: DxDataGridComponent;
  MostUsedMethods: MostUsedMethods
  CompanyData: CompanyInfo;

  constructor(private Service: ApprovalDashboardService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.MostUsedMethods=new MostUsedMethods(commonMethods);
  }

  RecordToBeApproved: any;
  confirmationPopupVisible: boolean = false;
  dataSource = [];
  headerArray = [];

  @Input() ApprovalPopupHeading: string;
  @Input() CompanyId: number;
  @Output() onApproval = new EventEmitter();

  async ngOnInit() 
  {
    this.CompanyData=await this.MostUsedMethods.FetchCompanyInfo(this.CompanyId>0?this.CompanyId: parseInt(sessionStorage.getItem("CompanyId")))
    this.GetUnApprovedData()

  }

  handleYesNoClicked(e) {
    if (e == "true") {
      this.Service.ApporveImportContract({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: this.CompanyData.CompanyId,
        EntryUser: sessionStorage.getItem("UserId"),
        PostDate: new Date(),
        IsApproved: true,
        Id: this.RecordToBeApproved.Id,
      }).subscribe(
        (result) => {
          this.GetUnApprovedData();
          this.onApproval.emit("1");
          this.confirmationPopupVisible = false;
          this.SuccessPopup("Import Contract Doc No" + this.RecordToBeApproved.LcOrderDocNo + " Approved Successfully");
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
    this.Service.ImportContractSlipAndRegister({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: this.CompanyData.CompanyId,
      ApprovedFilter: "Not Approved",
      IsApproved: false,
    }).subscribe(
      (result) => {
        this.dataSource = [];
        this.headerArray = [];
        this.dataSource = result;
        this.GenerateHeaderArray(result);
        console.log(result);
      },
      (error) => {
        this.HandleError(error);
      }
    );
  }
  GenerateHeaderArray(data) {
    if (data != null && data != undefined) {
      for (let i = 0; i < data.length; i++) {
        if (i == 0) {
          this.headerArray.push(data[i]);
        } else if (i > 0) {
          let flag = false;
          for (let j = 0; j < this.headerArray.length; j++) {
            if (this.headerArray[j].Id == data[i].Id) {
              flag = true;
              break;
            }
          }
          if (flag == false) {
            this.headerArray.push(data[i]);
          }
        }
      }
    }
  }
  ImpContractSlip_801(e) {
    this.ActivateLoadPanel("Loading Report");
    this.Service
      .ImpContractSlip_801({
        Id: e.Id,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: this.CompanyData.CompanyId,
        CompanyAddress: this.CompanyData.CompanyAddress,
        CompanyName: this.CompanyData.CompanyName,
        ReportName: "801-ImpContractSlip",
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
    this.FilterButtonInGridToolbar(event);
    this.GridHeadingInToolbar(event,'GridHeadingTemplate')
    this.RefreshButtonInGridToolbar(event,()=> this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("ImportContractApprovalGrid"), this.ImportContractApprovalGrid))

  };


  onApproved(data) {
    this.RecordToBeApproved = data;
    this.confirmationPopupVisible = true;
  }
}
