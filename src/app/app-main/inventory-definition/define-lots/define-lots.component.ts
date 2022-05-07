import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { DefineLotsService } from "./define-lots.service";
import { DefineLots } from "./define-lots.model";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { validate } from "src/app/shared/Base/validationHelper";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "app-define-lots",
  templateUrl: "./define-lots.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class DefineLotsComponent extends BaseActions implements OnInit {
  @ViewChild("defineLotsGrid", { static: false })
  defineLotsGrid: DxDataGridComponent;
  @ViewChild("JobLotForm", { static: false })
  JobLotForm: DxFormComponent;
  JobLotFormData: DefineLots;
  JobLotParamsId: number = 0;
  dataSource = [];
  JobStatusList = [{ name: "Complete" }, { name: "InComplete" }, { name: "Cancel" }];
  @Input() IsLoadedInPopup: boolean = false;
  @Input() SomeElementsVisible: boolean = true;
  constructor(private service: DefineLotsService, private commonService: CommonBaseService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }
  async ngOnInit() {
    this.breadCrumb("InventoryDefinition", "Define Job/Lot");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("frmInvJob_Lot"));
    this.GetAllFunc();
    this.initForm();
  }
  ngOnDestroy(): void {
    this.JobLotParamsId = 0;
    this.dataSource = [];
  }
  public initForm() {
    this.JobLotFormData = new DefineLots();
  }
  GetAllFunc() {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .JobLotGetAll({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.dataSource = result;
          console.log("checking data Source:", this.dataSource);
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }
  DummyMethod() {}
  onToolbarPreparing = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("defineLotsGrid"), this.defineLotsGrid));
    this.FilterButtonInGridToolbar(e);
  };
  setFocus = () => this.JobLotForm.instance.getEditor("JobLotCode").focus();
  /////////////////////////////////////////////////////////////////
  /////////////////////edit////////////////////////////////////////
  editPopup(e) {
    this.JobLotParamsId = e.Id;
    this.service.JobLotGetById(this.JobLotParamsId).subscribe(
      (result) => {
        this.formPopup = true;
        this.JobLotFormData = result;
      },
      (error) => this.HandleError(error)
    );
  }
  addData() {
    this.formPopup = true;
    this.JobLotParamsId = 0;
    this.initForm();
  }
  cancel() {
    this.formPopup = false;
    this.JobLotParamsId = 0;
    this.initForm();
  }
  onSave() {
    if (this.JobLotParamsId > 0 == false && this.UserRightsObject.canSave == false) {
      this.WarningPopup("You don't have right to Save!");
      return;
    } else if (this.JobLotParamsId > 0 && this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have right to Update!");
      return;
    }
    this.submit();
  }
  submit() {
    if (validate(this.JobLotForm)) {
      this.JobLotFormData.EntryDate = new Date();
      this.JobLotFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.JobLotFormData.ModifyDate = new Date();
      this.JobLotFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.JobLotFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.JobLotFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.JobLotParamsId > 0 ? this.ActivateLoadPanel("Updating Record!") : this.ActivateLoadPanel("Saving Record!");
      this.service.JobLotSave(this.JobLotFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.JobLotParamsId > 0 ? this.SuccessPopup("Job/Lot Updated Successfully!") : this.SuccessPopup("Job/Lot Saved Successfully");
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
