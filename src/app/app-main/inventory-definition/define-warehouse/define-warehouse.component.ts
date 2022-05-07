import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { DefineWarehouseService } from "./define-warehouse.service";
import { Definewarehouse } from "./define-warehouse.model";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { validate } from "src/app/shared/Base/validationHelper";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "app-define-warehouse",
  templateUrl: "./define-warehouse.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class DefineWarehouseComponent extends BaseActions implements OnInit {
  @ViewChild("DefineWarehouseGrid", { static: false })
  DefineWarehouseGrid: DxDataGridComponent;
  @ViewChild("warehouseForm", { static: false })
  warehouseForm: DxFormComponent;
  warehouseFormData: Definewarehouse;
  WarehouseParamsId: number = 0;
  dataSource = [];
  @Input() IsLoadedInPopup: boolean = false;
  @Input() SomeElementsVisible: boolean = true;
  constructor(private service: DefineWarehouseService, private commonService: CommonBaseService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }
  async ngOnInit() {
    this.breadCrumb("InventoryDefinition", "Define Uom");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmInvWarehouse"));
    this.GetAllFunc();
    this.initForm();
  }
  ngOnDestroy(): void {
    this.WarehouseParamsId = 0;
    this.dataSource = [];
  }
  public initForm() {
    this.warehouseFormData = new Definewarehouse();
  }
  GetAllFunc() {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .WarehouseGetAll({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.dataSource = result;
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }
  DummyMethod() {}
  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("DefineWarehouseGrid"), this.DefineWarehouseGrid));
    this.FilterButtonInGridToolbar(e);
  };
  /////////////////////////////////////////////////////////////////
  /////////////////////edit////////////////////////////////////////
  editPopup(e) {
    this.WarehouseParamsId = e.Id;
    this.ActivateLoadPanel("Fetching Data!");
    this.service.WarehouseGetById(this.WarehouseParamsId).subscribe(
      (result) => {
        this.DeActivateLoadPanel();
        this.formPopup = true;
        this.warehouseFormData = result;
      },
      (error) => {
        this.DeActivateLoadPanel();
        this.HandleError(error);
      }
    );
  }
  setFocus = () => this.warehouseForm.instance.getEditor("WareHouseCode").focus();
  addData() {
    this.formPopup = true;
    this.WarehouseParamsId = 0;
    this.initForm();
  }
  cancel() {
    this.formPopup = false;
    this.WarehouseParamsId = 0;
    this.initForm();
  }
  onSave() {
    if (this.WarehouseParamsId > 0 == false && this.UserRightsObject.canSave == false) {
      this.WarningPopup("You don't have right to Save!");
      return;
    } else if (this.WarehouseParamsId > 0 && this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have right to Update!");
      return;
    }
    this.submit();
  }
  submit() {
    if (validate(this.warehouseForm)) {
      this.warehouseFormData.Id = this.WarehouseParamsId;
      this.warehouseFormData.EntryDate = new Date();
      this.warehouseFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.warehouseFormData.ModifyDate = new Date();
      this.warehouseFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.warehouseFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.warehouseFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.WarehouseParamsId > 0 ? this.ActivateLoadPanel("Updating Warehouse!") : this.ActivateLoadPanel("Saving Warehouse");
      this.service.WarehouseSave(this.warehouseFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.WarehouseParamsId > 0 ? this.SuccessPopup("Warehouse Updated Successfully!") : this.SuccessPopup("Warehouse Saved Successfylly!");
          this.GetAllFunc();
          this.cancel();
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
    }
  }
}
