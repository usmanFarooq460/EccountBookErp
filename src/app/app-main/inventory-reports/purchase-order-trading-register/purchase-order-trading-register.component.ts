import { Component, OnInit, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { PurchaseOrderTradingRegisterModel } from "./purchase-order-trading-register.model";
import { PurchaseOrderTradingRegisterService } from "./purchase-order-trading-register.service";

@Component({
  selector: "app-purchase-order-trading-register",
  templateUrl: "./purchase-order-trading-register.component.html",
  styleUrls: ["/src/assets/scss/custom/components/_stickyGrid.scss"],
})
export class PurchaseOrderTradingRegisterComponent extends BaseActions implements OnInit {
  @ViewChild("purchaseOrderTradingRegister", { static: false })
  purchaseOrderTradingRegister: DxDataGridComponent;

  @ViewChild("PurchaseOrderTradingRegisterComponentForm", { static: false })
  PurchaseOrderTradingRegisterComponentForm: DxFormComponent;
  PurchaseOrderTradingRegisterComponentData: PurchaseOrderTradingRegisterModel;

  dataSource = [];
  supplierList: any;
  itemList: any;
  jobLotList: any;
  headerArray = [];

  constructor(private commonMethods: CommonMethodsForCombos, private service: PurchaseOrderTradingRegisterService) {
    super();
  }

  async ngOnInit() {
    this.breadCrumb("Inventory Reports", "Purchase Order Trading Register");
    this.supplierList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetSupplierCustomer());
    this.itemList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.ItemsGetAll());
    this.initForm();
    this.filtering();
    this.GetAll();
  }

  ngOnDestroy(): void {
    this.dataSource = [];
    this.headerArray = [];
  }

  public initForm() {
    this.PurchaseOrderTradingRegisterComponentData = new PurchaseOrderTradingRegisterModel();
    this.PurchaseOrderTradingRegisterComponentData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.PurchaseOrderTradingRegisterComponentData.ToDate = new Date();
  }

  GetAll() {
    this.ActivateLoadPanel("Fetching Data");
    this.service
      .PurchaseOrderDetailRegister({
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        DocumentTypeId: 42,
        SupplierCustomerId: this.PurchaseOrderTradingRegisterComponentData.SupplierCustomerId,
        ItemId: this.PurchaseOrderTradingRegisterComponentData.ItemId,
        FromDate: this.PurchaseOrderTradingRegisterComponentData.FromDate,
        ToDate: this.PurchaseOrderTradingRegisterComponentData.ToDate,
        ApprovedFilter: "All",
        IsApproved: true,
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          if (result == null || result == undefined) {
            result = [];
          }
          this.dataSource = [];
          this.headerArray = [];
          console.log(result);
          this.dataSource = result;
          this.headerArray = this.GenerateHeaderData(result, "Id");
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }

  RptPurchaseOrderRegisterRice_206() {
    this.ActivateLoadPanel("Loading Data");
    this.service
      .RptPurchaseOrderRegisterRice_206({
        //Compulosry
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        DocumentTypeId: 42,
        SupplierCustomerId: this.PurchaseOrderTradingRegisterComponentData.SupplierCustomerId,
        ItemId: this.PurchaseOrderTradingRegisterComponentData.ItemId,
        FromDate: this.PurchaseOrderTradingRegisterComponentData.FromDate,
        ToDate: this.PurchaseOrderTradingRegisterComponentData.ToDate,
        ApprovedFilter: "All",
        IsApproved: true,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        UserName: sessionStorage.getItem("DisplayName"),
        ReportName: "278-PurchaseOrderTradingRegister",
      })
      .subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          window.open(result);
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
  }
  onToolPreparingOfHistoryGrid = (e) => {
    this.RefreshButtonInGridToolbar(e, () => this.RefreshHistoryGridGrid(this.GetAll.bind(this), this.HistoryGridSateKey("purchaseOrderTradingRegister"), this.purchaseOrderTradingRegister));
    this.FilterButtonInGridToolbar(e);
    this.HistoryGridExpanAllRowButton(e, () => this.ExpanAllRows(this.purchaseOrderTradingRegister));
    this.ReportButtonInGridToolbar(e, "278-Purchase Order Trading Register", this.RptPurchaseOrderRegisterRice_206.bind(this));
  };
}
