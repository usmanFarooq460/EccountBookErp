import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { ItemPerameterService } from "./sample-log-register.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { SampleLogRegisterModel } from "./sample-log-register.model";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { validate } from "src/app/shared/Base/validationHelper";
@Component({
  selector: "app-sample-log-register",
  templateUrl: "./sample-log-register.component.html",
  styleUrls: [],
})
export class SampleLogRegisterComponent extends BaseActions implements OnInit {
  @ViewChild("sampleLogRegisterGrid", { static: false })
  sampleLogRegisterGrid: DxDataGridComponent;
  @ViewChild("sampleLogRegisterForm", { static: false })
  sampleLogRegisterForm: DxFormComponent;
  sampleLogRegisterFormData: SampleLogRegisterModel;

  cropYearlist = [];
  jobLotList = [];
  projectList = [];
  branchesList = [];
  dataSource = [];
  supplierList: any;
  ItemsList: any;
  CityList = [];

  SampleLogFormRegisterVisible: boolean;

  constructor(private commonService: CommonBaseService, private service: ItemPerameterService, private commonMethods: CommonMethodsForCombos) {
    super();
    this.filter = true;
  }

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("InvLabSampleLogRegister"));
    this.getSpecificNumberOfRecords();
    await this.FetchData();
    await this.initForm();
  }
  async initForm() {
    this.sampleLogRegisterFormData = new SampleLogRegisterModel();
    this.sampleLogRegisterFormData.SampleDate = new Date();
    if (this.sampleLogRegisterFormData.Id > 0 === false) {
      this.sampleLogRegisterFormData.SampleNo = await this.GenerateCode();
    }
  }

  async FetchData() {
    this.supplierList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.SupplierCustomerByOrganizationAndCompany().catch((err) => this.HandleError(err)));
    this.CityList = await this.commonMethods.CityGetByOrganizationAndCompany().catch((err) => this.HandleError(err));
    this.ItemsList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.ItemsGetAll().catch((err) => this.HandleError(err)));
    this.cropYearlist = await this.commonMethods.CropYear().catch((err) => this.HandleError(err));
    this.jobLotList = await this.commonMethods.getJobLot().catch((err) => this.HandleError(err));
    this.projectList = await this.commonService.getProject().catch((err) => this.HandleError(err));
    this.branchesList = await this.commonService.getBranch().catch((err) => this.HandleError(err));
  }

  async GenerateCode() {
    return await this.service
      .GenerateCode({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .catch((err) => this.HandleError(err));
  }

  //#region History
  getSpecificNumberOfRecords() {
    this.GetAll(21);
  }

  getAllRecords() {
    this.UserRightsObject.CanView_AllRecord ? this.GetAll(null) : this.ErrorPopup("You don't have Right to View All Records!");
  }

  GetAll(noOfRecords) {
    this.ActivateLoadPanel("Fetching Data!");
    this.service
      .GetAll({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        NoOfRecords: noOfRecords,
        CanViewAllRecord: this.UserRightsObject.CanView_AllRecord,
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

  onToolbarPreparing = (e) => {
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.getAllRecords(),
      () => this.RefreshHistoryGridGrid(this.getSpecificNumberOfRecords.bind(this), this.HistoryGridSateKey("sampleLogRegisterGrid"), this.sampleLogRegisterGrid)
    );
  };

  //#endregion

  //#region Form
  addData() {
    this.SampleLogFormRegisterVisible = !this.SampleLogFormRegisterVisible;
    this.initForm();
  }

  editPopup(e) {
    this.SampleLogFormRegisterVisible = true;
    this.service.GetById(e.Id).subscribe(
      (result) => {
        this.sampleLogRegisterFormData = result[0];
      },
      (error) => {
        this.HandleError(error);
      }
    );
  }

  onSubmitButtonClick() {
    if (this.sampleLogRegisterFormData.Id > 0) {
      this.UserRightsObject.canUpdate ? this.submit() : this.ErrorPopup("You don't have Right to Update!");
    } else {
      this.UserRightsObject.canSave ? this.submit() : this.ErrorPopup("You Don't have Right to Save!");
    }
  }

  submit() {
    if (validate(this.sampleLogRegisterForm)) {
      this.sampleLogRegisterFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.sampleLogRegisterFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.sampleLogRegisterFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.sampleLogRegisterFormData.ModifyUser = parseInt(sessionStorage.getItem("ModifyUser"));
      this.sampleLogRegisterFormData.EntryDate = new Date();
      this.sampleLogRegisterFormData.ModifyDate = new Date();
      this.sampleLogRegisterFormData.BranchId = this.branchesList[0].Id;
      this.sampleLogRegisterFormData.ProjectId = this.projectList[0].Id;
      this.sampleLogRegisterFormData.InvLabSampleAnalysisId = null;
      this.sampleLogRegisterFormData.StockPartyId = null;
      this.sampleLogRegisterFormData.LotDesc = this.sampleLogRegisterForm.instance.getEditor("JobLotId").option("text");
      this.sampleLogRegisterFormData.LotDesc = this.sampleLogRegisterForm.instance.getEditor("JobLotId").option("text");
      this.sampleLogRegisterFormData.DocumentTypeId = 301;
      this.sampleLogRegisterFormData.dmsAttachment = [];
      this.sampleLogRegisterFormData.SampleCookingPic = "";
      this.sampleLogRegisterFormData.SamplePic = "";

      console.log("Sample Log register: ", this.sampleLogRegisterFormData);

      this.sampleLogRegisterFormData.Id > 0 ? this.ActivateLoadPanel("Updating!") : this.ActivateLoadPanel("Saving");
      this.service.LabAnalysisStandardSave(this.sampleLogRegisterFormData).subscribe(
        (resp) => {
          this.sampleLogRegisterFormData.Id > 0 ? this.SuccessPopup("Record Updated Successfully!") : this.SuccessPopup("Record Saved Successfully!");
          this.addData();
          this.sampleLogRegisterForm.instance.getEditor("SupplierCustomerId").focus();
          this.getSpecificNumberOfRecords();
        },
        (error) => this.HandleError(error)
      );
    }
  }
  //#endregion
}
