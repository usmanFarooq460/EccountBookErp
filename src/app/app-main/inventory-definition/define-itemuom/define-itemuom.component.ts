import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { DefineItemUomService } from "./define-itemuom.service";
import { DefineItemuom } from "./define-itemuom.model";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { validate } from "src/app/shared/Base/validationHelper";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-define-itemuom",
  templateUrl: "./define-itemuom.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class DefineItemuomComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  @ViewChild("ItemUomForm", { static: false })
  ItemUomForm: DxFormComponent;
  ItemUomFormData: any;
  ItemUomParamsId: number = 0;
  dataSource = [];

  @Input() IsLoadedInPopup: boolean = false;
  @Input() SomeElementsVisible: boolean = true;

  constructor(private service: DefineItemUomService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }

  async ngOnInit() {
    this.breadCrumb("InventoryDefinition", "Define Uom");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmInvItemUom"));
    this.GetAllFunc();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.ItemUomParamsId = 0;
    this.dataSource = [];
  }

  public initForm() {
    this.ItemUomFormData = new DefineItemuom();
  }

  GetAllFunc() {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .ItemUomGetAll({
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
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("DefineItemUomHistoryGridState"), this.dataGrid));
    this.FilterButtonInGridToolbar(e);
  };

  editPopup(e) {
    this.ItemUomParamsId = e.Id;
    this.service.ItemUomGetById(this.ItemUomParamsId).subscribe(
      (result) => {
        this.formPopup = true;

        this.ItemUomFormData.UOMCode = result.UOMCode;
        this.ItemUomFormData.UOMDescription = result.UOMDescription;
        this.ItemUomFormData.UOMSymbol = result.UOMSymbol;
        this.ItemUomFormData.UOMStatus = result.UOMStatus;
      },
      (error) => this.HandleError(error)
    );
  }
  setFocus = () => this.ItemUomForm.instance.getEditor("UOMCode").focus();

  addData() {
    this.formPopup = true;
    this.ItemUomParamsId = 0;
    this.initForm();
  }

  cancel() {
    this.formPopup = false;
    this.ItemUomParamsId = 0;
    this.initForm();
  }
  Save() {
    if (this.ItemUomParamsId > 0 == false && this.UserRightsObject.canSave == false) {
      this.WarningPopup("You don't have right to Save!");
      return;
    } else if (this.ItemUomParamsId > 0 && this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have right to Update");
      return;
    }
    this.submit();
  }
  submit() {
    if (validate(this.ItemUomForm)) {
      this.ItemUomParamsId > 0 ? this.ActivateLoadPanel("Updating Item Uom!") : this.ActivateLoadPanel("Saving Item Uom!");
      this.service
        .ItemUomSave({
          Id: this.ItemUomParamsId,
          UOMCode: this.ItemUomFormData.UOMCode,
          UOMDescription: this.ItemUomFormData.UOMDescription,
          UOMSymbol: this.ItemUomFormData.UOMSymbol,
          UOMStatus: this.ItemUomFormData.UOMStatus,
          CompanyId: sessionStorage.getItem("CompanyId"),
          EntryDate: new Date(),
          EntryUser: sessionStorage.getItem("UserId"),
          ModifyDate: new Date(),
          ModifyUser: sessionStorage.getItem("UserId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            this.ItemUomParamsId > 0 ? this.SuccessPopup("Item Uom Updated Successfully!") : this.SuccessPopup("Item Uom Saved Successfully!");

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
