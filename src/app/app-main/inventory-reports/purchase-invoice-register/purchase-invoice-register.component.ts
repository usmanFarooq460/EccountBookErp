import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { PurchaseInvoiceHistoryService } from "./purchase-invoice-register.service";
import { InventoryCommonService } from "../Inventorycommon.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { PurchaseInvoiceModel } from "./purchase-invoice-register.model";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";

@Component({
  selector: "app-purchase-invoice-register",
  templateUrl: "./purchase-invoice-register.component.html",
  styleUrls: ["./purchase-invoice-register.scss","/src/assets/scss/custom/components/_gridHeading.scss"],
})
export class PurchaseInvoiceRegisterComponent extends BaseActions implements OnInit {
  @ViewChild("PurchaseHistoryGrid", { static: false })
  PurchaseHistoryGrid: DxDataGridComponent;

  @ViewChild("AverageRateByItemGrid", { static: false })
  AverageRateByItemGrid: DxDataGridComponent;

  @ViewChild("AverageRateBySupplierGrid", { static: false })
  AverageRateBySupplierGrid: DxDataGridComponent;
  @ViewChild("RiceAndPaddyPurchaseReportGrid", { static: false })
  RiceAndPaddyPurchaseReportGrid: DxDataGridComponent;

  @ViewChild("purchaseInvoiceHistoryForm", { static: false })
  purchaseInvoiceHistoryForm: DxFormComponent;
  purchaseInvoiceHistoryFormData: PurchaseInvoiceModel;
  showPurchseInvoiceHistoryGrid: boolean;
  showAvgRateBySupplierGrid: boolean;
  showAvgRateByItemGrid: boolean;
  RiceAndPaddyPurchaseReport: boolean;
  companyList = [];
  branchList = [];
  projectList = [];
  itemList :any;
  SupplierList:any;
  dataSource = [];
  reportType = [
    { type: "Current & Total Purchases", Id: 4 },
    { type: "Avg Rate By Item", Id: 1 },
    { type: "Avg Rate By Supplier", Id: 2 },
    { type: "Purchase Detail", Id: 3 },
  ];
  detailOnBasisOFPurchseDetail = [];
  detailOnBasisOfAvgRateByItem = [];
  detailOnBasisOfAvgRateBySupplier = [];
  PurchaseOfRiceAndPaddyReportList = [];
  InventoryParentCategoriesList = [];
  AverageRateBySupplierReportGridPageSize: any;
  batchList = [];
  configurationsList = [];
  typeOfReport;
  constructor(private service: PurchaseInvoiceHistoryService,private commonMethods:CommonMethodsForCombos ,private commonService: CommonBaseService, private inventorycommon_service: InventoryCommonService) {
    super();
    this.popoverVisible = false;
    this.filter = false;
  }

  toggle() {
    this.popoverVisible = !this.popoverVisible;
  }



  async ngOnInit() {
    this.breadCrumb("Inventory Reports", "Purchase Invoice Register");

    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.InventoryParentCategoriesList=await this.commonMethods.InventoryParentCategories();

    this.batchList= await this.commonMethods.CropYear();
   
    this.itemList= await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetItemsForComboBind());
    this.SupplierList=await   this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.SupplierCustomerByOrganizationAndCompany())
    this.GetAllConfiguration();

    this.initForm();
  }

  public initForm() {
    this.purchaseInvoiceHistoryFormData = new PurchaseInvoiceModel();
    this.purchaseInvoiceHistoryFormData.ToDate = new Date();
    this.purchaseInvoiceHistoryFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.showAvgRateBySupplierGrid = false;
    this.showPurchseInvoiceHistoryGrid = false;
    this.showAvgRateByItemGrid = false;
    this.RiceAndPaddyPurchaseReport = true;
    this.purchaseInvoiceHistoryFormData.InventoryParentCateGory=this.InventoryParentCategoriesList[0].Id
    this.purchaseInvoiceHistoryFormData.reportType = this.reportType[0].Id;
    this.GetPurchaseReportForRiceAndPaddyOnLoad();
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
  setDefaultValuesForCombos() {
    for (let { ConfigDescription, ConfigKey } of this.configurationsList) {
      if (ConfigDescription == "Default Crop Year") {
        let newList = [];
        newList = this.batchList.filter(({ Id }) => Id == parseInt(ConfigKey));
        this.purchaseInvoiceHistoryFormData.Crop = newList[0].CropYear;
      }
    }
  }

  PurchaseInvoiceHistoryGET() {
    this.ActivateLoadPanel("Loading Data!")
    this.service
      .onBasisOfPurchaseHistory({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        ToDocNo: this.purchaseInvoiceHistoryFormData.ToDocNo,
        FromDocNo: this.purchaseInvoiceHistoryFormData.FromDocNo,
        FromDate: this.purchaseInvoiceHistoryFormData.FromDate,
        ToDate: this.purchaseInvoiceHistoryFormData.ToDate,
        ItemId: this.purchaseInvoiceHistoryFormData.ItemId,
        SupplierCustomerId: this.purchaseInvoiceHistoryFormData.SupplierCustomerId,
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.detailOnBasisOFPurchseDetail = result;
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
          console.log(error);
        }
      );
  }

  GetPurchaseReportForRiceAndPaddy() {
    this.ActivateLoadPanel("Loading Data")
    this.service
      .RicePaddyPuchaseReport({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        FromDate: this.purchaseInvoiceHistoryFormData.FromDate,
        ToDate: this.purchaseInvoiceHistoryFormData.ToDate,
        ItemId: this.purchaseInvoiceHistoryFormData.ItemId,
        CropYear: this.purchaseInvoiceHistoryFormData.Crop,
        InventoryParentCategories: this.purchaseInvoiceHistoryFormData.InventoryParentCateGory,
        ActivityId: 1
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          console.log(result);
          this.PurchaseOfRiceAndPaddyReportList = result;
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error)
        }
      );
  }

  GetPurchaseReportForRiceAndPaddyOnLoad() {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .RicePaddyPuchaseReport({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        FromDate: this.purchaseInvoiceHistoryFormData.FromDate,
        ToDate: this.purchaseInvoiceHistoryFormData.ToDate,
        ItemId: this.purchaseInvoiceHistoryFormData.ItemId,
        CropYear: null,
        InventoryParentCategories: 1,
        ActivityId: 1
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.PurchaseOfRiceAndPaddyReportList = result;
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }

  // -----------------------------

  AvgRateByItemGet() {
    this.ActivateLoadPanel("Loading Data")
    this.service
      .onBasisOfAvgRateByItem({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        // ToDocNo: this.purchaseInvoiceHistoryFormData.ToDocNo,
        // FromDocNo: this.purchaseInvoiceHistoryFormData.FromDocNo,
        FromDate: this.purchaseInvoiceHistoryFormData.FromDate,
        ToDate: this.purchaseInvoiceHistoryFormData.ToDate,
        ItemId: this.purchaseInvoiceHistoryFormData.ItemId,
        SupplierCustomerId: this.purchaseInvoiceHistoryFormData.SupplierCustomerId,
        CropYear: this.purchaseInvoiceHistoryFormData.Crop,
        ItemCategoryId: this.purchaseInvoiceHistoryFormData.InventoryParentCateGory,
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel()
          this.detailOnBasisOfAvgRateByItem = result;
        },
        (error) => {
          this.DeActivateLoadPanel()
          this.HandleError(error);
        }
      );
  }

  AvgRateBySupplierGet() {
    this.ActivateLoadPanel("Loading Data")
    this.service
      .InvPurchaseInvoiceAvgRateBySupplier222({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        FromDate: this.purchaseInvoiceHistoryFormData.FromDate,
        ToDate: this.purchaseInvoiceHistoryFormData.ToDate,
        SupplierCustomerId: this.purchaseInvoiceHistoryFormData.SupplierCustomerId,
        ItemId: this.purchaseInvoiceHistoryFormData.ItemId,
        CropYear: this.purchaseInvoiceHistoryFormData.Crop,
        ItemCategoryId: this.purchaseInvoiceHistoryFormData.InventoryParentCateGory,
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.detailOnBasisOfAvgRateBySupplier = result;
          this.AverageRateBySupplierReportGridPageSize = [20, 300, 500, 1000, 2500, result.length];
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
          console.log(error);
        }
      );
  }

  getReportType = (e) => {
    this.typeOfReport = this.purchaseInvoiceHistoryFormData.reportType;
    return this.typeOfReport;
  };

  onSubmit() {
    const result: any = this.purchaseInvoiceHistoryForm.instance.validate();
    if (result.isValid == false) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.popoverVisible = false;
      if (this.typeOfReport == 3) {
        this.RiceAndPaddyPurchaseReport = false;
        this.showPurchseInvoiceHistoryGrid = true;
        this.showAvgRateByItemGrid = false;
        this.showAvgRateBySupplierGrid = false;
        this.PurchaseInvoiceHistoryGET();
      } else if (this.typeOfReport == 1) {
        this.RiceAndPaddyPurchaseReport = false;
        this.showPurchseInvoiceHistoryGrid = false;
        this.showAvgRateByItemGrid = true;
        this.showAvgRateBySupplierGrid = false;
        this.AvgRateByItemGet();
      } else if (this.typeOfReport == 2) {
        this.showPurchseInvoiceHistoryGrid = false;
        this.RiceAndPaddyPurchaseReport = false;
        this.showAvgRateByItemGrid = false;
        this.showAvgRateBySupplierGrid = true;
        this.AvgRateBySupplierGet();
      } else if (this.typeOfReport == 4) {
        this.showPurchseInvoiceHistoryGrid = false;
        this.showAvgRateByItemGrid = false;
        this.showAvgRateBySupplierGrid = false;
        this.RiceAndPaddyPurchaseReport = true;
        this.GetPurchaseReportForRiceAndPaddy();
      }
    }
  }

  ReportRegister221() {
  
      this.ActivateLoadPanel("Loading Report")
      this.service
        .InvRptPurchaseInvoicePurchaseAvgRateByItem_221({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.purchaseInvoiceHistoryFormData.FromDate,
          ToDate: this.purchaseInvoiceHistoryFormData.ToDate,
          ItemId: this.purchaseInvoiceHistoryFormData.ItemId,
          ReportName: "221-InvRptPurchaseInvoicePurchaseAvgRateByItem",
        })
        .subscribe(
          (result) => {
              this.DeActivateLoadPanel()
            window.open(result)},
          (error) => {
            this.DeActivateLoadPanel()
            this.HandleError(error);
          }
        );

  }

  // -----------------------------------------------

  ReportRegister222() {
 this.ActivateLoadPanel("Loading Report")
      this.service
        .InvRptPurchaseInvoicePurchaseAvgRateByItemSupplier_222({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.purchaseInvoiceHistoryFormData.FromDate,
          ToDate: this.purchaseInvoiceHistoryFormData.ToDate,
          ItemId: this.purchaseInvoiceHistoryFormData.ItemId,
          SupplierCustomerId: this.purchaseInvoiceHistoryFormData.SupplierCustomerId,
          ReportName: "222-InvRptPurchaseInvoicePurchaseAvgRateByItemSupplier",
        })
        .subscribe(
          (result) => 
          {this.DeActivateLoadPanel()
            window.open(result)},
          (error) => {
            this.DeActivateLoadPanel()
            this.HandleError(error)
          }
        );
 
  }
  ReportDetailRegister223() {
    this.ActivateLoadPanel("Loading Report")
      this.service
        .InvRptPurchaseRegisterDetail_223({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.purchaseInvoiceHistoryFormData.FromDate,
          ToDate: this.purchaseInvoiceHistoryFormData.ToDate,
          ToDocNo: this.purchaseInvoiceHistoryFormData.ToDocNo,
          FromDocNo: this.purchaseInvoiceHistoryFormData.FromDocNo,
          ItemId: this.purchaseInvoiceHistoryFormData.ItemId,
          SupplierCustomerId: this.purchaseInvoiceHistoryFormData.SupplierCustomerId,
          ReportName: "223-InvRptPurchaseRegisterDetail",
        })
        .subscribe(
          (result) =>{ 
            this.DeActivateLoadPanel();
            window.open(result)},
          (error) => {
            this.DeActivateLoadPanel()
            this.HandleError(error);
          }
        );

  }
  ReportRegister224() {
    this.ActivateLoadPanel("Loading Report")
      this.service
        .InvRptPurchaseBillRegister_224({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.purchaseInvoiceHistoryFormData.FromDate,
          ToDate: this.purchaseInvoiceHistoryFormData.ToDate,
          ToDocNo: this.purchaseInvoiceHistoryFormData.ToDocNo,
          FromDocNo: this.purchaseInvoiceHistoryFormData.FromDocNo,
          ItemId: this.purchaseInvoiceHistoryFormData.ItemId,
          SupplierCustomerId: this.purchaseInvoiceHistoryFormData.SupplierCustomerId,
          ReportName: "224-InvRptPurchaseBillRegister",
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel()
            window.open(result)
          },
          (error) => {
            this.DeActivateLoadPanel();
          this.HandleError(error);
          }
        );
  
  }

  RiceAndPaddyPurchaseReportPdf_231() {
   this.ActivateLoadPanel("Loading Report")
      this.service
        .RiceAndPaddyPurchaseReportPdf_231({
          //Compulosry
          OrganizationId: this.commonService.OrganizationId(),
          CompanyId: this.commonService.CompanyId(),
          CompanyAddress: sessionStorage.getItem("CompanyAddress"),
          CompanyName: sessionStorage.getItem("CompanyName"),
          FromDate: this.purchaseInvoiceHistoryFormData.FromDate,
          ToDate: this.purchaseInvoiceHistoryFormData.ToDate,
          ItemId: this.purchaseInvoiceHistoryFormData.ItemId,
          CropYear: this.purchaseInvoiceHistoryFormData.Crop,
          ItemCategoryId: this.purchaseInvoiceHistoryFormData.InventoryParentCateGory,
          ReportName: "231-RicePaddyPurchaseRpt",
        })
        .subscribe(
          (result) => {
            this.DeActivateLoadPanel()
            window.open(result)},
          (error) => {
            this.DeActivateLoadPanel()
            this.HandleError(error);
          }
        );
 
  }

  clear() {
    this.purchaseInvoiceHistoryForm.instance.resetValues();
  }

  //#region  ToolbarPreparings
  AverageRateByItemToolbarPreparing(event) {
    this.GridHeadingInToolbar(event,"AverageRateByItemGridTitleTemplate");
    this.ReportButtonInGridToolbar(event,"221_Rate Comparison By Item Report",this.ReportRegister221.bind(this))
    this.RefreshButtonInGridToolbar(event,this.RefreshHistoryGridGrid(()=>this.AvgRateByItemGet.bind(this),this.HistoryGridSateKey("AverageRateByItemGridStateInPurchaseRegister"),this.AverageRateByItemGrid ))
    this.FilterButtonInGridToolbar(event);
  }

  PurchaseHistorGridToolbarPreparing(event) {
    this.GridHeadingInToolbar(event,"PurchaseHistoryGridTemplate");
    this.ReportButtonInGridToolbar(event,"224_Purchase Summary Register", this.ReportRegister224.bind(this))
    this.ReportButtonInGridToolbar(event,"223_Purchase Detail Register", this.ReportDetailRegister223.bind(this))
    this.FilterButtonInGridToolbar(event);
 this.RefreshButtonInGridToolbar(event,this.RefreshHistoryGridGrid(()=>this.PurchaseInvoiceHistoryGET.bind(this),this.HistoryGridSateKey("PurchaseHistoryGridStateInPuchaseRegister"),this.PurchaseHistoryGrid ))

  }

  AverageRateBySupplierGridToolbarPreparing(event) {
    this.GridHeadingInToolbar(event,"AverageRateBySupplierGridTitleTemplate")
    this.ReportButtonInGridToolbar(event,"222_ Rate Comparison By Supplier Report",this.ReportRegister222.bind(this))
    this.RefreshButtonInGridToolbar(event,this.RefreshHistoryGridGrid(()=>this.AvgRateBySupplierGet.bind(this),this.HistoryGridSateKey("AverageRateBySupplierGridStateInPurchaseRegister"),this.AverageRateBySupplierGrid ))
    this.FilterButtonInGridToolbar(event);

  }
  RiceAndPaddyReportGridToolbarPreparing(event) {
    this.GridHeadingInToolbar(event,"RicePaddyPurchaseReportGridTitle");
    this.ReportButtonInGridToolbar(event,"231_Current And Total Purchases Report",this.RiceAndPaddyPurchaseReportPdf_231.bind(this) )
    this.FilterButtonInGridToolbar(event);
    this.RefreshButtonInGridToolbar(event,this.RefreshHistoryGridGrid(()=>this.GetPurchaseReportForRiceAndPaddy.bind(this),this.HistoryGridSateKey("RiceAndPaddyPurchaseReportGridStateInPurchaseRegiser"),this.RiceAndPaddyPurchaseReportGrid ))
  }

  RiceAndPaddyPurchaseReportRowPrepared(e) {
    if (e.rowType == "header") {
      e.rowElement.style.backgroundColor = "#3fbbe8";
      e.rowElement.style.fontWeight = "bold";
      e.rowElement.style.fontSize = "16px";
      e.rowElement.style.color = "#000000";
    }
    if (e.rowType == "totalFooter") {
      e.rowElement.style.backgroundColor = "#3fbbe8";
      e.rowElement.style.fontWeight = "bold";
      e.rowElement.style.fontSize = "18px";
      e.rowElement.style.color = "#000000";
    }
    if (e.rowType == "groupFooter") {
      e.rowElement.style.backgroundColor = "#000000";
      e.rowElement.style.fontWeight = "bold";
      e.rowElement.style.fontSize = "16px";
      e.rowElement.style.color = "#000000";
    }
  }



  //#endregion
}
