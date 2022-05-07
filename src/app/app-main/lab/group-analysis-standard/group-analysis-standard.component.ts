import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { ItemPerameterService } from "./group-analysis-standard.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { GroupAnalysisStandardModel } from "./group-analysis-standard.model";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { validate } from "src/app/shared/Base/validationHelper";

@Component({
  selector: "app-group-analysis-standard",
  templateUrl: "./group-analysis-standard.component.html",
  styleUrls: [],
})
export class LabGroupAnalysisPerameterComponent extends BaseActions implements OnInit {
  @ViewChild("GroupAnalysisStandardGrid", { static: false })
  GroupAnalysisStandardGrid: DxDataGridComponent;

  @ViewChild("AnalysisStandardForm", { static: false })
  AnalysisStandardForm: DxFormComponent;
  AnalysisStandardFormData: GroupAnalysisStandardModel;
  editFieldId: number;
  dataSource = [];
  itemsList = [];
  groupList = [];
  isUpdate: boolean;
  groupAnalysisStandardVisible: boolean;

  constructor(private service: ItemPerameterService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }
  setFocus = () => this.AnalysisStandardForm.instance.getEditor("InvLabAnalysisGroup").focus();
  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("InvLabGroupAnalysisStandards"));
    this.PerametersGetAll();
    this.GroupGetAll();
    this.ItemsGetAll();
    this.initForm();
  }

  initForm() {
    this.AnalysisStandardFormData = new GroupAnalysisStandardModel();
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

  GroupGetAll() {
    this.service
      .GetGroups({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.groupList = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  ItemsGetAll() {
    this.service
      .GetAllItems({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.itemsList = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  DummyMethod() {}
  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("GroupAnalysisStandardGrid"), this.GroupAnalysisStandardGrid));
    this.FilterButtonInGridToolbar(e);
  };

  editPopup(e) {
    if (this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You dont have Rihgt to Update");
    } else {
      this.groupAnalysisStandardVisible = true;
      this.service
        .GetAllNReadById({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          Id: e.Id,
        })
        .subscribe(
          (result) => {
            this.AnalysisStandardFormData = result[0];
          },
          (error) => {
            this.HandleError(error);
          }
        );
    }
  }

  handlePopUpVisibility() {
    this.groupAnalysisStandardVisible = !this.groupAnalysisStandardVisible;
    this.initForm();
  }

  onSaveButtonClicked() {
    if (this.AnalysisStandardFormData.Id > 0) {
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
    if (validate(this.AnalysisStandardForm)) {
      this.AnalysisStandardFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.AnalysisStandardFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.service.LabAnalysisStandardSave(this.AnalysisStandardFormData).subscribe(
        (result) => {
          if (this.AnalysisStandardFormData.Id > 0 == false) {
            this.SuccessPopup("Record Saved successfully");
          } else {
            this.SuccessPopup("Record Updated successfully");
          }
          this.handlePopUpVisibility();
          this.PerametersGetAll();
        },
        (error) => this.HandleError(error)
      );
    }
  }
}
