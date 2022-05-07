import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { JobManagmentReportService } from "./joblot-managment-ledger.service";
import { JobManagmentledgerModel } from "./joblot-managment-ledger.model";
import { Router } from "@angular/router";
import DataSource from "devextreme/data/data_source";
@Component({
  selector: "app-joblot-managment-ledger",
  templateUrl: "./joblot-managment-ledger.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class JobtLotManagmentLedgerComponent extends BaseActions implements OnInit {
  @Input() IsLoadedInPopup: boolean = false;
  @ViewChild("joblotManagementLedgerGrid", { static: false })
  joblotManagementLedgerGrid: DxDataGridComponent;
  @ViewChild("JobManagmentReportForm", { static: false })
  JobManagmentReportForm: DxFormComponent;
  JobManagmentReportFormData: JobManagmentledgerModel;
  dataSource = [];
  JobLotList = [];
  ItemList = [];
  AccountList: any = [];
  historyGridState: any;
  accountTitle: string = "";
  itemName: string = "";
  JobLot: string = "";
  HeaderArray = [];
  constructor(private router: Router, private service: JobManagmentReportService, private commonService: CommonBaseService) {
    super();
    this.popoverVisible = false;
    this.filter = false;
  }
  toggle() {
    this.popoverVisible = !this.popoverVisible;
  }
  filtering() {
    this.filter = !this.filter;
  }
  async ngOnInit() {
    this.breadCrumb("Acconts Reports", "Job Managment Report");
    this.initForm();
    this.historyGridState = sessionStorage.getItem("CompanyName") + "UserId=" + sessionStorage.getItem("UserId") + "--" + "JobManagmentReportGridState";
    this.GetCombosLists();
    this.GetData();
  }
  public initForm() {
    this.JobManagmentReportFormData = new JobManagmentledgerModel();
    this.JobManagmentReportFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.JobManagmentReportFormData.ToDate = new Date();
  }
  clear() {
    this.initForm();
  }

  GetCombosLists() {
    this.service
      .GetAllCombos({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.ItemList = result.filter(({ ActivityType }) => ActivityType == "Items");
          this.JobLotList = result.filter(({ ActivityType }) => ActivityType == "JobLot");
          this.AccountList = new DataSource({
            store: result.filter(({ ActivityType }) => ActivityType == "Account"),
            loadMode: "raw",
            paginate: true,
            pageSize: 10,
          });
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  GetData() {
    this.ActivateLoadPanel("Loading Data");
    this.JobManagmentReportFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
    this.JobManagmentReportFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
    this.service.LedgerByJobReport(this.JobManagmentReportFormData).subscribe(
      (result) => {
        this.DeActivateLoadPanel();
        this.HeaderArray = this.GenerateHeaderData(result, "VoucherCode");
        this.dataSource = result;
      },
      (error) => {
        this.DeActivateLoadPanel();
        this.HandleError(error);
      }
    );
  }
  // GnerateHeaderData(data) {
  //   let HeaderArray = [];
  //   for (let i = 0; i < data.length; i++) {
  //     if (i == 0) {
  //       HeaderArray.push(data[i]);
  //     } else if (i > 0) {
  //       let flag = false;
  //       for (let j = 0; j < HeaderArray.length; j++) {
  //         if (data[i].HeaderAccountTitle === HeaderArray[j].HeaderAccountTitle && data[i].VoucherCode === HeaderArray[j].VoucherCode) {
  //           flag = true;
  //           break;
  //         }
  //       }
  //       if (flag == false) {
  //         HeaderArray.push(data[i]);
  //       }
  //     }
  //   }
  //   return HeaderArray;
  // }
  // onSubmit() {
  //   const result: any = this.JobManagmentReportForm.instance.validate();
  //   if (!result.isValid) {
  //     result.brokenRules[0].validator.focus();
  //     return;
  //   } else {
  //     this.ActivateLoadPanel("Loading Data");
  //     this.JobManagmentReportFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
  //     this.JobManagmentReportFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
  //     this.service.LedgerByJobReport(this.JobManagmentReportFormData).subscribe(
  //       (result) => {
  //         console.log(result)
  //         this.DeActivateLoadPanel();
  //         this.accountTitle = this.JobManagmentReportForm.instance.getEditor("AccountId").option("text");
  //         this.itemName = this.JobManagmentReportForm.instance.getEditor("ItemId").option("text");
  //         this.JobLot = this.JobManagmentReportForm.instance.getEditor("JobLotId").option("text");
  //         this.dataSource = result;
  //         this.dataSourceLength = [20, 50, 100, this.dataSource.length];
  //       },
  //       (error) => {
  //         this.DeActivateLoadPanel();
  //        this.HandleError(error);
  //       }
  //     );
  //   }
  // }

  jobMangment155() {
    this.ActivateLoadPanel("Loading Report");
    this.service
      .jobMangment155({
        //Compulosry
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FromDate: this.JobManagmentReportFormData.FromDate,
        ToDate: this.JobManagmentReportFormData.ToDate,
        AccountId: this.JobManagmentReportFormData.AccountId,
        ItemId: this.JobManagmentReportFormData.ItemId,
        JobLotId: this.JobManagmentReportFormData.JobLotId,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),

        ReportName: "155-VouchersInvJobManagementRpt",
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
  jobMangment155JobWiseNDocumentTypeWise() {
    this.ActivateLoadPanel("Loading Report");
    this.service
      .jobMangment155({
        //Compulosry
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FromDate: this.JobManagmentReportFormData.FromDate,
        ToDate: this.JobManagmentReportFormData.ToDate,
        AccountId: this.JobManagmentReportFormData.AccountId,
        ItemId: this.JobManagmentReportFormData.ItemId,
        JobLotId: this.JobManagmentReportFormData.JobLotId,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "155-VouchersInvJobManagementGroupByJoblot&DocumentTypeRpt",
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
  jobMangment155DocumentTypeWise() {
    this.ActivateLoadPanel("Loading Report");
    this.service
      .jobMangment155({
        //Compulosry
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FromDate: this.JobManagmentReportFormData.FromDate,
        ToDate: this.JobManagmentReportFormData.ToDate,
        AccountId: this.JobManagmentReportFormData.AccountId,
        ItemId: this.JobManagmentReportFormData.ItemId,
        JobLotId: this.JobManagmentReportFormData.JobLotId,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "155-VouchersInvJobManagementGroupByDocument.Rpt",
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

  onToolPreparingOfItemHistoryGrid = (e) => {
    this.ReportButtonInGridToolbar(e, "155-Report", this.jobMangment155.bind(this));
    this.ReportButtonInGridToolbar(e, "155-Document Type Wise Report", this.jobMangment155DocumentTypeWise.bind(this));
    this.ReportButtonInGridToolbar(e, "155-Job Wise Report", this.jobMangment155JobWiseNDocumentTypeWise.bind(this));
    this.FilterButtonInGridToolbar(e);
    this.RefreshHistoryGridGrid(() => this.GetData.bind(this), this.HistoryGridSateKey("joblotManagementLedgerGrid"), this.joblotManagementLedgerGrid);
    this.HistoryGridExpanAllRowButton(e, () => this.ExpanAllRows(this.joblotManagementLedgerGrid));
  };
}
