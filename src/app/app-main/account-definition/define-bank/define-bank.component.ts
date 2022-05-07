import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { DefineBankService } from "./define-bank.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { DefineBankModel } from "./define-bank.model";
import notify from "devextreme/ui/notify";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "define-bank",
  templateUrl: "./define-bank.component.html",
  styleUrls: [],
})
export class DefineBankComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("bankForm", { static: false })
  bankForm: DxFormComponent;
  bankFormData: DefineBankModel;
  BankParamsId: number = 0;
  //
  countryId: number;
  countryName: string;
  //cityName: string;
  //
  countryNameList;
  cityNameList;
  accountList = [];
  dataSource = [];
  homelandList = [{ name: "Home Country" }, { name: "Foreign Country" }];
  @Input() IsLoadedInPopup: boolean = false;
  @Input() SomeElementsVisible: boolean = true;
  constructor(private service: DefineBankService, private commonService: CommonBaseService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = false;
  }
  async ngOnInit() {
    this.breadCrumb("Account Defintion", "Banks");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmBank"));
    this.BankGetAll();
    this.countryGetAll();
    this.accountsGetAll();
    this.initForm();
  }
  ngOnDestroy(): void {
    this.countryId = null;
    this.countryName = null;
    this.BankParamsId = 0;
    this.countryNameList = [];
    this.cityNameList = [];
    this.accountList = [];
    this.dataSource = [];
  }
  public initForm() {
    this.bankFormData = new DefineBankModel();
  }
  //CountryCombo
  filtering() {
    this.filter = !this.filter;
  }
  countryGetAll() {
    this.service
      .CountryGetAll({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.countryNameList = result;
          this.bankFormData.DescriptionCountry = result.Description;
        },
        (error) => console.log(error)
      );
  }
  //CityComboFill
  cityGetAll = (e) => {
    this.service
      .CityGetAll({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        CountryId: e.value,
      })
      .subscribe(
        (result) => {
          this.cityNameList = result;
        },
        (error) => console.log(error)
      );
  };
  //AccountCombofill
  accountsGetAll() {
    this.service
      .AccountsGetAll({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          result.map((item) => item.AccountTypeId == 15 && this.accountList.push(item));
        },
        (error) => console.log(error)
      );
  }
  BankGetAll() {
    this.service
      .BankGetAll({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.dataSource = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  onToolbarPreparing(event) {
    this.toolbarPreparing(
      event,
      () => this.dataGrid.instance.refresh(),
      () => this.exportGrid(this.dataGrid.instance)
    );
  }
  /////////////////////////////////////////////////////////////////
  /////////////////////edit////////////////////////////////////////
  editPopup(e) {
    this.BankParamsId = e.Id;
    this.service.BankReadById(this.BankParamsId).subscribe(
      (result) => {
        this.formPopup = true;
        this.bankFormData = result;
        this.confirmPopup = false;
      },
      (error) => console.log(error)
    );
  }
  setFocus = () => this.bankForm.instance.getEditor("BranchName").focus();
  addData() {
    this.formPopup = true;
    this.BankParamsId = 0;
    this.initForm();
  }
  cancel() {
    this.formPopup = false;
  }
  Save() {
    if (this.BankParamsId > 0 == false && this.UserRightsObject.canSave == false) {
      this.WarningPopup("You don't have right to Save!");
      return;
    } else if (this.BankParamsId > 0 && this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have right to Update!");
      return;
    }
    this.submit();
  }
  submit() {
    const result: any = this.bankForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      (this.bankFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"))),
        (this.bankFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"))),
        this.BankParamsId > 0 ? this.ActivateLoadPanel("Updating Bank!") : this.ActivateLoadPanel("Saving Bank!");
      this.service.BankSave(this.bankFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.BankParamsId > 0 ? this.SuccessPopup("Bank Updated Successfully!") : this.SuccessPopup("Bank Saved Successfully!");
          this.formPopup = false;
          this.addData();
          this.BankGetAll();
          this.setFocus();
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
    }
  }
  ////////////////////////////////////////////////////////////////////
}
