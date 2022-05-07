import { Component, OnInit, ViewChild } from "@angular/core";
import { DxFormComponent } from "devextreme-angular";
import { DefineCompanyModel } from "../define-company.model";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { DefineCompanyService } from "../define-company.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { validate } from "src/app/shared/Base/validationHelper";
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-define-comapny-form",
  templateUrl: "./define-comapny-form.component.html",
  styleUrls: ["./define-comapny-form.component.scss"],
})
export class DefineComapnyFormComponent extends BaseActions implements OnInit {
  @ViewChild("DefineComopanyForm", { static: false })
  DefineComopanyForm: DxFormComponent;
  DefineComopanyFormData: DefineCompanyModel;

  //#region DataVariables
  OrganizationInfo = [];
  CountryList = [];
  StatesList = [];
  CurrencyList = [];
  //#endregion
  //#region  ConditionalVariables
  DefineCompanyParamsId: number = 0;
  //#endregion
  constructor(
    private commonBaseService: CommonBaseService,
    private route: ActivatedRoute,
    private router: Router,
    private service: DefineCompanyService,
    private commonMethods: CommonMethodsForCombos
  ) {
    super();
  }

  async ngOnInit() {
    this.DefineCompanyParamsId = this.route.snapshot.queryParams["Id"];

    this.OrganizationInfo[0] = await this.commonBaseService.getOrganizationById(sessionStorage.getItem("OrganizationId"));
    console.log(this.OrganizationInfo);
    this.CountryList = await this.commonMethods.GetCountry();
    this.StatesList = await this.commonMethods.CityGetByOrganizationAndCompany();
    this.CurrencyList = await this.commonMethods.MultiCurrency();
    console.log(this.CurrencyList);
    this.GetRemainingCompaniesCount();
    this.initForm();
  }
  initForm() {
    this.DefineComopanyFormData = new DefineCompanyModel();

    this.DefineComopanyFormData.OrgCompanyTypeId = this.OrganizationInfo[0].Id;
    if (this.DefineCompanyParamsId > 0) {
      this.GetById();
    }
  }

  GetById() {
    this.service.GetByID(this.DefineCompanyParamsId).subscribe(
      (result: any) => {
        this.DefineComopanyFormData = result;
        this.DefineComopanyFormData.CompCountry = result.CompCountry;
        this.DefineComopanyFormData.CompState = result.CompState;
        this.DefineComopanyFormData.CompBaseCurr = result.CompBaseCurr;
        this.GetRemainingCompaniesCount();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  GetRemainingCompaniesCount() {
    this.service.GetRemainingCompaniesCount(sessionStorage.getItem("OrganizationId")).subscribe(
      (result: number) => {
        this.DefineComopanyFormData.RemainingCompanies = result;
        console.log(result);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  Reset() {
    this.DefineCompanyParamsId = 0;
    this.initForm();
  }
  Save() {
    if (validate(this.DefineComopanyForm)) {
      this.DefineComopanyFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.DefineComopanyFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.DefineComopanyFormData.EntryDate = new Date();
      this.DefineComopanyFormData.ModifyDate = new Date();
      this.DefineComopanyFormData.CompType = "Branch";
      if (this.DefineCompanyParamsId > 0 == false) {
        this.ActivateLoadPanel("Saving");
      } else if (this.DefineCompanyParamsId > 0) {
        this.ActivateLoadPanel("Updating");
      }
      this.service.Save(this.DefineComopanyFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          if (this.DefineCompanyParamsId > 9 == false) {
            this.SuccessPopup("Compnay Defined Successfully!");
          } else if (this.DefineCompanyParamsId > 0) {
            this.SuccessPopup("Company Info Updated Successfully!");
          }

          this.router.navigate([], { queryParams: { Id: null } });
          this.Reset();
          console.log(result);
        },
        (error) => {
          this.DeActivateLoadPanel();
          console.log(error);
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
}
