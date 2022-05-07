import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { DeliveryOrderService } from "../delivery-order.service";
import { LoaderFormDataModel } from "../delivery-order.model";
@Component({
  selector: "app-sale-order-loader-for-delivery-order",
  templateUrl: "./sale-order-loader.component.html",
  styleUrls: ["./sale-order-loader.component.scss"],
})
export class SaleOrderLoaderComponent extends BaseActions implements OnInit {
  @ViewChild("LoaderForm", { static: false })
  LoaderForm: DxFormComponent;
  LoaderFormData: LoaderFormDataModel;
  @ViewChild("popupGrid", { static: false })
  popupGrid: DxDataGridComponent;
  @Input() LoaderPopupVisible: boolean = false;
  @Output() ClosePopup = new EventEmitter();
  @Output() SelectedData = new EventEmitter();
  CustomerList = [];
  ItemList = [];
  SaleOrderListForLoader = [];
  constructor(private service: DeliveryOrderService) {
    super();
  }
  ngOnInit(): void {
    this.LoaderFormData = new LoaderFormDataModel();
    this.LoaderFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.LoaderFormData.ToDate = new Date();
    this.LoadSaleOrderForDeliveryOrder();
  }
  closeLoaderPopup(e) {
    this.ClosePopup.emit(1);
  }
  LoadSaleOrderForDeliveryOrder() {
    this.service
      .LoadSaleOrderForDeliveryOrder({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
        DocumentTypeId: 81,
        SupplierCustomerId: this.LoaderFormData.CustomerId,
        ItemId: this.LoaderFormData.ItemId,
        FromDate: this.LoaderFormData.FromDate,
        ToDate: this.LoaderFormData.ToDate,
      })
      .subscribe(
        (result: any) => {
          this.SaleOrderListForLoader = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  LoadFinalDataBySelectedIds(Ids: string) {
    let RecordToBePushed = [];
    this.service
      .LoadSaleOrderForDeliveryOrderInDetail({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
        GdnIds: Ids,
      })
      .subscribe(
        (result: any) => {
          console.log(result);
          for (let i = 0; i < result.length; i++) {
            RecordToBePushed.push({
              ItemId: result[i].ItemId,
              ItemName: result[i].Item,
              JobLotId: result[i].JobLotId,
              PackUomId: result[i].ItemUOMId,
              PackUOM: result[i].ItemUOM,
              SaleOrderId: result[i].OrderId,
              CropYearId: result[i].CropYearId,
              CropYear: result[i].CropYear,
              OrderNo: result[i].OrderNo,
              InvPackingTypeId: result[i].PackingTypeId,
              WarehouseId: result[i].WareHouseId,
              SupplierCustomerId: result[i].SupplierCustomerId,
              SupplierCustomer: result[i].SupplierCustomer,
              DoQty: result[i].QTY,
              DoWeight: result[i].Weight,
              LoadingQty: result[i].LoadQty,
              LoadingWeight: result[i].LoadWeight,
              LoadingRemarks: result[i].Remarks,
              PackingWeight: result[i].PackingWeight,
              GrossWeight: result[i].GrossWeight,
              SaleOrderDetailId: result[i].SaleOrderDetailId,
            });
          }
          this.SelectedData.emit(RecordToBePushed)
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  LoadSelectedData() {
    if (this.popupGrid.instance.getSelectedRowsData().length > 0 == false) {
      this.WarningPopup("No Record is Selected!");
      return;
    }
    let selectedRecord = this.popupGrid.instance.getSelectedRowsData();
    let SelectedIds: string = "";
    for (let i = 0; i < selectedRecord.length; i++) {
      SelectedIds += selectedRecord[i].Id + ",";
    }
    console.log(SelectedIds);
    this.LoadFinalDataBySelectedIds(SelectedIds);
  }
}
