//@hamzamfarooqi55

import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import notify from "devextreme/ui/notify";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { PyablesRecievablesAgingService } from "../payables-recievables.service";
import { DxTreeViewComponent } from "devextreme-angular";
@Component({
  selector: "app-receivable-follow-up-history",
  templateUrl: "./payables-recievables-history.component.html",
  styleUrls: [],
})
export class PyablesRecievablesAgingHistoryComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild(DxTreeViewComponent, { static: false }) treeView;
  treeDataSource: any;
  treeBoxValue: string[];
  @ViewChild("PayablesRecievablesAgingHistoryForm", { static: false })
  PayablesRecievablesAgingHistoryForm: DxFormComponent;
  PayablesRecievablesAgingHistoryFormData: any;
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

  constructor(private router: Router, private service: PyablesRecievablesAgingService, private commonService: CommonBaseService) {
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
    this.PayablesRecievablesAgingHistoryFormData = {
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
    let currentPageIndex = this.dataGrid.instance.pageIndex();
    let rowCountTillLastPage: number;
    let rowCountOFCurrentPage = this.dataGrid.instance.getVisibleRows().length;
    console.log(this.dataGrid.instance.getVisibleRows().length);

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
    if (this.PayablesRecievablesAgingHistoryFormData) {
      this.service
        .AcRptAccounts_ReceivablesWithStatus_122({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.PayablesRecievablesAgingHistoryFormData.FromDate,
          ToDate: this.PayablesRecievablesAgingHistoryFormData.ToDate,
          FinancialYearId: sessionStorage.getItem("FinancialYearId"),
          ReportName: "122-AcRptAccounts_ReceivablesWithStatus",
        })
        .subscribe(
          (result) => window.open(result),
          (error) => {
            notify(error.ExceptionMessage, "error");
          }
        );
    } else {
      notify("Record Not Found", "error");
    }
  }

  getReceivableList() {
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
          this.dataSource = result;
          console.log(result);
          this.girdPageSize = [250, 500, result.length];
        },
        (error) => console.log(error)
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
          this.accountsList = result.filter(({ Id }) => Id == 3 || Id == 22);
        },
        (error) => console.log(error)
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
          this.thirdLevleAccountsWithType22 = this.thirdLevelAccountList.filter(({ AccountTypeId }) => AccountTypeId == 22);
        },
        (error) => console.log(error)
      );
  }

  checkAccountTypeID = (e) => {
    this.accountListToBeShownInCombo = null;
    this.treeBoxValue = null;

    if (e.value == 3) {
      this.accountListToBeShownInCombo = this.thirdLevleAccountsWithType3;
    } else if (e.value == 22) {
      this.accountListToBeShownInCombo = this.thirdLevelAccountList.filter(({ AccountTypeId }) => AccountTypeId == 22);
    }
  };
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
          console.log(error);
        }
      );
  }

  clear() {
    this.PayablesRecievablesAgingHistoryFormData.FromDate = sessionStorage.getItem("StartPeriod");
    this.PayablesRecievablesAgingHistoryFormData.ToDate = new Date();
    this.PayablesRecievablesAgingHistoryForm.instance.getEditor("FromDate").focus();
  }

  onSubmit() {
    const result: any = this.PayablesRecievablesAgingHistoryForm.instance.validate();
    if (!result.isValid) {
      // result.brokenRules[0].validator.focus();
      return;
    } else {
      if (this.treeBoxValue) {
        for (let i = 0; i < this.treeBoxValue.length; i++) {
          this.selectedAccountsValueList += "," + this.treeBoxValue[i];
        }
      }

      this.BalanceFrom = this.PayablesRecievablesAgingHistoryFormData.fromBalance;
      this.BalanceTo = this.PayablesRecievablesAgingHistoryFormData.toBalance;

      this.popoverVisible = false;
      this.service
        .GetAllReceivables({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          FromDate: this.PayablesRecievablesAgingHistoryFormData.FromDate,
          ToDate: this.PayablesRecievablesAgingHistoryFormData.ToDate,
          AccountTypeId: this.PayablesRecievablesAgingHistoryFormData.accountType,
          BalanceFrom: this.BalanceFrom,
          BalanceTo: this.BalanceTo,
          parentAccountCodes: this.selectedAccountsValueList,
        })
        .subscribe(
          (result) => {
            this.dataSource = result;
            this.girdPageSize = [250, 500, result.length];
            let noOfRecord: number;
            noOfRecord = this.dataSource.length;
            this.treeBoxValue = null;
            this.selectedAccountsValueList = "";
            if (noOfRecord > 0) {
              this.notification(noOfRecord + "  " + "Record Found SuccessFully", "success");
            } else if ((noOfRecord = 0)) {
              this.notification("Record Not Found ", "error");
            }
          },
          (error) => {
            notify(error);
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
        (error) => console.log(error)
      );
  }
  onToolbarPreparing(event) {
    this.toolbarPreparing(
      event,
      () => this.dataGrid.instance.refresh(),
      () => this.exportGrid(this.dataGrid.instance)
    );
  }
}
