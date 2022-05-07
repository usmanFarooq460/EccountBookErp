import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxFormComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { validate } from "src/app/shared/Base/validationHelper";
import { productionJobOrderMainModel } from "../Production-job-order-main.model";
import { ProductionJobOrderService } from "../production-job-order.service";

@Component({
  selector: "production-job-order-main-form",
  templateUrl: "./production-job-order-main-form.component.html",
  styleUrls: [],
})
export class ProductionJobOrderMainFormComponent extends BaseActions implements OnInit {
  @ViewChild("productionJobOrderMainForm", { static: false })
  productionJobOrderMainForm: DxFormComponent;
  productionJobOrderMainFormData: productionJobOrderMainModel;
  allAccountsList: any;
  itemsList: any;
  StatusList = [
    { id: 1, label: "In Process" },
    { id: 2, label: "Complete" },
    { id: 3, label: "Cancel" },
  ];
  planTypeList = [
    { id: 1, label: "Local" },
    { id: 2, label: "Export" },
    { id: 3, label: "Party" },
  ];
  productionTypeList = [
    { id: 1, label: "Husking" },
    { id: 2, label: "Processing" },
    { id: 3, label: "Other" },
  ];
  plantsList = [];

  @Output() isSubmitted = new EventEmitter();
  @Output() closeClicked = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ProductionJobOrderService,
    private commonMethods: CommonMethodsForCombos,
    private commonService: CommonBaseService
  ) {
    super();
  }

  async ngOnInit() {
    await this.FetchData();
    this.initForm();
  }

  async FetchData() {
    this.ActivateLoadPanel("Setting Form Feilds ");
    this.allAccountsList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.CoaAllocationGetAll());
    this.itemsList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetItemsForComboBind());
    this.plantsList = await this.getAllProductionPlantList();
    this.DeActivateLoadPanel();
  }

  async initForm() {
    this.productionJobOrderMainFormData = new productionJobOrderMainModel();
    this.productionJobOrderMainFormData.PlanDate = new Date();
    this.productionJobOrderMainFormData.StartDate = new Date();
    this.productionJobOrderMainFormData.EndDate = new Date();
    if (this.productionJobOrderMainFormData.Id > 0 == false) {
      this.productionJobOrderMainFormData.PlanCode = await this.generateDocNumber();
    }
  }

  SetFieldsForEdit(Id) {
    this.service.GetByID(Id).subscribe(
      (resp) => (this.productionJobOrderMainFormData = resp),
      (error) => this.HandleError(error)
    );
  }

  async generateDocNumber() {
    return await this.service.GetGenerateCode({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
      DocumentTypeId: 403,
    });
  }

  async getAllProductionPlantList() {
    return await this.service.getAllPRoductionPalnts({
      OrganizationId: sessionStorage.getItem("OrganizationId"),
      CompanyId: sessionStorage.getItem("CompanyId"),
    });
  }

  resetForm() {
    this.initForm();
  }

  OnCancelClick(){
    this.closeClicked.emit("true")
  }

  async onSubmit() {
    if (validate(this.productionJobOrderMainForm)) {
      this.productionJobOrderMainFormData.PlanTypeSrNo = 0;
      this.productionJobOrderMainFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.productionJobOrderMainFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.productionJobOrderMainFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.productionJobOrderMainFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.productionJobOrderMainFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.productionJobOrderMainFormData.EntryDate = new Date();
      this.productionJobOrderMainFormData.ModifyDate = new Date();
      this.productionJobOrderMainFormData.DocumentTypeId = 403;
      let branchList = await this.commonService.getBranch();
      this.productionJobOrderMainFormData.BranchesId = branchList[0].Id;
      let projectList = await this.commonService.getProject();
      this.productionJobOrderMainFormData.ProjectsId = projectList[0].Id;
      this.productionJobOrderMainFormData.IsApproved = false;
      this.productionJobOrderMainFormData.SupplierCustomerId = 0;
      this.productionJobOrderMainFormData.invProductionJobOrderOutput = [];
      this.productionJobOrderMainFormData.invProductionJobOrderInput = [];
      this.productionJobOrderMainFormData.AttachmentsList = [];
      this.productionJobOrderMainFormData.Id > 0 ? (this.productionJobOrderMainFormData.ActionId = 2) : (this.productionJobOrderMainFormData.ActionId = 1);
      this.productionJobOrderMainFormData.Id > 0 ? this.ActivateLoadPanel("Updating") : this.ActivateLoadPanel("Saving");
      this.service.Save(this.productionJobOrderMainFormData).subscribe(
        (resp) => {
          this.DeActivateLoadPanel();
          this.productionJobOrderMainFormData.Id > 0 ? this.SuccessPopup("Record Updated Succesffully!") : this.SuccessPopup("Record Saved Succesffully!");
          this.isSubmitted.emit("true")
          this.resetForm();
        },
        (error) => {
          this.HandleError(error);
        }
      );
    }
  }
}
