import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { OpeningBalanceService } from "./opening-balance.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { OpeningBalance } from "./opening-balance.model";
import notify from "devextreme/ui/notify";

import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-opening-balance",
  templateUrl: "./opening-balance.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_gridHeading.scss", "/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class OpeningBalanceComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  @ViewChild("openingbalanceForm", { static: false })
  openingbalanceForm: DxFormComponent;
  openingbalanceFormData: any;
  editFieldId;
  accountList: any;
  dataSource = [];
  isUpdate: boolean;
  AccountId: number;
  AccountTitle: string;
  canSave: boolean;
  lengthOfDataSource: any[];
  constructor(private service: OpeningBalanceService, private commonMethods: CommonMethodsForCombos, private commonService: CommonBaseService) {
    super();
    this.filter = false;
  }

  ngOnInit(): void {
    this.breadCrumb("Account Defintion", "Opening Balance");
    this.userRights();
    this.OpeningBalanceGetAll();
    this.AccountsGetAll();
    this.initForm();
  }

  public initForm() {
    // this.openingbalanceFormData = new DefineCity();
    this.openingbalanceFormData = {
      AccountId: "",
      AccountTitle: "",
      Id: "",
      AccountName: "",
      Debit: "0",
      Credit: "0",
    };
  }
  filtering() {
    this.filter = !this.filter;
  }

  AccountsGetAll() {
    this.service
      .OpeningBalanceGetAll({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
      })
      .subscribe(
        (result) => {
          this.GnerateAccountsDataSource(result);
        },
        (error) => console.log(error)
      );
  }
  async GnerateAccountsDataSource(data) {
    this.accountList = await this.commonMethods.GenerateDataSourceFromList(data);
  }

  handleDebitChange = (e) => {
    if (this.openingbalanceFormData.Debit) {
      this.openingbalanceFormData.Credit = 0;
    }
  };
  handleCreditChange = (e) => {
    if (this.openingbalanceFormData.Credit) {
      this.openingbalanceFormData.Debit = 0;
    }
  };

  handleChange = (e) => {
    this.service
      .OpeningBalanceGetAll({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
        Id: e.value,
      })
      .subscribe(
        (result) => {
          result.map((item) => {
            (this.openingbalanceFormData.Debit = item.YearObDebit), (this.openingbalanceFormData.Credit = item.YearObCredit), (this.openingbalanceFormData.AccountId = item.ChartOfAccountId);
            this.openingbalanceFormData.AccountTitle = item.ChartOfAccountTitle;
          });
        },
        (error) => console.log(error)
      );
  };

  OpeningBalanceGetAll() {
    this.service
      .OpeningBalanceGetAll({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
      })
      .subscribe(
        (result) => {
          this.dataSource = result;
          this.lengthOfDataSource = [100, 500, 1000, result.length];
        },
        (error) => {
          console.log(error);
        }
      );
  }
  GetSpecificNumbersOfRecords() {}
  LoadAllRecords() {}

  onToolbarPreparing(event) {
    this.HistoryGridToolBarPreparing(
      event,
      () => this.filtering(),
      () => this.LoadAllRecords(),
      () => this.RefreshHistoryGridGrid(this.GetSpecificNumbersOfRecords.bind(this), this.HistoryGridSateKey("AccountsOpeningBalanceHistoryGrid"), this.dataGrid)
    );
  }
  setFocus = () => this.openingbalanceForm.instance.getEditor("AccountName").focus();
  addData() {
    this.formPopup = true;
    this.openingbalanceFormData = {
      AccountId: "",
      AccountTitle: "",
      Id: "",
      AccountName: "",
      Debit: "0",
      Credit: "0",
    };
  }

  cancel() {
    this.formPopup = false;
    this.openingbalanceFormData = {
      AccountId: "",
      AccountTitle: "",
      Id: "",
      AccountName: "",
      Debit: "0",
      Credit: "0",
    };
  }
  userRights() {
    this.commonService
      .userRights({
        UserId: this.commonService.UserId(),
        ScreenName: "AcfrmOpeningBalance",
        RightName: this.commonService.RoleName(),
      })
      .subscribe(
        (result) => {
          for (let { RightName, Value } of result) {
            if (RightName === "Update") {
              this.canSave = Value;
            }
          }
        },
        (error) => console.log(error)
      );
  }
  Submit() {
    if (this.canSave) {
      this.onSubmit();
    } else {
      notify("You don't have right to save", "error");
      return;
    }
  }
  onSubmit() {
    const result: any = this.openingbalanceForm.instance.validate();

    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.service
        .OpeningBalanceSave({
          Id: this.openingbalanceFormData.AccountName,
          ChartOfAccountId: this.openingbalanceFormData.AccountId,
          ChartOfAccountTitle: this.openingbalanceFormData.AccountTitle,
          CompanyId: sessionStorage.getItem("CompanyId"),

          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          EntryDate: new Date(),
          EntryUser: sessionStorage.getItem("UserId"),
          ModifyDate: new Date(),
          ModifyUser: sessionStorage.getItem("UserId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          PostDate: new Date(),
          PostUser: sessionStorage.getItem("UserId"),
          YearObCredit: this.openingbalanceFormData.Credit,
          YearObDebit: this.openingbalanceFormData.Debit,
        })
        .subscribe(
          (result) => {
            this.notification("Record Saved Successfully", "success");
            this.OpeningBalanceGetAll();
            this.clear();
            this.setFocus();
          },
          (error) => console.log(error)
        );
    }
  }

  clear() {
    this.formPopup = true;
    this.openingbalanceForm.instance.resetValues();
  }
  ////////////////////////////////////////////////////////////////////
}
