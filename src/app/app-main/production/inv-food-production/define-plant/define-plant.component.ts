import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { definePlantModel } from "./define-plant.model";
import { DefinePlantService } from "./define-plant.service";

@Component({
  selector: "app-define-plant",
  templateUrl: "./define-plant.component.html",
  styleUrls: ["./define-plant.component.scss"],
})
export class DefinePlantComponent extends BaseActions implements OnInit {
  @ViewChild("definePlantForm", { static: false })
  definePlantForm: DxFormComponent;
  definePlantFormData: definePlantModel;
  @ViewChild("definePlantGrid", { static: false })
  definePlantGrid: DxDataGridComponent;

  dataSource = [];
  branchesList = [];
  projectList = [];

  showDefinePantPopup: boolean;
  constructor(private commonMethods: CommonMethodsForCombos, private service: DefinePlantService, private commonService: CommonBaseService) {
    super();
  }

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmDefinePlant"));
    this.branchesList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.getAlldefinedPlant();
    this.initForm();
  }

  initForm() {
    this.definePlantFormData = new definePlantModel();
  }

  editPopup = (e) => {
    if (this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have Right to Update");
      return;
    }
    this.ActivateLoadPanel("Setting Form Fields For Edit");
    this.service.GetById(e.Id).subscribe(
      (resp) => {
        this.DeActivateLoadPanel();
        this.definePlantFormData = resp[0];
        this.showDefinePantPopup = true;
      },
      (error) => {
        this.DeActivateLoadPanel();
        this.HandleError(error);
      }
    );
  };

  getAlldefinedPlant() {
    this.ActivateLoadPanel("Fetching Data!");
    this.service
      .getAll({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (resp) => {
          this.DeActivateLoadPanel();
          this.dataSource = resp;
        },
        (erorr) => {
          this.DeActivateLoadPanel();
          this.HandleError(erorr);
        }
      );
  }

  hanldeFormPopupVisibility() {
    this.showDefinePantPopup = !this.showDefinePantPopup;
    this.initForm();
  }

  onSaveButtonClick() {
    this.UserRightsObject.canSave ? this.onSave() : this.ErrorPopup("You dont have Right to Save");
  }

  onSave() {
    this.definePlantFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
    this.definePlantFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
    this.definePlantFormData.BranchId = this.branchesList[0]?.Id;
    this.definePlantFormData.ProjectId = this.projectList[0]?.Id;
    this.definePlantFormData.Id > 0 ? (this.definePlantFormData.ActionId = 2) : (this.definePlantFormData.ActionId = 1);
    this.definePlantFormData.Id > 0 ? this.ActivateLoadPanel("Updating!") : this.ActivateLoadPanel("Saving!");
    this.service.save(this.definePlantFormData).subscribe(
      (resp) => {
        this.definePlantFormData.Id > 0 ? this.SuccessPopup("Record Updated Successfully!") : this.SuccessPopup("Record Saved Succesffully");
        this.getAlldefinedPlant();
        this.hanldeFormPopupVisibility();
      },
      (error) => {
        this.HandleError(error);
      }
    );
  }

  DummyMethod() {}
  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("definePlantGrid"), this.definePlantGrid));
    this.FilterButtonInGridToolbar(e);
  };
}
