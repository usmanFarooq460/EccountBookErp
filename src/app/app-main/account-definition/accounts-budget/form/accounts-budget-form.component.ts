import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { AccountsBudget } from "../accounts-budget.model";
import { AccountsBudgetService } from "../accounts-budget.service";
import * as moment from "moment";
import notify from "devextreme/ui/notify";
import { validate } from "src/app/shared/Base/validationHelper";

@Component({
  selector: "app-accounts-budget-form",
  templateUrl: "./accounts-budget-form.component.html",
  styles: [],
})
export class AccountsBudgetFormComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  @ViewChild("ABF", { static: false })
  ABF: DxFormComponent; // Accounts Budget form instance`
  ABD: AccountsBudget; // Accounts Budget form object

  dataSource = [];
  companyList = [];
  branchList = [];
  projectList = [];
  expenseAccountList = [];

  constructor(private commonService: CommonBaseService, private service: AccountsBudgetService) {}
  async ngOnInit() {
    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.getDocumentNo();
    this.getExpenseAccountList();
    this.initForm();
  }

  public initForm() {
    this.ABD = new AccountsBudget();

    this.ABD.CompanyId = this.companyList[0].Id;
    this.ABD.BranchId = this.branchList[0].Id;
    this.ABD.ProjectId = this.projectList[0].Id;
    this.ABD.DocDate = new Date();
    this.ABD.FnFromMonth = new Date(sessionStorage.getItem("StartPeriod"));
    this.ABD.FnToMonth = new Date(sessionStorage.getItem("EndPeriod"));
  }

  setFocus = (e) => setTimeout(() => e.component.focus(), 0);

  getDocumentNo() {
    this.service.getDocumentNo().subscribe(
      (result) => (this.ABD.DocNo = result),
      (error) => console.log(error)
    );
  }

  getExpenseAccountList() {
    this.service
      .getExpenseAccount({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => {
          this.expenseAccountList = result.filter(({ AccountTypeId }) => AccountTypeId == 11);
        },

        (error) => console.log(error)
      );
  }

  generate() {
    let dateStart = moment(this.ABD.FnFromMonth);
    let dateEnd = moment(this.ABD.FnToMonth);
    let months = [];
    this.dataSource.length = 0;

    while (dateEnd > dateStart || dateStart.format("M") === dateEnd.format("M")) {
      months.push({ BudgetMonth: dateStart.format("MMM-YYYY") });
      dateStart.add(1, "month");
    }
    let budgetAmount = (this.ABD.BudgetTotalAmount / months.length).toFixed(2);
    let budgetPercentage = (100 / months.length).toFixed(2);
    months.map(({ BudgetMonth }) => this.dataSource.push({ BudgetMonth: BudgetMonth, BudgetAmount: budgetAmount, BudgetPrcnt: budgetPercentage }));
  }

  calculateBudgetAmount(budgetPercent, index) {
    if (this.ABD.BudgetTotalAmount > 0 && budgetPercent > 0) {
      this.dataSource[index].BudgetAmount = ((this.ABD.BudgetTotalAmount * budgetPercent) / 100).toFixed(2);
    }
    this.dataGrid.instance.refresh();
  }

  handleBudgetPercentChange = ({ value }, index) => {
    this.calculateBudgetAmount(value, index);
  };

  calculateBudgetPercent(budgetAmount, index) {
    if (this.ABD.BudgetTotalAmount > 0 && budgetAmount > 0) {
      this.dataSource[index].BudgetPrcnt = ((100 / this.ABD.BudgetTotalAmount) * budgetAmount).toFixed(2);
    }
    this.dataGrid.instance.refresh();
  }

  handleBudgetAmountChange = ({ value }, index) => {
    this.calculateBudgetPercent(value, index);
  };

  onCellPrepared = (e) => {
    if ((e.rowType === "data" && e.column.dataField === "BudgetAmount") || e.column.dataField === "BudgetPrcnt") {
      e.cellElement.style.padding = "0px";
      e.cellElement.style.verticalAlign = "middle";
    }
  };

  reset() {
    this.initForm();
    this.dataSource.length = 0;
  }

  handleSave() {
    if (validate(this.ABF)) {
      if (this.dataSource.length > 0 === false) {
        notify("Please add record in data grid", "error");
      } else {
        if (this.ABD.BudgetTotalAmount != this.dataGrid.instance.getTotalSummaryValue("BudgetAmount")) {
          notify("Budget Amounts should be equal", "error");
          return;
        }
        if (this.dataGrid.instance.getTotalSummaryValue("BudgetPrcnt") != 100) {
          notify("Budget Percentage should be equal to 100", "error");
          return;
        }
        this.ABD.accountBudgetDetails = this.dataSource;
        console.log(this.ABD);
      }
    }
  }
}
