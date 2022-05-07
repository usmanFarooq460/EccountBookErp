import { Component, OnInit, Input } from '@angular/core';
import { BaseActions } from 'src/app/shared/Base/BaseActions';
import { CommonMethodsForCombos } from 'src/app/shared/Base/common-methods-for-combos';
import { MostUsedMethods,CompanyInfo, CustomerDataType, InvoiceDataType } from 'src/app/shared/Base/mostUsedMethods';
import { GlobalConstant } from 'src/app/Common/global-constant';
@Component({
  selector: 'app-invoice-one',
  templateUrl: './invoice-one.component.html',
  styleUrls: ['./invoice-one.component.scss']
})
export class InvoiceOneComponent extends BaseActions implements OnInit {
  MostUsedMethods: MostUsedMethods
  CompanyData:CompanyInfo;
  CustomerData:CustomerDataType
  @Input() CompanyId: number;
  @Input() InvoiceData: InvoiceDataType;
  constructor(private commonMethods: CommonMethodsForCombos) 
  {
    super()
    this.MostUsedMethods=new MostUsedMethods(commonMethods);
  }
  async ngOnInit() {

    if(GlobalConstant.CompanyInfo.CompanyId>0)
    {
      if(GlobalConstant.CompanyInfo.CompanyId!=this.CompanyId)
      {
        this.CompanyData=await this.MostUsedMethods.FetchCompanyInfo(this.CompanyId>0?this.CompanyId: parseInt(sessionStorage.getItem("CompanyId")));
        GlobalConstant.CompanyInfo=this.CompanyData
     
      }
      else{
        this.CompanyData=GlobalConstant.CompanyInfo;
      
      }
    }
    else{
      this.CompanyData=await this.MostUsedMethods.FetchCompanyInfo(this.CompanyId>0?this.CompanyId: parseInt(sessionStorage.getItem("CompanyId")));
      GlobalConstant.CompanyInfo=this.CompanyData
      
    }
      if(this.InvoiceData.CustomerId!=null && this.InvoiceData.CustomerId!=undefined)
      {

        this.CustomerData=await this.MostUsedMethods.FetchCustomerData(parseInt(sessionStorage.getItem("CompanyId")), this.InvoiceData.CustomerId)
      }
      else{
        this.CustomerData=new CustomerDataType()
        this.CustomerData.CustomerName=this.InvoiceData.SupplierCustomerName
        this.CustomerData.CustomerPhoneNumber=this.InvoiceData.SupplierCustomerPhoneNumber
      }
  }
  async GenerateInvoice()
  {
  }
}
