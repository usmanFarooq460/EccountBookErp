import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { validate } from "src/app/shared/Base/validationHelper";
import { DataSourceDTO, PreShipmentAnalysisModel, PreShipmentAnalysisDetailModel } from "../pre-shipment-analysis.model";
import { PreShipmentAnalysisService } from "../pre-shipment-analysis.service";

import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { BaseActions } from "src/app/shared/Base/BaseActions";
@Component({
  selector: "app-pre-shipment-analysis-form",
  templateUrl: "./pre-shipment-analysis-form.component.html",
  styleUrls: [],
})
export class PreShipmentAnalysisFormComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("PreProductionLabForm", { static: false }) //POF = PurchaseOrderForm
  PreProductionLabForm: DxFormComponent;
  PreProductionLabFormData: PreShipmentAnalysisModel; //PurchaseOrderData => formObject
  @ViewChild("PreProductionLabDetailForm", { static: false }) //POF = PurchaseOrderDetailForm
  PreProductionLabDetailForm: DxFormComponent;
  PreProductionLabDetailFormData: PreShipmentAnalysisDetailModel; //SaleOrderDetail = formObject
  branchList = [];
  projectList = [];
  supplierNameList: any;
  OrderNoList = [];
  jobLotList = [];
  dataSource = new Array<DataSourceDTO>();
  updateRowIndex: number;
  detailEditMode: boolean;
  ParamsId: number;
  InspectionLabNameList: any;
  ItemList: any;
  StatusList = [{ name: "Changed" }, { name: "Complete" }];
  EditType;
  constructor(
    private commonService: CommonBaseService,
    private commonMethods: CommonMethodsForCombos,
    private service: PreShipmentAnalysisService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }
  async ngOnInit() {
    this.ParamsId = this.route.snapshot.queryParams["Id"];
    this.EditType = this.route.snapshot.queryParams["Type"];
    await this.FetchData();
    this.initForm();
  }
  async FetchData() {
    this.ActivateLoadPanel("Initializing Form!");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("EximPreProductionLab"));
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.ItemList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetItemsForExport());
    this.supplierNameList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.SupplierCustomerForExport());
    this.InspectionLabNameList = await this.InspectionLabName();
    this.jobLotList = await this.commonMethods.getJobLot();
    this.DeActivateLoadPanel();
  }
  async initForm() {
    this.PreProductionLabFormData = new PreShipmentAnalysisModel();
    this.PreProductionLabDetailFormData = new PreShipmentAnalysisDetailModel();
    this.PreProductionLabFormData.ReportDate = new Date();
    if (this.ParamsId > 0) {
      this.setFields4editMode();
    } else {
      this.PreProductionLabFormData.ReportDocNo = await this.generateDocNumber();
    }
  }

  setFocus = (e) =>
    setTimeout(() => {
      e.component.focus();
    }, 0);

  setFields4editMode() {
    this.ActivateLoadPanel("Fetching Data!");
    this.service.GetById(this.ParamsId).subscribe(
      (result: PreShipmentAnalysisModel) => {
        this.DeActivateLoadPanel();
        this.PreProductionLabFormData = result;
        this.dataSource = result.LotInspectionDetails;
      },
      (error) => {
        this.DeActivateLoadPanel();
        this.HandleError(error);
      }
    );
  }

  async InspectionLabName() {
    return await this.service
      .InspectionLabName({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
        ExImLookUptypesId: 3,
      })
      .catch((err) => this.HandleError(err));
  }

  async generateDocNumber() {
    return await this.service
      .GenerateCode({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
      })
      .catch((error) => this.HandleError(error));
  }

  onjobLotLeave = (e) => {
    this.PreProductionLabFormData.LotRefNo = this.PreProductionLabForm.instance.getEditor("JobLotId").option("text");
  };

  getOrderNo = (e) => {
    if (e.value)
      this.service
        .GetExportSaleOrderNoBySupplierCustomerId({
          CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
          OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
          SupplierCustomerId: e.value,
        })
        .subscribe(
          (result) => {
            this.OrderNoList = result;
          },
          (error) => {
            this.HandleError(error);
          }
        );
  };

  addDetailRecord2Grid() {
    if (validate(this.PreProductionLabDetailForm)) {
      if (this.PreProductionLabDetailFormData.ContractId > 0 == false) {
        this.WarningPopup("Contract is Required!");
        return;
      } else if (this.PreProductionLabDetailFormData.Qty > 0 == false) {
        this.WarningPopup("Qty is Required!");
        return;
      }
      this.PreProductionLabDetailFormData.SupplierCustomer = this.PreProductionLabDetailForm.instance.getEditor("SupplierCustomerId").option("text");
      this.PreProductionLabDetailFormData.ContractNo = this.PreProductionLabDetailForm.instance.getEditor("ContractId").option("text");
      this.PreProductionLabDetailFormData.SubLot = this.PreProductionLabDetailForm.instance.getEditor("SubLot").option("text");
      this.PreProductionLabDetailFormData.SubRemarks = this.PreProductionLabDetailForm.instance.getEditor("SubRemarks").option("text");
      this.PreProductionLabDetailFormData.Status = this.PreProductionLabDetailForm.instance.getEditor("Status").option("text");
    }
    if (this.updateRowIndex >= 0) {
      this.dataSource[this.updateRowIndex] = this.PreProductionLabDetailFormData;
      this.updateRowIndex = -1;
      this.detailEditMode = false;
    } else {
      this.dataSource.push(this.PreProductionLabDetailFormData);
    }
    this.dataGrid.instance.refresh();
    this.PreProductionLabDetailForm.instance.getEditor("SupplierCustomerId").focus();
    this.PreProductionLabDetailFormData = new PreShipmentAnalysisDetailModel();
  }

  resetForm() {
    this.router.navigate([], { queryParams: { Id: null } });
    this.dataSource = [];
    this.ParamsId = null;
    this.EditType = 0;
    this.initForm();
  }

  editDetailRecordRow(editObject, index) {
    this.detailEditMode = true;
    this.updateRowIndex = index;
    this.PreProductionLabDetailFormData.InvLabPreProductionExportLotInspectionHeaderId = editObject.InvLabPreProductionExportLotInspectionHeaderId;
    this.PreProductionLabDetailFormData.SupplierCustomerId = editObject.SupplierCustomerId;
    this.PreProductionLabDetailFormData.ContractId = editObject.ContractId;
    this.PreProductionLabDetailFormData.Qty = editObject.Qty;
    this.PreProductionLabDetailFormData.SubLot = editObject.SubLot;
    this.PreProductionLabDetailFormData.SubRemarks = editObject.SubRemarks;
    this.PreProductionLabDetailFormData.Status = editObject.Status;
  }
  deleteDetailRecordRow(index) {
    this.dataSource.splice(index, 1);
  }

  onSave() {
    if (this.ParamsId > 0 == false && this.UserRightsObject.canSave == false) {
      this.WarningPopup("You don't have right to Save!");
      return;
    } else if (this.ParamsId > 0 && this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have right to Update!");
      return;
    }
    this.ParamsId > 0 ? (this.EditType == 1 ? this.handleSave() : this.UpdateConfirmationDate()) : this.handleSave();
  }

  UpdateConfirmationDate() {
    if (this.PreProductionLabFormData.ReportRefNo == null || this.PreProductionLabFormData.ReportRefNo == undefined) {
      this.WarningPopup("Please Enter Reference Report Number!");
      this.PreProductionLabForm.instance.getEditor("ReportRefNo").focus();
      return;
    } else if (this.PreProductionLabFormData.ConfirmationDate == null || this.PreProductionLabFormData.ConfirmationDate == undefined) {
      this.WarningPopup("Please Enter Report Confirmation Date!");
      this.PreProductionLabForm.instance.getEditor("ConfirmationDate").focus();
      return;
    }
    this.ActivateLoadPanel("Updating!");
    this.service
      .UpdateConfirmationDateAfterApproval({
        ConfirmationDate: this.PreProductionLabFormData.ConfirmationDate,
        ReportRefNo: this.PreProductionLabFormData.ReportRefNo,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        Id: this.PreProductionLabFormData.Id,
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.SuccessPopup("Confirmation Date Updated Successfully!");
          this.resetForm();
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }

  handleSave() {
    if (validate(this.PreProductionLabForm)) {
      if (this.dataSource.length > 0 == false) {
        this.WarningPopup("Detail Record Not Found!");
        return;
      }
      let id = 0;
      this.ParamsId ? (id = this.ParamsId) : (id = null);
      this.PreProductionLabFormData.Id = id;
      this.PreProductionLabFormData.JobLotDescription = this.PreProductionLabForm.instance.getEditor("JobLotId").option("text");
      this.PreProductionLabFormData.BranchesId = this.branchList[0].Id;
      this.PreProductionLabFormData.ProjectsId = this.projectList[0].Id;
      this.PreProductionLabFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.PreProductionLabFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.PreProductionLabFormData.EntryUserId = this.commonService.UserId();
      this.PreProductionLabFormData.EntryDate = new Date();
      this.PreProductionLabFormData.ApprovedDate = new Date();
      this.PreProductionLabFormData.ModifyUserId = this.commonService.UserId();
      this.PreProductionLabFormData.ModifyDate = new Date();
      this.PreProductionLabFormData.ApprovedUserId = this.commonService.UserId();
      this.PreProductionLabFormData.LotInspectionDetails = this.dataSource;
      this.ParamsId > 0 ? this.ActivateLoadPanel("Updating!") : this.ActivateLoadPanel("Saving!");
      this.service.onSave(this.PreProductionLabFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.ParamsId > 0 ? this.SuccessPopup("Record Updated Successfully!") : this.SuccessPopup("Record Saved Successfully!");
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
