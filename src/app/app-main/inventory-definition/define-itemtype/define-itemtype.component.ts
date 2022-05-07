import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { DefineItemtypeService } from "./define-itemtype.service";
import { DefineItemtype } from "./define-itemtype.model";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { validate } from "src/app/shared/Base/validationHelper";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-define-itemtype",
  templateUrl: "./define-itemtype.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class DefineItemtypeComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  @ViewChild("ItemTypeForm", { static: false })
  ItemTypeForm: DxFormComponent;
  ItemTypeFormData: DefineItemtype;
  ItemTypeParamsId: number = 0;
  dataSource = [];
  typeList = [];

  @Input() IsLoadedInPopup: boolean = false;
  @Input() SomeElementsVisible: boolean = true;

  constructor(private service: DefineItemtypeService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }

  async ngOnInit() {
    this.breadCrumb("Inventory Definations", "Item Type");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmInvDefineItemType"));
    this.GetAllFunc();
    this.typeList = await this.commonMethods.GetByInvLookUpTypeId(6);
    this.initForm();
  }

  ngOnDestroy(): void {
    this.ItemTypeParamsId = 0;
    this.dataSource = [];
    this.typeList = [];
  }

  public initForm() {
    this.ItemTypeFormData = new DefineItemtype();
  }

  GetAllFunc() {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .ItemTypeGetAll({
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
    this.FilterButtonInGridToolbar(e);
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("DefineItemTypeHistoryGridState"), this.dataGrid));
  };

  editPopup(e) {
    this.ItemTypeParamsId = e.Id;
    this.ActivateLoadPanel("Fetching Data!");
    this.service.ItemTypeGetById(this.ItemTypeParamsId).subscribe(
      (result) => {
        this.DeActivateLoadPanel();
        this.formPopup = true;
        this.ItemTypeFormData.TypeCode = result.TypeCode;
        this.ItemTypeFormData.TypeDescription = result.TypeDescription;
        this.ItemTypeFormData.Type = result.Type;
      },
      (error) => {
        this.DeActivateLoadPanel();
        this.HandleError(error);
      }
    );
  }

  addData() {
    this.formPopup = true;
    this.ItemTypeParamsId = 0;
    this.initForm();
  }

  cancel() {
    this.formPopup = false;
    this.ItemTypeParamsId = 0;
    this.initForm();
  }
  setFocus = () => this.ItemTypeForm.instance.getEditor("TypeCode").focus();

  Save() {
    if (this.ItemTypeParamsId > 0 == false && this.UserRightsObject.canSave == false) {
      this.WarningPopup("You don't have right to Save!");
      return;
    } else if (this.ItemTypeParamsId > 0 && this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have right to Update!");
      return;
    }
    this.submit();
  }
  submit() {
    if (validate(this.ItemTypeForm)) {
      this.ItemTypeFormData.EntryDate = new Date();
      this.ItemTypeFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.ItemTypeFormData.ModifyDate = new Date();
      this.ItemTypeFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.ItemTypeFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.ItemTypeFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.ItemTypeParamsId > 0 ? this.ActivateLoadPanel("Updating Item Type") : this.ActivateLoadPanel("Saving Item Type");
      this.service.ItemTypeSave(this.ItemTypeFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.ItemTypeParamsId > 0 ? this.SuccessPopup("Item Type Updated Successfylly!") : this.SuccessPopup("Item Type Saved Successfully!");
          this.GetAllFunc();
          this.cancel();
          this.setFocus();
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
    }
  }
}
