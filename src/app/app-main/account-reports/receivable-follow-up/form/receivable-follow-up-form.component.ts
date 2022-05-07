import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { validate } from "src/app/shared/Base/validationHelper";
import { ReceivableFollowUpModel } from "../receivable-follow-up.model";
import { ReceivableFollowUpService } from "../receivable-follow-up.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "receivable-follow-up-form",
  templateUrl: "./receivable-follow-up-form.component.html",
  styleUrls: [],
})
export class ReceivableFollowUpFormComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("ReceivableFollowUpForm", { static: false })
  ReceivableFollowUpForm: DxFormComponent;
  ReceivableFollowUpFormData: ReceivableFollowUpModel;
  companyList = [];
  branchList = [];
  projectList = [];
  supplierNameList = [];
  WareHouseList = [];
  itemNameList;
  dataSource = [];
  AccountsList: any;
  dueDays: number;
  dueDate: Date;
  taxPercent: number;
  tempItemAmount;
  Calculation: number;
  updateRowIndex: number;
  detailEditMode: boolean;
  ParamsId: number;
  id4submit: number;
  PackUOM: number;
  isUpdate: boolean;
  //======================================
  @Input() CompanyId: number;
  @Input() AccountId: number;
  @Input() IsLoadedInPopup: boolean = false;
  constructor(
    private commonService: CommonBaseService,
    private commonMethods: CommonMethodsForCombos,
    private service: ReceivableFollowUpService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.filter = false;
  }
  async ngOnInit() {
    this.ParamsId = this.route.snapshot.queryParams["Id"];
    await this.FetchData();
    this.initForm();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.ParamsId = 0;
    this.AccountId = 0;
    this.AccountsList = [];
    this.dataSource = [];
  }
  async FetchData() {
    this.ActivateLoadPanel("Initializing Form!");
    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.AccountsList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.CoaAllocationGetByCompanyId(this.CompanyId>0?this.CompanyId:parseInt(sessionStorage.getItem("CompanyId"))).catch((error) => this.HandleError(error)));
    this.FollowUpHistoryGetAll();
    this.DeActivateLoadPanel();
  }
  public initForm() {
    this.ReceivableFollowUpFormData = new ReceivableFollowUpModel();
    this.ReceivableFollowUpFormData.FollowupDate = new Date();
    this.CompanyId > 0 ? (this.ReceivableFollowUpFormData.ChartOfAccountId = this.AccountId) : (this.ReceivableFollowUpFormData.ChartOfAccountId = 0);
    if (this.ParamsId > 0) {
      this.setFields4editMode();
    }
  }
  setFocus = (e) =>
    setTimeout(() => {
      e.component.focus();
    }, 0);
  onEdit(e) {
    this.isUpdate = true;
    this.ParamsId = e.Id;
    if (this.ParamsId > 0) {
      this.ReceivableFollowUpFormData.Id = e.Id;
      this.ReceivableFollowUpFormData.FollowupDate = e.FollowupDate;
      this.ReceivableFollowUpFormData.PromiseDate = e.PromiseDate;
      this.ReceivableFollowUpFormData.ChartOfAccountId = e.ChartOfAccountId;
      this.ReceivableFollowUpFormData.NextFollowupDays = e.NextFollowupDays;
      this.ReceivableFollowUpFormData.CommentsDetail = e.CommentsDetail;
    }
  }
  onToolbarPreparing(event) {
    this.toolbarPreparing(
      event,
      () => this.dataGrid.instance.refresh(),
      () => this.exportGrid(this.dataGrid.instance)
    );
  }
  setFields4editMode() {
    !isNaN(this.ParamsId)
      ? ((this.id4submit = this.ParamsId),
        this.service.getById(this.ParamsId).subscribe(
          (result: ReceivableFollowUpModel) => {
            this.ReceivableFollowUpFormData = result;
          },
          (error) => console.log(error)
        ))
      : (this.id4submit = null);
  }
  FollowUpHistoryGetAll() {
    this.service
      .FollowUpHistoryGetAll({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
      })
      .subscribe(
        (result) => (console.log(result), (this.dataSource = result)),
        (error) => console.log(error)
      );
  }
  resetForm() {
    this.ParamsId = null;
    this.id4submit = null;
    this.initForm();
    this.FollowUpHistoryGetAll();
  }
  handleCancel() {}
  handleSave() {
    if (validate(this.ReceivableFollowUpForm)) {
      this.ReceivableFollowUpFormData.CompanyId = this.CompanyId > 0 ? this.CompanyId : parseInt(sessionStorage.getItem("CompanyId"));
      this.ReceivableFollowUpFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.ReceivableFollowUpFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.ReceivableFollowUpFormData.EntryDate = new Date();
      this.ReceivableFollowUpFormData.CommentsDate = new Date();
      this.ReceivableFollowUpFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      console.log(this.ReceivableFollowUpFormData);
      this.ParamsId > 0 ? this.ActivateLoadPanel("Updating!") : this.ActivateLoadPanel("Saving!");
      this.service.save(this.ReceivableFollowUpFormData).subscribe(
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
