import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { DefineCityService } from "./define-city.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { DefineCityModel } from "./define-city.model";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "define-city",
  templateUrl: "./define-city.component.html",
  styleUrls: [],
})
export class DefineCityComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("cityForm", { static: false })
  cityForm: DxFormComponent;
  cityFormData: DefineCityModel;
  CityParamsId: number = 0;
  countryNameList;
  dataSource;
  @Input() IsLoadedInPopup: boolean = false;
  @Input() SomeElementsVisible: boolean = true;
  constructor(private service: DefineCityService, private commonMethods: CommonMethodsForCombos) {
    super();
  }
  setFocus = () => this.cityForm.instance.getEditor("CountryId").focus();
  async ngOnInit() {
    this.breadCrumb("Account Defintion", "City");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmCity"));
    this.CityGetAll();
    this.countryGetAll();
    this.initForm();
  }
  ngOnDestroy(): void {
    this.CityParamsId = 0;
    this.countryNameList = [];
    this.dataSource = [];
  }
  public initForm() {
    this.cityFormData = new DefineCityModel();
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
        },
        (error) => console.log(error)
      );
  }
  CityGetAll() {
    this.service
      .CityGetAll({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
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
  editPopup(e) {
    this.formPopup = true;
    this.CityParamsId = e.Id;
    this.service.CityGetById(e.Id).subscribe(
      (result) => {
        this.cityFormData = result;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  addData() {
    this.formPopup = true;
    this.CityParamsId = 0;
    this.cityFormData = new DefineCityModel();
  }
  cancel() {
    this.formPopup = false;
    this.CityParamsId = 0;
    this.cityFormData = new DefineCityModel();
  }
  Save() {
    if (this.CityParamsId > 0 == false && this.UserRightsObject.canSave == false) {
      this.WarningPopup("You don't have right to Save!");
      return;
    } else if (this.CityParamsId > 0 && this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have right to Update!");
      return;
    }
    this.submit();
  }
  submit() {
    const result: any = this.cityForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.cityFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.cityFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.cityFormData.EntryDate = new Date();
      this.cityFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.cityFormData.ModifyDate = new Date();
      this.cityFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.cityFormData.PostDate = new Date();
      this.cityFormData.PostUser = parseInt(sessionStorage.getItem("UserId"));
      this.CityParamsId > 0 ? this.ActivateLoadPanel("Updating City!") : this.ActivateLoadPanel("Saving City!");
      this.service.CitySave(this.cityFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.CityParamsId > 0 ? this.SuccessPopup("City Updated Successfully!") : this.SuccessPopup("City Saved Successfully!");
          this.addData();
          this.CityGetAll();
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
    }
  }
}
