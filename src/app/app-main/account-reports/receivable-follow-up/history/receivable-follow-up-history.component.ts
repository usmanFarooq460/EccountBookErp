//@hamzamfarooqi55

import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import notify from "devextreme/ui/notify";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { ReceivableFollowUpService } from "../receivable-follow-up.service";
import { DxTreeViewComponent } from "devextreme-angular";
@Component({
  selector: "app-receivable-follow-up-history",
  templateUrl: "./receivable-follow-up-history.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class ReceivableFollowUpHistoryComponent extends BaseActions implements OnInit {
  @Input() IsLoadedInPopup: boolean = false;
  @ViewChild("ReceiveAbleFollowUpGrid", { static: false })
  ReceiveAbleFollowUpGrid: DxDataGridComponent;
  @ViewChild(DxTreeViewComponent, { static: false }) treeView;
  treeDataSource: any;
  treeBoxValue: string[];
  @ViewChild("ReceivableFollowUpHistory", { static: false })
  ReceivableFollowUpHistory: DxFormComponent;
  ReceivableFollowUpHistoryData: any;
  BalanceFrom: any;
  BalanceTo: any;
  dataSource: any;
  girdPageSize: any;
  companyList = [];
  branchList = [];
  projectList = [];
  selectedAccountsValueList: string = "";
  accountsList = [];
  thirdLevelAccountList = [];
  thirdLevleAccountsWithType3 = [];
  thirdLevleAccountsWithType22 = [];
  accountListToBeShownInCombo: any;
  tasksDataSource: any;
  SaleInvoiceDocumentTypeIds: number;
  SupplierCustomerList: any;

  constructor(private router: Router, private service: ReceivableFollowUpService, private commonService: CommonBaseService) {
    super();
    this.filter = false;
    this.popoverVisible = false;
  }
  filtering() {
    this.filter = !this.filter;
  }
  async ngOnInit() {
    this.breadCrumb("Account Reports", "Receivable Follow Up");
    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.AccountsGetAll();
    this.SaleInvoiceDocumentTypeIdsGet();
    this.AccountsAllLevelsGetAll();
    this.initForm();
    this.getReceivableList();
  }

  public initForm() {
    this.ReceivableFollowUpHistoryData = {
      FromDate: sessionStorage.getItem("StartPeriod"),
      ToDate: new Date(),
      toBalance: null,
      fromBalance: null,
    };
  }

  onEdit(e) {
    this.router.navigate(["/account-reports/receivable-follow-up-form"], {
      queryParams: { Id: e.Id },
    });
  }
  getRowNumber(e) {
    let previousPageIndex: number;
    let currentPageIndex = this.ReceiveAbleFollowUpGrid.instance.pageIndex();
    let rowCountTillLastPage: number;
    let rowCountOFCurrentPage = this.ReceiveAbleFollowUpGrid.instance.getVisibleRows().length;
    rowCountTillLastPage += rowCountOFCurrentPage;
    if (currentPageIndex == 0) {
      return e.rowIndex + 1;
    }
    if (currentPageIndex != 0) {
      return rowCountTillLastPage;
    }

    // if(this.dataGrid.instance.pageIndex()==0)
    // {
    //   return e.rowIndex+1;
    // }
    // if(this.dataGrid.instance.pageIndex()>0 && this.dataGrid.instance.getVisibleRows().length==20)
    // {
    //   return (this.dataGrid.instance.pageIndex()*20)+e.rowIndex+1
    // }
    // if(this.dataGrid.instance.pageIndex()>0&& this.dataGrid.instance.getVisibleRows().length>20)
    // {

    //   return e.rowIndex+1;
    // }
  }
  toggle() {
    this.popoverVisible = !this.popoverVisible;
  }

  gotoForm() {
    this.router.navigate(["/account-reports/receivableFollowUp-form"]);
  }

  ReportRegister122() {
    if (this.ReceivableFollowUpHistoryData) {
      this.service
        .AcRptAccounts_ReceivablesWithStatus_122({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.ReceivableFollowUpHistoryData.FromDate,
          ToDate: this.ReceivableFollowUpHistoryData.ToDate,
          FinancialYearId: sessionStorage.getItem("FinancialYearId"),
          ReportName: "122-AcRptAccounts_ReceivablesWithStatus",
        })
        .subscribe(
          (result) => window.open(result),
          (error) => {
            if (error.ExceptionMessage) {
              this.ErrorPopup(error.ExceptionMessage);
            } else if (error.Message) {
              this.ErrorPopup(error.Message);
            } else {
              this.ErrorPopup(error);
            }
          }
        );
    } else {
      this.ErrorPopup("Record Not Found");
      // notify("Record Not Found", "error");
    }
  }

  getReceivableList() {
    this.ActivateLoadPanel("Loading data");
    this.service
      .GetAllReceivables({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
        FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
        AccountTypeId: 3,
        BalanceFrom: 10000,
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.dataSource = result;
          this.girdPageSize = [250, 500, result.length];
        },
        (error) => {
          this.DeActivateLoadPanel();
          if (error.ExceptionMessage) {
            this.ErrorPopup(error.ExceptionMessage);
          } else if (error.Message) {
            this.ErrorPopup(error.Message);
          } else {
            this.ErrorPopup(error);
          }
        }
      );
  }
  //@hamzamfarooqi55
  AccountsGetAll() {
    this.service
      .AccountGetAll({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
      })
      .subscribe(
        (result) => {
          this.accountsList = result.filter(({ Id }) => Id == 3);
          if (this.accountsList) {
            this.ReceivableFollowUpHistoryData.accountType = this.accountsList[0].Id;
            // this.checkAccountTypeID(3);
          }
          // this.accountsList = result.filter(({ Id }) => Id == 3 || Id == 22);
        },
        (error) => {
          if (error.ExceptionMessage) {
            this.ErrorPopup(error.ExceptionMessage);
          } else if (error.Message) {
            this.ErrorPopup(error.Message);
          } else {
            this.ErrorPopup(error);
          }
        }
      );
  }

  AccountsAllLevelsGetAll() {
    this.service
      .AllLevelsAccount({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
      })
      .subscribe(
        (result) => {
          this.thirdLevelAccountList = result.filter(({ Account_Level }) => Account_Level == 3);
          this.thirdLevleAccountsWithType3 = this.thirdLevelAccountList.filter(({ AccountTypeId }) => AccountTypeId == 3);

          // this.thirdLevleAccountsWithType22 = this.thirdLevelAccountList.filter(({ AccountTypeId }) => AccountTypeId == 22);
        },
        (error) => {
          if (error.ExceptionMessage) {
            this.ErrorPopup(error.ExceptionMessage);
          } else if (error.Message) {
            this.ErrorPopup(error.Message);
          } else {
            this.ErrorPopup(error);
          }
        }
      );
  }

  // checkAccountTypeID = (e) => {
  //   this.accountListToBeShownInCombo = null;
  //   this.treeBoxValue = null;

  //   this.AccountsAllLevelsGetAll();
  //   this.accountListToBeShownInCombo = this.thirdLevleAccountsWithType3;

  //   // else if (e.value == 22) {
  //   //   this.accountListToBeShownInCombo = this.thirdLevelAccountList.filter(({ AccountTypeId }) => AccountTypeId == 22);
  //   // }
  // };
  onDropDownBoxValueChanged(e) {
    this.updateSelection(this.treeView && this.treeView.instance);
  }
  updateSelection(treeView) {
    if (!treeView) return;

    if (!this.treeBoxValue) {
      treeView.unselectAll();
    }

    if (this.treeBoxValue) {
      this.treeBoxValue.forEach(
        function (value) {
          treeView.selectItem(value);
        }.bind(this)
      );
    }
  }
  onTreeViewSelectionChanged(e) {
    this.treeBoxValue = e.component.getSelectedNodeKeys();
  }
  onTreeViewReady(e) {
    this.updateSelection(e.component);
  }

  SaleInvoiceDocumentTypeIdsGet() {
    this.commonService
      .configurations({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => {
          for (let { ConfigDescription, ConfigKey } of result) {
            if (ConfigDescription === "ReceiptsByInvoiceSalesInvoice") {
              if (ConfigKey) {
                this.SaleInvoiceDocumentTypeIds = ConfigKey;
              }
            }
          }
        },
        (error) => {
          if (error.ExceptionMessage) {
            this.ErrorPopup(error.ExceptionMessage);
          } else if (error.Message) {
            this.ErrorPopup(error.Message);
          } else {
            this.ErrorPopup(error);
          }
        }
      );
  }

  clear() {
    this.ReceivableFollowUpHistoryData.FromDate = sessionStorage.getItem("StartPeriod");
    this.ReceivableFollowUpHistoryData.ToDate = new Date();
    this.ReceivableFollowUpHistory.instance.getEditor("FromDate").focus();
  }

  onSubmit() {
    const result: any = this.ReceivableFollowUpHistory.instance.validate();
    if (!result.isValid) {
      // result.brokenRules[0].validator.focus();
      return;
    } else {
      if (this.treeBoxValue) {
        for (let i = 0; i < this.treeBoxValue.length; i++) {
          this.selectedAccountsValueList += "," + this.treeBoxValue[i];
        }
      }

      this.BalanceFrom = this.ReceivableFollowUpHistoryData.fromBalance;
      this.BalanceTo = this.ReceivableFollowUpHistoryData.toBalance;

      this.popoverVisible = false;
      this.ActivateLoadPanel("Loading Data");
      this.service
        .GetAllReceivables({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.ReceivableFollowUpHistoryData.FromDate,
          ToDate: this.ReceivableFollowUpHistoryData.ToDate,
          AccountTypeId: this.ReceivableFollowUpHistoryData.accountType,
          BalanceFrom: this.BalanceFrom,
          BalanceTo: this.BalanceTo,
          parentAccountCodes: this.selectedAccountsValueList,
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            this.dataSource = result;
            this.girdPageSize = [250, 500, result.length];
            let noOfRecord: number;
            noOfRecord = this.dataSource.length;
            this.treeBoxValue = null;
            this.selectedAccountsValueList = "";
            if (noOfRecord > 0) {
              // this.notification(noOfRecord + "  " + "Record Found SuccessFully", "success");
            } else if ((noOfRecord = 0)) {
              this.ErrorPopup("Record not Found");
              // this.notification("Record Not Found ", "error");
            }
          },
          (error) => {
            this.DeActivateLoadPanel();
            if (error.ExceptionMessage) {
              this.ErrorPopup(error.ExceptionMessage);
            } else if (error.Message) {
              this.ErrorPopup(error.Message);
            } else {
              this.ErrorPopup(error);
            }
          }
        );
    }
  }

  InvoiceSlip262(e) {
    this.service
      .PDFReportSlip262({
        Id: e.Id,
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocumentTypeId: 84,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "262-DeliveryOrderSlip",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => {
          if (error.ExceptionMessage) {
            this.ErrorPopup(error.ExceptionMessage);
          } else if (error.Message) {
            this.ErrorPopup(error.Message);
          } else {
            this.ErrorPopup(error);
          }
        }
      );
  }

  goBack() {
    this.router.navigate(["/admin-panel/report-panel"]);
  }

  onToolPreparingOfItemHistoryGrid = (e) => {
    e.toolbarOptions.items.unshift(
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "outstandingPaddyPurchaseOrderChartButton",
          icon: "print",
          hint: "Print 122-Register-Report",
          onClick: this.ReportRegister122.bind(this),
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "outstandingPaddyPurchaseOrderChartButton",
          icon: "back",
          hint: "Back",
          onClick: this.goBack.bind(this),
        },
      }
    );

    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.getReceivableList(),
      () => this.RefreshHistoryGridGrid(this.getReceivableList.bind(this), this.HistoryGridSateKey("ReceiveAbleFollowUpGrid"), this.ReceiveAbleFollowUpGrid)
    );
  };

  // onToolbarPreparing(event) {
  //   this.toolbarPreparing(
  //     event,
  //     () => this.dataGrid.instance.refresh(),
  //     () => this.exportGrid(this.dataGrid.instance)
  //   );
  // }
}
