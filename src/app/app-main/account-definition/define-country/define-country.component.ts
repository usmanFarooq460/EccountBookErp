import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { DefineCountryService } from "./define-country.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { DefineCountry } from "./define-country.model";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "define-country",
  templateUrl: "./define-country.component.html",
  styleUrls: [],
})
export class DefineCountryComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("countryForm", { static: false })
  countryForm: DxFormComponent;
  countryFormData: any;
  CountryParamsId: number = 0;
  countryNameList;
  dataSource = [];
  @Input() IsLoadedInPopup: boolean = false;
  @Input() SomeElementsVisible: boolean = true;
  constructor(private service: DefineCountryService, private commonMethods: CommonMethodsForCombos) {
    super();
  }
  async ngOnInit() {
    this.breadCrumb("Account Defintion", "Country");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmCountry"));
    this.countryGetAll();
    this.initForm();
  }
  ngOnDestroy(): void {
    this.CountryParamsId = 0;
    this.countryNameList = [];
    this.dataSource = [];
  }
  public initForm() {
    // this.countryFormData = new DefineCity();
    this.countryFormData = {
      countryName: "",
      countryCode: "",
    };
  }
  setFocus = () => this.countryForm.instance.getEditor("countryCode").focus();
  countryGetAll() {
    this.service
      .CountryGetAll({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.countryNameList = result;
          this.dataSource = result;
        },
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
  /////////////////////////////////////////////////////////////////
  /////////////////////edit////////////////////////////////////////
  editPopup(e) {
    this.formPopup = true;
    this.countryFormData.countryCode = e.Code;
    this.countryFormData.countryName = e.Description;
    this.CountryParamsId = e.Id;
  }
  addData() {
    this.formPopup = true;
    this.CountryParamsId = 0;
    this.initForm();
  }
  cancel() {
    this.CountryParamsId = 0;
    this.formPopup = false;
  }
  Save() {
    if (this.CountryParamsId > 0 == false && this.UserRightsObject.canSave == false) {
      this.WarningPopup("You don't have right to Save!");
      return;
    } else if (this.CountryParamsId > 0 && this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have right to Update!");
      return;
    }
    this.submit();
  }
  submit() {
    const result: any = this.countryForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.CountryParamsId > 0 ? this.ActivateLoadPanel("Updating Country!") : this.ActivateLoadPanel("Saving Country!");
      this.service
        .CountrySave({
          Id: this.CountryParamsId,
          Code: this.countryFormData.countryCode,
          Description: this.countryFormData.countryName,
          CompanyId: sessionStorage.getItem("CompanyId"),
          EntryDate: new Date(),
          EntryUser: sessionStorage.getItem("UserId"),
          ModifyDate: new Date(),
          ModifyUser: sessionStorage.getItem("UserId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          PostDate: new Date(),
          PostUser: sessionStorage.getItem("UserId"),
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            this.CountryParamsId > 0 ? this.SuccessPopup("Country Updated Successfully!") : this.SuccessPopup("Country Saved Successfully!");
            this.countryGetAll();
            this.formPopup = false;
          },
          (error) => {
            this.DeActivateLoadPanel();
            this.HandleError(error);
          }
        );
    }
  }
}
