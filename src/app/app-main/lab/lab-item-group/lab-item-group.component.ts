import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { ItemGroupService } from "./lab-item-group.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { DefineItemGroupModel } from "./lab-item-group.model";
import { validate } from "src/app/shared/Base/validationHelper";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-lab-item-group",
  templateUrl: "./lab-item-group.component.html",
  styleUrls: [],
})
export class LabGroupPerameterComponent extends BaseActions implements OnInit {
  @ViewChild("labItemGroupGrid", { static: false })
  labItemGroupGrid: DxDataGridComponent;

  @ViewChild("itemgroupForm", { static: false })
  itemgroupForm: DxFormComponent;
  itemgroupFormData: DefineItemGroupModel;
  editFieldId: number;
  dataSource = [];
  labItemGroupPopupVisible: boolean;
  isUpdate: boolean;

  constructor(private service: ItemGroupService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }
  setFocus = () => this.itemgroupForm.instance.getEditor("AnalysisGroupCode").focus();

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("InvLabAnalysisGroup"));
    this.PerametersGetAll();
    this.initForm();
  }

  initForm() {
    this.itemgroupFormData = new DefineItemGroupModel();
  }

  PerametersGetAll() {
    this.service
      .GetAllNReadById({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.dataSource = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  DummyMethod() {}
  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("labItemGroupGrid"), this.labItemGroupGrid));
    this.FilterButtonInGridToolbar(e);
  };

  /////////////////////edit////////////////////////////////////////
  editPopup(e) {
    if (this.UserRightsObject.canUpdate) {
      this.labItemGroupPopupVisible = true;
      this.itemgroupFormData.AnalysisGroupCode = e.AnalysisGroupCode;
      this.itemgroupFormData.AnalysisGroupDescription = e.AnalysisGroupDescription;
      this.itemgroupFormData.Id = e.Id;
    } else {
      this.ErrorPopup("You don't have Right to Update");
    }
  }

  addData() {
    this.labItemGroupPopupVisible = !this.labItemGroupPopupVisible;
    this.initForm();
  }

  onSaveButtonClicked() {
    if (this.itemgroupFormData.Id > 0) {
      if (this.UserRightsObject.canUpdate) {
        this.submit();
      } else {
        this.ErrorPopup("You dont have right to update");
      }
    } else {
      if (this.UserRightsObject.canSave) {
        this.submit();
      } else {
        this.ErrorPopup("You dont have Right to Save");
      }
    }
  }

  submit() {
    if (validate(this.itemgroupForm)) {
      this.itemgroupFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.itemgroupFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.service.LabGroupSave(this.itemgroupFormData).subscribe(
        (result) => {
          if (this.itemgroupFormData.Id > 0 == false) {
            this.SuccessPopup("Record Saved successfully");
          } else {
            this.SuccessPopup("Record Updated successfully");
          }
          this.addData();
          this.PerametersGetAll();
        },
        (error) => this.HandleError(error)
      );
    }
  }
  ////////////////////////////////////////////////////////////////////
}
