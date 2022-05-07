import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { DefineItemTaxScheduleService } from "./define-itemtaxschedule.service";
import { DefineItemtaxSchedule } from "./define-itemtaxschedule.model";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { ThrowStmt } from "@angular/compiler";
@Component({
  selector: "app-define-itemtaxschedule",
  templateUrl: "./define-itemtaxschedule.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class DefineItemtaxscheduleComponent extends BaseActions implements OnInit {
  @ViewChild("itemTaxScheduleGrid", { static: false })
  itemTaxScheduleGrid: DxDataGridComponent;
  @ViewChild("ItemtaxScheduleForm", { static: false })
  ItemtaxScheduleForm: DxFormComponent;
  ItemtaxScheduleFormData: DefineItemtaxSchedule;
  editFieldId;
  itemList: any;
  taxtypeList = [];
  dataSource = [];
  isUpdate: boolean;

  @Input() IsLoadedInPopup: boolean = false;
  @Input() SomeElementsVisible: boolean = true;

  constructor(private service: DefineItemTaxScheduleService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }

  async ngOnInit() {
    this.breadCrumb("InventoryDefinition", "Item Tax Schedule");
    this.GetAllFunc();
    this.itemList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.ItemsGetAll());
    this.TexesTypeGetallFunc();
    this.initForm();
  }

  public initForm() {
    this.ItemtaxScheduleFormData = new DefineItemtaxSchedule();
  }

  setFocus = () => {
    this.ItemtaxScheduleForm.instance.getEditor("ItemId").focus();
  };

  TexesTypeGetallFunc() {
    this.service
      .GetTaxesType({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.taxtypeList = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  GetAllFunc() {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .ItemTaxSchGetAll({
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
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("DefineItemTexScheduleGrid"), this.itemTaxScheduleGrid));
    this.FilterButtonInGridToolbar(e);
  };

  /////////////////////////////////////////////////////////////////
  /////////////////////edit////////////////////////////////////////
  editPopup(e) {
    this.editFieldId = e.Id;
    this.service.ItemTaxSchGetById(this.editFieldId).subscribe(
      (result) => {
        this.formPopup = true;
        this.isUpdate = true;

        this.ItemtaxScheduleFormData = result;
      },
      (error) => this.HandleError(error)
    );
  }
  addData() {
    this.formPopup = true;
    this.isUpdate = false;
    this.initForm();
  }
  cancel() {
    this.formPopup = false;
    this.isUpdate = false;
    this.initForm();
  }
  submit() {
    const result: any = this.ItemtaxScheduleForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      let id;
      this.isUpdate === true ? (id = this.editFieldId) : (id = null);
      this.ItemtaxScheduleFormData.Id = id;

      this.ItemtaxScheduleFormData.EntryDate = new Date();
      this.ItemtaxScheduleFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.ItemtaxScheduleFormData.ModifyDate = new Date();
      this.ItemtaxScheduleFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.ItemtaxScheduleFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.ItemtaxScheduleFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.service.ItemTaxSchSave(this.ItemtaxScheduleFormData).subscribe(
        (result) => {
          if ((id = null)) {
            this.SuccessPopup("Record Saved successfully");
          } else {
            this.SuccessPopup("Record Updated successfully");
          }
          this.cancel();
          this.GetAllFunc();
        },
        (error) => this.HandleError(error)
      );
    }
  }
  ////////////////////////////////////////////////////////////////////
}
