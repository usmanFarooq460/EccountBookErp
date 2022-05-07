import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { DeliveryOrderHistoryService } from "./delivery-order-history.service";
import { InventoryCommonService } from "../Inventorycommon.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { GatePassInwardModel } from "./delivery-order-history.model";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { Router } from "@angular/router";
@Component({
  selector: "app-delivery-order-history",
  templateUrl: "./delivery-order-history.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class DeliveryOrderHistoryComponent extends BaseActions implements OnInit {
  @ViewChild("deliveryOrderGrid", { static: false })
  deliveryOrderGrid: DxDataGridComponent;
  @ViewChild("DeliveryOrderHistoryForm", { static: false })
  DeliveryOrderHistoryForm: DxFormComponent;
  DeliveryOrderHistoryFormData: GatePassInwardModel;
  SupplierList:any;
  dataSource = [];
  itemList:any;

  statusList = [{ name: "All" }, { name: "Approved" }, { name: "Not Approved" }];
  constructor(private router:Router,private commonMethods:CommonMethodsForCombos, private service: DeliveryOrderHistoryService, private commonService: CommonBaseService, private inventorycommon_service: InventoryCommonService) {
    super();
  }
  setFocus = () => this.DeliveryOrderHistoryForm.instance.getEditor("FromDate").focus();
  
  async ngOnInit() {
    this.breadCrumb("Inventory Reports", "Delivery Order History");
    this.initForm();
    this.itemList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.ItemsGetAll());
    this.SupplierList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.SupplierCustomerByOrganizationAndCompany());
    this.onLoad();
  }
  public initForm() {
    this.DeliveryOrderHistoryFormData = new GatePassInwardModel();
    this.DeliveryOrderHistoryFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.DeliveryOrderHistoryFormData.ToDate = new Date();
  }

  onLoad() {
    this.DeliveryOrderHistoryFormData.DocumentTypeId = 84;
    (this.DeliveryOrderHistoryFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"))),
      (this.DeliveryOrderHistoryFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"))),
      this.ActivateLoadPanel("Loading Data..")
      this.service.DeliveryOrderHistory(this.DeliveryOrderHistoryFormData).subscribe(
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
    const result: any = this.DeliveryOrderHistoryForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.DeliveryOrderHistoryFormData.DocumentTypeId = 84;
      this.DeliveryOrderHistoryFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.DeliveryOrderHistoryFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      if (this.DeliveryOrderHistoryFormData.FilterType === "Approved") {
        this.DeliveryOrderHistoryFormData.IsApproved = true;
        this.DeliveryOrderHistoryFormData.ApprovedFilter = null;
      }
      if (this.DeliveryOrderHistoryFormData.FilterType === "Not Approved") {
        this.DeliveryOrderHistoryFormData.IsApproved = false;
        this.DeliveryOrderHistoryFormData.ApprovedFilter = null;
      }
      if (this.DeliveryOrderHistoryFormData.FilterType === "All") {
        this.DeliveryOrderHistoryFormData.ApprovedFilter = "All";
      }
      this.ActivateLoadPanel("Loading Data..")
      this.service.DeliveryOrderHistory(this.DeliveryOrderHistoryFormData).subscribe(
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
  InvoiceSlip262(e) {
    this.service
      .PDFReportSlip262({
        Id: e.Id,
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocumentTypeId: 84,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "262-DeliveryOrderSlip",
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
  }
  ReportRegister263() {
    if (this.DeliveryOrderHistoryFormData) {
      this.DeliveryOrderHistoryFormData.DocumentTypeId = 84;
      this.DeliveryOrderHistoryFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.DeliveryOrderHistoryFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.DeliveryOrderHistoryFormData.CompanyAddress = sessionStorage.getItem("CompanyAddress");
      this.DeliveryOrderHistoryFormData.CompanyName = sessionStorage.getItem("CompanyName");
      this.DeliveryOrderHistoryFormData.ReportName = "263-InvDeliveryOrderForApprovel";
      if (this.DeliveryOrderHistoryFormData.FilterType === "Approved") {
        this.DeliveryOrderHistoryFormData.IsApproved = true;
        this.DeliveryOrderHistoryFormData.ApprovedFilter = null;
      }
      if (this.DeliveryOrderHistoryFormData.FilterType === "Not Approved") {
        this.DeliveryOrderHistoryFormData.IsApproved = false;
        this.DeliveryOrderHistoryFormData.ApprovedFilter = null;
      }
      if (this.DeliveryOrderHistoryFormData.FilterType === "All") {
        this.DeliveryOrderHistoryFormData.ApprovedFilter = "All";
      }
      this.service.DelvieryOrderRegister263(this.DeliveryOrderHistoryFormData).subscribe(
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
      this.ErrorPopup("Record Not Found")
    }
  }

  clear() {
    this.initForm();
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
          hint: "263-Do Register",
          onClick: this.ReportRegister263.bind(this),
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
      () => this.RefreshHistoryGridGrid(this.onLoad.bind(this), this.HistoryGridSateKey("gatepassInwardHistroyGrid"), this.deliveryOrderGrid)
    );
  }

}
