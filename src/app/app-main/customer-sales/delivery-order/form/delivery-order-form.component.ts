import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { validate } from "src/app/shared/Base/validationHelper";
import {  DeliveryOrderModel, DeliveryOrderDetailModel } from "../delivery-order.model";
import { DeliveryOrderService } from "../delivery-order.service";
import notify from "devextreme/ui/notify";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import DataSource from "devextreme/data/data_source";

@Component({
  selector: "app-delivery-order-form",
  templateUrl: "./delivery-order-form.component.html",
  styleUrls: [],
})
export class DeliveryOrderFormComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  popupGrid: DxDataGridComponent;
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild(DxDataGridComponent, { static: false })
  availableTransactionsGrid: DxDataGridComponent;
  @ViewChild("DeliveryOrderForm", { static: false }) //POF = PurchaseOrderForm
  DeliveryOrderForm: DxFormComponent;
  DeliveryOrderFormData: DeliveryOrderModel; //PurchaseOrderData => formObject
  @ViewChild("DeliveryOrderDetailForm", { static: false }) //POF = PurchaseOrderDetailForm
  DeliveryOrderDetailForm: DxFormComponent;
  DeliveryOrderDetailFormData: DeliveryOrderDetailModel; //SaleOrderDetail = formObject
  companyList = [];
  supplierNameList: any;
  DocTypeIdList = [];
  PackingTypeList = [];
  PackingTypeListForLookupColumn: any
  WareHouseList = [];
  WarehouseListForLookupColumn: any
  itemNameList: any;
  uomList = [];
  ProjectList = [];
  BranchList = [];
  OrderNoList = [];
  jobLotList = [];
  jobLotListForLookupColumn: any
  InventoryDefaultList = [];
  doTypeList = [{ name: "Local" }, { name: "Stock Transfer" }];
  dataSource = [];
  // dataSource = new Array<DataSourceDTO>();
  updateRowIndex: number;
  detailEditMode: boolean;
  ParamsId: number;
  batchList = [];
  availableStockTransactionsList=[]
  SaleOrderListForLoader = [];
  saleOrderDetailIds: any = [];
  IssuanceByLoaderConfiguration: string = "Flase";
  LoaderPopupVisible: boolean=false
  //=================================================
  constructor(private commonService: CommonBaseService, private commonMethods: CommonMethodsForCombos, private service: DeliveryOrderService, private route: ActivatedRoute, private router: Router) {
    super();
  }
  async ngOnInit() {
    this.ParamsId = this.route.snapshot.queryParams["Id"];
    await this.FetchData();
    this.initForm();
  }
  async FetchData() {
    this.ActivateLoadPanel("Initializing Form!");
    this.BranchList = await this.commonService.getBranch();
    this.ProjectList = await this.commonService.getProject();
    this.IssuanceByLoaderConfiguration = await this.commonMethods.GetConfigurationByOrgCompandConfigDescription("IssuanceByLoader");
    this.InventoryDefaultList = await this.commonMethods.GetInventoryDefaultsFromConfiguration();
    this.supplierNameList = await this.commonMethods.GenerateSupplierCustomerDataSourceForComboBind();
    this.PackingTypeList = await this.commonMethods.GetAllPackingTypes();
    this.PackingTypeListForLookupColumn=await this.commonMethods.GenerateStoreForLookUpColumn(this.PackingTypeList)
    this.WareHouseList = await this.commonMethods.getWareHouse();
    this.WarehouseListForLookupColumn=await this.commonMethods.GenerateStoreForLookUpColumn(this.WareHouseList)
    this.jobLotList = await this.commonMethods.getJobLot();
    this.jobLotListForLookupColumn=await this.commonMethods.GenerateStoreForLookUpColumn(this.jobLotList)
    this.batchList = await this.commonMethods.CropYear();
    this.DeActivateLoadPanel();
  }
  public initForm() {
    this.DeliveryOrderFormData = new DeliveryOrderModel();
    this.DeliveryOrderDetailFormData = new DeliveryOrderDetailModel();
    // this.DeliveryOrderFormData.CompanyId = this.companyList[0].Id;
    this.DeliveryOrderFormData.BranchesId = this.BranchList[0].Id;
    this.DeliveryOrderFormData.ProjectsId = this.ProjectList[0].Id;
    this.DeliveryOrderFormData.DocDate = new Date();
    this.DeliveryOrderFormData.DeliveryOrderType=this.doTypeList[0].name
    if (this.ParamsId > 0 == false) {
      this.getDocumentNo();
      this.SetInventoryDefaults();
    } else if (this.ParamsId > 0) {
      this.setFields4editMode();
    }
    this.DeliveryOrderDetailForm.instance.getEditor("SupplierCustomerId").focus();
  }
  setFields4editMode() {
    this.ActivateLoadPanel("Fetching Data!");
    this.service.getById(this.ParamsId).subscribe(
      (result: any) => {
        this.DeActivateLoadPanel();
        this.DeliveryOrderDetailFormData = new DeliveryOrderDetailModel();
        this.DeliveryOrderFormData = result;
        this.dataSource = result.InvDeliveryOrderDetailList;
      },
      (error) => {
        this.DeActivateLoadPanel();
        this.HandleError(error);
      }
    );
  }
  //#region  Combos Fill
  SetInventoryDefaults() {
    for (let i = 0; i < this.InventoryDefaultList.length; i++) {
      if (this.InventoryDefaultList[i].ConfigDescription == "Default Crop Year") {
        let Id = parseInt(this.InventoryDefaultList[i].Id);
        this.DeliveryOrderDetailFormData.CropYearId = Id;
      }
      if (this.InventoryDefaultList[i].ConfigDescription == "Job/Lot") {
        let Id = parseInt(this.InventoryDefaultList[i].Id);
        this.DeliveryOrderDetailFormData.JobLotId = Id;
      }
      if (this.InventoryDefaultList[i].ConfigDescription == "Paking Type") {
        let Id = parseInt(this.InventoryDefaultList[i].Id);
        this.DeliveryOrderDetailFormData.InvPackingTypeId = Id;
      }
      if (this.InventoryDefaultList[i].ConfigDescription == "Warehouse") {
        let Id = parseInt(this.InventoryDefaultList[i].Id);
        this.DeliveryOrderDetailFormData.WarehouseId = Id;
      }
    }
  }
  getDocumentNo() {
    this.service
      .getDocumentNo({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        DocumentTypeId: 84,
      })
      .subscribe(
        (result) => (this.DeliveryOrderFormData.DocNo = result),
        (error) => console.log(error)
      );
  }
  handleItemChange = (e) => {
    if (e.value > 0 == false) {
      this.uomList = [];
      return;
    }
    this.getUomList(e.value);
  };
  async getUomList(e) {
    this.uomList = await this.commonMethods.getUOM(e);
  }
  GetItemsByOrderid = (e) => {
   
    console.log(e)
    
    this.DeliveryOrderDetailFormData.ItemId=0;
    this.DeliveryOrderDetailFormData.InvPackingTypeId=0;
    this.DeliveryOrderDetailFormData.JobLotId=0;
    this.DeliveryOrderDetailFormData.PackUomId=0;
    this.itemNameList = null;
    if (e.value>0 == false) return;
    this.service
      .getItemBySaleOrderId({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
        Id: e.value,
      })
      .subscribe(
        (result: any) => {
          console.log(result);
          let data = result;
          this.itemNameList = new DataSource({
            store: data,
            paginate: true,
            pageSize: 10,
            loadMode: "raw",
          });
          this.DeliveryOrderDetailFormData.ItemId = data[0].OrderItemId;
          this.DeliveryOrderDetailFormData.InvPackingTypeId = this.PackingTypeList[0].Id;
          this.DeliveryOrderDetailFormData.PackingWeight = data[0].BagWeight * data[0].OrderItemQty;
          this.DeliveryOrderDetailFormData.JobLotId = data[0].JobLotId;
          this.DeliveryOrderDetailFormData.PackUomId = data[0].OrderItemUOMId;
          this.saleOrderDetailIds = result;
        },
        (error) => {
          console.log(error);
        }
      );
  };
  getItem() {
    this.service
      .getItem({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.itemNameList = [];
          let data = [];
          for (let i = 0; i < result.length; i++) {
            data.push({
              OrderItemId: result[i].Id,
              ItemName: result[i].ItemName,
            });
          }
          this.itemNameList = new DataSource({
            store: data,
            loadMode: "raw",
            paginate: true,
            pageSize: 10,
          });
        },
        (error) => console.log(error)
      );
  }
  getOrderNo = (e) => {
    console.log(e);
    if (e.value > 0 == false) return;
    if (this.DeliveryOrderFormData.DeliveryOrderType == null || this.DeliveryOrderFormData.DeliveryOrderType == undefined) return;
    this.OrderNoList = [];
    this.itemNameList = null;
    if (this.DeliveryOrderFormData.DeliveryOrderType == "Local") this.GetOrderNumbersByCustomerId(e.value);
    else this.getItem();
  };
  GetOrderNumbersByCustomerId(CustomerId) {
    this.service
      .getOrderNo({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
        DocumentTypeId: 81,
        OrderSupCustId: CustomerId,
      })
      .subscribe(
        (result) => {
          this.OrderNoList = result;
        },
        (error) => console.log(error)
      );
  }
  onDeliveryOrderTypeChanged = (e) => {
    this.DeliveryOrderDetailFormData = new DeliveryOrderDetailModel();
    this.SetInventoryDefaults();
    if(e.value>0==false) return;
    this.itemNameList=null;
    if(e.value=='Stock Transfer') this.getItem();
  };
  ValidateSaleOrderNumber = (e) => {
    if (this.DeliveryOrderFormData.DeliveryOrderType == "Local") {
      if (e.value > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };
  //#endregion
  //#region Calculations
  PackingWeightChangeInDetailGrid(newData, value, currentRowData) {
    newData.PackingWeight = value;
    newData.GrossWeight = value + currentRowData.LoadingWeight;
  }
  handlePackUomChange = (e) => {
    this.GetAvailableTransactionsForDeliveryOrderFilter(1);
    this.handleWeightCalculationInDetailForm(1);
  };
  handleWeightCalculationInDetailForm = (e) => {
    let loadingWeight = 0;
    let uom = 0;
    let loadingQty = 0;
    let packingWeight = 0;
    if (this.DeliveryOrderDetailFormData.LoadingQty > 0) {
      loadingQty = this.DeliveryOrderDetailFormData.LoadingQty;
    }
    if (parseInt(this.DeliveryOrderDetailForm.instance.getEditor("PackUomId").option("text")) > 0) {
      uom = parseInt(this.DeliveryOrderDetailForm.instance.getEditor("PackUomId").option("text"));
    } else if (parseInt(this.DeliveryOrderDetailFormData.PackUOM) > 0) {
      uom = parseInt(this.DeliveryOrderDetailFormData.PackUOM);
    }
    if (this.DeliveryOrderDetailFormData.PackingWeight > 0) {
      packingWeight = this.DeliveryOrderDetailFormData.PackingWeight;
    }
    loadingWeight = loadingQty * uom;
    this.DeliveryOrderDetailFormData.LoadingWeight = parseInt(loadingWeight.toFixed(2));
    this.DeliveryOrderDetailFormData.GrossWeight = loadingWeight + packingWeight;
  };
  //#endregion
  //#region  LoadSaleOrdersPopup
  //=============================================================================
  handleLoaderPopupVisibility(e)
  {
    this.LoaderPopupVisible=!this.LoaderPopupVisible
  }
  LoadSelectedDataInDetailGrid(data)
  {
    this.dataSource=[]
    this.dataSource=data;
    this.handleLoaderPopupVisibility(0);
  }
  filterJobLotDescription(e) {
    let jobLotDescriptionAgainstJobLotIdInResult = "";
    for (let j = 0; j < this.jobLotList.length; j++) {
      if (e == this.jobLotList[j].Id) {
        jobLotDescriptionAgainstJobLotIdInResult = this.jobLotList[j].JobLotDescription;
      }
    }
    return jobLotDescriptionAgainstJobLotIdInResult;
  }
  filterPackTypeDescription(e) {
    let packingTypeDescriptionAgainstPackingTypeIdInResult = "";
    for (let d = 0; d < this.PackingTypeList.length; d++) {
      if (e == this.PackingTypeList[d].Id) {
        packingTypeDescriptionAgainstPackingTypeIdInResult = this.PackingTypeList[d].PackTypeDesc;
      }
    }
    return packingTypeDescriptionAgainstPackingTypeIdInResult;
  }
  filterWarehouseName(e) {
    let warehouseNameAgainstWarehouseIdInResult = "";
    for (let c = 0; c < this.WareHouseList.length; c++) {
      if (e == this.WareHouseList[c].Id) {
        warehouseNameAgainstWarehouseIdInResult = this.WareHouseList[c].WareHouseName;
      }
    }
    return warehouseNameAgainstWarehouseIdInResult;
  }
  loadDataToDeliveryOrderAgainstSelectedSaleOrders(e) {
    this.service
      .LoadSaleOrderForDeliveryOrderInDetail({
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
        GdnIds: e,
      })
      .subscribe(
        (result: any) => {
          this.saleOrderDetailIds = [];
          // this.LoaderpopupVisible = !this.LoaderpopupVisible;
          this.SaleOrderListForLoader = [];
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              this.dataSource.push({
                ItemId: result[i].ItemId,
                ItemName: result[i].Item,
                JobLotId: result[i].JobLotId,
                JobLotDescription: this.filterJobLotDescription(result[i].JobLotId),
                PackUomId: result[i].ItemUOMId,
                PackUOM: result[i].ItemUOM,
                SaleOrderId: result[i].OrderId,
                OrderNo: result[i].OrderNo,
                InvPackingTypeId: result[i].PackingTypeId,
                PackTypeDesc: this.filterPackTypeDescription(result[i].PackingTypeId),
                WarehouseId: result[i].WareHouseId,
                WarehouseName: this.filterWarehouseName(result[i].WareHouseId),
                SupplierCustomerId: result[i].SupplierCustomerId,
                SupplierCustomer: result[i].SupplierCustomer,
                DoQty: result[i].QTY,
                DoWeight: result[i].Weight,
                LoadingQty: result[i].LoadQty,
                LoadingWeight: result[i].LoadWeight,
                LoadingRemarks: result[i].Remarks,
                PackingWeight: result[i].PackingWeight,
                GrossWeight: result[i].GrossWeight,
                SaleOrderDetailId: result[i].SaleOrderDetailId,
              });
            }
          }
        },
        (error) => {
          this.WarningPopup("Failed to Load Data!");
          console.log(error);
        }
      );
  }
  resetPopupGrid() {}
  //#endregion
  editDetailRecordRow(editObject, index) {
    this.detailEditMode = true;
    this.updateRowIndex = index;
    this.DeliveryOrderDetailFormData = editObject;
    this.DeliveryOrderDetailFormData.SupplierCustomerId = editObject.SupplierCustomerId;
    for (let i = 0; i < this.PackingTypeList.length; i++) {
      if (editObject.PackTypeDesc == this.PackingTypeList[i].PackTypeDesc) {
        this.DeliveryOrderDetailFormData.InvPackingTypeId = this.PackingTypeList[i].Id;
      }
    }
    // this.DeliveryOrderDetailFormData.DoQty = editObject.DoQty;
    // this.DeliveryOrderDetailFormData.DoWeight = editObject.DoWeight;
    // this.DeliveryOrderDetailFormData.LoadingQty = editObject.LoadingQty;
    // this.DeliveryOrderDetailFormData.LoadingWeight = editObject.LoadingWeight;
    // this.DeliveryOrderDetailFormData.PackingWeight = editObject.PackingWeight;
    // this.DeliveryOrderDetailFormData.SaleOrderId = editObject.SaleOrderId;
    // this.DeliveryOrderDetailFormData.LoadingRemarks = editObject.LoadingRemarks;
    // this.DeliveryOrderDetailFormData.OrderItemId = editObject.OrderItemId;
    // this.DeliveryOrderDetailFormData.JobLotId = editObject.JobLotId;
    // this.DeliveryOrderDetailFormData.WarehouseId = editObject.WarehouseId;
    // this.DeliveryOrderDetailFormData.GrossWeight = editObject.GrossWeight;
    // this.DeliveryOrderDetailFormData.ItemId = editObject.ItemId;
    // this.DeliveryOrderDetailFormData.PackUomId = editObject.PackUomId;
    // this.DeliveryOrderDetailFormData.CropYearId = editObject.CropYearId;
  }
  deleteDetailRecordRow(index) {
    this.dataSource.splice(index, 1);
  }
  handleCancel() {}
  onPrint(e) {
    this.service
      .PDFReportSlip262({
        Id: e,
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocumentTypeId: 84,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ReportName: "262-DeliveryOrderSlip",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => console.log(error)
      );
  }
  //========================================================18-Nov-2021==========================================
  GetAvailableTransactionsForDeliveryOrderFilter = (e) => {
    if (this.detailEditMode == false) {
      this.DeliveryOrderDetailFormData.DoQty = 0;
      this.DeliveryOrderDetailFormData.DoWeight = 0;
      this.DeliveryOrderDetailFormData.RefDocIdNo = 0;
      this.DeliveryOrderDetailFormData.RefDocSubIdNo = 0;
      this.DeliveryOrderDetailFormData.RefDocumentTypeId = 0;
    }
    if (this.IssuanceByLoaderConfiguration == 'True') {
      if (
        this.DeliveryOrderDetailFormData.ItemId != undefined &&
        this.DeliveryOrderDetailFormData.JobLotId != undefined &&
        this.DeliveryOrderDetailFormData.CropYearId != undefined &&
        this.DeliveryOrderDetailFormData.PackUomId != undefined &&
        this.DeliveryOrderDetailFormData.InvPackingTypeId != undefined
      ) {
        this.service
          .GetAvailableTransactionsForDeliveryOrderFilter({
            OrganizationId: sessionStorage.getItem("OrganizationId"),
            CompanyId: sessionStorage.getItem("CompanyId"),
            ItemId: this.DeliveryOrderDetailFormData.ItemId,
            JobLotId: this.DeliveryOrderDetailFormData.JobLotId,
            CropYear: this.DeliveryOrderDetailForm.instance.getEditor("CropYearId").option("text"),
            stockUOM: this.DeliveryOrderDetailFormData.PackUomId,
            PackingTypeId: this.DeliveryOrderDetailFormData.InvPackingTypeId,
            FromDate: new Date(sessionStorage.getItem("StartPeriod")),
            ToDate: new Date(),
          })
          .subscribe(
            (result) => {
              this.availableStockTransactionsList = result;
            },
            (error) => {
              console.log(error);
            }
          );
      }
    }
  };
  loadAvailableTransactionInDetailForm(data, index) {
    this.DeliveryOrderDetailFormData.RefDocumentTypeId = data.RefDocumentTypeId;
    this.DeliveryOrderDetailFormData.RefDocIdNo = data.RefDocIdNo;
    this.DeliveryOrderDetailFormData.RefDocSubIdNo = data.RefDocSubIdNo;
    this.DeliveryOrderDetailFormData.WarehouseId = data.WarehouseId;
    if (this.dataSource.length > 0 == false) {
      this.DeliveryOrderDetailFormData.DoQty = data.QtyBalance;
      this.DeliveryOrderDetailFormData.DoWeight = data.WeightBalance;
    } else {
      for (let i = 0; i < this.dataSource.length; i++) {
        if (
          this.dataSource[i].RefDocumentTypeId == data.RefDocumentTypeId &&
          this.dataSource[i].RefDocIdNo == data.RefDocIdNo &&
          this.dataSource[i].RefDocSubIdNo == data.RefDocSubIdNo &&
          this.dataSource[i].ItemId == data.ItemId &&
          this.dataSource[i].PackUomId == data.ItemUom &&
          this.dataSource[i].JobLotId == data.JobLotId
        ) {
          this.DeliveryOrderDetailFormData.DoQty = data.QtyBalance - this.dataSource[i].LoadingQty;
          this.DeliveryOrderDetailFormData.DoWeight = data.WeightBalance - this.dataSource[i].LoadingWeight;
        } else {
          this.DeliveryOrderDetailFormData.DoQty = data.QtyBalance;
          this.DeliveryOrderDetailFormData.DoWeight = data.WeightBalance;
        }
      }
    }
  }
  addDetailRecord2Grid() {
    if (validate(this.DeliveryOrderDetailForm)) {
      if (this.DeliveryOrderDetailFormData.LoadingQty > 0 && this.DeliveryOrderDetailFormData.LoadingWeight > 0) {
        // 18-Nov-2021
        if (this.IssuanceByLoaderConfiguration == 'True') {
          if (
            this.DeliveryOrderDetailFormData.RefDocIdNo == undefined ||
            this.DeliveryOrderDetailFormData.RefDocSubIdNo == undefined ||
            this.DeliveryOrderDetailFormData.RefDocumentTypeId == undefined ||
            this.DeliveryOrderDetailFormData.RefDocIdNo == 0 ||
            this.DeliveryOrderDetailFormData.RefDocSubIdNo == 0 ||
            this.DeliveryOrderDetailFormData.RefDocumentTypeId == 0 ||
            this.DeliveryOrderDetailFormData.DoQty == 0 ||
            this.DeliveryOrderDetailFormData.DoWeight == 0
          ) {
            this.WarningPopup("Please Load Data from Avaialble Stock Grid!");
            return;
          } else if (this.DeliveryOrderDetailFormData.LoadingQty > this.DeliveryOrderDetailFormData.DoQty) {
            this.WarningPopup("Entered Quantity Exceeds Available Qty !");
            return;
          } else if (this.DeliveryOrderDetailFormData.LoadingWeight > this.DeliveryOrderDetailFormData.DoWeight) {
            this.WarningPopup("Entered Weight Exceeds Available Weight !");
            return;
          }
        }
        this.DeliveryOrderDetailFormData.SupplierCustomer = this.DeliveryOrderDetailForm.instance.getEditor("SupplierCustomerId").option("text");
        this.DeliveryOrderDetailFormData.JobLotDescription = this.DeliveryOrderDetailForm.instance.getEditor("JobLotId").option("text");
        this.DeliveryOrderDetailFormData.OrderNo = this.DeliveryOrderDetailForm.instance.getEditor("SaleOrderId").option("text");
        this.DeliveryOrderDetailFormData.ItemName = this.DeliveryOrderDetailForm.instance.getEditor("ItemId").option("text");
        this.DeliveryOrderDetailFormData.PackUOM = this.DeliveryOrderDetailForm.instance.getEditor("PackUomId").option("text");
        this.DeliveryOrderDetailFormData.PackTypeDesc = this.DeliveryOrderDetailForm.instance.getEditor("InvPackingTypeId").option("text");
        this.DeliveryOrderDetailFormData.LoadingRemarks = this.DeliveryOrderDetailForm.instance.getEditor("LoadingRemarks").option("text");
        this.DeliveryOrderDetailFormData.WarehouseName = this.DeliveryOrderDetailForm.instance.getEditor("WarehouseId").option("text");
        this.DeliveryOrderDetailFormData.CropYear = this.DeliveryOrderDetailForm.instance.getEditor("CropYearId").option("text");
        if (this.IssuanceByLoaderConfiguration == 'False') {
          this.DeliveryOrderDetailFormData.DoWeight = this.DeliveryOrderDetailFormData.LoadingWeight;
          this.DeliveryOrderDetailFormData.DoQty = this.DeliveryOrderDetailFormData.LoadingQty;
        }
        for (let i = 0; i < this.saleOrderDetailIds.length; i++) {
          if (this.DeliveryOrderDetailFormData.SaleOrderId == this.saleOrderDetailIds[i].SaleOrderId) {
            this.DeliveryOrderDetailFormData.SaleOrderDetailId = this.saleOrderDetailIds[i].Id;
          }
        }
        if (this.updateRowIndex >= 0) {
          this.dataSource[this.updateRowIndex] = this.DeliveryOrderDetailFormData;
          this.updateRowIndex = -1;
          this.detailEditMode = false;
        } else {
          this.dataSource.push(this.DeliveryOrderDetailFormData);
        }
        this.dataGrid.instance.refresh();
        this.DeliveryOrderDetailForm.instance.getEditor("SupplierCustomerId").focus();
        this.DeliveryOrderDetailFormData = new DeliveryOrderDetailModel();
        // this.availableStockTransactionsList = [];
      }
    } else {
      notify("Please Check Your Detail Columns Value Before Add!", "error");
    }
  }
  //=============================================================================================================
  resetForm() {
    this.ParamsId = null;
    this.router.navigate([], { queryParams: { Id: null } });
    this.dataSource = [];
    this.initForm();
  }
  handleSave() {
    if (validate(this.DeliveryOrderForm)) {
      if (this.dataSource.length > 0 == false) {
        this.WarningPopup("Please Add detail record");
      } else {
        this.DeliveryOrderFormData.DocumentTypeId = 84;
        this.DeliveryOrderFormData.GrossWeight = this.dataGrid.instance.getTotalSummaryValue("DoWeight");
        this.DeliveryOrderFormData.NetWeight = this.dataGrid.instance.getTotalSummaryValue("DoWeight");
        this.DeliveryOrderFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
        this.DeliveryOrderFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
        this.DeliveryOrderFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
        this.DeliveryOrderFormData.EntryDate = new Date()
        this.DeliveryOrderFormData.ApprovedDate =new Date()
        this.DeliveryOrderFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
        this.DeliveryOrderFormData.ModifyDate = new Date()
        this.DeliveryOrderFormData.ApprovedUser = parseInt(sessionStorage.getItem("UserId"));
        this.DeliveryOrderFormData.InvDeliveryOrderDetailList = this.dataSource;
        this.ParamsId>0?this.ActivateLoadPanel("Updating!"): this.ActivateLoadPanel("Saving!")
        this.service.save(this.DeliveryOrderFormData).subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            this.ParamsId>0?this.SuccessPopup("Record Updated Successfully!"): this.SuccessPopup("Recird Saved Successfully!")
            if(this.MUST_PRINT_AFTER_SAVE==true)
            {
              this.onPrint(result);
            }
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
}
