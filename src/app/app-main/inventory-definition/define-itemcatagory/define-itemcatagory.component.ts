import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { DefineItemCatagoryService } from "./define-itemcatagory.service";
import { DefineItemCatagory } from "./define-itemcatagory.model";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { validate } from "src/app/shared/Base/validationHelper";
import { timeStamp } from "console";

@Component({
  selector: "app-define-itemcatagory",
  templateUrl: "./define-itemcatagory.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class DefineItemcatagoryComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("ItemCatagoryForm", { static: false })
  ItemCatagoryForm: DxFormComponent;
  ItemCatagoryFormData: any;
  ItemCategoryParamsId: number = 0;

  revenueAccountList: any;
  inventoryAccountList: any;
  cgsAccountList: any;
  dataSource = [];
  @Input() IsLoadedInPopup: boolean = false;
  @Input() SomeElementsVisible: boolean = true;

  constructor(private service: DefineItemCatagoryService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }

  async ngOnInit() {
    this.breadCrumb("InventoryDef", "Item Catagory");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmInvDefineItemCategory"));
    this.GetAllFunc();
    this.RevenueAccountFunc();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.ItemCategoryParamsId = 0;
    this.revenueAccountList = [];
    this.inventoryAccountList = [];
    this.cgsAccountList = [];
    this.dataSource = [];
  }

  public initForm() {
    this.ItemCatagoryFormData = new DefineItemCatagory();
  }

  async RevenueAccountFunc() {
    this.inventoryAccountList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetAccountsIncludingAccountTypeIds("4,10"));
    this.revenueAccountList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetAccountsIncludingAccountTypeIds("10,4"));
    this.cgsAccountList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetAccountsIncludingAccountTypeIds("11,12"));
  }

  GetAllFunc() {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .ItemCatagoryGetAll({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result: any) => {
          this.DeActivateLoadPanel();
          this.dataSource = result;
          this.NoOfRecordsInGrid = this.dataSource.length;
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }
  setFocus = () => this.ItemCatagoryForm.instance.getEditor("CategoryDescription").focus();

  DummyMethod() {}

  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("DefineItemCategoryHistoryGridState"), this.dataGrid));
    this.FilterButtonInGridToolbar(e);
  };

  /////////////////////edit////////////////////////////////////////
  editPopup(e) {
    if (e.Id) {
      this.ItemCategoryParamsId = e.Id;
      this.service.ItemCatagoryGetById(e.Id).subscribe(
        (result) => {
          this.formPopup = true;
          this.ItemCatagoryFormData.CategoryCode = result.CategoryCode;
          this.ItemCatagoryFormData.CategoryDescription = result.CategoryDescription;
          this.ItemCatagoryFormData.SerialFrom = result.SerialFrom;
          this.ItemCatagoryFormData.SerialTo = result.SerialTo;
          this.ItemCatagoryFormData.RevenueAccountId = result.RevenueAccountId;
          this.ItemCatagoryFormData.CGSAccountId = result.CGSAccountId;
          this.ItemCatagoryFormData.InventoryAccountId = result.InventoryAccountId;
        },
        (error) => this.HandleError(error)
      );
    } else {
      this.ErrorPopup("Record Id Not Found");
    }
  }

  addData() {
    this.formPopup = true;
    this.ItemCategoryParamsId = 0;
    this.initForm();
    this.SetDefaults();
  }

  cancel() {
    this.formPopup = false;
    this.ItemCategoryParamsId = 0;
  }

  SetDefaults() {
    this.ItemCatagoryFormData.RevenueAccountId = this.revenueAccountList._store._array[0].Id;
    this.ItemCatagoryFormData.CGSAccountId = this.cgsAccountList._store._array[0].Id;
    this.ItemCatagoryFormData.InventoryAccountId = this.inventoryAccountList._store._array[0].Id;
  }
  Save() {
    if (this.ItemCategoryParamsId > 0 == false && this.UserRightsObject.canSave == false) {
      this.WarningPopup("You don't have right to Save!");
      return;
    } else if (this.ItemCategoryParamsId > 0 == false && this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have right to Update!");
      return;
    }
    this.onSave();
  }

  onSave() {
    if (validate(this.ItemCatagoryForm)) {
      this.ItemCategoryParamsId > 0 ? this.ActivateLoadPanel("Updating Item Category!") : this.ActivateLoadPanel("Saving Item Category!");
      this.service
        .ItemCatagorySave({
          Id: this.ItemCategoryParamsId,
          CategoryCode: this.ItemCatagoryFormData.CategoryDescription,
          CategoryDescription: this.ItemCatagoryFormData.CategoryDescription,
          SerialFrom: this.ItemCatagoryFormData.SerialFrom,
          SerialTo: this.ItemCatagoryFormData.SerialTo,
          RevenueAccountId: this.ItemCatagoryFormData.RevenueAccountId,
          CGSAccountId: this.ItemCatagoryFormData.CGSAccountId,
          InventoryAccountId: this.ItemCatagoryFormData.InventoryAccountId,
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          EntryDate: new Date(),
          EntryUser: sessionStorage.getItem("UserId"),
          ModifyDate: new Date(),
          ModifyUser: sessionStorage.getItem("UserId"),
          CategoryStatus: true,
          PostDate: new Date(),
          PostUser: sessionStorage.getItem("UserId"),
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            this.ItemCategoryParamsId > 0 ? this.SuccessPopup("Item Category Updated Successfully!") : this.SuccessPopup("Record Saved Successfully!");

            this.GetAllFunc();
            this.addData();
            this.setFocus();
            this.cancel();
          },
          (error) => {
            this.DeActivateLoadPanel();
            this.HandleError(error);
          }
        );
    }
  }
  ////////////////////////////////////////////////////////////////////
}
