import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { SaleInvoiceTradeProService } from "./sale-invoice-tradePro-slip.service";
import { InventoryCommonService } from "../Inventorycommon.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { SaleInvoiceTradeProModel } from "./sale-invoice-tradePro-slip.model";

@Component({
  selector: "app-sale-invoice-history",
  templateUrl: "./sale-invoice-tradePro-slip.component.html",
  styleUrls: [],
})
export class SaleInvoiceTradeProSlipComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  @ViewChild("SaleInvoiceTradeProSlipForm", { static: false })
  SaleInvoiceTradeProSlipForm: DxFormComponent;
  SaleInvoiceTradeProSlipFormData: SaleInvoiceTradeProModel;

  companyList = [];
  branchList = [];
  projectList = [];
  SupplierList = [];
  dataSource = [];
  ItemList = [];
  gridPageSize: any;

  constructor(private service: SaleInvoiceTradeProService, private commonService: CommonBaseService, private inventorycommon_service: InventoryCommonService) {
    super();
    this.popoverVisible = false;
    this.filter = false;
  }

  setFocus = () => this.SaleInvoiceTradeProSlipForm.instance.getEditor("ToDate").focus();
  toggle() {
    this.popoverVisible = !this.popoverVisible;
  }

  filtering() {
    this.filter = !this.filter;
  }

  async ngOnInit() {
    this.breadCrumb("Inventory Reports", "Sale-Invoice-Trade-Pro-Slip");
    this.initForm();
  }
  public initForm() {
    this.SaleInvoiceTradeProSlipFormData = new SaleInvoiceTradeProModel();
    this.SaleInvoiceTradeProSlipFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.SaleInvoiceTradeProSlipFormData.ToDate = new Date();
    this.onLoad();
  }
  onLoad() {
    this.dataSource = [];
    this.service
      .SaleInvoiceTradeProSlipHistory({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        FromDate: this.SaleInvoiceTradeProSlipFormData.FromDate,
        ToDate: this.SaleInvoiceTradeProSlipFormData.ToDate,
        DocumentTypeId: 103,
      })
      .subscribe(
        (result) => {
          this.dataSource = result;
          this.gridPageSize = [50, 100, result.length];
        },
        (error) => {
          console.log(error);
        }
      );
  }
  onSubmit() {
    const result: any = this.SaleInvoiceTradeProSlipForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.popoverVisible = false;
      this.dataSource = [];
      this.service
        .SaleInvoiceTradeProSlipHistory({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          FromDate: this.SaleInvoiceTradeProSlipFormData.FromDate,
          ToDate: this.SaleInvoiceTradeProSlipFormData.ToDate,
          DocumentTypeId: 103,
        })
        .subscribe(
          (result) => {
            this.dataSource = result;
            this.gridPageSize = [50, 100, result.length];
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
  clear() {
    this.SaleInvoiceTradeProSlipForm.instance.resetValues();
  }
  onToolbarPreparing(event) {
    this.toolbarPreparing(
      event,
      () => this.dataGrid.instance.refresh(),
      () => this.exportGrid(this.dataGrid.instance)
    );
  }
}
