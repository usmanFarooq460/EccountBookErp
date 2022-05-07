import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { DefineItemUomScheduleService } from "./define-itemuomschedule.service";
import { DefineItemuomSchedule } from "./define-itemuomschedule.model";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { validate } from "src/app/shared/Base/validationHelper";
@Component({
  selector: "app-define-itemuomschedule",
  templateUrl: "./define-itemuomschedule.component.html",
  styleUrls: [],
})
export class DefineItemuomscheduleComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("ItemUomScheduleForm", { static: false })
  ItemUomScheduleForm: DxFormComponent;
  ItemUomScheduleFormData: any;
  ItemUomScheduleParamsId: number = 0;
  itemList: any;
  uomList;
  dataSource;
  // @Input() ItemUomScheduleComponentVisible: boolean = true;
  @Input() IsLoadedInPopup: boolean = false;
  @Input() SomeElementsVisible: boolean = true;
  //////////////////////////////////////////////////////////////////////
  constructor(private service: DefineItemUomScheduleService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }
  async ngOnInit() {
    this.breadCrumb("Inventory Definations", "Item Uom Schedule");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmInvItemUomSchedule"));
    this.GetAllFunc();
    this.itemList = await this.commonMethods.GenerateItemDataSourceForComboBind();
    this.UomsGetallFunc();
    this.initForm();
  }
  ngOnDestroy(): void {
    this.ItemUomScheduleParamsId = 0;
    this.itemList = [];
    this.uomList = [];
    this.dataSource = [];
  }
  public initForm() {
    this.ItemUomScheduleFormData = new DefineItemuomSchedule();
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
      .ItemUomSchGetAll({
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
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("DefineItemUomScheduleHistoryGridState"), this.dataGrid));
    this.FilterButtonInGridToolbar(e);
  };
  /////////////////////////////////////////////////////////////////
  /////////////////////edit////////////////////////////////////////
  editPopup(e) {
    this.ItemUomScheduleParamsId = e.Id;
    this.ActivateLoadPanel("Fetching Data!");
    this.service.ItemUomSchGetById(this.ItemUomScheduleParamsId).subscribe(
      (result) => {
        this.DeActivateLoadPanel();
        this.formPopup = true;
        this.ItemUomScheduleFormData.Equivalent = result.Equivalent;
        this.ItemUomScheduleFormData.ScheduleUnitId = result.ScheduleUnitId;
        this.ItemUomScheduleFormData.ItemId = result.ItemId;
      },
      (error) => {
        this.DeActivateLoadPanel();
        this.HandleError(error);
      }
    );
  }
  addData() {
    this.formPopup = true;
    this.ItemUomScheduleParamsId = 0;
    this.initForm();
  }
  cancel() {
    this.formPopup = false;
    this.ItemUomScheduleParamsId = 0;
    this.initForm();
  }
  setFocus = () => this.ItemUomScheduleForm.instance.getEditor("ItemId").focus();
  Save() {
    if (this.ItemUomScheduleParamsId > 0 == false && this.UserRightsObject.canSave == false) {
      this.WarningPopup("You don't have right to Save!");
      return;
    } else if (this.ItemUomScheduleParamsId > 0 && this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have right to Update!");
      return;
    }
    this.submit();
  }
  submit() {
    if (validate(this.ItemUomScheduleForm)) {
      this.ItemUomScheduleParamsId > 0 ? this.ActivateLoadPanel("Updating Record!") : this.ActivateLoadPanel("Saving Record");
      this.service
        .ItemUomSchSave({
          Id: this.ItemUomScheduleParamsId,
          Equivalent: this.ItemUomScheduleFormData.Equivalent,
          ScheduleUnitId: this.ItemUomScheduleFormData.ScheduleUnitId,
          ItemId: this.ItemUomScheduleFormData.ItemId,
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
            this.ItemUomScheduleParamsId > 0 ? this.SuccessPopup("Item Uom Schedule Updated Successfylly!") : this.SuccessPopup("Item Uom Schedule Saved Successfully!");
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
