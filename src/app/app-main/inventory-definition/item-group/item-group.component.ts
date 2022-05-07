import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { DefineItemGroupService } from "./item-group.service";
import { DefineItemGroup } from "./item-group.model";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { validate } from "src/app/shared/Base/validationHelper";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-item-group",
  templateUrl: "./item-group.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class ItemGroupComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("itemGroupForm", { static: false })
  itemGroupForm: DxFormComponent;
  itemGroupFormData: any;
  ItemGroupParamsId: number = 0;
  dataSource = [];

  ////////////////////////////////////////////////////

  @Input() IsLoadedInPopup: boolean = false;
  @Input() SomeElementsVisible: boolean = true;
  ////////////////////////////////////////////////////
  constructor(private service: DefineItemGroupService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }

  async ngOnInit() {
    this.breadCrumb("InventoryDefinition", "Define Item UOM");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmInvItemGroup"));
    this.GetAllFunc();
    this.initForm();
  }
  ngOnDestroy(): void {
    this.ItemGroupParamsId = 0;
    this.dataSource = [];
  }

  public initForm() {
    this.itemGroupFormData = new DefineItemGroup();
  }

  GetAllFunc() {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .ItemGroupGetAll({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
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
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("DefineItemGroupHistoryGridState"), this.dataGrid));
    this.FilterButtonInGridToolbar(e);
  };

  editPopup(e) {
    this.ItemGroupParamsId = e.GroupId;
    this.service.ItemGroupGetById(this.ItemGroupParamsId).subscribe(
      (result) => {
        this.formPopup = true;

        this.itemGroupFormData.ItemGroupName = result.ItemGroupName;
      },
      (error) => this.HandleError(error)
    );
  }
  setFocus = () => this.itemGroupForm.instance.getEditor("ItemGroupName").focus();

  addData() {
    this.formPopup = true;
    this.ItemGroupParamsId = 0;
    this.initForm();
  }

  cancel() {
    this.formPopup = false;
    this.ItemGroupParamsId = 0;
    this.initForm();
  }

  Save() {
    if (this.ItemGroupParamsId > 0 == false && this.UserRightsObject.canSave == false) {
      this.WarningPopup("You don't have right to Save!");
      return;
    } else if (this.ItemGroupParamsId > 0 && this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have right to Update!");
      return;
    }
    this.submit();
  }
  submit() {
    if (validate(this.itemGroupForm)) {
      this.ItemGroupParamsId > 0 ? this.ActivateLoadPanel("Updating Item Group!") : this.ActivateLoadPanel("Saving Item Group!");

      this.service
        .ItemGroupSave({
          GroupId: this.ItemGroupParamsId,
          ItemGroupName: this.itemGroupFormData.ItemGroupName,
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            this.ItemGroupParamsId > 0 ? this.SuccessPopup("Item Group Updated Successfully!") : this.SuccessPopup("Item Group Saved Successfully!");
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
