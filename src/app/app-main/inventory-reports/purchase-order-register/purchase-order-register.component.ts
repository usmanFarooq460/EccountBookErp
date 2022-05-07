import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { PurchaseOrderHistoryService } from "./purchase-order-register.service";
import { InventoryCommonService } from "../Inventorycommon.service";
import { validate } from "src/app/shared/Base/validationHelper";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { PurchaseRegisterModel, HeaderArrayModelForReportAgainstOutstandingPurchaseOrder, model } from "./purchase-order-register.model";
import { ActivatedRoute } from "@angular/router";
import { GlobalConstant } from "src/app/Common/global-constant";

import notify from "devextreme/ui/notify";

@Component({
  selector: "app-purchase-order-register",
  templateUrl: "./purchase-order-register.component.html",
  styleUrls: ["./purchase-order-register.component.scss"],
})
export class PurchaseOrderRegisterComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("OutstandingPaddyPurchaseOrdersGrid", { static: false })
  OutstandingPaddyPurchaseOrdersGrid: DxDataGridComponent;

  @ViewChild("purchaseOrderHistoryForm", { static: false })
  purchaseOrderHistoryForm: DxFormComponent;
  purchaseOrderHistoryFormData: PurchaseRegisterModel;

  ApprovalPopupHeight: number = window.innerHeight - 200;
  ApprovalPopupWidth: number = window.innerWidth - 200;
  ApprovalPopupGridWidth: number = window.innerWidth - 350;
  ApprovalPopupGridHeight: number = window.innerHeight - 270;
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    event.target.innerWidth;
    let height = event.target.innerHeight;
    let width = event.target.innerWidth;
    this.ApprovalPopupHeight = height - (height * 35) / 100;
    this.ApprovalPopupWidth = width - (width * 35) / 100;
    this.ApprovalPopupGridWidth = width - (width * 37) / 100;
    this.ApprovalPopupGridHeight = height - (height * 40) / 100;
  }
  HistoryRegisterVisibility: boolean = false;

  companyList = [];
  branchList = [];
  projectList = [];
  itemList = [];
  batchList = [];
  SupplierList = [];
  CityAreaList = [];
  dataSource = [];
  gridPageSize: any;
  statusList = [{ name: "Open" }, { name: "Complete" }, { name: "Cancel" }];
  //approvedList = ["Approved", "Not Approved", "All"];
  approvedList = [{ name: "All" }, { name: "Approved" }, { name: "Not Approved" }];
  //==============================================================================
  DataForReportAgainstOutstandingPurchaseOrders = [];
  ChartDataForOutstandingPurchaseOrder = [];
  HeaderDataForReportAgainstOutstandingPurchaseOrders = new Array<HeaderArrayModelForReportAgainstOutstandingPurchaseOrder>();
  OutstandingPaddyPurchaseOrderDataList = [];
  OutstandingPaddyPurchaseOrderDataCount: number;
  InventoryParentCategoriesList = [];
  outstandingPaddyPurchaseOrderChartPanelVisibility: boolean = false;
  reportTypesList = [
    { Id: 1, name: "History Report" },
    { Id: 2, name: "Outstanding Reports" },
  ];
  ListOfDates = [
    { Id: 0, name: "Custom Date" },
    { Id: 1, name: "Today" },
    { Id: 2, name: "Current Week" },
    { Id: 3, name: "Current Month" },
    { Id: 4, name: "Current Year" },
  ];
  ReportType: any;
  configurationsList = [];
  ReportForOutstandingPurchaseOrderGridState: any;

  //==============================================================================
  //=======================VISIBILITIES===========================================
  OutstandingPaddyPurchaseOrderGridVisibility: boolean = false;
  pdfSrc: any;

  //==============================================================================
  constructor(private service: PurchaseOrderHistoryService, private route: ActivatedRoute, private commonService: CommonBaseService, private inventorycommon_service: InventoryCommonService) {
    super();
    this.popoverVisible = false;
    this.filter = false;
  }

  toggle() {
    this.popoverVisible = !this.popoverVisible;
  }

  filtering() {
    this.filter = !this.filter;
  }

  async ngOnInit() {
    this.breadCrumb("Inventory Reports", "Purchase Order History");
    this.ReportType = this.route.snapshot.queryParams["Id"];
    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.ReportForOutstandingPurchaseOrderGridState =
      sessionStorage.getItem("OrganizationId") + sessionStorage.getItem("CompanyName") + sessionStorage.getItem("UseriId") + "ReportForOutstandingPurchaseOrderGridState";
    this.InventoryParentCategories();
    // this.item();
    this.getBatch();
    // this.Supplier();
    this.PurchaseOrderCombos();
    // this.CityAreaGetAll();
    this.GetAllConfiguration();
    this.initForm();
    this.pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
    this.GenerateReportAccordingToRoutedReportType();
  }
  public initForm() {
    this.purchaseOrderHistoryFormData = new PurchaseRegisterModel();
    this.purchaseOrderHistoryFormData.dateType = this.ListOfDates[4].Id;
    this.purchaseOrderHistoryFormData.branch = this.branchList[0].Id;
    this.purchaseOrderHistoryFormData.CompanyId = this.companyList[0].Id;
    this.purchaseOrderHistoryFormData.project = this.projectList[0].Id;
    this.purchaseOrderHistoryFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.purchaseOrderHistoryFormData.ToDate = new Date();
    this.purchaseOrderHistoryFormData.FilterType = this.approvedList[0].name;
    this.purchaseOrderHistoryFormData.ReportType = this.reportTypesList[1].Id;
    this.OutstandingPaddyPurchaseOrderGridVisibility = true;
    this.FetchDataForOutstandingPurchaseOrderOnLoad();
  }
  //=======================ONINIT===============================
  GenerateReportAccordingToRoutedReportType() {
    if (GlobalConstant.InventoryDashboardRoutedReportType == "OutstandingPaddyPurchaseReport") {
      this.OutstandingPaddyPurchaseOrderGridVisibility = true;
      this.DataForReportsAgainstOutstandingPurchaseOrders();
      // this.purchaseOrderHistoryFormData.InventoryParentCateGory = this.InventoryParentCategoriesList[0].Id;
    }
  }

  //===========================================================
  //#region ComboFills

  //#region Supplier
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
  //#endregion
  //#region Item

  item() {
    this.inventorycommon_service.item({ CompanyId: sessionStorage.getItem("CompanyId"), OrganizationId: sessionStorage.getItem("OrganizationId") }).subscribe(
      (result) => {
        this.itemList = result;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //#endregion

  //#region InventoryParentCategories
  InventoryParentCategories() {
    this.service
      .InventoryParentCategories({
        Activity: "InventoryParentCategories",
      })
      .subscribe(
        (result) => {
          this.InventoryParentCategoriesList = result;
          this.purchaseOrderHistoryFormData.InventoryParentCateGory = this.InventoryParentCategoriesList[0].Id;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  //#endregion

  //#region getBatch
  getBatch() {
    this.service.getBatch().subscribe(
      (result) => (this.batchList = result),
      (error) => console.log(error)
    );
  }
  GetAllConfiguration() {
    this.commonService
      .configurations({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => {
          this.configurationsList = result;
          this.setDefaultValuesForCombos();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  //#endregion
  PurchaseOrderCombos() {
    this.service
      .PoCombos({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.itemList = result.filter(({ ActivityType }) => ActivityType == "Item");
          this.SupplierList = result.filter(({ ActivityType }) => ActivityType == "Supplier");
          this.CityAreaList = result.filter(({ ActivityType }) => ActivityType == "City");
        },
        (error) => {
          console.log(error);
        }
      );
  }
  //#region  Defalult valus for Combos
  setDefaultValuesForCombos() {
    for (let { ConfigDescription, ConfigKey } of this.configurationsList) {
      if (ConfigDescription == "Default Crop Year") {
        let newList = [];
        newList = this.batchList.filter(({ Id }) => Id == parseInt(ConfigKey));
        this.purchaseOrderHistoryFormData.Crop = newList[0].CropYear;
      }
    }
  }
  //#endregion
  //#region  CityArea
  CityAreaGetAll() {
    this.service
      .CityAreaGetAll({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.CityAreaList = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  //#endregion
  //#endregion

  //#region Generating Report according to selected Report type
  GenerateReport() {
    if (validate(this.purchaseOrderHistoryForm)) {
      if (this.purchaseOrderHistoryFormData.ReportType == 1) {
        this.OutstandingPaddyPurchaseOrderGridVisibility = false;
        this.HistoryRegisterVisibility = true;
        this.GenerateHisotoryGridData();
      } else {
        this.HistoryRegisterVisibility = false;
        this.OutstandingPaddyPurchaseOrderGridVisibility = true;
        this.DataForReportsAgainstOutstandingPurchaseOrders();
      }
    }
  }
  //#endregion

  //#region Rejected Logic
  OpenReportsPanel() {
    this.popoverVisible = !this.popoverVisible;
  }

  //#endregion

  //#region DesingBomb
  onRowPrepared(e) {
    if (e.rowType == "data") {
      e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");
      e.rowElement.style.backgroundColor = "#36e8eb";
      e.rowElement.style.fontWeight = "bold";
      e.rowElement.style.fontSize = "16px";
    }
  }
  //#endregion

  //==================================================================

  //#region Fetching Data for outstanding Purchase orders
  DataForReportsAgainstOutstandingPurchaseOrders() {
    this.service
      .DataForReportsAgainstOutstandingPurchaseOrders({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ItemCategoryId: this.purchaseOrderHistoryFormData.InventoryParentCateGory,
        FromDate: this.purchaseOrderHistoryFormData.FromDate,
        ToDate: this.purchaseOrderHistoryFormData.ToDate,
        CropYear: this.purchaseOrderHistoryFormData.Crop,
      })
      .subscribe(
        (result) => {
          this.DataForReportAgainstOutstandingPurchaseOrders = result;
          this.HeaderDataForReportAgainstOutstandingPurchaseOrders = [];
          for (let i = 0; i < result.length; i++) {
            let flag = false;
            let rowNumber = 1;
            if (i == 0) {
              this.HeaderDataForReportAgainstOutstandingPurchaseOrders.push({
                RowNumber: 1,
                ItemName: result[i].ItemName,
                Crop: result[i].Crop,
                MaxRatebyItemCrop: result[i].MaxRatebyItemCrop,
                MinRateByItemCrop: result[i].MinRateByItemCrop,
                itemQty: result[i].itemQty,
                ItemWeight: result[i].ItemWeight,
                ItemAmount: result[i].ItemAmount,
                ItemAvgRate: result[i].ItemAvgRate,
              });
            }
            if (i > 0) {
              for (let j = 0; j < this.HeaderDataForReportAgainstOutstandingPurchaseOrders.length; j++) {
                if (result[i].ItemName == this.HeaderDataForReportAgainstOutstandingPurchaseOrders[j].ItemName) {
                  flag = true;
                }
              }
              if (flag == false) {
                this.HeaderDataForReportAgainstOutstandingPurchaseOrders.push({
                  RowNumber: this.HeaderDataForReportAgainstOutstandingPurchaseOrders.length + 1,
                  ItemName: result[i].ItemName,
                  Crop: result[i].Crop,
                  MaxRatebyItemCrop: result[i].MaxRatebyItemCrop,
                  MinRateByItemCrop: result[i].MinRateByItemCrop,
                  itemQty: result[i].itemQty,
                  ItemWeight: result[i].ItemWeight,
                  ItemAmount: result[i].ItemAmount,
                  ItemAvgRate: result[i].ItemAvgRate,
                });
              }
            }
          }
          this.OutstandingPaddyPurchaseOrderDataCount = this.HeaderDataForReportAgainstOutstandingPurchaseOrders.length;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  FetchDataForOutstandingPurchaseOrderOnLoad() {
    this.service
      .DataForReportsAgainstOutstandingPurchaseOrders({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ItemCategoryId: 1,
        FromDate: this.purchaseOrderHistoryFormData.FromDate,
        ToDate: this.purchaseOrderHistoryFormData.ToDate,
        CropYear: this.purchaseOrderHistoryFormData.Crop,
      })
      .subscribe(
        (result) => {
          this.DataForReportAgainstOutstandingPurchaseOrders = result;
          this.HeaderDataForReportAgainstOutstandingPurchaseOrders = [];
          for (let i = 0; i < result.length; i++) {
            let flag = false;
            let rowNumber = 1;
            if (i == 0) {
              this.HeaderDataForReportAgainstOutstandingPurchaseOrders.push({
                RowNumber: 1,
                ItemName: result[i].ItemName,
                Crop: result[i].Crop,
                MaxRatebyItemCrop: result[i].MaxRatebyItemCrop,
                MinRateByItemCrop: result[i].MinRateByItemCrop,
                itemQty: result[i].itemQty,
                ItemWeight: result[i].ItemWeight,
                ItemAmount: result[i].ItemAmount,
                ItemAvgRate: result[i].ItemAvgRate,
              });
            }
            if (i > 0) {
              for (let j = 0; j < this.HeaderDataForReportAgainstOutstandingPurchaseOrders.length; j++) {
                if (result[i].ItemName == this.HeaderDataForReportAgainstOutstandingPurchaseOrders[j].ItemName) {
                  flag = true;
                }
              }
              if (flag == false) {
                this.HeaderDataForReportAgainstOutstandingPurchaseOrders.push({
                  RowNumber: this.HeaderDataForReportAgainstOutstandingPurchaseOrders.length + 1,
                  ItemName: result[i].ItemName,
                  Crop: result[i].Crop,
                  MaxRatebyItemCrop: result[i].MaxRatebyItemCrop,
                  MinRateByItemCrop: result[i].MinRateByItemCrop,
                  itemQty: result[i].itemQty,
                  ItemWeight: result[i].ItemWeight,
                  ItemAmount: result[i].ItemAmount,
                  ItemAvgRate: result[i].ItemAvgRate,
                });
              }
            }
          }
          this.OutstandingPaddyPurchaseOrderDataCount = this.HeaderDataForReportAgainstOutstandingPurchaseOrders.length;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  //#endregion

  //==================================================================
  //#region HndleChangeOfDateType
  HndleChangeOfDateType = (e) => {
    if (e.value == 1) {
      this.purchaseOrderHistoryFormData.FromDate = new Date();
      this.purchaseOrderHistoryFormData.ToDate = new Date();

      // this.uptoDate=this.datePipe.transform(this.InventoryDashboardFormData.toDate, 'dd-MM-yyy')
    }
    if (e.value == 2) {
      this.purchaseOrderHistoryFormData.FromDate = this.getMonday(new Date());
      this.purchaseOrderHistoryFormData.ToDate = new Date();
      // this.uptoDate=this.datePipe.transform(this.purchaseOrderHistoryFormData.ToDate, 'dd-MM-yyy')
    }
    if (e.value == 3) {
      let my_date = new Date();
      let monthfirstdate = new Date(my_date.getFullYear(), my_date.getMonth(), 1);
      this.purchaseOrderHistoryFormData.FromDate = monthfirstdate;
      this.purchaseOrderHistoryFormData.ToDate = new Date();
      // this.uptoDate=this.datePipe.transform(this.purchaseOrderHistoryFormData.ToDate, 'dd-MM-yyy')
    }
    if (e.value == 4) {
      var Year = new Date(new Date().getFullYear(), 0, 1);
      this.purchaseOrderHistoryFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
      this.purchaseOrderHistoryFormData.ToDate = new Date();
      // this.uptoDate=this.datePipe.transform(this.purchaseOrderHistoryFormData.ToDate, 'dd-MM-yyy')
    }
  };
  getMonday(d = new Date()) {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }
  //#endregion
  //#region Fetching Data for History Register Grid
  GenerateHisotoryGridData() {
    const result: any = this.purchaseOrderHistoryForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.purchaseOrderHistoryFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.purchaseOrderHistoryFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.purchaseOrderHistoryFormData.DocumentTypeId = 41;
      if (this.purchaseOrderHistoryFormData.FilterType === "Approved") {
        this.purchaseOrderHistoryFormData.IsApproved = true;
        this.purchaseOrderHistoryFormData.ApprovedFilter = null;
      }
      if (this.purchaseOrderHistoryFormData.FilterType === "Not Approved") {
        this.purchaseOrderHistoryFormData.IsApproved = false;
        this.purchaseOrderHistoryFormData.ApprovedFilter = null;
      }
      if (this.purchaseOrderHistoryFormData.FilterType === "All") {
        this.purchaseOrderHistoryFormData.ApprovedFilter = "All";
      }

      this.service.purchaseorderhistory(this.purchaseOrderHistoryFormData).subscribe(
        (result) => {
          this.dataSource = result;
          this.gridPageSize = [100, 200, result.length];
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  //#endregion
  //#region PdfReportForOutstandingPurchaseOrder
  PdfReportForOutstandingPurchaseOrder() {
    this.service
      .InvOutstandingPurchaseOrderRptByAvgRate_207({
        //Compulosry
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        FromDate: this.purchaseOrderHistoryFormData.FromDate,
        ToDate: this.purchaseOrderHistoryFormData.ToDate,
        ReportName: "207-OutstandingPurchaseOrderByItem&Supplier&Avg.Rate",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => {
          notify(error.ExceptionMessage, "error");
        }
      );
  }

  //#endregion
  //#region ReportRegister205

  ReportRegister205() {
    if (this.purchaseOrderHistoryFormData) {
      if (this.purchaseOrderHistoryFormData.FilterType === "Approved") {
        this.purchaseOrderHistoryFormData.IsApproved = true;
      }
      if (this.purchaseOrderHistoryFormData.FilterType === "Not Approved") {
        this.purchaseOrderHistoryFormData.IsApproved = false;
      }
      if (this.purchaseOrderHistoryFormData.FilterType === "All") {
        this.purchaseOrderHistoryFormData.ApprovedFilter = "All";
      }

      this.service
        .InvRptPurchaseOrderDetailRegisterRice_205({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.purchaseOrderHistoryFormData.FromDate,
          ToDate: this.purchaseOrderHistoryFormData.ToDate,
          FromDocNo: this.purchaseOrderHistoryFormData.FromDocNo,
          ToDocNo: this.purchaseOrderHistoryFormData.ToDocNo,
          SupplierCustomerId: this.purchaseOrderHistoryFormData.SupplierCustomerId,
          ItemId: this.purchaseOrderHistoryFormData.ItemId,
          Status: this.purchaseOrderHistoryFormData.Status,
          IsApproved: this.purchaseOrderHistoryFormData.IsApproved,
          ApprovedFilter: this.purchaseOrderHistoryFormData.ApprovedFilter,
          ReportName: "205-InvRptPurchaseOrderDetailRegisterRice",
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
  //#endregion
  //#region ReportRegister206

  ReportRegister206() {
    if (this.purchaseOrderHistoryFormData) {
      if (this.purchaseOrderHistoryFormData.FilterType === "Approved") {
        this.purchaseOrderHistoryFormData.IsApproved = true;
      }
      if (this.purchaseOrderHistoryFormData.FilterType === "Not Approved") {
        this.purchaseOrderHistoryFormData.IsApproved = false;
      }
      if (this.purchaseOrderHistoryFormData.FilterType === "All") {
        this.purchaseOrderHistoryFormData.ApprovedFilter = "All";
      }

      this.service
        .RptPurchaseOrderRegisterRice_206({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.purchaseOrderHistoryFormData.FromDate,
          ToDate: this.purchaseOrderHistoryFormData.ToDate,
          FromDocNo: this.purchaseOrderHistoryFormData.FromDocNo,
          ToDocNo: this.purchaseOrderHistoryFormData.ToDocNo,
          SupplierCustomerId: this.purchaseOrderHistoryFormData.SupplierCustomerId,
          ItemId: this.purchaseOrderHistoryFormData.ItemId,
          Status: this.purchaseOrderHistoryFormData.Status,
          IsApproved: this.purchaseOrderHistoryFormData.IsApproved,
          ApprovedFilter: this.purchaseOrderHistoryFormData.ApprovedFilter,
          ReportName: "206-RptPurchaseOrderRegisterRice",
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
  //#endregion
  //#region   ReportSlip203
  ReportSlip203 = (e) => {
    if (this.purchaseOrderHistoryFormData) {
      if (this.purchaseOrderHistoryFormData.FilterType === "Approved") {
        this.purchaseOrderHistoryFormData.IsApproved = true;
      }
      if (this.purchaseOrderHistoryFormData.FilterType === "Not Approved") {
        this.purchaseOrderHistoryFormData.IsApproved = false;
      }
      if (this.purchaseOrderHistoryFormData.FilterType === "All") {
        this.purchaseOrderHistoryFormData.ApprovedFilter = "All";
      }

      this.service
        .InvRptPurchaseOrderRiceSlip_203({
          OrderId: e.Id,
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          Status: this.purchaseOrderHistoryFormData.Status,
          IsApproved: this.purchaseOrderHistoryFormData.IsApproved,
          ApprovedFilter: this.purchaseOrderHistoryFormData.ApprovedFilter,
          ReportName: "203-InvRptPurchaseOrderRiceSlip",
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
  //#endregion
  //#region GenerateDataForCharts

  GenerateDataForChart(data) {
    this.ChartDataForOutstandingPurchaseOrder = [];
    for (let i = 0; i < this.OutstandingPaddyPurchaseOrderDataCount; i++) {
      if (i == 0) {
        this.ChartDataForOutstandingPurchaseOrder[i] = new Array<model>();
        for (let j = 0; j < data.length; j++) {
          let flag = false;
          if (j == 0) {
            this.ChartDataForOutstandingPurchaseOrder[i].push({
              ItemName: data[j].ItemName,
              Supplier: data[j].Supplier,
              MaxRatebyItemCropSupplier: data[j].MaxRatebyItemCropSupplier,
              MinRateByItemCropSupplier: data[j].MinRateByItemCropSupplier,
              AvgRate: data[j].AvgRate,
              Qty: data[j].Qty,
              OrderWeight: data[j].OrderWeight,
              TotalItemQuantity: this.formatNumber(parseInt(data[j].itemQty.toFixed(0))),
              TotalItemWeight: this.formatNumber(parseInt(data[j].ItemWeight.toFixed(0))),
            });
          } else if (j > 0) {
            for (let z = 0; z < this.ChartDataForOutstandingPurchaseOrder[i].length; z++) {
              if (this.ChartDataForOutstandingPurchaseOrder[i][z].ItemName != data[j].ItemName) {
                flag = true;
              }
            }
            if (flag == false) {
              this.ChartDataForOutstandingPurchaseOrder[i].push({
                ItemName: data[j].ItemName,
                Supplier: data[j].Supplier,
                MaxRatebyItemCropSupplier: data[j].MaxRatebyItemCropSupplier,
                MinRateByItemCropSupplier: data[j].MinRateByItemCropSupplier,
                AvgRate: data[j].AvgRate,
                Qty: data[j].Qty,
                OrderWeight: data[j].OrderWeight,
                TotalItemQuantity: this.formatNumber(parseInt(data[j].itemQty.toFixed(0))),
                TotalItemWeight: this.formatNumber(parseInt(data[j].ItemWeight.toFixed(0))),
              });
            }
          }
        }
      } else if (i > 0) {
        this.ChartDataForOutstandingPurchaseOrder[i] = new Array<model>();

        for (let j = 0; j < data.length; j++) {
          let flag = false;

          for (let c = 0; c < this.ChartDataForOutstandingPurchaseOrder.length; c++) {
            if (c != i) {
              if (data[j].ItemName == this.ChartDataForOutstandingPurchaseOrder[c][0].ItemName) {
                flag = true;
              }
            }
          }
          if (flag == false) {
            this.ChartDataForOutstandingPurchaseOrder[i].push({
              ItemName: data[j].ItemName,
              Supplier: data[j].Supplier,
              MaxRatebyItemCropSupplier: data[j].MaxRatebyItemCropSupplier,
              MinRateByItemCropSupplier: data[j].MinRateByItemCropSupplier,
              AvgRate: data[j].AvgRate,
              Qty: data[j].Qty,
              OrderWeight: data[j].OrderWeight,
              TotalItemQuantity: this.formatNumber(parseInt(data[j].itemQty.toFixed(0))),
              TotalItemWeight: this.formatNumber(parseInt(data[j].ItemWeight.toFixed(0))),
            });
          }
        }
      }
    }
  }

  formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  //#endregion

  clear() {
    this.purchaseOrderHistoryForm.instance.resetValues();
  }

  OutstandingPurchaseOrdersRptGridToolbarPreparing(event) {
    event.toolbarOptions.items.unshift(
      {
        localtion: "before",
        template: "OutstandingPaddyPurchaseOrderCount",
      },
      // {
      //   location: "after",

      //   widget: "dxButton",
      //   options: {
      //     id: "outstandingPaddyPurchaseOrderChartButton",
      //     icon: "chart",
      //     hint: "Chart",
      //     onClick: this.showChartForOutstandingPaddyPurchaseOrders.bind(this),
      //   },
      // },
      {
        location: "after",

        widget: "dxButton",
        options: {
          id: "outstandingPaddyPurchaseOrderPdfRegsiterButton",
          icon: "print",
          hint: "Pdf Report",
          onClick: this.openPdfReportForOutstandingPurchaseOrder.bind(this),
        },
      },
      {
        location: "after",
        widget: "dxButton",
        options: {
          icon: "refresh",
          hint: "Refresh",
          onClick: this.refreshDataGrid.bind(this),
        },
      },
      {
        location: "after",

        widget: "dxButton",
        options: {
          id: "historyGridFilterButton",
          icon: "filter",
          hint: "Filter",
          onClick: this.filtering.bind(this),
        },
      }
    );
  }
  onToolbarPreparing(event) {}

  HistoryRegisterGridToolbarPreparing(event) {
    event.toolbarOptions.items.unshift(
      {
        localtion: "berfore",
        template: "HistoryRegisterGridTitleTemplate",
      },
      {
        location: "after",

        widget: "dxButton",
        options: {
          id: "historyRegisterReportButton_203",
          icon: "print",
          hint: "Pdf Register 205",
          onClick: this.ReportRegister205.bind(this),
        },
      },
      {
        location: "after",

        widget: "dxButton",
        options: {
          id: "historyRegisterReportButton_206",
          icon: "print",
          hint: "Pdf Register 206",
          onClick: this.ReportRegister206.bind(this),
        },
      },
      {
        location: "after",

        widget: "dxButton",
        options: {
          id: "historyGridFilterButton",
          icon: "filter",
          hint: "Filter",
          onClick: this.filtering.bind(this),
        },
      }
    );
  }

  //#region HistoryGridFunctionalitiesByMr.Sufi:
  onCancel(e) {
    if (e.OrderStatus == "Open") {
      this.service
        .updatestatusandapproved({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          ReqType: "Cancel",
          Id: e.Id,
        })
        .subscribe(
          (result) => {
            notify("Order Status  Canceled  Successfully", "success");
            this.GenerateHisotoryGridData();
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      notify("You cannot revert status!", "error");
    }
  }

  onComplete(e) {
    if (e.OrderStatus == "Open") {
      this.service
        .updatestatusandapproved({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          ReqType: "Status",
          Id: e.Id,
        })
        .subscribe(
          (result) => {
            notify("Order Status Completed  Successfully", "success");
            this.GenerateHisotoryGridData();
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      notify("You cannot revert status!", "error");
    }
  }

  //#endregion

  openPdfReportForOutstandingPurchaseOrder() {
    this.PdfReportForOutstandingPurchaseOrder();
  }
  showChartForOutstandingPaddyPurchaseOrders() {
    this.GenerateDataForChart(this.DataForReportAgainstOutstandingPurchaseOrders);
    this.outstandingPaddyPurchaseOrderChartPanelVisibility = !this.outstandingPaddyPurchaseOrderChartPanelVisibility;
  }
  refreshDataGrid() {
    this.OutstandingPaddyPurchaseOrdersGrid.instance.refresh();
  }
}
