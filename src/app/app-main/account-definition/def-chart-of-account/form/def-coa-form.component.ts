import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { ChartOfAccount } from "../def-chart-of-account.model";
import { DefChartOfAccountService } from "../def-chart-of-account.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { validate } from "src/app/shared/Base/validationHelper";
import ArrayStore from "devextreme/data/array_store";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { Console } from "console";
@Component({
  selector: "def-coa-form-popup",
  templateUrl: "./def-coa-form.component.html",
  styleUrls: [],
})
export class DefineChartOfAccountFormComponent extends BaseActions implements OnInit {
  @ViewChild("WsrmLoaderGrid", { static: false })
  WsrmLoaderGrid: DxDataGridComponent;
  @ViewChild("ChartOfAccountForm", { static: false })
  ChartOfAccountForm: DxFormComponent;
  ChartOfAccountFormData: ChartOfAccount;
  //==============Grids
  @ViewChild("ChildAccountGridOfSelectedParent", { static: false })
  ChildAccountGridOfSelectedParent: DxDataGridComponent;
  @ViewChild("FirstLevelAccountsGrid", { static: false })
  FirstLevelAccountsGrid: DxDataGridComponent;
  @ViewChild("SecondLevelAccountsGrid", { static: false })
  SecondLevelAccountsGrid: DxDataGridComponent;
  @ViewChild("ThirdLevelAcccountsGrid", { static: false })
  ThirdLevelAcccountsGrid: DxDataGridComponent;
  @ViewChild("FourthLevelAccountsGrid", { static: false })
  FourthLevelAccountsGrid: DxDataGridComponent;
  //==================
  @Input()
  PopupWithGridVisible: boolean;
  @Input() dataSource: any;
  @Output() selectedRecord = new EventEmitter();
  @Output() closePopupGrid = new EventEmitter();
  constructor(private service: DefChartOfAccountService, private commonMethods: CommonMethodsForCombos, private commonService: CommonBaseService) {
    super();
  }
  //#region  DataVariables
  headerArray = [];
  GridPageSize: any;
  parentAccountList: any;
  bSNotesList = [];
  parentaccountacdatasource = [];
  pLNotesList = [];
  accountTypeList = [];
  accountClassList = [
    { Id: 1, name: "Capital" },
    { Id: 2, name: "Assets" },
    { Id: 3, name: "Liabilities" },
    { Id: 4, name: "Expense" },
    { Id: 5, name: "Revenue" },
  ];
  groupDetailList = [
    { Id: 1, name: "Group" },
    { Id: 2, name: "Detail" },
  ];
  FirstLevelAccountsList = [];
  SecondLevelAccountsList = [];
  ThirdLevelAccountsList = [];
  FourthLevelAccountListt = [];
  selectedCompanies = [];
  CompaniesDataSource: any;
  brancheList = [];
  CompaniesList = [];
  //#endregion
  //#region ConditionalVariables
  accountCodeValue: number;
  groupDetailStatus: boolean = true;
  accountTypeStatus: boolean = true;
  bSNoteStatus: boolean = true;
  pLNoteStatus: boolean = true;
  canView: boolean;
  canSave: boolean;
  canPrint: boolean;
  canUpdate: boolean;
  //#endregion
  async ngOnInit() {
    this.filtering();
    this.GetData();
    this.initForm();
  }
  async GetData() {
    this.brancheList = await this.commonService.getBranch();
    this.userRights();
    this.getParentAccountList();
    this.getAccountTypeList();
    this.getCompany();
  }
  initForm() {
    this.ChartOfAccountFormData = new ChartOfAccount();
  }
  close() {
    this.closePopupGrid.emit("1");
    this.ResetGrids();
  }
  //===================================================================
  //#region ComboFills
  getParentAccountList() {
    this.service
      .getParentAccountList({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FinancialYearId: sessionStorage.getItem("FinancialYearId"),
      })
      .subscribe(
        (result) => {
          console.log(result);
          this.GenerateParentAccountDataSource(result);
        },
        (error) => console.log(error)
      );
  }
  async GenerateParentAccountDataSource(list) {
    this.parentAccountList = await this.commonMethods.GenerateDataSourceFromList(list);
  }
  getAccountTypeList() {
    this.service
      .getAccountTypeList({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => (this.accountTypeList = result),
        (error) => console.log(error)
      );
  }
  userRights() {
    this.commonService
      .userRights({
        UserId: this.commonService.UserId(),
        ScreenName: "AcfrmDefCoa",
        RightName: this.commonService.RoleName(),
      })
      .subscribe(
        (result) => {
          for (let { RightName, Value } of result) {
            if (RightName === "Save") {
              this.canSave = Value;
            }
          }
        },
        (error) => console.log(error)
      );
  }
  getCompany() {
    this.service
      .getCompany({
        OrgCompanyTypeId: this.commonService.OrganizationId(),
      })
      .subscribe(
        (result) => {
          this.CompaniesDataSource = new ArrayStore({
            key: "Id",
            data: result,
          });
          this.SelecteAllCompaniesByDefault(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  SelecteAllCompaniesByDefault(data) {
    if (data != null && data != undefined) {
      if (data.length == 1) {
        for (let i = 0; i < data.length; i++) {
          this.selectedCompanies.push(data[i].Id);
        }
      } else {
        this.selectedCompanies = [];
      }
    }
  }
  //#endregion
  //===================================================================
  //=====================================================================
  FilterAccountsByLevel(list) {
    let FirstLevelAccountList = [];
    let SecondLevelAccountList = [];
    let ThirdLevelAccountList = [];
    let FourthLevelAccountList = [];
    if (list.length > 0) {
      FirstLevelAccountList = list.filter(({ Account_Level }) => Account_Level == 1);
      SecondLevelAccountList = list.filter(({ Account_Level }) => Account_Level == 2);
      ThirdLevelAccountList = list.filter(({ Account_Level }) => Account_Level == 2);
      FourthLevelAccountList = list.filter(({ Account_Level }) => Account_Level == 4);
    }
    this.FirstLevelAccountsList = FirstLevelAccountList;
    this.SecondLevelAccountsList = SecondLevelAccountList;
    this.ThirdLevelAccountsList = ThirdLevelAccountList;
    this.FourthLevelAccountListt = FourthLevelAccountList;
  }
  handleChange = (e) => {
    this.accountCodeValue = e.value;
    this.service
      .getAccountCodeClassLevelList({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        AccountCode: e.value,
      })
      .subscribe(
        (result) => {
          result.map((item) => {
            this.ChartOfAccountFormData.AccountTypeId = null;
            item.AccountClass == 1
              ? (this.ChartOfAccountFormData.AccountClass = 1)
              : item.AccountClass == 2
              ? (this.ChartOfAccountFormData.AccountClass = 2)
              : item.AccountClass == 3
              ? (this.ChartOfAccountFormData.AccountClass = 3)
              : item.AccountClass == 4
              ? (this.ChartOfAccountFormData.AccountClass = 4)
              : (this.ChartOfAccountFormData.AccountClass = 5);
            this.ChartOfAccountFormData.Account_Level = item.Account_Level;
            this.ChartOfAccountFormData.AccountCode = item.AccountCode;
            this.ChartOfAccountFormData.Account_Level < 4
              ? ((this.ChartOfAccountFormData.AccountGroup = "Group"), (this.groupDetailStatus = true))
              : ((this.ChartOfAccountFormData.AccountGroup = "Detail"), (this.groupDetailStatus = false));
            this.ChartOfAccountFormData.Account_Level == 3 && this.ChartOfAccountFormData.AccountClass < 4 ? (this.getBSNotesList(), (this.bSNoteStatus = false)) : (this.bSNoteStatus = true);
            this.ChartOfAccountFormData.Account_Level == 3 && this.ChartOfAccountFormData.AccountClass >= 4 ? (this.getPLNotesList(), (this.pLNoteStatus = false)) : (this.pLNoteStatus = true);
            this.ChartOfAccountFormData.Account_Level == 3 ? (this.accountTypeStatus = false) : (this.accountTypeStatus = true);
            if (this.ChartOfAccountFormData.Account_Level >= 4) {
              this.accountTypeList.map((i) => i.AccountType == item.AccountType && (this.ChartOfAccountFormData.AccountTypeId = i.Id));
            }
          });
        },
        (error) => console.log(error)
      );
    //GetAlreeady Made Account By Parent Account Leave
    this.FilterChildAccountsOfSelectedParentAccount();
  };
  FilterChildAccountsOfSelectedParentAccount() {
    this.parentaccountacdatasource = [];
    this.dataSource.map(
      (item) => item.ParentAccountCode == this.ChartOfAccountFormData.ParentAccountCode && this.parentaccountacdatasource.push({ AccountCode: item.AccountCode, AccountTitle: item.AccountTitle })
    );
  }
  getBSNotesList() {
    this.service.getBSNotesList().subscribe(
      (result) => {
        console.log(result);
        this.bSNotesList = result;
      },
      (error) => console.log(error)
    );
  }
  getPLNotesList() {
    this.service.getPLNotesList().subscribe(
      (result) => {
        this.pLNotesList = result;
      },
      (error) => console.log(error)
    );
  }
  AddChild(data) {
    if (data.Account_Level == 4) {
      this.ChartOfAccountFormData.ParentAccountCode = data.ParentAccountCode;
    } else if (data.Account_Level < 4) {
      this.ChartOfAccountFormData.ParentAccountCode = data.AccountCode;
    }
    this.FilterAccounts(data);
  }
  FilterAccounts(data) {
    let FilteredAccounts = [];
    FilteredAccounts = this.dataSource.filter(({ ParentAccountCode }) => ParentAccountCode == data.AccountCode);
    this.parentaccountacdatasource = FilteredAccounts;
  }
  GetLatestChartOfAccountList() {
    this.service
      .chartofaccount({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => {
          this.dataSource = result;
          let NewAccount = this.dataSource.find(({ AccountCode }) => AccountCode == this.ChartOfAccountFormData.ParentAccountCode);
          this.FilterAccounts(NewAccount);
          this.ChartOfAccountForm.instance.getEditor("AccountTitle").reset();
        },
        (error) => console.log(error)
      );
  }
  ResetGrids() {
    this.ChildAccountGridOfSelectedParent.instance.clearFilter();
    this.FirstLevelAccountsGrid.instance.clearFilter();
    this.SecondLevelAccountsGrid.instance.clearFilter();
    this.ThirdLevelAcccountsGrid.instance.clearFilter();
    this.FourthLevelAccountsGrid.instance.clearFilter();
  }
  RefreshForm() {
    this.ChartOfAccountFormData = new ChartOfAccount();
    this.FilterAccountsByLevel(this.dataSource);
    this.FilterChildAccountsOfSelectedParentAccount();
  }
  onSubmit() {
    if (this.canSave) {
      this.onSave();
    } else {
      this.WarningPopup("You don't have right to save!");
      return;
    }
  }
  onSave() {
    if (validate(this.ChartOfAccountForm)) {
      this.ChartOfAccountFormData.COAAllocationList = [];
      if (this.selectedCompanies.length > 0 == false) {
        this.WarningPopup("Please Allocate to At Least One Location to Save Account!");
        return;
      }

      for (let j of this.selectedCompanies) {
        this.ChartOfAccountFormData.COAAllocationList.push({
          IsActive: true,
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: j,
          BranchId: this.brancheList[0].Id,
        });
      }
      let ParentAccountList = this.parentAccountList._store._array;
      this.ChartOfAccountFormData.ParentCodeId = ParentAccountList.find(({ AccountCode }) => AccountCode == this.ChartOfAccountFormData.ParentAccountCode).Id;
      this.ChartOfAccountFormData.FinancialYearId = this.commonService.FinancialYearId();
      this.ChartOfAccountFormData.EntryDate = new Date();
      this.ChartOfAccountFormData.EntryUser = this.commonService.UserId();
      this.ChartOfAccountFormData.ModifyDate = new Date();
      this.ChartOfAccountFormData.ModifyUser = this.commonService.UserId();
      this.ChartOfAccountFormData.PostDate = new Date();
      this.ChartOfAccountFormData.PostUser = this.commonService.UserId();
      this.ChartOfAccountFormData.OrganizationId = this.commonService.OrganizationId();
      this.ChartOfAccountFormData.CompanyId = this.commonService.CompanyId();
      this.ChartOfAccountFormData.IsActive = true;
      this.ActivateLoadPanel("Saving Account!");
      this.service.addChartOfAccount(this.ChartOfAccountFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.SuccessPopup("Record Saved Successfully!");
          this.getParentAccountList();
          this.GetLatestChartOfAccountList();
          this.ResetGrids();
          this.SelecteAllCompaniesByDefault(this.CompaniesList);
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
    }
  }
  //======================================================================
  DummyMethod() {}
  onToolbarPreparing(e) {
    this.LoaderGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("WsrmSaleInvoiceLoaderGrid"), this.WsrmLoaderGrid)
    );
    this.HistoryGridExpanAllRowButton(e, () => this.ExpanAllRows(this.WsrmLoaderGrid));
  }
}
