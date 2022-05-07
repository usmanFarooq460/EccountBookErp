import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxFormComponent } from "devextreme-angular";
import { validate } from "src/app/shared/Base/validationHelper";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { performaInvoiceService } from "../sample-analysis.service";
import { SampleAnalysisModel, ProformaInvoiceDetailModel } from "../sample-analysis.model";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { BaseActions } from "src/app/shared/Base/BaseActions";
@Component({
  selector: "app-sample-analysis-form",
  templateUrl: "./sample-analysis-form.component.html",
  styleUrls: [],
})
export class SampleAnalysisFormComponent extends BaseActions implements OnInit {
  @ViewChild("SampleAnalysisForm", { static: false })
  SampleAnalysisForm: DxFormComponent;
  SampleAnalysisFormData: SampleAnalysisModel;
  @ViewChild("SampleAnalysisDetailForm", { static: false })
  SampleAnalysisDetailForm: DxFormComponent;
  SampleAnalysisDetailData: ProformaInvoiceDetailModel;
  sampleLogList = [];
  supCustList: any;
  ItemList: any;
  jobLotList = [];
  cropYearList = [];
  purchaseOrderList = [];
  analysisGroupList: [];
  dataSource = [];
  SampleAnalysisParamsId: number;
  branchesList = [];
  projectsList = [];

  constructor(private commonMethods: CommonMethodsForCombos, private commonService: CommonBaseService, private service: performaInvoiceService, private route: ActivatedRoute, private router: Router) {
    super();
  }
  async ngOnInit() {
    this.SampleAnalysisParamsId = this.route.snapshot.queryParams["Id"];
    this.FetchData();
    this.initForm();
  }

  async FetchData() {
    this.ActivateLoadPanel("Fetching Data For Form Fields");
    this.branchesList = await this.commonService.getBranch().catch((err) => {
      this.HandleError(err);
    });
    this.projectsList = await this.commonService.getProject().catch((err) => {
      this.HandleError(err);
    });
    this.supCustList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.SupplierCustomerByOrganizationAndCompany());
    this.ItemList = await this.commonMethods.GenerateDataSourceFromList(
      await this.commonMethods.ItemsGetAll().catch((error) => {
        this.HandleError(error);
      })
    );
    this.SampleLogRegisterAll();
    this.jobLotList = await this.commonMethods.getJobLot().catch((error) => this.HandleError(error));
    this.analysisGroupList = await this.GroupGetAll().catch((err) => this.HandleError(err));
    this.cropYearList = await this.commonMethods.CropYear().catch((err) => this.HandleError(err));
    this.DeActivateLoadPanel();
  }

  async initForm() {
    this.SampleAnalysisFormData = new SampleAnalysisModel();
    this.SampleAnalysisDetailData = new ProformaInvoiceDetailModel();
    this.SampleAnalysisFormData.DocDate = new Date();
    if (this.SampleAnalysisParamsId > 0 == false) {
      this.SampleAnalysisFormData.DocNo = await this.GenerateCode();
    } else {
      this.setFields4editMode();
    }
  }

  setFields4editMode() {
    if (this.SampleAnalysisParamsId > 0) {
      this.service.sampleAnalysisGetById(this.SampleAnalysisParamsId).subscribe(
        (result) => {
          this.SampleAnalysisFormData = result;
          this.dataSource = result.LabSampleDetail;
        },
        (error) => this.HandleError(error)
      );
    } else {
      this.SampleAnalysisParamsId = null;
    }
  }

  async GenerateCode() {
    return await this.service
      .GenerateCode({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .catch((error) => {
        this.HandleError(error);
      });
  }

  SampleLogRegisterAll() {
    this.service
      .GetAllSampleLogs({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (resp) => {
          this.sampleLogList = resp;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  async GroupGetAll() {
    return await this.service
      .GetAllGroups({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .catch((error) => {
        this.HandleError(error);
      });
  }

  onSampleLogChange = (e) => {
    if (e.value > 0 && e.value != undefined && e.value != null)
      this.service.getDataOnSampleLogLeave(e.value).subscribe(
        (resp) => {
          if (resp?.length > 0) {
            this.SampleAnalysisFormData.SupplierCustomerId = resp[0]?.SupplierCustomerId;
            this.SampleAnalysisFormData.ItemId = resp[0]?.ItemId;
            this.SampleAnalysisFormData.JobLotId = resp[0]?.JobLotId;
            this.SampleAnalysisFormData.Crop = resp[0]?.Crop;
            this.SampleAnalysisFormData.CommissionAgentId = resp[0]?.ReferencePartyId;
          }
        },
        (Err) => this.HandleError(Err)
      );
  };

  getPurchaseOrderNoByItemAndSupplierLeave = (e) => {
    if (this.SampleAnalysisFormData.SupplierCustomerId > 0 && this.SampleAnalysisFormData.ItemId > 0) {
      this.service
        .GetForComboPurchaseOrderBySupplierandItemId({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          ItemId: this.SampleAnalysisFormData.ItemId,
          SupplierCustomerId: this.SampleAnalysisFormData.SupplierCustomerId,
        })
        .subscribe(
          (resp) => {
            this.purchaseOrderList = resp;
          },
          (error) => {
            this.HandleError(error);
          }
        );
    }
  };

  GetByGroupId = (e) => {
    if (e.value) {
      this.service
        .GroupsLeave({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          Id: e.value,
        })
        .subscribe(
          (resp) => {
            if (resp?.length > 0) {
              if (this.SampleAnalysisParamsId > 0 == false) {
                this.dataSource = [];
                resp?.map((item) => {
                  this.dataSource.push({
                    Id: null,
                    InvLabAnalysisItemsId: item.InvLabAnalysisItems,
                    InvLabSampleAnalysisHeaderId: item.labgroupstandardId,
                    ResultValue: 0,
                    InvLabAnalysisItems: item.InvLabAnalysisItems,
                    AnalysisGroupDescription: item.AnalysisGroupDescription,
                    AnalysisParameterDescription: item.AnalysisParameterDescription,
                    MinValue: item.MinValue,
                    MaxValue: item.MaxValue,
                  });
                });
              }
            }
          },
          (error) => {
            this.HandleError(error);
          }
        );
    }
  };

  onResultValueChange = (newData, value, currentRowData) => {
    if (value >= currentRowData.MinValue && value <= currentRowData.MaxValue) {
      newData.ResultValue = value;
    } else {
      this.WarningPopup("Result value Should be between min Value and Max Value");
    }
  };

  resetForm() {
    this.SampleAnalysisParamsId = null;
    this.router.navigate([], { queryParams: { Id: null } });
    this.dataSource = [];
    this.initForm();
  }

  handleSave() {
    if (validate(this.SampleAnalysisForm)) {
      if (this.dataSource.length > 0 == false) {
        this.WarningPopup("Pleae Add Detail Record! Select Analysis Group to proceed");
      } else {
        this.SampleAnalysisFormData.IsApproved = false;
        this.SampleAnalysisFormData.ApprovedDate = new Date();
        this.SampleAnalysisFormData.ApprovedUserId = parseInt(sessionStorage.getItem("UserId"));
        this.SampleAnalysisFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
        this.SampleAnalysisFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
        this.SampleAnalysisFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
        this.SampleAnalysisFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
        this.SampleAnalysisFormData.BranchesId = this.branchesList[0].Id;
        this.SampleAnalysisFormData.ProjectsId = this.projectsList[0].Id;
        this.SampleAnalysisFormData.ModifyDate = new Date();
        this.SampleAnalysisFormData.DocumentTypeId = 302;
        this.SampleAnalysisFormData.AnalysisPic = "";
        this.SampleAnalysisFormData.CookingPic = "";
        this.SampleAnalysisFormData.Attachments = "";
        this.SampleAnalysisFormData.dmsAttachment = [];
        this.SampleAnalysisFormData.EntryDate = new Date();
        this.SampleAnalysisFormData.ItemName = this.SampleAnalysisForm.instance.getEditor("ItemId").option("text");
        this.SampleAnalysisFormData.AnalysisGroupDescription = this.SampleAnalysisForm.instance.getEditor("InvLabAnalysisGroupId").option("text");
        this.SampleAnalysisFormData.LabSampleDetail = this.dataSource;
        this.service.sampleAnalysisSave(this.SampleAnalysisFormData).subscribe(
          (resp) => {
            this.SampleAnalysisParamsId > 0 ? this.SuccessPopup("Record updated successfully") : this.SuccessPopup("Record saved successfully!");
            this.resetForm();
          },
          (error) => {
            this.HandleError(error);
          }
        );
      }
    }
  }
}
