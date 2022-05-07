import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { SaleOrderHistoryService } from "./sale-order-history.service";
import { InventoryCommonService } from "../Inventorycommon.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { SaleOrderRegisterModel } from "./sale-order-history.model";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import notify from "devextreme/ui/notify";
import { Router } from "@angular/router";

@Component({
  selector: "app-sale-order-history",
  templateUrl: "./sale-order-history.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class SaleOrderHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("saleOrderHistoryGrid", { static: false })
  saleOrderHistoryGrid: DxDataGridComponent;

  @ViewChild("saleOrderHistoryForm", { static: false })
  saleOrderHistoryForm: DxFormComponent;
  saleOrderHistoryFormData: SaleOrderRegisterModel;

  companyList = [];
  branchList = [];
  projectList = [];
  itemList: any;
  CustomerList: any;
  dataSource = [];

  statusList = [{ name: "Open" }, { name: "Complete" }, { name: "Cancel" }];
  approvedList = [{ name: "All" }, { name: "Approved" }, { name: "Not Approved" }];

  constructor(
    private router: Router,
    private commonMethods: CommonMethodsForCombos,
    private service: SaleOrderHistoryService,
    private commonService: CommonBaseService,
  ) {
    super();
  }

  async ngOnInit() {
    this.breadCrumb("Inventory Reports", "Sale Order History");

    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();

    this.itemList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.ItemsGetAll());
    this.CustomerList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.SupplierCustomerByOrganizationAndCompany());
    this.initForm();
  }
  public initForm() {
    this.saleOrderHistoryFormData = new SaleOrderRegisterModel();
    this.saleOrderHistoryFormData.CompanyId = this.companyList[0].Id;
    this.saleOrderHistoryFormData.branch = this.branchList[0].Id;
    this.saleOrderHistoryFormData.project = this.projectList[0].Id;
    this.saleOrderHistoryFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.saleOrderHistoryFormData.ToDate = new Date();
    this.onLoad();
  }

  onLoad() {
    this.popoverVisible = false;
    this.saleOrderHistoryFormData.OrganizationId = this.commonService.OrganizationId();
    this.saleOrderHistoryFormData.CompanyId = this.commonService.CompanyId();
    this.saleOrderHistoryFormData.DocId = 81;
    this.saleOrderHistoryFormData.FilterType = "Not Approved";
    this.saleOrderHistoryFormData.IsApproved = false;
    this.saleOrderHistoryFormData.DocumentTypeId = 81;
    this.ActivateLoadPanel("Loading Data..");
    this.service.saleorderhistory(this.saleOrderHistoryFormData).subscribe(
      (result) => {
        this.DeActivateLoadPanel();
        this.dataSource = result;
      },
      (error) => {
        this.DeActivateLoadPanel();
        if (error.ExceptionMessage) {
          this.ErrorPopup(error.ExceptionMessage);
        } else if (error.Message) {
          this.ErrorPopup(error.Message);
        } else {
          this.ErrorPopup(error);
        }
      }
    );
  }

  onSubmit() {
    const result: any = this.saleOrderHistoryForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.popoverVisible = false;
      this.saleOrderHistoryFormData.DocId = 81;
      if (this.saleOrderHistoryFormData.FilterType === "Approved") {
        this.saleOrderHistoryFormData.IsApproved = true;
        this.saleOrderHistoryFormData.ApprovedFilter = null;
      }
      if (this.saleOrderHistoryFormData.FilterType === "Not Approved") {
        this.saleOrderHistoryFormData.IsApproved = false;
        this.saleOrderHistoryFormData.ApprovedFilter = null;
      }
      if (this.saleOrderHistoryFormData.FilterType === "All") {
        this.saleOrderHistoryFormData.ApprovedFilter = "All";
      }
      this.saleOrderHistoryFormData.DocumentTypeId = 81;
      this.ActivateLoadPanel("Loading Data..");
      this.service.saleorderhistory(this.saleOrderHistoryFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.dataSource = result;
        },
        (error) => {
          this.DeActivateLoadPanel();
          if (error.ExceptionMessage) {
            this.ErrorPopup(error.ExceptionMessage);
          } else if (error.Message) {
            this.ErrorPopup(error.Message);
          } else {
            this.ErrorPopup(error);
          }
        }
      );
    }
  }

  onApproved(e) {
    if (e.IsApproved != "Approved") {
      this.service
        .updatestatusandapproved({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          ReqType: "Approve",
          Id: e.Id,
        })
        .subscribe(
          (result) => {
            this.SuccessPopup("Record Approved successfully!")
            // notify("Record Approved successfully!", "success");
            this.onSubmit();
          },
          (error) => {
            if (error.ExceptionMessage) {
              this.ErrorPopup(error.ExceptionMessage);
            } else if (error.Message) {
              this.ErrorPopup(error.Message);
            } else {
              this.ErrorPopup(error);
            }
          }
        );
    } else {
      this.ErrorPopup("Record Already Approved")
      // notify("Record Already Approved", "error");
    }
  }

  //Pdf Reports

  ReportRegister270() {
    if (this.saleOrderHistoryFormData) {
      if (this.saleOrderHistoryFormData.FilterType === "Approved") {
        this.saleOrderHistoryFormData.IsApproved = true;
        this.saleOrderHistoryFormData.ApprovedFilter = null;
      }
      if (this.saleOrderHistoryFormData.FilterType === "Not Approved") {
        this.saleOrderHistoryFormData.IsApproved = false;
        this.saleOrderHistoryFormData.ApprovedFilter = null;
      }
      if (this.saleOrderHistoryFormData.FilterType === "All") {
        this.saleOrderHistoryFormData.ApprovedFilter = "All";
      }

      this.service
        .InvRptSaleOderRegister_270({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          ApprovedFilter: this.saleOrderHistoryFormData.ApprovedFilter,
          IsApproved: this.saleOrderHistoryFormData.IsApproved,
          ReportName: "270-InvRptSaleOderRegister",
        })
        .subscribe(
          (result) => window.open(result),
          (error) => {
            if (error.ExceptionMessage) {
              this.ErrorPopup(error.ExceptionMessage);
            } else if (error.Message) {
              this.ErrorPopup(error.Message);
            } else {
              this.ErrorPopup(error);
            }
          }
        );
    } else {
      this.ErrorPopup("Record Already Approved")
      // notify("Record Not Found", "error");
    }
  }

  ReportRegister271() {
    if (this.saleOrderHistoryFormData) {
      if (this.saleOrderHistoryFormData.FilterType === "Approved") {
        this.saleOrderHistoryFormData.IsApproved = true;
      }
      if (this.saleOrderHistoryFormData.FilterType === "Not Approved") {
        this.saleOrderHistoryFormData.IsApproved = false;
      }
      if (this.saleOrderHistoryFormData.FilterType === "All") {
        this.saleOrderHistoryFormData.ApprovedFilter = "All";
      }

      this.service
        .InvRptSalesOrderRegister_271({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          ApprovedFilter: this.saleOrderHistoryFormData.ApprovedFilter,
          IsApproved: this.saleOrderHistoryFormData.IsApproved,
          ReportName: "271-InvRptSalesOrderRegister",
        })
        .subscribe(
          (result) => window.open(result),
          (error) => {
            if (error.ExceptionMessage) {
              this.ErrorPopup(error.ExceptionMessage);
            } else if (error.Message) {
              this.ErrorPopup(error.Message);
            } else {
              this.ErrorPopup(error);
            }
          }
        );
    } else {
      this.ErrorPopup("Record Already Approved")
      // notify("Record Not Found", "error");
    }
  }

  ReportSlip272 = (e) => {
    if (this.saleOrderHistoryFormData) {
      if (this.saleOrderHistoryFormData.FilterType === "Approved") {
        this.saleOrderHistoryFormData.IsApproved = true;
      }
      if (this.saleOrderHistoryFormData.FilterType === "Not Approved") {
        this.saleOrderHistoryFormData.IsApproved = false;
      }
      if (this.saleOrderHistoryFormData.FilterType === "All") {
        this.saleOrderHistoryFormData.ApprovedFilter = "All";
      }

      this.service
        .InvRptSaleOrderSlipWithDespatchDetail_272({
          //Compulosry
          Id: e.Id,

          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          ApprovedFilter: this.saleOrderHistoryFormData.ApprovedFilter,
          IsApproved: this.saleOrderHistoryFormData.IsApproved,
          ReportName: "272-InvRptSaleOrderSlipWithDespatchDetail",
        })
        .subscribe(
          (result) => window.open(result),
          (error) => {
            if (error.ExceptionMessage) {
              this.ErrorPopup(error.ExceptionMessage);
            } else if (error.Message) {
              this.ErrorPopup(error.Message);
            } else {
              this.ErrorPopup(error);
            }
          }
        );
    } else {
      this.ErrorPopup("Record Already Approved")
    }
  };

  clear() {
    this.saleOrderHistoryFormData = new SaleOrderRegisterModel();
    this.saleOrderHistoryFormData.CompanyId = this.companyList[0].Id;
    this.saleOrderHistoryFormData.branch = this.branchList[0].Id;
    this.saleOrderHistoryFormData.project = this.projectList[0].Id;
    this.saleOrderHistoryFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.saleOrderHistoryFormData.ToDate = new Date();
  }

  goBack() {
    this.router.navigate(["/admin-panel/report-panel"]);
  }

  onToolPreparingOfItemHistoryGrid = (e) => {
    e.toolbarOptions.items.unshift(
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "outstandingPaddyPurchaseOrderChartButton",
          icon: "print",
          hint: "270-RegDetail",
          onClick: this.ReportRegister270.bind(this),
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "outstandingPaddyPurchaseOrderChartButton",
          icon: "print",
          hint: "271-RegSummary",
          onClick: this.ReportRegister271.bind(this),
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          id: "outstandingPaddyPurchaseOrderChartButton",
          icon: "back",
          hint: "Back",
          onClick: this.goBack.bind(this),
        },
      }
    );
    this.HistoryGridToolBarPreparing(
      e,
      () => this.filtering(),
      () => this.onLoad(),
      () => this.RefreshHistoryGridGrid(this.onLoad.bind(this), this.HistoryGridSateKey("saleOrderHistoryGrid"), this.saleOrderHistoryGrid)
    );
  }
}
