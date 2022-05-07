import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { validate } from "src/app/shared/Base/validationHelper";
import { PyablesRecievablesAgingModel } from "../payables-recievables.model";
import { PyablesRecievablesAgingService } from "../payables-recievables.service";
import notify from "devextreme/ui/notify";
// import { ShippedConsignmentFollowupservice } from "src/app/app-main/export-definition/shipped-consignment-followup/shipped-consignment-followup.service";

@Component({
  selector: "app-receivable-follow-up-form",
  templateUrl: "./payables-recievables-form.component.html",
  styleUrls: [],
})
export class PyablesRecievablesAgingFormComponent extends BaseActions implements OnInit {
  @ViewChild("payAbleReceiveAbleGrid", { static: false })
  payAbleReceiveAbleGrid: DxDataGridComponent;
  @ViewChild("customGroupGrid", { static: false })
  customGroupGrid: DxDataGridComponent;
  @ViewChild("PayablesRecievablesAgingForm", { static: false })
  PayablesRecievablesAgingForm: DxFormComponent;
  PayablesRecievablesAgingFormData: PyablesRecievablesAgingModel;

  companyList = [];
  branchList = [];
  projectList = [];
  supplierNameList = [];
  WareHouseList = [];
  itemNameList;
  ProjectList = [];
  BranchList = [];
  dataSource = [];
  AccountsList = [];

  currentDate: Date = new Date();
  dueDays: number;
  dueDate: Date;
  taxPercent: number;
  tempItemAmount;
  Calculation: number;
  organizationId: number;
  companyId: number;
  updateRowIndex: number;
  detailEditMode: boolean;
  ParamsId: number;
  id4submit: number;
  PackUOM: number;
  recId: number;
  isUpdate: boolean;

  //====================
  classificationList = ["Classify By Accounts", "Classify by Balance"];
  RptTypeList = ["Accounts Payables", "Accounts Recievables"];
  AccountsPayables = [];
  AccountsRecievables = [];
  AccountsSelectionGridDataSource = [];
  ApprovalPopupHeight: number = window.innerHeight - 100;
  mainData = [];
  @HostListener("window:resize", ["$event"])
  onResize(event): void {
    let height = event.target.innerHeight;

    this.ApprovalPopupHeight = height - (height * 15) / 100;
  }
  gridPageSize: any;
  selectedAccounts = [];
  warningPopupVisibility: boolean = false;
  warningPopupMessage: string = "";
  refreshing: boolean = false;
  //====================
  AccountsLookupList = [];
  AccountsCustomGroupList = [];
  selectedCustomGroups = [];
  constructor(private commonService: CommonBaseService, private service: PyablesRecievablesAgingService, private route: ActivatedRoute, private router: Router) {
    super();
    this.filter = false;
  }

  async ngOnInit() {
    this.ParamsId = this.route.snapshot.queryParams["Id"];
    this.AccountsCustomGroupGetAll();
    this.AccountsLookupGetAll();
    this.initForm();
    this.PayablesandReceivablesMenagment();
  }

  public initForm() {
    this.PayablesRecievablesAgingFormData = new PyablesRecievablesAgingModel();
    let currentDate = new Date();
    this.PayablesRecievablesAgingFormData.FromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 30);
    this.PayablesRecievablesAgingFormData.IntervalDays = 30;
    this.PayablesRecievablesAgingFormData.ToDate = currentDate;
    this.PayablesRecievablesAgingFormData.DocNo = 1000;
    this.PayablesRecievablesAgingFormData.ItemTypeId = 0;
    this.PayablesRecievablesAgingFormData.ItemClassId = 0;
    this.AccountsAllLevelsGetAll();
  }

  setFocus = (e) =>
    setTimeout(() => {
      e.component.focus();
    }, 0);

  onEdit(e) {
    this.isUpdate = true;
    this.recId = e.Id;
  }

  checkClick = (e) => {
    this.warningPopupVisibility = false;
  };
  AccountsAllLevelsGetAll() {
    this.service
      .AllLevelsAccount({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
      })
      .subscribe(
        (result) => {
          this.AccountsPayables = result.filter(({ Account_Level, AccountTypeId, AccountClass }) => Account_Level == 3 && AccountTypeId == 3 && AccountClass == 3);
          this.AccountsRecievables = result.filter(({ Account_Level, AccountTypeId, AccountClass }) => Account_Level == 3 && AccountTypeId == 3 && AccountClass == 2);
          this.AccountsSelectionGridDataSource = result.filter(
            ({ Account_Level, AccountTypeId, AccountClass }) => Account_Level == 3 && AccountTypeId == 3 && (AccountClass == 2 || AccountClass == 3)
          );
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
  AccountsLookupGetAll() {
    this.service
      .AccountsLookupGetAll({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
      })
      .subscribe(
        (result) => {
          this.AccountsLookupList = result;
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
  AccountsCustomGroupGetAll() {
    this.service
      .AccountsCustomGroupGetAll({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
      })
      .subscribe(
        (result) => {
          this.AccountsCustomGroupList = result;
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
  setClassificationType = (e) => {
    if (e.value == "Classify By Accounts") {
      this.PayablesRecievablesAgingFormData.ItemClassId = 1;
    } else if (e.value == "Classify by Balance") {
      this.PayablesRecievablesAgingFormData.ItemClassId = 2;
    }
    this.MgicMethodGenerateDataForMainGrid();
  };
  setRptType = (e) => {
    if (this.PayablesRecievablesAgingFormData.ItemClassId > 0) {
      if (e.value == "Accounts Payables") {
        this.PayablesRecievablesAgingFormData.ItemTypeId = 1;
        this.AccountsSelectionGridDataSource = this.AccountsPayables;
      } else if (e.value == "Accounts Recievables") {
        this.PayablesRecievablesAgingFormData.ItemTypeId = 2;
        this.AccountsSelectionGridDataSource = this.AccountsRecievables;
      }
      this.MgicMethodGenerateDataForMainGrid();
    } else {
      if (this.refreshing == false) {
        this.warningPopupMessage = "Please Check Report Classification First!";
        this.warningPopupVisibility = true;
      }
    }
  };
  generateReport() {
    this.ActivateLoadPanel("Loading Data...");
    this.service
      .PayablesandReceivablesMenagment({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        IntervalDays: this.PayablesRecievablesAgingFormData.IntervalDays,
        ToDate: this.PayablesRecievablesAgingFormData.ToDate,
        DocNo: this.PayablesRecievablesAgingFormData.DocNo,
        FinancialYearId: sessionStorage.getItem("FinancialYearId"),
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.mainData = result;
          this.gridPageSize = [result.length];
          this.MgicMethodGenerateDataForMainGrid();
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
  handleenddateChange = (e) => {
    let currentDated: any;
    currentDated = new Date(this.PayablesRecievablesAgingFormData.ToDate);
    if (this.PayablesRecievablesAgingFormData.IntervalDays > 0) {
      this.PayablesRecievablesAgingFormData.FromDate = new Date(currentDated.getFullYear(), currentDated.getMonth(), currentDated.getDate() - this.PayablesRecievablesAgingFormData.IntervalDays);
    } else {
      this.PayablesRecievablesAgingFormData.FromDate = new Date(currentDated.getFullYear(), currentDated.getMonth(), currentDated.getDate() - 0);
    }
  };
  handleIntervalChange = ({ value }) => {
    value &&
      value > 0 &&
      (this.PayablesRecievablesAgingFormData.ToDate = new Date(
        this.PayablesRecievablesAgingFormData.FromDate.getFullYear(),
        this.PayablesRecievablesAgingFormData.FromDate.getMonth(),
        this.PayablesRecievablesAgingFormData.FromDate.getDate() - +value
      ));
  };

  PayablesandReceivablesMenagment() {
    this.ActivateLoadPanel("Loading Data..");
    this.service
      .PayablesandReceivablesMenagment({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        IntervalDays: 30,
        ToDate: new Date(
          this.PayablesRecievablesAgingFormData.FromDate.getFullYear(),
          this.PayablesRecievablesAgingFormData.FromDate.getMonth(),
          this.PayablesRecievablesAgingFormData.FromDate.getDate() - +this.PayablesRecievablesAgingFormData.IntervalDays
        ),
        DocNo: 1000,
        FinancialYearId: sessionStorage.getItem("FinancialYearId"),
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.dataSource = result;
          this.mainData = result;
          this.gridPageSize = [result.length];
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

  //================================================================================
  //#region Magic
  MgicMethodGenerateDataForMainGrid() {
    let arrayToBePushed = [];
    if (this.PayablesRecievablesAgingFormData.ItemClassId == 0) {
      this.dataSource = this.mainData;
      this.gridPageSize = [this.dataSource.length];
    } else if (this.PayablesRecievablesAgingFormData.ItemClassId == 1) {
      if (this.PayablesRecievablesAgingFormData.ItemTypeId == 1) {
        if (this.selectedAccounts.length > 0 == false) {
          this.dataSource = this.mainData.filter(({ accountClass }) => accountClass == 3);
          this.gridPageSize = [this.dataSource.length];
        } else if (this.selectedAccounts.length > 0) {
          arrayToBePushed = [];
          for (let i = 0; i < this.selectedAccounts.length; i++) {
            for (let j = 0; j < this.mainData.length; j++) {
              if (this.mainData[j].accountClass == 3 && this.selectedAccounts[i].AccountCode == this.mainData[j].Ac3LevelCode) {
                arrayToBePushed.push({
                  AccountTitle: this.mainData[j].AccountTitle,
                  Opening: this.mainData[j].Opening,
                  Interval1St: this.mainData[j].Interval1St,
                  Interval2nd: this.mainData[j].Interval2nd,
                  Interval3rd: this.mainData[j].Interval3rd,
                  IntervalAbove: this.mainData[j].IntervalAbove,
                  ArApTypeDesc: this.mainData[j].ArApTypeDesc,
                  accountClass: this.mainData[j].accountClass,
                  Ac3LevelCode: this.mainData[j].Ac3LevelCode,
                });
              }
            }
          }
          this.dataSource = arrayToBePushed;
          this.gridPageSize = [this.dataSource.length];
        }
      } else if (this.PayablesRecievablesAgingFormData.ItemTypeId == 2) {
        if (this.selectedAccounts.length > 0 == false) {
          this.dataSource = this.mainData.filter(({ accountClass }) => accountClass == 2);
          this.gridPageSize = [this.dataSource.length];
        } else if (this.selectedAccounts.length > 0) {
          arrayToBePushed = [];
          for (let i = 0; i < this.selectedAccounts.length; i++) {
            for (let j = 0; j < this.mainData.length; j++) {
              if (this.mainData[j].accountClass == 2 && this.selectedAccounts[i].AccountCode == this.mainData[j].Ac3LevelCode) {
                arrayToBePushed.push({
                  AccountTitle: this.mainData[j].AccountTitle,
                  Opening: this.mainData[j].Opening,
                  Interval1St: this.mainData[j].Interval1St,
                  Interval2nd: this.mainData[j].Interval2nd,
                  Interval3rd: this.mainData[j].Interval3rd,
                  IntervalAbove: this.mainData[j].IntervalAbove,
                  ArApTypeDesc: this.mainData[j].ArApTypeDesc,
                  accountClass: this.mainData[j].accountClass,
                  Ac3LevelCode: this.mainData[j].Ac3LevelCode,
                });
              }
            }
          }
          this.dataSource = arrayToBePushed;
          this.gridPageSize = [this.dataSource.length];
        }
      }
    } else if (this.PayablesRecievablesAgingFormData.ItemClassId == 2) {
      if (this.PayablesRecievablesAgingFormData.ItemTypeId == 1) {
        if (this.selectedAccounts.length > 0 == false) {
          this.dataSource = this.mainData.filter(({ ArApTypeDesc }) => ArApTypeDesc == "Payables");
          this.gridPageSize = [this.dataSource.length];
        } else if (this.selectedAccounts.length > 0) {
          arrayToBePushed = [];
          for (let i = 0; i < this.selectedAccounts.length; i++) {
            for (let j = 0; j < this.mainData.length; j++) {
              if (this.mainData[j].ArApTypeDesc == "Payables" && this.mainData[j].Ac3LevelCode == this.selectedAccounts[i].AccountCode) {
                arrayToBePushed.push({
                  AccountTitle: this.mainData[j].AccountTitle,
                  Opening: this.mainData[j].Opening,
                  Interval1St: this.mainData[j].Interval1St,
                  Interval2nd: this.mainData[j].Interval2nd,
                  Interval3rd: this.mainData[j].Interval3rd,
                  IntervalAbove: this.mainData[j].IntervalAbove,
                  ArApTypeDesc: this.mainData[j].ArApTypeDesc,
                  accountClass: this.mainData[j].accountClass,
                  Ac3LevelCode: this.mainData[j].Ac3LevelCode,
                });
              }
            }
          }
          this.dataSource = arrayToBePushed;
          this.gridPageSize = [this.dataSource.length];
        }
      } else if (this.PayablesRecievablesAgingFormData.ItemTypeId == 2) {
        if (this.selectedAccounts.length > 0 == false) {
          this.dataSource = this.mainData.filter(({ ArApTypeDesc }) => ArApTypeDesc == "Receivables");
          this.gridPageSize = [this.dataSource.length];
        } else if (this.selectedAccounts.length > 0) {
          arrayToBePushed = [];
          for (let i = 0; i < this.selectedAccounts.length; i++) {
            for (let j = 0; j < this.mainData.length; j++) {
              if (this.mainData[j].ArApTypeDesc == "Receivables" && this.mainData[j].Ac3LevelCode == this.selectedAccounts[i].AccountCode) {
                arrayToBePushed.push({
                  AccountTitle: this.mainData[j].AccountTitle,
                  Opening: this.mainData[j].Opening,
                  Interval1St: this.mainData[j].Interval1St,
                  Interval2nd: this.mainData[j].Interval2nd,
                  Interval3rd: this.mainData[j].Interval3rd,
                  IntervalAbove: this.mainData[j].IntervalAbove,
                  ArApTypeDesc: this.mainData[j].ArApTypeDesc,
                  accountClass: this.mainData[j].accountClass,
                  Ac3LevelCode: this.mainData[j].Ac3LevelCode,
                });
              }
            }
          }
          this.dataSource = arrayToBePushed;
          this.gridPageSize = [this.dataSource.length];
        }
      }
    }
    this.gridPageSize = [this.dataSource.length];
  }

  //#endregion

  MagicMethodGenerateDataForMainGridAgainstCustomGroups() {
    if (this.selectedCustomGroups.length > 0 == false) {
      this.dataSource = this.mainData;
    } else {
      let arrayToBePushed = [];
      let accountsListAgainstCustomGroup = [];
      for (let i = 0; i < this.selectedCustomGroups.length; i++) {
        for (let j = 0; j < this.AccountsCustomGroupList.length; j++) {
          if (this.selectedCustomGroups[i].Id == this.AccountsCustomGroupList[j].AcLookUpsId) {
            accountsListAgainstCustomGroup.push({
              ChartOfAccountId: this.AccountsCustomGroupList[j].ChartOfAccountId,
            });
          }
        }
      }
      console.log(accountsListAgainstCustomGroup);
      for (let i = 0; i < accountsListAgainstCustomGroup.length; i++) {
        for (let j = 0; j < this.mainData.length; j++) {
          if (accountsListAgainstCustomGroup[i].ChartOfAccountId == this.mainData[j].AcId) {
            arrayToBePushed.push({
              AccountTitle: this.mainData[j].AccountTitle,
              Opening: this.mainData[j].Opening,
              Interval1St: this.mainData[j].Interval1St,
              Interval2nd: this.mainData[j].Interval2nd,
              Interval3rd: this.mainData[j].Interval3rd,
              IntervalAbove: this.mainData[j].IntervalAbove,
              ArApTypeDesc: this.mainData[j].ArApTypeDesc,
              accountClass: this.mainData[j].accountClass,
              Ac3LevelCode: this.mainData[j].Ac3LevelCode,
            });
          }
        }
      }
      this.dataSource = arrayToBePushed;
    }
  }
  //================================================================================

  onSelectionChanged = (e) => {
    this.selectedAccounts = e.selectedRowsData;
    this.MgicMethodGenerateDataForMainGrid();
  };
  onSelectionChangeInCustomGroupGid = (e) => {
    this.selectedCustomGroups = e.selectedRowsData;
    this.MagicMethodGenerateDataForMainGridAgainstCustomGroups();
  };

  onToolPreparingOfItemHistoryGrid = (e) => {
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.PayablesandReceivablesMenagment(),
      () => this.RefreshHistoryGridGrid(this.PayablesandReceivablesMenagment.bind(this), this.HistoryGridSateKey("payAbleReceiveAbleGrid"), this.payAbleReceiveAbleGrid)
    );
  };
  // onToolbarPreparing(event) {
  //   this.toolbarPreparing(
  //     event,
  //     () => this.dataGrid.instance.refresh(),
  //     () => this.exportGrid(this.dataGrid.instance)
  //   );
  // }

  formatValue(e) {
    if (e > 0) {
      return parseFloat(e.toFixed(2));
    } else if (e < 0) {
      let c = Math.abs(parseFloat(e.toFixed(2)));
      return "(" + c + ")";
    }
    return e;
  }

  resetForm() {
    this.refreshing = true;
    this.initForm();
    this.ParamsId = null;
    this.recId = null;
    this.id4submit = null;
    this.PayablesRecievablesAgingForm.instance.resetValues();
    this.refreshing = false;
  }
}
