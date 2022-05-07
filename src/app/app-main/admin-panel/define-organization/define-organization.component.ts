import { Component, OnInit, ViewChild } from "@angular/core";
import { validate } from "src/app/shared/Base/validationHelper";
import { DxFormComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { defineOrganizationModel } from "./define-organization-model";
import { DefineOrganizationService } from "./define-organization.service";
import { DxoGridComponent } from "devextreme-angular/ui/nested";

@Component({
  selector: "app-define-organization",
  templateUrl: "./define-organization.component.html",
  styleUrls: [],
})
export class DefineOrganizationComponent extends BaseActions implements OnInit {
  @ViewChild("defineOrganizationGrid", { static: false })
  defineOrganizationGrid: DxoGridComponent;

  @ViewChild("defineOrganizationForm", { static: false })
  defineOrganizationForm: DxFormComponent;
  defineOrganizationFormData: defineOrganizationModel;

  dataSource = [];
  idForUpdate: number;
  showForm: boolean;
  editMode: boolean;

  constructor(private service: DefineOrganizationService) {
    super();
  }

  async ngOnInit() {
    this.breadCrumb("Admin Panel", "Define Organization");
    this.getAllOrganizations();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.dataSource = [];
    this.idForUpdate = null;
  }
  initForm() {
    this.defineOrganizationFormData = new defineOrganizationModel();
  }

  // update
  getById(data) {
    this.idForUpdate = data.Id;
    this.service.GetByID(this.idForUpdate).subscribe(
      (resp) => {
        this.showForm = true;
        this.editMode = true;
        this.defineOrganizationFormData = resp;
      },
      (error) => {
        this.HandleError(error);
      }
    );
  }
  // update

  showDefineOrganizationForm() {
    this.showForm = !this.showForm;
    this.idForUpdate = null;
    this.initForm();
    this.editMode = false;
  }

  getAllOrganizations() {
    this.ActivateLoadPanel("Loading Data");
    this.service.getAllOrganizations().subscribe(
      (resp) => {
        this.DeActivateLoadPanel();
        this.dataSource = resp;
      },
      (error) => {
        this.DeActivateLoadPanel();
        this.HandleError(error);
      }
    );
  }

  onToolPreparingOfdefineOrganizationGrid = (e) => {
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.getAllOrganizations(),
      () => this.RefreshHistoryGridGrid(this.getAllOrganizations.bind(this), this.HistoryGridSateKey("defineOrganizationGrid"), this.defineOrganizationGrid)
    );
  };

  onSubmit() {
    if (validate(this.defineOrganizationForm)) {
      if (this.idForUpdate > 0) {
        this.defineOrganizationFormData.Id = this.idForUpdate;
      } else {
        this.defineOrganizationFormData.Id = null;
      }
      this.defineOrganizationFormData.OrgLogo = null;
      this.ActivateLoadPanel("Loading");
      this.service.Save(this.defineOrganizationFormData).subscribe(
        (resp) => {
          this.DeActivateLoadPanel();
          if (this.idForUpdate > 0) {
            this.SuccessPopup("Data Has Updated Successfully");
          } else {
            this.SuccessPopup("Data Has Saved Successfully");
          }
          this.getAllOrganizations();
          this.initForm();
          this.editMode = false;
          this.showForm = false;
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
    }
  }
}
