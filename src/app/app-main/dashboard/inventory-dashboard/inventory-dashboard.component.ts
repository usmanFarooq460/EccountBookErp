import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { Router } from "@angular/router";
import { InventoryDashboardService } from "./inventory-dashboard.service";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { GlobalConstant } from "src/app/Common/global-constant";
import { InventoryDasboardModel } from "./inventory-dashboard-grids.model";
import notify from "devextreme/ui/notify";
declare var mainAdminLte: any;
declare var JqueryLoaded: any;
@Component({
  selector: "app-inventory-dashboard",
  templateUrl: "./inventory-dashboard.component.html",
  styleUrls: ["/src/assets/adminlte/adminlteStyles.css"],
})
export class InventoryDashboardComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("InventoryDashboardForm", { static: false })
  InventoryDashboardForm: DxFormComponent;
  InventoryDashboardFormData: InventoryDasboardModel;
  fromDate: Date;
  toDate: Date;
  thisMonth: any;
  thisYear: any;
  today: any;
  fullDate: any;
  fromYear: any;
  fromMonth: any;
  fromDay: any;
  fromFullDate: any;
  purchasesGridVisible1: boolean;
  purchasesDataList = [];
  purchasesGridVisible2: boolean;
  checkIfButtonIsClickedForFirstTime: boolean = false;
  purchasesGrid1DataList = [];
  purchasesGrid2DataList = [];
  outstandingPurchaseOrdersList = [];
  outstandingSaleOrdersList = [];
  stockByItemGridList = [];
  stockByWarehouseList = [];
  salesSummaryByItemDataList = [];
  salesSummaryByCustomerDataList = [];
  purchaseGrid1DataCount: number;
  purchaseGrid2DataCount: number;
  ListOfDates = [
    { Id: 0, name: "Custom Date" },
    { Id: 1, name: "Today" },
    { Id: 2, name: "Current Week" },
    { Id: 3, name: "Current Month" },
    { Id: 4, name: "Current Year" },
  ];
  toDateFull: any;
  //=====================================================
  OutstandingPaddyPurchaseOrderDataList = [];
  OutstandingPaddyPurchaseOrderDataCount = 0;
  OutstandingPaddyPurchaseOrderBags: any;
  OutstanidngPaddyPurchaseOrderWeight: any;
  //=====================================================

  fromDateFull: any;
  reportLoadOptions = ["FromTo Date", "Upto Date"];
  gridPageSize: any;
  detailReportForOrdersByParentCategoryVisible: boolean = false;
  detailReportDataSourceForOrdersByParentCategory = [];

  constructor(private service: InventoryDashboardService, private commonService: CommonBaseService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.purchasesGridVisible1 = false;
    this.purchasesGridVisible2 = false;
    setTimeout(() => {
      this.collapseAllGrids();
    }, 2000);
    setTimeout(() => {
      this.checkIfButtonIsClickedForFirstTime = true;
    }, 3000);
    // this.GetDataForOutstandingPaddyPurchaseOrder();
    // this.breadCrumb("Account Dashboard", "");
    if (GlobalConstant.checkIfAdminLteIsLoadedOrNot == true) {
      this.callMainAdminLte();
      GlobalConstant.checkIfAdminLteIsLoadedOrNot = false;
    }
    // this.InventoryDashboardFormData = {
    //   fromDate: new Date(),
    //   toDate: new Date(),
    //   dateType: this.ListOfDates[0].Id,
    // };
    this.InventoryDashboardFormData = new InventoryDasboardModel();
    this.InventoryDashboardFormData.dateType = this.ListOfDates[4].Id;
    this.InventoryDashboardFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.InventoryDashboardFormData.ToDate = new Date();

    // this.uptoDate=this.datePipe.transform(this.InventoryDashboardFormData.toDate, 'dd-MM-yyy');
    // this.getToDate();
    // this.getFromDate();
  }
  callMainAdminLte() {
    if (GlobalConstant.checkIfAdminLteIsLoadedOrNot == true) {
      JqueryLoaded();
      mainAdminLte();
      GlobalConstant.checkIfAdminLteIsLoadedOrNot = false;
    } else {
      return;
    }
  }
  onSubmit() {}

  DataForPurchasesGrid1() {
    if (this.checkIfButtonIsClickedForFirstTime == true) {
      this.getToDate();
      if (this.InventoryDashboardFormData) {
        this.service
          .InventoryDashboardPurchases({
            //Compulosry
            OrganizationId: this.commonService.OrganizationId(),
            CompanyId: this.commonService.CompanyId(),
            CompanyAddress: sessionStorage.getItem("CompanyAddress"),
            CompanyName: sessionStorage.getItem("CompanyName"),
            FromDate: this.InventoryDashboardFormData.FromDate,
            ToDate: this.InventoryDashboardFormData.ToDate,
            // ItemId: this.InventoryDashboardFormData.ItemId,
            // ReportName: "221-InvRptPurchaseInvoicePurchaseAvgRateByItem",
          })
          .subscribe(
            (result) => {
              this.purchasesGrid1DataList = result;
              this.purchaseGrid1DataCount = result.length;
            },
            (error) => {
              notify(error.ExceptionMessage, "error");
            }
          );
      } else {
        notify("Record Not Found", "error");
      }
    }
  }
  ShowOutstandingPaddyPurchaseInfo() {}

  // GetDataForOutstandingPaddyPurchaseOrder() {
  //   this.service
  //     .DataForOutstandingPaddyPurchaseOrders({
  //       OrganizationId: sessionStorage.getItem("OrganizationId"),
  //       CompanyId: sessionStorage.getItem("CompanyId"),
  //       Activity: "PaddyOutStandingPurchaseOrders",
  //       stockUOM: 65,
  //       FromDate: "2021-6-01",
  //       ToDate: "2021-10-14",
  //     })
  //     .subscribe(
  //       (result) => {
  //         this.OutstandingPaddyPurchaseOrderDataList = result;
  //         let totalBags = 0;
  //         let totalWeight = 0;
  //         for (let i = 0; i < result.length; i++) {
  //           totalBags += result[i].Qty;
  //           totalWeight += result[i].NetWeight;
  //         }
  //         this.OutstandingPaddyPurchaseOrderBags = this.formatNumber(totalBags) + " Bags";

  //         this.OutstanidngPaddyPurchaseOrderWeight = this.formatNumber(totalWeight) + " Kg's";

  //         this.OutstandingPaddyPurchaseOrderDataCount = result.length;
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  // }

  formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  customizeLabel(arg) {
    return arg.valueText + " (Bags)";
  }

  //==========================================================================
  OutstandingPaddyPurchaseCardClick() {
    GlobalConstant.InventoryDashboardRoutedReportType = "OutstandingPaddyPurchaseReport";
    this.router.navigate(["/inventory-reports/purchase-order-register"]);
    // this.router.navigate(["/supplier-purchases/mandi-purchase-order-form"], {
    //   queryParams: { Id: 1 },
    // });
  }

  //==========================================================================

  DataForPurchasesGrid2() {
    if (this.checkIfButtonIsClickedForFirstTime == true) {
      this.getToDate();
      if (this.InventoryDashboardFormData) {
        this.service
          .InventoryDashboardPurchases({
            //Compulosry
            OrganizationId: this.commonService.OrganizationId(),
            CompanyId: this.commonService.CompanyId(),
            CompanyAddress: sessionStorage.getItem("CompanyAddress"),
            CompanyName: sessionStorage.getItem("CompanyName"),
            FromDate: sessionStorage.getItem("StartPeriod"),
            ToDate: this.InventoryDashboardFormData.ToDate,
            // ItemId: this.InventoryDashboardFormData.ItemId,
            // ReportName: "221-InvRptPurchaseInvoicePurchaseAvgRateByItem",
          })
          .subscribe(
            (result) => {
              this.purchasesGrid2DataList = result;
              this.purchaseGrid2DataCount = result.length;
            },
            (error) => {
              notify(error.ExceptionMessage, "error");
            }
          );
      } else {
        notify("Record Not Found", "error");
      }
    }
  }
  DataForPurchasesGrid3() {
    // if(this.checkIfButtonIsClickedForFirstTime==true)
    // {

    this.service
      .InventoryDashboardOutstandingPurchases({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocumentTypeId: 41,
        Status: "Open",
      })
      .subscribe(
        (result) => {
          this.outstandingPurchaseOrdersList = result;
        },
        (error) => {
          console.log(error);
          notify(error, "error");
        }
      );
  }
  SalesSummaryByItem() {
    if (this.checkIfButtonIsClickedForFirstTime == true) {
      this.service
        .SalesSummaryByActivity({
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          FromDate: this.InventoryDashboardFormData.FromDate,
          ToDate: this.InventoryDashboardFormData.ToDate,
          Activity: "SalesSummaryByItem",
        })
        .subscribe(
          (result) => {
            this.salesSummaryByItemDataList = result;
            this.gridPageSize = [20, 50, result.length];
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
  SalesSummaryByCustomer() {
    if (this.checkIfButtonIsClickedForFirstTime == true) {
      this.service
        .SalesSummaryByActivity({
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          FromDate: this.InventoryDashboardFormData.FromDate,
          ToDate: this.InventoryDashboardFormData.ToDate,
          Activity: "SalesSummaryByCustomer",
        })
        .subscribe(
          (result) => {
            this.salesSummaryByCustomerDataList = result;
            this.gridPageSize = [20, 50, result.length];
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
  DataForOutstandingSaleOrder() {
    if (this.checkIfButtonIsClickedForFirstTime == true) {
      this.service
        .InventoryDashboardOutstandingSaleOrder({
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          DocumentTypeId: 81,
          Status: "Open",
        })
        .subscribe(
          (result) => {
            this.outstandingSaleOrdersList = result;
            this.gridPageSize = [50, 100, result.length];
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
  DataForStockByItemGrid() {
    if (this.checkIfButtonIsClickedForFirstTime == true) {
      this.service
        .StockSummaryByActivity({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          FromDate: this.InventoryDashboardFormData.FromDate,
          ToDate: this.InventoryDashboardFormData.ToDate,
          Activity: "ItemStockSummary",
        })
        .subscribe(
          (result) => {
            this.stockByItemGridList = result;
            this.gridPageSize = [50, 100, result.length];
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
  DataForStockByWarehouseGrid() {
    if (this.checkIfButtonIsClickedForFirstTime == true) {
      this.service
        .StockSummaryByActivity({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          FromDate: this.InventoryDashboardFormData.FromDate,
          ToDate: this.InventoryDashboardFormData.ToDate,
          Activity: "ItemandWarehouseStockSummary",
        })
        .subscribe(
          (result) => {
            this.stockByWarehouseList = result;
            this.gridPageSize = [50, 100, result.length];
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
  HndleChangeOfDateType = (e) => {
    if (e.value == 1) {
      this.InventoryDashboardFormData.FromDate = new Date();
      this.InventoryDashboardFormData.ToDate = new Date();
      this.onSubmit();

      // this.uptoDate=this.datePipe.transform(this.InventoryDashboardFormData.toDate, 'dd-MM-yyy')
    }
    if (e.value == 2) {
      this.InventoryDashboardFormData.FromDate = this.getMonday(new Date());
      this.InventoryDashboardFormData.ToDate = new Date();
      this.onSubmit();
      // this.uptoDate=this.datePipe.transform(this.InventoryDashboardFormData.toDate, 'dd-MM-yyy')
    }
    if (e.value == 3) {
      let my_date = new Date();
      let monthfirstdate = new Date(my_date.getFullYear(), my_date.getMonth(), 1);
      this.InventoryDashboardFormData.FromDate = monthfirstdate;
      this.InventoryDashboardFormData.ToDate = new Date();
      this.onSubmit();
      // this.uptoDate=this.datePipe.transform(this.InventoryDashboardFormData.toDate, 'dd-MM-yyy')
    }
    if (e.value == 4) {
      var Year = new Date(new Date().getFullYear(), 0, 1);
      this.InventoryDashboardFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
      this.InventoryDashboardFormData.ToDate = new Date();
      this.onSubmit();
      // this.uptoDate=this.datePipe.transform(this.InventoryDashboardFormData.toDate, 'dd-MM-yyy')
    }
  };
  getMonday(d = new Date()) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }
  setFocus = (e) => setTimeout(() => e.component.focus(), 0);

  collapseAllGrids() {
    // document.getElementById("purchasesGrid2").click();
    document.getElementById("purchasesGrid1").click();
    // document.getElementById("purchasesGrid3").click();
    document.getElementById("salesGrid1").click();
    document.getElementById("salesGrid2").click();
    // document.getElementById("salesGrid3").click();
    document.getElementById("stockByItemGrid").click();
    document.getElementById("stockByWarehouseGrid").click();
  }
  getDates = (e) => {
    if (this.InventoryDashboardFormData.dateType == 4) {
      this.toDateFull =
        this.InventoryDashboardFormData.ToDate.getDate().toString() +
        "-" +
        this.InventoryDashboardFormData.ToDate.getMonth().toString() +
        "-" +
        this.InventoryDashboardFormData.ToDate.getFullYear().toString();
      this.fromDateFull = "Start of Year";
    } else if (this.InventoryDashboardFormData.dateType == 5) {
      this.toDateFull =
        this.InventoryDashboardFormData.ToDate.getDate().toString() +
        "-" +
        this.InventoryDashboardFormData.ToDate.getMonth().toString() +
        "-" +
        this.InventoryDashboardFormData.ToDate.getFullYear().toString();
      this.fromDateFull =
        this.InventoryDashboardFormData.FromDate.getDate().toString() +
        "-" +
        this.InventoryDashboardFormData.FromDate.getMonth().toString() +
        "-" +
        this.InventoryDashboardFormData.FromDate.getFullYear().toString();
    } else {
      this.toDateFull =
        this.InventoryDashboardFormData.ToDate.getDate().toString() +
        "-" +
        this.InventoryDashboardFormData.ToDate.getMonth().toString() +
        "-" +
        this.InventoryDashboardFormData.ToDate.getFullYear().toString();
      this.fromDateFull =
        this.InventoryDashboardFormData.FromDate.getDate().toString() +
        "-" +
        this.InventoryDashboardFormData.FromDate.getMonth().toString() +
        "-" +
        this.InventoryDashboardFormData.FromDate.getFullYear().toString();
    }
  };
  getToDate() {
    this.toDateFull =
      this.InventoryDashboardFormData.ToDate.getDate().toString() +
      "-" +
      this.InventoryDashboardFormData.ToDate.getMonth().toString() +
      "-" +
      this.InventoryDashboardFormData.ToDate.getFullYear().toString();
  }
  getFromDate() {
    this.fromDateFull =
      this.InventoryDashboardFormData.FromDate.getDate().toString() +
      "-" +
      this.InventoryDashboardFormData.FromDate.getMonth().toString() +
      "-" +
      this.InventoryDashboardFormData.FromDate.getFullYear().toString();
  }

  // MoveDiv()
  // {
  //   let outstandingPurchaseOrderGridDiv=document.getElementById("card1");
  //   let mainDiv=document.getElementById("mainDiv");
  //   mainDiv.appendChild(outstandingPurchaseOrderGridDiv);
  //   outstandingPurchaseOrderGridDiv.classList.remove('col-md-12');
  //   outstandingPurchaseOrderGridDiv.classList.add('col-md-6');
  // }

  OrderDetailByParentCategory(e) {
    if (e != null) {
      this.detailReportDataSourceForOrdersByParentCategory = [];
      this.service
        .Inventory_Dashboard_OrderDetailByParentCategory({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          InventoryParentCategories: e.Id,
          OrderId: e.OrderDescriptionId,
          FromDate: this.InventoryDashboardFormData.FromDate,
          ToDate: this.InventoryDashboardFormData.ToDate,
        })
        .subscribe(
          (result) => {
            this.detailReportDataSourceForOrdersByParentCategory = result;
            this.detailReportForOrdersByParentCategoryVisible = true;
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }
  closeDetailRportForOrdersByParentCategory(e) {
    this.detailReportForOrdersByParentCategoryVisible = false;
  }
}
