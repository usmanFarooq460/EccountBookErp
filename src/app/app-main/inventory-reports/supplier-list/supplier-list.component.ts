import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { BaseActions } from 'src/app/shared/Base/BaseActions';
import { CommonMethodsForCombos } from 'src/app/shared/Base/common-methods-for-combos';
import { InventoryCommonModel} from "../inventory-common-model"
import { InventoryCommonService} from "../Inventorycommon.service"
import { MostUsedMethods, CompanyInfo } from 'src/app/shared/Base/mostUsedMethods';
@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent extends BaseActions implements OnInit {
  @ViewChild("SupplierListForm", {static: false})
  SupplierListForm: DxFormComponent;
  SupplierListFormData: InventoryCommonModel;
  @ViewChild("SupplierCustomerRegisterHistoryGrid", {static: false})
  SupplierCustomerRegisterHistoryGrid: DxDataGridComponent
  //============================================
  SupplierList=[]
  CountryList=[]
  CityData=[]
  CityList=[]
  DataSource=[]
  MostUsedMethods:MostUsedMethods
CompanyData:CompanyInfo
  constructor(private commonMethods: CommonMethodsForCombos, private service:InventoryCommonService) 
  {
    super();
    this.MostUsedMethods=new MostUsedMethods(commonMethods);
  }
  async ngOnInit() 
  { 
    this.ActivateLoadPanel("Initializing Report!")
    this.SupplierListFormData=new InventoryCommonModel();
    this.CompanyData=await this.MostUsedMethods.FetchCompanyInfo(parseInt(sessionStorage.getItem("CompanyId")))
    this.SupplierList=await this.commonMethods.SupplierCustomerByOrganizationAndCompany();
    this.CountryList=await this.commonMethods.GetCountry();
    this.CityList=await this.commonMethods.CityGetByOrganizationAndCompany();
    this.DeActivateLoadPanel();
    await this.onSubmit()
  }
  onCountryLeaveHandle = (e) => {
    if (e.value > 0) {
      this.CityList = this.CityData.filter(({ CountryId }) => CountryId == e.value);
    } else {
      this.CityList = [];
    }
  };
  async onSubmit()
  {
    this.ActivateLoadPanel("Fetching Report!")
    let data=await this.commonMethods.GetSupplierCustomerInfo(parseInt(sessionStorage.getItem("CompanyId")),this.SupplierListFormData.SupplierCustomerId,this.SupplierListFormData.CountryId,this.SupplierListFormData.CityId);
    this.DataSource=data
    this.DeActivateLoadPanel()
  }
  SupplierCustomerRegister()
  {
      this.ActivateLoadPanel("Loading Report!");
      this.service
        .SupplierCustomerRegister({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: this.CompanyData.CompanyId,
          SupplierCustomerId:this.SupplierListFormData.SupplierCustomerId,
          CountryId: this.SupplierListFormData.CountryId,
          CityId: this.SupplierListFormData.CityId,
          CompanyAddress: this.CompanyData.CompanyAddress,
          CompanyName: this.CompanyData.CompanyName,
          ReportName: "292-InvRptSupplierRegister",
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel(), window.open(result);
          },
          (error) => {
            this.DeActivateLoadPanel(), this.HandleError(error);
          }
        );
  }
  DummyMethod()
  {
  }
  onToolPreparingOfItemHistoryGrid = (e) => {
    this.ReportButtonInGridToolbar(e,"292-SuppleirCustomerRegister",this.SupplierCustomerRegister.bind(this));
    this.FilterButtonInGridToolbar(e)
    this.RefreshButtonInGridToolbar(e,this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("SupplierCustomerRegisterGridState"), this.SupplierCustomerRegisterHistoryGrid))
  }
}
