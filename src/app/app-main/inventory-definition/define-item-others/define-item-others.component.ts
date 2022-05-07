import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { DefineItemOthersService } from "./define-item-others.service";
import { DefineItemOthersModel } from "./define-item-others.model";
import { BaseActions } from "../../../../../src/app/shared/Base/BaseActions";
import { CommonBaseService } from "../../../../../src/app/shared/Base/common-base.service";
import { validate } from "src/app/shared/Base/validationHelper";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "app-define-item-others",
  templateUrl: "./define-item-others.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class DefineItemOthersComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("ItemOthersForm", { static: false })
  ItemOthersForm: DxFormComponent;
  ItemOthersFormData: DefineItemOthersModel;
  DefineOtherItemParamsId: number = 0;
  StockGLAcList: any;
  SaleGLAcList: any;
  CogsGLAcList: any;
  dataSource = [];
  @Input() IsLoadedInPopup: boolean = false;
  @Input() SomeElementsVisible: boolean = true;
  constructor(private service: DefineItemOthersService, private commonService: CommonBaseService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }
  async ngOnInit() {
    this.breadCrumb("Inventory Defination", "Item Others");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmInvDefineOtherItems"));
    this.GetAllFunc();
    this.CGSAccountFunc();
    this.initForm();
  }
  ngOnDestroy(): void {
    this.DefineOtherItemParamsId = 0;
    this.StockGLAcList = [];
    this.SaleGLAcList = [];
    this.CogsGLAcList = [];
    this.dataSource = [];
  }
  public initForm() {
    this.ItemOthersFormData = new DefineItemOthersModel();
  }
  async CGSAccountFunc() {
    let data = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetAccountsExcludingAccountTypeIds("2,15,3,11,12,22"));
    this.StockGLAcList = data;
    this.SaleGLAcList = data;
    this.CogsGLAcList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetAccountsIncludingAccountTypeIds("11,12"));
  }
  GetAllFunc() {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .ItemOthersGetAll({
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
          this.ErrorPopup(error);
        }
      );
  }
  setFocus = () => this.ItemOthersForm.instance.getEditor("OtherItemName").focus();
  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("DefineItemOthersHistoryGridState"), this.dataGrid));
    this.FilterButtonInGridToolbar(e);
  };
  DummyMethod() {}
  /////////////////////edit////////////////////////////////////////
  editPopup(e) {
    this.DefineOtherItemParamsId = e.Id;
    this.service.ItemOthersGetById(this.DefineOtherItemParamsId).subscribe(
      (result) => {
        this.formPopup = true;
        this.ItemOthersFormData = result;
      },
      (error) => this.HandleError(error)
    );
  }
  addData() {
    this.formPopup = true;
    this.DefineOtherItemParamsId = 0;
    this.initForm();
  }
  cancel() {
    this.formPopup = false;
    this.DefineOtherItemParamsId = 0;
    this.initForm();
  }
  onSave() {
    if (this.DefineOtherItemParamsId > 0 == false && this.UserRightsObject.canSave == false) {
      this.WarningPopup("You don't have right to Save!");
      return;
    } else if (this.DefineOtherItemParamsId > 0 && this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have right to Update!");
      return;
    }
    this.submit();
  }
  submit() {
    if (validate(this.ItemOthersForm)) {
      this.ItemOthersFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.ItemOthersFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.DefineOtherItemParamsId > 0 ? this.ActivateLoadPanel("Updating Other Item") : this.ActivateLoadPanel("Saving Other Item");
      this.service.ItemOthersSave(this.ItemOthersFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.DefineOtherItemParamsId > 0 ? this.SuccessPopup("Other Item Updated Successfully!") : this.SuccessPopup("Other Item Saved Successfylly!");
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
  ////////////////////////////////////////////////////////////////////
}
