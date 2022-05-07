import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { DefineItemGroupScheduleService } from "./item-group-schedule.service";
import { DefineItemGroupScheduleModel } from "./item-group-schedule.model";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { validate } from "src/app/shared/Base/validationHelper";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "app-item-group-schedule",
  templateUrl: "./item-group-schedule.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class ItemGroupScheduleComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("ItemGroupScheduleForm", { static: false })
  ItemGroupScheduleForm: DxFormComponent;
  ItemGroupScheduleFormData: DefineItemGroupScheduleModel;
  ItemGroupScheduleParamsId: number = 0;
  itemGroupList = [];
  uomList = [];
  dataSource = [];

  @Input() IsLoadedInPopup: boolean = false;
  @Input() SomeElementsVisible: boolean = true;

  constructor(private service: DefineItemGroupScheduleService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }

  async ngOnInit() {
    this.breadCrumb("Inventory Defination", "Item Group Schedule");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmInvItemGroupSchedule"));
    this.GetAllFunc();
    this.ItemsGroupallFunc();
    this.UomsGetallFunc();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.ItemGroupScheduleParamsId = 0;
    this.itemGroupList = [];
    this.uomList = [];
    this.dataSource = [];
  }

  public initForm() {
    this.ItemGroupScheduleFormData = new DefineItemGroupScheduleModel();
  }

  ItemsGroupallFunc() {
    this.service
      .GetGroup({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.itemGroupList = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  UomsGetallFunc() {
    this.service
      .GetUom({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.uomList = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  GetAllFunc() {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .ItemGroupSchGetAll({
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
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("ItemGroupScheduleHistoryGrid"), this.dataGrid));
    this.FilterButtonInGridToolbar(e);
  };

  /////////////////////////////////////////////////////////////////
  /////////////////////edit////////////////////////////////////////
  editPopup(e) {
    this.ItemGroupScheduleParamsId = e.Id;
    this.ActivateLoadPanel("Fetching Data!");
    this.service.ItemGroupSchGetById(this.ItemGroupScheduleParamsId).subscribe(
      (result) => {
        this.DeActivateLoadPanel();
        this.formPopup = true;

        this.ItemGroupScheduleFormData = result;
      },
      (error) => {
        this.DeActivateLoadPanel();
        this.HandleError(error);
      }
    );
  }

  addData() {
    this.formPopup = true;
    this.ItemGroupScheduleParamsId = 0;
    this.initForm();
  }

  cancel() {
    this.formPopup = false;
    this.ItemGroupScheduleParamsId = 0;
    this.initForm();
  }

  setFocus = () => this.ItemGroupScheduleForm.instance.getEditor("ItemGroupId").focus();
  Save() {
    if (this.ItemGroupScheduleParamsId > 0 == false && this.UserRightsObject.canSave == false) {
      this.WarningPopup("You don't have right to Save!");
      return;
    } else if (this.ItemGroupScheduleParamsId > 0 && this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have right to Update!");
      return;
    }
    this.submit();
  }

  submit() {
    if (validate(this.ItemGroupScheduleForm)) {
      this.ItemGroupScheduleFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.ItemGroupScheduleFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.ItemGroupScheduleParamsId > 0 ? this.ActivateLoadPanel("Updating Record!") : this.ActivateLoadPanel("Saving Record!");
      this.service.ItemGroupSchSave(this.ItemGroupScheduleFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.ItemGroupScheduleParamsId > 0 ? this.SuccessPopup("Item Group Schedule Updated Successfully") : this.SuccessPopup("Item Group Schedule Saved Successfully");
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
