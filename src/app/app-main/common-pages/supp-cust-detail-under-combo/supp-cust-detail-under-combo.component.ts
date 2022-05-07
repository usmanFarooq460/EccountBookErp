import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonPagesService } from "../common-pages.service";
import { CustomerInfoModel } from "../common-pages.model";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "app-supp-cust-detail-under-combo",
  templateUrl: "./supp-cust-detail-under-combo.component.html",
  styleUrls: ["./supp-cust-detail-under-combo.component.scss"],
})
export class SuppCustDetailUnderComboComponent extends BaseActions implements OnInit {
  @Input() ComboValue: number;
  InfoObject: CustomerInfoModel;
  @Input() SupplierCustomerFormType: number;
  //SupplierCustomerFormType==1?Define Supplier Customer Form from Supplier Purchases Module
  //SupplierCustomerFormTyupe==2?Define Supplier Customer Form from Export Defination Module
  CustomerFormPopupVisible: boolean = false;
  CityList = [];
  CountryList = [];
  ProvinceList = [];
  constructor(private service: CommonPagesService, private commonMethods: CommonMethodsForCombos) {
    super();
  }
  async ngOnInit() {
    this.CityList = await this.commonMethods.CityGetByOrganizationAndCompany();
    this.ProvinceList = await this.commonMethods.GetAllProvinces();
    this.CountryList = await this.commonMethods.GetCountry();
  }
  handleCustomerFormPopupVisibility(Id) {
    this.CustomerFormPopupVisible = !this.CustomerFormPopupVisible;
    if (this.CustomerFormPopupVisible == false) {
      this.SetInfoObjectValues(this.InfoObject.Id);
    }
  }
  SetInfoObjectValues(Id) {
    if (Id > 0) {
      this.service.SupplierCustomerGetById(Id).subscribe(
        (result) => {
          this.InfoObject = new CustomerInfoModel();
          this.InfoObject.Id = result.Id;
          this.InfoObject.Address = result.Address1;
          let CityObject = this.CityList.find(({ Id }) => Id == result.CityId);
          if (CityObject != null && CityObject != undefined) {
            this.InfoObject.City = CityObject.CityName;
          }
          let CountryObject = this.CountryList.find(({ Id }) => Id == result.CountryId);
          if (CountryObject != null && CountryObject != undefined) {
            this.InfoObject.Country = CountryObject.Description;
          }
          this.InfoObject.Email = result.Email;
          this.InfoObject.PhoneNumberPersonal = result.MobilePersonal;
          this.InfoObject.PhoneNumberOffice = result.MobileOffice;
          let ProvinceObject = this.ProvinceList.find(({ Id }) => result.StateProvinceId);
          if (ProvinceObject != null && ProvinceObject != undefined) {
            this.InfoObject.Province = ProvinceObject.Description;
          }
          this.InfoObject.PostalCode = result.ZipCode;
        },
        (error) => console.log(error)
      );
    } else {
      this.InfoObject = new CustomerInfoModel();
    }
  }
}
