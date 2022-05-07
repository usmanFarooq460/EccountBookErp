import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { SaleInvoiceDirectRegisterService } from "./sale-invoice-direct-register.service";
import { InventoryCommonService } from "../Inventorycommon.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { SaleInvoiceDirectRegisterModel } from "./sale-invoice-direct-register.model";
import notify from "devextreme/ui/notify";

@Component({
  selector: "app-sale-invoice-direct-register",
  templateUrl: "./sale-invoice-direct-register.component.html",
  styleUrls: [],
})
export class SaleInvoiceDirectRegisterComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;

  @ViewChild("SaleInvoiceDirectRegisterForm", { static: false })
  SaleInvoiceDirectRegisterForm: DxFormComponent;
  SaleInvoiceDirectRegisterFormData: SaleInvoiceDirectRegisterModel;

  companyList = [];
  branchList = [];
  projectList = [];
  SupplierList = [];
  dataSource = [];
  ItemList = [];
  JobLotList = [];

  constructor(private service: SaleInvoiceDirectRegisterService, private commonService: CommonBaseService, private inventorycommon_service: InventoryCommonService) {
    super();
    this.popoverVisible = false;
    this.filter = false;
  }

  setFocus = () => this.SaleInvoiceDirectRegisterForm.instance.getEditor("SupplierCustomerId").focus();
  toggle() {
    this.popoverVisible = !this.popoverVisible;
  }

  filtering() {
    this.filter = !this.filter;
  }

  async ngOnInit() {
    this.breadCrumb("Inventory Reports", "Sale-Invoice-History");
    this.Supplier();
    this.GetJobLot();
    this.GetItem();
    this.initForm();
  }
  public initForm() {
    this.SaleInvoiceDirectRegisterFormData = new SaleInvoiceDirectRegisterModel();
    this.SaleInvoiceDirectRegisterFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.SaleInvoiceDirectRegisterFormData.ToDate = new Date();
    this.onLoad();
  }
  Supplier() {
    this.inventorycommon_service
      .supplierCustomer({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.SupplierList = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  GetItem() {
    this.inventorycommon_service
      .item({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.ItemList = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  GetJobLot() {
    this.inventorycommon_service
      .JobLot({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.JobLotList = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ReportRegister302() {
    if (this.SaleInvoiceDirectRegisterFormData) {
      this.service
        .InvSaleInvoice_302({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.SaleInvoiceDirectRegisterFormData.FromDate,
          ToDate: this.SaleInvoiceDirectRegisterFormData.ToDate,
          SupplierCustomerId: this.SaleInvoiceDirectRegisterFormData.SupplierCustomerId,
          ItemId: this.SaleInvoiceDirectRegisterFormData.ItemId,
          ReportName: "302-InvSaleInvoice",
        })
        .subscribe(
          (result) => window.open(result),
          (error) => {
            notify(error.ExceptionMessage, "error");
          }
        );
    } else {
      notify("Record Not Found", "error");
    }
  }

  InvRptSaleBillDirectWithoutSO_294 = (e) => {
    if (this.SaleInvoiceDirectRegisterFormData) {
      this.service
        .InvRptSaleBillDirectWithoutSO_294({
          Id: e.Id,
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          ReportName: "294-InvRptSaleBillDirectWithoutSO",
        })
        .subscribe(
          (result) => window.open(result),
          (error) => {
            notify(error.ExceptionMessage, "error");
          }
        );
    } else {
      notify("Record Not Found", "error");
    }
  };

  AcRptVoucherSlip_118 = (e) => {
    if (this.SaleInvoiceDirectRegisterFormData) {
      this.service
        .AcRptVoucherSlip_118({
          Id: e.Id,
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          ApprovedFilter: "All",
          ReportName: "118-AcRptVoucherSlip",
        })
        .subscribe(
          (result) => window.open(result),
          (error) => {
            notify(error.ExceptionMessage, "error");
          }
        );
    } else {
      notify("Record Not Found", "error");
    }
  };

  onLoad() {
    this.dataSource = [];
    this.service
      .SaleInvoiceDirectRegister({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        FromDate: this.SaleInvoiceDirectRegisterFormData.FromDate,
        ToDate: this.SaleInvoiceDirectRegisterFormData.ToDate,
        JobLotId: this.SaleInvoiceDirectRegisterFormData.JobLotId,
        SupplierCustomerId: this.SaleInvoiceDirectRegisterFormData.SupplierCustomerId,
        ItemId: this.SaleInvoiceDirectRegisterFormData.ItemId,
      })
      .subscribe(
        (result) => {
          this.dataSource = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onSubmit() {
    const result: any = this.SaleInvoiceDirectRegisterForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.popoverVisible = false;
      this.dataSource = [];
      this.service
        .SaleInvoiceDirectRegister({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          FromDate: this.SaleInvoiceDirectRegisterFormData.FromDate,
          ToDate: this.SaleInvoiceDirectRegisterFormData.ToDate,
          JobLotId: this.SaleInvoiceDirectRegisterFormData.JobLotId,
          SupplierCustomerId: this.SaleInvoiceDirectRegisterFormData.SupplierCustomerId,
          ItemId: this.SaleInvoiceDirectRegisterFormData.ItemId,
        })
        .subscribe(
          (result) => {
            this.dataSource = result;
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  clear() {
    this.SaleInvoiceDirectRegisterForm.instance.resetValues();
  }

  onToolbarPreparing(event) {
    this.toolbarPreparing(
      event,
      () => this.dataGrid.instance.refresh(),
      () => this.exportGrid(this.dataGrid.instance)
    );
  }
}
