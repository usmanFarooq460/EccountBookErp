import { Component, OnInit, ViewChild } from "@angular/core";
import { DxFormComponent } from "devextreme-angular";
import { FoodProduction, FoodProductionDetail } from "../food-production.model";

@Component({
  selector: "app-food-production-form",
  templateUrl: "./food-production-form.component.html",
  styles: [],
})
export class FoodProductionFormComponent implements OnInit {
  @ViewChild("foodProductionForm", { static: false })
  foodProductionForm: DxFormComponent;
  foodProductionData: FoodProduction;

  @ViewChild("foodProductionDetailForm", { static: false })
  foodProductionDetailForm: DxFormComponent;
  foodProductionDetailData: FoodProductionDetail;

  inputDataSource = new Array<FoodProductionDetail>();
  outputDataSource = new Array<FoodProductionDetail>();

  columns = [
    { dataField: "Id", caption: "Id", dataType: "", visible: false },
    {
      dataField: "InvFoodProductionId",
      caption: "Production Header Id",
      dataType: "",
      visible: false,
    },
    {
      dataField: "InvProductionJobOrderId",
      caption: "Job Order Id",
      dataType: "",
      visible: false,
    },
    {
      dataField: "InvProductionJobOrderNo",
      caption: "Job Order #",
      dataType: "",
      visible: false,
    },
    {
      dataField: "RefDocNoId",
      caption: "Ref Invoice #",
      dataType: "",
      visible: true,
    },
    {
      dataField: "EntryType",
      caption: "Entry Type",
      dataType: "",
      visible: true,
    },
    {
      dataField: "WarehouseId",
      caption: "Warehouse",
      dataType: "",
      visible: true,
    },
    { dataField: "ItemId", caption: "Item", dataType: "", visible: true },
    { dataField: "ItemUomId", caption: "UOM", dataType: "", visible: true },
    { dataField: "CropBatch", caption: "Crop", dataType: "", visible: true },
    {
      dataField: "JobLotId",
      caption: "Job / Lot",
      dataType: "",
      visible: true,
    },
    {
      dataField: "PackingtypeId",
      caption: "Packing Type",
      dataType: "",
      visible: true,
    },
    { dataField: "Qty", caption: "Qty", dataType: "", visible: true },
    { dataField: "PackUnit", caption: "", dataType: "", visible: false },
    { dataField: "Weight", caption: "Weight", dataType: "", visible: true },
    { dataField: "Rate", caption: "Rate", dataType: "", visible: true },
    {
      dataField: "RateUOMId",
      caption: "Rate/UOM",
      dataType: "",
      visible: true,
    },
    { dataField: "Amount", caption: "Amount", dataType: "", visible: true },
    { dataField: "Remarks", caption: "Remarks", dataType: "", visible: true },
    { dataField: "VoucherHeadId", caption: "0", dataType: "", visible: false },
  ];

  constructor() {}

  ngOnInit(): void {}

  initForm() {
    this.foodProductionData = new FoodProduction();
    this.foodProductionDetailData = new FoodProductionDetail();
  }
}
