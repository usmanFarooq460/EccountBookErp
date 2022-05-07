import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { DefineItemPricingScheduleService } from "./item-pricing-schedule.service";
import { DefineItemPricingSchedule } from "./item-pricing-schedule.model";
import { BaseActions } from "src/app/shared/Base/BaseActions";
@Component({
  selector: "app-item-pricing-schedule",
  templateUrl: "./item-pricing-schedule.component.html",
  styleUrls: [],
})
export class ItemPricingScheduleComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("ItemPricingScheduleForm", { static: false })
  ItemPricingScheduleForm: DxFormComponent;
  ItemPricingScheduleFormData: DefineItemPricingSchedule;
  editFieldId;
  itemList;
  uomList;
  priceTypeList;

  dataSource = [];
  isUpdate: boolean;
  constructor(private service: DefineItemPricingScheduleService) {
    super();
  }
  ngOnInit(): void {
    this.breadCrumb("InventoryDefinition", "Item Pricing Schedule");
    this.GetAllFunc();
    this.ItemsGetallFunc();
    this.PriceTypeGetAll();
    this.initForm();
  }
  public initForm() {
    this.ItemPricingScheduleFormData = new DefineItemPricingSchedule();
    this.ItemPricingScheduleFormData.EffectedDate = new Date();
  }
  PriceTypeGetAll() {
    this.service
      .ItemPriceTypes({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.priceTypeList = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  ItemsGetallFunc() {
    this.service
      .GetItems({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.itemList = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  GetUomByItemId = (e) => {
    if (e.value) {
      this.UomsGetallFunc(e.value);
    }
  };
  UomsGetallFunc(id) {
    this.service
      .GetUom({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
        ItemId: id,
      })
      .subscribe(
        (result) => {
          this.uomList = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  GetAllFunc() {
    this.service
      .ItemPricingSchGetAll({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          console.log(result);
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
    this.editFieldId = e.Id;
    this.service.ItemPricingSchGetById(this.editFieldId).subscribe(
      (result) => {
        this.formPopup = true;
        this.isUpdate = true;
        this.ItemPricingScheduleFormData = result;
        this.notification("Record Get For Update", "warning");
        this.UomsGetallFunc(result.ItemId);
      },
      (error) => console.log(error)
    );
  }
  addData() {
    this.formPopup = true;
    this.isUpdate = false;
    this.ItemPricingScheduleForm.instance.resetValues();
    this.ItemPricingScheduleFormData.EffectedDate = new Date();
  }

  cancel() {
    this.formPopup = false;
    this.isUpdate = false;
    this.ItemPricingScheduleForm.instance.resetValues();
  }
  setFocus = () => this.ItemPricingScheduleForm.instance.getEditor("EffectedDate").focus();
  submit() {
    const result: any = this.ItemPricingScheduleForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      let id;
      this.isUpdate === true ? (id = this.editFieldId) : (id = null);
      this.ItemPricingScheduleFormData.Id = id;
      this.ItemPricingScheduleFormData.EntryDate = new Date();
      this.ItemPricingScheduleFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.ItemPricingScheduleFormData.ModifyDate = new Date();
      this.ItemPricingScheduleFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.ItemPricingScheduleFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.ItemPricingScheduleFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.service.ItemPricingSchSave(this.ItemPricingScheduleFormData).subscribe(
        (result) => {
          if ((id = null)) {
            this.notification("Record Saved successfully", "success");
          } else {
            this.notification("Record Updated successfully", "success");
          }
          this.editFieldId = 0;
          this.GetAllFunc();
          this.addData();
          this.setFocus();
        },
        (error) => console.log(error)
      );
    }
  }
  ////////////////////////////////////////////////////////////////////
}
