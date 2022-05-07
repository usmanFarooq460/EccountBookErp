import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { validate } from "src/app/shared/Base/validationHelper";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { PurcahseAnalysisService } from "../purchase-analysis.service";
import { purchaseAnalysisModel, purchaseInvoiceDetailModel } from "../purchase-analysis.model";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "app-purchase-analysis-form",
  templateUrl: "./purchase-analysis-form.component.html",
  styleUrls: [],
})
export class PurchaseAnalysisFormComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("PurchaseAnalysisForm", { static: false })
  PurchaseAnalysisForm: DxFormComponent;
  PurchaseAnalysisFormData: purchaseAnalysisModel;
  @ViewChild("PurcahseAnalysisDetailForm", { static: false })
  PurcahseAnalysisDetailForm: DxFormComponent;
  PurcahseAnalysisDetailData: purchaseInvoiceDetailModel;
  sampleLogList = [];
  gatePassList = [];
  ItemList = [];
  jobLotList = [];
  analysisGroupList: [];
  dataSource = [];
  OrderNoList = [];
  updateRowIndex: number;
  detailEditMode: boolean;
  updateDataGrid: boolean;
  SampleAnalysisParamsId: number;
  cropYearList = [];
  sampleAnalysisNo = [];
  DetailRecordFoundOnSampleNoLeave = false;
  branchesList = [];
  projectList = [];
  statusList = [
    { Id: true, label: "Accepted" },
    { Id: false, label: "Rejected" },
  ];

  constructor(
    private commonService: CommonBaseService,
    private service: PurcahseAnalysisService,
    private route: ActivatedRoute,
    private router: Router,
    private commonMethods: CommonMethodsForCombos
  ) {
    super();
  }
  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("InvLabPurchaseAnalysis"));
    this.SampleAnalysisParamsId = this.route.snapshot.queryParams["Id"];
    await this.FetchData();
    this.initForm();
  }

  async FetchData() {
    this.branchesList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.cropYearList = await this.commonMethods.CropYear().catch((err) => this.HandleError(err));
    this.jobLotList = await this.commonMethods.getJobLot().catch((err) => this.HandleError(err));
    this.analysisGroupList = await this.GroupGetAll();
    this.GetAllGatePassNo();
  }

  initForm() {
    this.PurchaseAnalysisFormData = new purchaseAnalysisModel();
    this.PurcahseAnalysisDetailData = new purchaseInvoiceDetailModel();
    this.PurchaseAnalysisFormData.DocDate = new Date();
    if (this.SampleAnalysisParamsId > 0 == false) {
      this.GenerateCode();
    } else {
      this.setFields4editMode();
    }
  }

  setFields4editMode() {
    if (this.SampleAnalysisParamsId) {
      this.service.purchaseAnalysisGetById(this.SampleAnalysisParamsId).subscribe(
        (result) => {
          console.log("Edit Data", result);
          this.PurchaseAnalysisFormData = result[0];
          this.PurchaseAnalysisFormData.IsAccepted = result[0].IsAccepted;
          this.PurchaseAnalysisFormData.ItemId = result[0].ItemId;
          this.PurchaseAnalysisFormData.InvLabAnalysisGroup = result[0].InvLabAnalysisGroup;
          this.gatePassList.push({
            GpSrNo: result[0].GpSrNo,
            Id: result[0].GatePassInwardId,
          });
          this.PurchaseAnalysisFormData.GatePassInwardId = result[0].GatePassInwardId;
          let DetailList = [];
          for (let i = 0; i < result.length; i++) {
            DetailList.push({
              ResultValue: result[i].ResultValue,
              InAnalysisResult: result[i].InAnalysisResult,
              InvLabGroupAnalysisStandardsId: result[i].InvLabGroupAnalysisStandardsId,
              RemarksDetail: result[i].RemarksDetail,
              AnalysisParameterDescription: result[i].AnalysisParameterDescription,
              MinValue: result[i].MinValue,
              MaxValue: result[i].MaxValue,
            });
          }
          this.dataSource = DetailList;
        },
        (error) => this.HandleError(error)
      );
    } else {
      this.SampleAnalysisParamsId = null;
    }
  }

  async GroupGetAll() {
    return await this.service
      .GetAllGroups({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .catch((err) => this.HandleError(err));
  }

  async GetAllGatePassNo() {
    this.service
      .GetGpSrNoForPurchaseAnalysis({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (resp) => {
          this.gatePassList = resp;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  GenerateCode() {
    this.service
      .GenerateCode({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.PurchaseAnalysisFormData.DocNo = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  validateStatus = (e) => {
    if (e.value == null || e.value == undefined) return false;
    else return true;
  };

  GetByGpNoLeave = (e) => {
    if (e.value > 0) {
      this.service
        .getDataOnGatePassLeave({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          GatePassInwardId: e.value,
        })
        .subscribe(
          (resp) => {
            if (resp?.length > 0) {
              this.PurchaseAnalysisFormData.BiltyNo = resp[0]?.BiltyNo;
              this.PurchaseAnalysisFormData.Crop = resp[0]?.Crop;
              this.PurchaseAnalysisFormData.VehicleNo = resp[0]?.VehicleNo;
              this.OrderNoList = [];
              this.OrderNoList.push({
                OrderNo: resp[0]?.OrderItemId,
                PurchaseOrderId: resp[0]?.PurchaseOrderId,
              });
              this.PurchaseAnalysisFormData.PurchaseOrderId = this.OrderNoList[0].PurchaseOrderId;
              this.ItemList = [];
              this.ItemList.push({
                OrderItemId: resp[0]?.OrderItemId,
                ItemName: resp[0]?.ItemName,
              });
              this.PurchaseAnalysisFormData.ItemId = this.ItemList[0].OrderItemId;
            }
          },
          (error) => {
            this.HandleError(error);
          }
        );
    }
  };

  onOrderNoLeave = (e) => {
    if (e.value) {
      this.GetSampleAnalysisDetailByPo(e.value);
      this.GetPurchaseAnalysisDetailByPo(e.value);
    }
  };

  GetSampleAnalysisDetailByPo(OrderId) {
    this.service
      .GetSampleAnalysisDetailByPo({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        PurchaseOrderId: OrderId,
      })
      .subscribe(
        (resp) => {
          if (resp?.length > 0) {
            this.PurchaseAnalysisFormData.InvLabAnalysisGroup = resp[0].InvLabAnalysisGroupId;
            this.PurchaseAnalysisFormData.Crop = resp[0].Crop;
            this.sampleAnalysisNo = [];
            this.sampleAnalysisNo.push({
              Id: resp[0]?.Id,
              DocNo: resp[0]?.DocNo,
            });
            this.PurchaseAnalysisFormData.LabSampleNo = this.sampleAnalysisNo[0].Id;
          } else {
            this.sampleAnalysisNo = [];
            this.PurchaseAnalysisFormData.LabSampleNo = null;
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  GetPurchaseAnalysisDetailByPo(OrderId) {
    this.service
      .GetPurchaseAnalysisDetailByPo({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        PurchaseOrderId: OrderId,
      })
      .subscribe(
        (resp) => {
          if (resp?.length > 0) {
            this.PurchaseAnalysisFormData.InvLabAnalysisGroup = resp[0].InvLabAnalysisGroup;
            this.PurchaseAnalysisFormData.Crop = resp[0].Crop;
            this.PurchaseAnalysisFormData.ItemId = resp[0].ItemId;
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  onSampleAnalysisLeave = (e) => {
    this.DetailRecordFoundOnSampleNoLeave = false;
    if (e.value > 0) {
      if (this.SampleAnalysisParamsId > 0 == false) {
        this.DetailRecordFoundOnSampleNoLeave = true;
        this.service
          .getDetailBySampleAnalysisNumber({
            OrganizationId: sessionStorage.getItem("OrganizationId"),
            CompanyId: sessionStorage.getItem("CompanyId"),
            DocNo: e.value,
          })
          .subscribe(
            (resp) => {
              if (resp?.length > 0) {
                this.dataSource = [];
                resp.map((item) => {
                  this.dataSource.push({
                    Id: null,
                    ResultValue: item.ResultValue,
                    InvLabAnalysisPurchaseHeaderId: item.Id,
                    InvLabGroupAnalysisStandardsId: item.labgroupstandardId,
                    RemarksDetail: "",
                    AnalysisParameterDescription: item.AnalysisParameterDescription,
                    MinValue: item.MinValue,
                    MaxValue: item.MaxValue,
                  });
                });
              } else {
                this.dataSource = [];
              }
            },
            (error) => {
              this.DetailRecordFoundOnSampleNoLeave = false;
              this.HandleError(error);
            }
          );
      }
    } else {
      this.dataSource = [];
    }
  };

  GetByGroupId = (e) => {
    if (this.DetailRecordFoundOnSampleNoLeave == false) {
      if (e.value > 0 && this.SampleAnalysisParamsId > 0 == false) {
        this.service
          .GroupsLeave({
            CompanyId: sessionStorage.getItem("CompanyId"),
            OrganizationId: sessionStorage.getItem("OrganizationId"),
            Id: e.value,
          })
          .subscribe(
            (resp) => {
              if (resp?.length > 0) {
                this.dataSource = [];
                resp.map((item) => {
                  this.dataSource.push({
                    Id: null,
                    ResultValue: item.ResultValue,
                    InvLabGroupAnalysisStandardsId: item.labgroupstandardId,
                    RemarksDetail: "",
                    AnalysisParameterDescription: item.AnalysisParameterDescription,
                    MinValue: item.MinValue,
                    MaxValue: item.MaxValue,
                  });
                });
              }
            },
            (error) => {
              this.HandleError(error);
            }
          );
      }
    }
  };

  resetForm() {
    this.router.navigate([], { queryParams: { Id: null } });
    this.dataSource = [];
    this.SampleAnalysisParamsId = null;
    this.initForm();
  }

  onSAveButtonClicked() {
    if (this.SampleAnalysisParamsId > 0) {
      if (this.UserRightsObject.canUpdate) {
        this.handleSave();
      } else {
        this.ErrorPopup("You dont have right to update");
      }
    } else {
      if (this.UserRightsObject.canSave) {
        this.handleSave();
      } else {
        this.ErrorPopup("You dont have Right to Save");
      }
    }
  }

  handleSave() {
    if (validate(this.PurchaseAnalysisForm)) {
      if (this.dataSource.length > 0 == false) {
      } else {
        if (this.dataSource.length > 0) {
          for (let i = 0; i < this.dataSource.length; i++) {
            if (this.dataSource[i].InAnalysisResult > 0 == false || this.dataSource[i].InAnalysisResult == "" || this.dataSource[i].InAnalysisResult == null) {
              this.WarningPopup("InAnalysisResult Is Required  at  Detail Grid Row # " + (i + 1));
              return;
            }
          }
        }
        this.PurchaseAnalysisFormData.IsApproved = false;
        this.PurchaseAnalysisFormData.ApprovedDate = new Date();
        this.PurchaseAnalysisFormData.EntryDate = new Date();
        this.PurchaseAnalysisFormData.ModifyDate = new Date();
        this.PurchaseAnalysisFormData.ApprovedUserId = parseInt(sessionStorage.getItem("UserId"));
        this.PurchaseAnalysisFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
        this.PurchaseAnalysisFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
        this.PurchaseAnalysisFormData.BranchesId = this.branchesList[0].Id;
        this.PurchaseAnalysisFormData.ProjectsId = this.projectList[0].Id;
        this.PurchaseAnalysisFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
        this.PurchaseAnalysisFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
        this.PurchaseAnalysisFormData.InvLabSampleLogRegisterId = null;
        this.PurchaseAnalysisFormData.SupplierCustomerId = null;
        this.PurchaseAnalysisFormData.CookingPic = "";
        this.PurchaseAnalysisFormData.Pic1Pathe = "";
        this.PurchaseAnalysisFormData.SupCustCode = "";
        this.PurchaseAnalysisFormData.dmsAttachment = [];
        this.PurchaseAnalysisFormData.BiltyNo = this.PurchaseAnalysisForm.instance.getEditor("BiltyNo").option("text");
        this.PurchaseAnalysisFormData.SupCustCodePah = "";
        this.PurchaseAnalysisFormData.VehicleNo = this.PurchaseAnalysisForm.instance.getEditor("VehicleNo").option("text");
        this.PurchaseAnalysisFormData.GpSrNo = this.PurchaseAnalysisForm.instance.getEditor("GatePassInwardId").option("text");
        this.PurchaseAnalysisFormData.LabSampleNo = this.PurchaseAnalysisForm.instance.getEditor("LabSampleNo").option("text");
        this.PurchaseAnalysisFormData.ItemName = this.PurchaseAnalysisForm.instance.getEditor("ItemId").option("text");
        this.PurchaseAnalysisFormData.DocumentTypeId = 303;

        this.PurchaseAnalysisFormData.LabSampleDetail = this.dataSource;
        console.log("this. data Source : ", this.PurchaseAnalysisFormData, "detail data source: ", this.dataSource);
        this.SampleAnalysisParamsId > 0 ? this.ActivateLoadPanel("Updating Records!") : this.ActivateLoadPanel("Saving Record!");
        this.service.purchaseAnalysisSave(this.PurchaseAnalysisFormData).subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            this.SampleAnalysisParamsId ? this.SuccessPopup("Record updated successfully") : this.SuccessPopup("Record saved successfully!");
            this.dataSource.length = 0;
            this.resetForm();
          },
          (error) => {
            this.DeActivateLoadPanel();
            this.HandleError(error);
          }
        );
      }
    }
  }
}
