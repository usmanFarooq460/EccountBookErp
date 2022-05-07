// Pending tasks
/* Rights Implementation 
    Save issues
  */

import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { validate } from "src/app/shared/Base/validationHelper";
import { invFoodProductionPackingTypeModel } from "./inv-food-production-packing-type.model";
import { InvFoodProductionPackingTypeService } from "./inv-food-production-packing-type.service";

@Component({
  selector: "inv-food-production-packing-type",
  templateUrl: "./inv-food-production-packing-type.component.html",
  styleUrls: [],
})
export class InvFoodProductionPackingTypeComponent extends BaseActions implements OnInit {
  @ViewChild("packingTypeForm", { static: false })
  packingTypeForm: DxFormComponent;
  packingTypeFormData: invFoodProductionPackingTypeModel;
  @ViewChild("packingTypeProductionGrid", { static: false })
  packingTypeProductionGrid: DxDataGridComponent;

  jobOrderList = [];
  dataSource = [];
  itemsList: any;
  newItemsList: any;
  UOMListByItemId = [];
  constructor(private service: InvFoodProductionPackingTypeService, private commonMethods: CommonMethodsForCombos) {
    super();
  }

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("FoodProductionWithValues"));
    await this.FetchData();
    this.getHistoryOfPackingType();
    this.initForm();
  }

  async FetchData() {
    this.ActivateLoadPanel("Fetching Data For Form Fields");
    this.itemsList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetItemsByItemTypeIds("14"));
    this.jobOrderList = await this.getAllProductionJobOrder();
    this.DeActivateLoadPanel();
  }

  async initForm() {
    this.packingTypeFormData = new invFoodProductionPackingTypeModel();
    this.packingTypeFormData.DocDate = new Date();
    if (this.packingTypeFormData.Id > 0 == false) {
      this.packingTypeFormData.DocNo = await this.GetSerialNumberForInvFoodProdcution();
    }
    this.packingTypeForm.instance.getEditor("InvProductionJobOrderId").focus();
  }

  editForm = (e) => {
    if (this.UserRightsObject.canUpdate == false) {
      this.ErrorPopup("You dont have Right to Update");
      return;
    }
    this.ActivateLoadPanel("Getting data For Update");
    this.service.GetByID(e.Id).subscribe(
      (resp: invFoodProductionPackingTypeModel) => {
        this.DeActivateLoadPanel();
        this.packingTypeFormData = resp;
      },
      (err) => {
        this.DeActivateLoadPanel();
        this.HandleError(err);
      }
    );
  };

  async GetSerialNumberForInvFoodProdcution() {
    return await this.service.GenerateCode({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
    });
  }

  async getAllProductionJobOrder() {
    return await this.service.GetJobOrderNoForInvFoodProduction({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      DocumentTypeId: 403,
    });
  }

  onItemValueChange = async (e) => {
    this.UOMListByItemId = await this.commonMethods.getUOM(e.value);
  };

  calculationsInDetailForm = (e) => {
    let qty = this.packingTypeFormData.Qty > 0 ? this.packingTypeFormData.Qty : 0;
    let rate = this.packingTypeFormData.Rate > 0 ? this.packingTypeFormData.Rate : 0;
    if (qty > 0 && rate > 0) {
      this.packingTypeFormData.Amount = qty * rate;
    }
  };

  resetForm() {
    this.initForm();
  }

  onSAveButtonClicked() {
    this.UserRightsObject.canSave ? this.onSave() : this.ErrorPopup("You dont have Right to Save");
  }

  getHistoryOfPackingType() {
    this.ActivateLoadPanel("Fetching data!");
    this.service
      .FormHistoryOfPackingType({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (resp) => {
          this.DeActivateLoadPanel();
          this.dataSource = resp;
        },
        (err) => {
          this.DeActivateLoadPanel();
          this.HandleError(err);
        }
      );
  }

  onSave() {
    if (validate(this.packingTypeForm)) {
      this.packingTypeFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.packingTypeFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.packingTypeFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.packingTypeFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.packingTypeFormData.EntryDate = new Date();
      this.packingTypeFormData.ModifyDate = new Date();
      this.packingTypeFormData.UOMDescription = this.packingTypeForm.instance.getEditor("itemUomSchId").option("text");
      this.packingTypeFormData.DocumentTypeId = 111;
      this.packingTypeFormData.Id > 0 ? this.ActivateLoadPanel("Updating") : this.ActivateLoadPanel("Saving!");
      this.service.Save(this.packingTypeFormData).subscribe(
        (resp) => {
          this.DeActivateLoadPanel();
          this.packingTypeFormData.Id > 0 ? this.SuccessPopup("Record Updated Successfully!") : this.SuccessPopup("Record Saved Successfully!");
          this.getHistoryOfPackingType();
          this.resetForm();
        },
        (err) => {
          this.DeActivateLoadPanel();
          this.HandleError(err);
        }
      );
    }
  }

  DummyMethod() {}
  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("packingTypeProductionGrid"), this.packingTypeProductionGrid));
    this.FilterButtonInGridToolbar(e);
  };
}
