import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { ItemPerameterService } from "./lab-item-perameter.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { DefineItemPerameterModel } from "./lab-item-perameter.model";
import { validate } from "src/app/shared/Base/validationHelper";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-lab-item-perameter",
  templateUrl: "./lab-item-perameter.component.html",
  styleUrls: [],
})
export class LabItemPerameterComponent extends BaseActions implements OnInit {
  @ViewChild("labItemParamenterGrid", { static: false })
  labItemParamenterGrid: DxDataGridComponent;

  @ViewChild("perameterForm", { static: false })
  perameterForm: DxFormComponent;
  perameterFormData: DefineItemPerameterModel;
  dataSource = [];
  labItemParameterPopupVisible: boolean;

  constructor(private service: ItemPerameterService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }

  setFocus = () => this.perameterForm.instance.getEditor("AnalysisParameterCode").focus();

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("InvLabAnalysisItems"));
    this.PerametersGetAll();
    this.initForm();
  }

  initForm() {
    this.perameterFormData = new DefineItemPerameterModel();
  }

  PerametersGetAll() {
    this.ActivateLoadPanel("Loading Data!");
    this.service
      .GetAllNReadById({
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
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("labItemParamenterGrid"), this.labItemParamenterGrid));
    this.FilterButtonInGridToolbar(e);
  };

  /////////////////////edit////////////////////////////////////////
  editPopup(e) {
    if (this.UserRightsObject.canUpdate) {
      this.labItemParameterPopupVisible = true;
      this.perameterFormData.AnalysisParameterDescription = e.AnalysisParameterDescription;
      this.perameterFormData.AnalysisParameterCode = e.AnalysisParameterCode;
      this.perameterFormData.Id = e.Id;
    } else {
      this.ErrorPopup("You don't have Right to Update");
    }
  }

  handlePopupVisibilty() {
    this.labItemParameterPopupVisible = !this.labItemParameterPopupVisible;
    this.initForm();
  }

  onSaveButtonClicked() {
    if (this.perameterFormData.Id > 0) {
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
    if (validate(this.perameterForm)) {
      this.perameterFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.perameterFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.perameterFormData.Id > 0 ? this.ActivateLoadPanel("Updating!") : this.ActivateLoadPanel("Saving");
      this.service.LabPerameterSave(this.perameterFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          if (this.perameterFormData.Id > 0 == false) {
            this.SuccessPopup("Record Saved successfully");
          } else {
            this.SuccessPopup("Record Updated successfully");
          }
          this.handlePopupVisibilty();
          this.PerametersGetAll();
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
