import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { InventoryCommonService} from "../Inventorycommon.service"
@Component({
  selector: 'app-supplier-customer-info-card',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {
  @Input() CompanyId: number;
  @Input() SupplierCustomerId: number
  @Input() FolowupButtonVisible: boolean=false
  @Output() ClosePopup=new EventEmitter()
  @Output() FollowupButtonClick=new EventEmitter();
  constructor(private service:InventoryCommonService) { }

  openCLosePopUp:boolean;
  SupplierCustomerData:any
  ngOnInit(): void {
    this.FetchData();
  }


  async FetchData()
  {
    console.log(this.CompanyId)
    console.log(this.SupplierCustomerId)
    let CustomerData=await this.service.SupplierCustomerInfo({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: this.CompanyId,
      AccountId: this.SupplierCustomerId
    });
    console.log(CustomerData);
    this.SupplierCustomerData=CustomerData[0];
  }
handlePopupClosed()
{
  this.ClosePopup.emit("close")
}
SendAccountIdForFollowup()
{
  this.FollowupButtonClick.emit(this.SupplierCustomerId);
}

}
