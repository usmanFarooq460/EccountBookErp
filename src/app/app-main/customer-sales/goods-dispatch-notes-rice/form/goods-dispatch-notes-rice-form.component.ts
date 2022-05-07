import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { validate } from "src/app/shared/Base/validationHelper";
import { DataSourceDTO, GoodsDispatchNotesModel, GoodsDispatchNoteDetail } from "../goods-dispatch-notes-rice.model";
import { GoodsDispatchNoteService } from "../goods-dispatch-notes-rice.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import DataSource from "devextreme/data/data_source";
@Component({
  selector: "app-goods-dispatch-notes-rice-form",
  templateUrl: "./goods-dispatch-notes-rice-form.component.html",
  styleUrls: [],
})
export class GoodsDispatchNotesRiceFormComponent extends BaseActions implements OnInit {
  @ViewChild("PendingOutwardGatePassGDNPopupGrid", { static: false })
  PendingOutwardGatePassGDNPopupGrid: DxDataGridComponent;
  @ViewChild("GoodsDispatchNotesForm", { static: false }) //GoodsDispatchNotesForm = PurchaseOrderForm
  GoodsDispatchNotesForm: DxFormComponent;
  GoodsDispatchNotesFormData: GoodsDispatchNotesModel; //PurchaseOrderData => formObject
  @ViewChild("GoodsDispatchNotesDetailForm", { static: false }) //GoodsDispatchNotesForm = PurchaseOrderDetailForm
  GoodsDispatchNotesDetailForm: DxFormComponent;
  GoodsDispatchNotesDetailFormData: GoodsDispatchNoteDetail; //purchaseOrderDetailData = formObject
  branchList = [];
  projectList = [];
  supplierNameList: any;
  transporterNameList: any;
  itemNameList: any;
  itemList = [];
  uomList = [];
  batchList = [];
  jobLotList = [];
  VehicleTypeList = [];
  CityList = [];
  warehouseList = [];
  PackingTypeList = [];
  PurchasOrderList = [];
  CustomerStatus: boolean;
  gatepassStatus: boolean;
  dataSource = [];
  updateRowIndex: number;
  detailEditMode: boolean = false;
  GoodsDispatchNotesParamsId: number;
  SaleORderId: number;
  showNHideDetailForm: boolean = true;
  CropyearStatus: boolean;
  JoblotStatus: boolean;
  PackingTypeStatus: boolean;
  WtcutStatus: boolean;
  WtcutTotalStatus: boolean;
  LabnoStatus: boolean;
  popupVisible: boolean = false;
  pendingInwardGatePassList = [];
  inventoryDefaultList = [];
  gatePassReadOnly: boolean = false;
  configurationsList = [];
  TNetWeight = 0;
  saleOrderIdValue: number;
  GatePassIdValue: number;
  OrderStatusValue: any;
  detailGridEditingDeletingVisible: boolean = true;
  GrossWeightReadOnly: boolean = false;
  GatePassNumberReadOnly: boolean = false;
  AllowUpdatingInDataGridWhenThereIsDeliveryOder: boolean = false;
  TotalNetWeightInDetailGrid: number = 0;
  TotalGrossWeightInDetailGrid: number = 0;
  //===================================================
  //======================================22-Nov-2021===========
  SaleOrderCompulsoryForGdnConfiguration: boolean = false;
  EditingInDetailRelatedStock: boolean = true;
  //============================================================
  constructor(
    private commonService: CommonBaseService,
    private commonMethods: CommonMethodsForCombos,
    private service: GoodsDispatchNoteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }
  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("InvfrmGDN"));
    this.GoodsDispatchNotesParamsId = this.route.snapshot.queryParams["Id"];
    // this.userRights();
    this.GetAllConfiguration();

    this.getFreightAc();
    this.GetAllPendingGatePassForGDN();
    await this.FetchData();
    this.initForm();
  }

  async FetchData() {
    this.ActivateLoadPanel("Fetching Data For Form Feilds");
    this.supplierNameList = await this.commonMethods.GenerateSupplierCustomerDataSourceForComboBind();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.inventoryDefaultList = await this.commonMethods.GetInventoryDefaultsFromConfiguration();
    this.VehicleTypeList = await this.commonMethods.VehicleTypeGetAll();
    this.CityList = await this.commonMethods.CityGetByOrganizationAndCompany();
    this.warehouseList = await this.commonMethods.getWareHouse();
    this.PackingTypeList = await this.commonMethods.GetAllPackingTypes();
    this.batchList = await this.commonMethods.CropYear();
    this.getJobLot();
    this.getItem();
    this.DeActivateLoadPanel();
  }

  public initForm() {
    this.showNHideDetailForm = true;
    this.GatePassNumberReadOnly = false;
    this.GoodsDispatchNotesFormData = new GoodsDispatchNotesModel();
    this.GoodsDispatchNotesDetailFormData = new GoodsDispatchNoteDetail();
    this.GoodsDispatchNotesFormData.DocDate = new Date();
    if (this.GoodsDispatchNotesParamsId > 0 == false) {
      this.getDocumentNo();
      this.CustomerStatus = false;
      this.gatepassStatus = false;
      this.SetInventoryDefaults();
    } else if (this.GoodsDispatchNotesParamsId > 0 == true) {
      this.setFields4editMode();
      this.CustomerStatus = true;
      this.gatepassStatus = true;
    }
    this.GoodsDispatchNotesForm.instance.getEditor("SupplierCustomerId").focus();
  }
  setFocus = (e) =>
    setTimeout(() => {
      e.component.focus();
    }, 0);

  setFields4editMode() {
    this.service.getGrnById(this.GoodsDispatchNotesParamsId).subscribe(
      (result: any) => {
        this.GoodsDispatchNotesFormData = result;
        this.dataSource = result.invGdnDetail;
        this.GoodsDispatchNotesFormData.DeliveryTerm = result.OtherSupCust;
        if (this.GoodsDispatchNotesFormData.DeliveryTerm == "DeliverOrder") {
          this.showNHideDetailForm = false;
          this.showDetailColumn(false);
        } else {
          this.showNHideDetailForm = true;
          this.showDetailColumn(true);
        }
      },
      (error) => this.HandleError(error)
    );
  }
  getDocumentNo() {
    this.service
      .getDocumentNo({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        DocumentTypeId: 86,
      })
      .subscribe(
        (result) => {
          this.GoodsDispatchNotesFormData.DocNo = result;
        },
        (error) => this.HandleError(error)
      );
  }
  SetInventoryDefaults() {
    for (let i = 0; i < this.inventoryDefaultList.length; i++) {
      if (this.inventoryDefaultList[i].ConfigDescription == "Default Crop Year") {
        let filterdCropYear = this.batchList.filter(({ Id }) => Id == this.inventoryDefaultList[i].Id);
        this.GoodsDispatchNotesDetailFormData.CropYear = filterdCropYear[0].CropYear;
      }
      if (this.inventoryDefaultList[i].ConfigDescription == "Job/Lot") {
        let Id = parseInt(this.inventoryDefaultList[i].Id);
        this.GoodsDispatchNotesDetailFormData.JobLotId = Id;
      }
      if (this.inventoryDefaultList[i].ConfigDescription == "Paking Type") {
        let Id = parseInt(this.inventoryDefaultList[i].Id);
        this.GoodsDispatchNotesDetailFormData.PackingTypeId = Id;
      }
      if (this.inventoryDefaultList[i].ConfigDescription == "Warehouse") {
        let Id = parseInt(this.inventoryDefaultList[i].Id);
        this.GoodsDispatchNotesDetailFormData.WarehouseId = Id;
      }
    }
  }
  
  getFreightAc() {
    this.service
      .getCoaDetailAccounts({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          let data = result.filter(({ AccountTypeId }) => AccountTypeId != 2 && AccountTypeId != 11 && AccountTypeId != 15);
          this.transporterNameList = this.commonMethods.GenerateDataSourceFromList(data);
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  //CheckDetailGridColumnShowOrNotHERE On based Of DeliveryOrderand SaleOrder
  showDetailColumn = (data) => {
    this.AllowUpdatingInDataGridWhenThereIsDeliveryOder = !data;
    this.detailGridEditingDeletingVisible = data;
    this.CropyearStatus = data;
    this.JoblotStatus = data;
    this.PackingTypeStatus = data;
    this.WtcutStatus = data;
    this.WtcutTotalStatus = data;
    this.LabnoStatus = data;
  };
  //StartFrom Here check Configuration First step
  //Detail COmobos

  async getItem() {
    this.itemNameList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetItemsForComboBind());
    this.itemList = this.itemNameList._store._array;
  }
  async getJobLot() {
    this.jobLotList = await this.commonMethods.getJobLot();
  }
  // calculateTotalQuantity() {
  //   this.GoodsDispatchNotesDetailFormData.OrderItemQty > 0 &&
  //     this.GoodsDispatchNotesDetailForm.instance.getEditor("OrderItemUOMId").option("text") > 0 &&
  //     (this.GoodsDispatchNotesDetailFormData.NetWeight = this.GoodsDispatchNotesDetailFormData.OrderItemQty * this.GoodsDispatchNotesDetailForm.instance.getEditor("OrderItemUOMId").option("text"));
  // }
  // handlediffweight = (e) => {
  //   if (this.GoodsDispatchNotesFormData.PartyWeight && this.GoodsDispatchNotesFormData.FactoryWeight) {
  //     this.GoodsDispatchNotesFormData.DiffWeight = this.GoodsDispatchNotesFormData.PartyWeight - this.GoodsDispatchNotesFormData.FactoryWeight;
  //   } else {
  //     this.GoodsDispatchNotesFormData.DiffWeight = null;
  //   }
  // };
  handlechangeaddless = (e) => {
    this.NetNGrossWeight();
  };
  NetNGrossWeight() {
    let totalcutweight = 0;
    totalcutweight = this.GoodsDispatchNotesDetailFormData.EBWTotal + this.GoodsDispatchNotesDetailFormData.WtCutTotal;
    let AdLsWeight = 0;
    this.GoodsDispatchNotesDetailFormData.NetBillWeight = this.GoodsDispatchNotesDetailFormData.GrossWeight - totalcutweight - AdLsWeight;
    this.GoodsDispatchNotesDetailFormData.StockWeight = this.GoodsDispatchNotesDetailFormData.GrossWeight - totalcutweight - AdLsWeight;
    if (this.GoodsDispatchNotesDetailFormData.AdLsWeight) {
      this.GoodsDispatchNotesDetailFormData.StockWeight += +this.GoodsDispatchNotesDetailFormData.AdLsWeight;
      this.GoodsDispatchNotesDetailFormData.NetBillWeight += +this.GoodsDispatchNotesDetailFormData.AdLsWeight;
    }
  }
  addDetailRecord2Grid() {
    if (validate(this.GoodsDispatchNotesDetailForm)) {
      if (this.GoodsDispatchNotesDetailFormData.GrossWeight > 0 && this.GoodsDispatchNotesDetailFormData.NetBillWeight > 0) {
        //========================================
        this.GoodsDispatchNotesDetailFormData.SaleOrderNo = this.GoodsDispatchNotesDetailForm.instance.getEditor("SaleOrderId").option("text");
        this.GoodsDispatchNotesDetailFormData.Item = this.GoodsDispatchNotesDetailForm.instance.getEditor("ItemId").option("text");
        this.GoodsDispatchNotesDetailFormData.UOMEquivalent = this.GoodsDispatchNotesDetailForm.instance.getEditor("ItemUomId").option("text");
        this.GoodsDispatchNotesDetailFormData.JobLot = this.GoodsDispatchNotesDetailForm.instance.getEditor("JobLotId").option("text");
        //========================================
        this.GoodsDispatchNotesDetailFormData.WareHouseCode = this.GoodsDispatchNotesDetailForm.instance.getEditor("WarehouseId").option("text");
        this.GoodsDispatchNotesDetailFormData.PackingType = this.GoodsDispatchNotesDetailForm.instance.getEditor("PackingTypeId").option("text");
        // OrderId and No,Qty,Gross wt,E.B unit,E.BUnitTotal,Addless,NetWt,warehouse,city,joblot,lab
        if (this.updateRowIndex >= 0) {
          this.dataSource[this.updateRowIndex] = this.GoodsDispatchNotesDetailFormData;
          this.updateRowIndex = -1;
          this.detailEditMode = false;
        } else {
          this.dataSource.push(this.GoodsDispatchNotesDetailFormData);
        }
        this.PendingOutwardGatePassGDNPopupGrid.instance.refresh();
        this.GoodsDispatchNotesDetailForm.instance.getEditor("ItemId").focus();
        this.GoodsDispatchNotesDetailFormData = new GoodsDispatchNoteDetail();
        this.SetInventoryDefaults();
      } else {
        this.WarningPopup("Gross or Net Weight is not greater than 0");
      }
    }
  }
  resetForm() {
    this.dataSource = new Array<DataSourceDTO>();
    this.router.navigate([], { queryParams: { Id: null } });
    this.detailEditMode = false;
    this.GoodsDispatchNotesParamsId = null;
    this.SaleORderId = null;
    this.initForm();
  }
  editDetailRecordRow(editObject, index) {
    this.detailEditMode = true;
    this.updateRowIndex = index;
    this.GoodsDispatchNotesDetailFormData = editObject;
  }
  deleteDetailRecordRow(index) {
    this.dataSource.splice(index, 1);
  }

  //=========================================================DetailForm
  // calculateTotalNetWeightInDetailFrom()
  // {
  //   let Gwt:number;
  //   let EbTwt:number;
  //   let WtTwt:number;
  //   let AdLsWt:number;
  //   if(this.GoodsDispatchNotesDetailFormData.GrossWeight>0)
  //   {
  //    Gwt=this.GoodsDispatchNotesDetailFormData.GrossWeight;
  //   }
  //   else if(this.GoodsDispatchNotesDetailFormData.GrossWeight>0 == false)
  //   {
  //     Gwt = 0;
  //   }
  //   if(this.GoodsDispatchNotesDetailFormData.EBWTotal>0)
  //   {
  //     EbTwt = this.GoodsDispatchNotesDetailFormData.EBWTotal;
  //   }
  //   else if(this.GoodsDispatchNotesDetailFormData.EBWTotal>0 ==false)
  //   {
  //     EbTwt = 0;
  //   }
  //   if(this.GoodsDispatchNotesDetailFormData.WtCutTotal>0)
  //   {
  //     WtTwt = this.GoodsDispatchNotesDetailFormData.WtCutTotal;
  //   }
  //   else if(this.GoodsDispatchNotesDetailFormData.WtCutTotal>0 == false)
  //   {
  //     WtTwt = 0
  //   }
  //   if(this.GoodsDispatchNotesDetailFormData.AdLsWeight>0)
  //   {
  //     AdLsWt = this.GoodsDispatchNotesDetailFormData.AdLsWeight;
  //   }
  //   else if(this.GoodsDispatchNotesDetailFormData.AdLsWeight>0 ==false)
  //   {
  //     AdLsWt= 0;
  //   }
  //   this.GoodsDispatchNotesDetailFormData.NetBillWeight = Gwt - ( EbTwt + WtTwt +(AdLsWt));
  // }
  //==================================================================
  //==========================================================DetailGrid
  calculatingNetWeight = (e) => {
    for (let i = 0; i < this.dataSource.length; i++) {
      this.dataSource[i].NetBillWeight = this.dataSource[i].GrossWeight - (this.dataSource[i].EBWTotal + this.dataSource[i].WtCutTotal + this.dataSource[i].AdLsWeight);
    }
  };
  onGrossWtChangeinDetailGrid = (newData, value, currentRowData) => {
    newData.GrossWeight = value;
    if (value > 0) {
      // newData.NetBillWeight = this.calculateNetWeightinDataGrid(value,currentRowData.EBWTotal,currentRowData.WtCutTotal,currentRowData.AdLsWeight)
      newData.NetBillWeight = value - (currentRowData.EBWTotal + currentRowData.WtCutTotal + currentRowData.AdLsWeight);
      newData.StockWeight = value - (currentRowData.EBWTotal + currentRowData.WtCutTotal + currentRowData.AdLsWeight);
    }
  };
  onAdLsWtChangeinDetailGrid = (newData, value, currentRowData) => {
    newData.AdLsWeight = value;
    newData.NetBillWeight = currentRowData.GrossWeight - (currentRowData.EBWTotal + currentRowData.WtCutTotal + value);
  };
  onWtCutTotalChangeinDetailGrid = (newData, value, currentRowData) => {
    newData.WtCutTotal = value;
    newData.NetBillWeight = currentRowData.GrossWeight - (currentRowData.EBWTotal + value + currentRowData.AdLsWeight);
    newData.StockWeight = currentRowData.GrossWeight - (currentRowData.EBWTotal + value + currentRowData.AdLsWeight);
  };
  onEbUnitChangeinDetailGrid = (newData, value, currentRowData) => {
    newData.EBWPerUnit = value;
    if (value > 0 && currentRowData.ItemQty > 0) {
      newData.EBWTotal = value * currentRowData.ItemQty;
    } else {
      newData.EBWTotal = 0;
    }
    newData.NetBillWeight = currentRowData.GrossWeight - (newData.EBWTotal + currentRowData.WtCutTotal + currentRowData.AdLsWeight);
    newData.StockWeight = currentRowData.GrossWeight - (newData.EBWTotal + currentRowData.WtCutTotal + currentRowData.AdLsWeight);
  };
  //#region Validations IN DataGrid
  checkValidationForEbUnitWeight = (e) => {
    if (e.value == null || e.value == 0 || e.value == undefined || (e.value >= 0.4 && e.value <= 3)) {
      return true;
    } else if (e.value < 0.4 || e.value > 3) {
      return false;
    }
  };
  checkValidationForGrossWeightt = (e) => {
    if (e.value > 0) {
      return true;
    } else {
      return false;
    }
  };
  //#endregion
  //====================================================================
  //======================================================================@hamzafarooqi55
  //#region  Configurations
  GetAllConfiguration() {
    this.commonService
      .configurations({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => {
          this.configurationsList = result;
          for (let { ConfigDescription, ConfigKey } of this.configurationsList) {
            if (ConfigDescription == "SOCompulsoryforGdn") {
              if (ConfigKey == "True") {
                this.SaleOrderCompulsoryForGdnConfiguration = true;
              } else {
                this.SaleOrderCompulsoryForGdnConfiguration = false;
              }
            }
            if (ConfigDescription == "IssuanceByLoader" && ConfigKey == "True") {
              this.EditingInDetailRelatedStock = false;
            } else if (ConfigDescription == "IssuanceByLoader" && ConfigKey == "False") {
              this.EditingInDetailRelatedStock = true;
            }
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  //#endregion
  //#region GettingDataAboutWeightOnBasisOfGPid
  getWeightData(e) {
    this.service
      .GetNetWeightAgainstGpId({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        ReferenceDocTypeId: 91,
        ReferenceDocNoId: e,
      })
      .subscribe(
        (result) => {
          for (let i = 0; i < result.length; i++) {
            this.TNetWeight += result[i].NetWbWeight;
            this.GoodsDispatchNotesFormData.FactoryWeight = this.TNetWeight;
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  handleLoaderPopupVisibility(e) {
    this.popupVisible = !this.popupVisible;
  }
  GetAllPendingGatePassForGDN() {
    this.service
      .GetPendingGatePass({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.pendingInwardGatePassList = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  //=====================================================================================
  //#region  Calculations
  handleCalculations = (e) => {
    if (this.GoodsDispatchNotesDetailFormData.EBWPerUnit > 0 && this.GoodsDispatchNotesDetailFormData.ItemQty > 0) {
      this.GoodsDispatchNotesDetailFormData.EBWTotal = this.GoodsDispatchNotesDetailFormData.EBWPerUnit * this.GoodsDispatchNotesDetailFormData.ItemQty;
    } else if (this.GoodsDispatchNotesDetailFormData.EBWPerUnit <= 0 || this.GoodsDispatchNotesDetailFormData.ItemQty <= 0) {
      this.GoodsDispatchNotesDetailFormData.EBWTotal = 0;
    }
    if (this.GoodsDispatchNotesDetailFormData.WtCut > 0 && this.GoodsDispatchNotesDetailFormData.ItemQty > 0) {
      this.GoodsDispatchNotesDetailFormData.WtCutTotal = this.GoodsDispatchNotesDetailFormData.WtCut * this.GoodsDispatchNotesDetailFormData.ItemQty;
    } else if (this.GoodsDispatchNotesDetailFormData.WtCut > 0 == false || this.GoodsDispatchNotesDetailFormData.ItemQty > 0 == false) {
      this.GoodsDispatchNotesDetailFormData.WtCutTotal = 0;
    }
    let TotalNetWeight =
      this.GoodsDispatchNotesDetailFormData.GrossWeight -
      (this.GoodsDispatchNotesDetailFormData.EBWTotal + this.GoodsDispatchNotesDetailFormData.WtCutTotal + this.GoodsDispatchNotesDetailFormData.AdLsWeight);
    this.GoodsDispatchNotesDetailFormData.NetBillWeight = TotalNetWeight;
    this.GoodsDispatchNotesDetailFormData.StockWeight = TotalNetWeight;
  };
  //#endregion
  //#region OrderNo Leave
  OrderNoLeave = (e) => {
    for (let { ConfigDescription, ConfigKey } of this.configurationsList) {
      if (ConfigDescription == "SaleOrderLoadCustomerWise") {
        if (ConfigKey == "True") {
          this.getGPTypeDeleiveryTermandGpType(e.value);
        } else {
          if (e.value > 0) {
            this.getGPTypeDeleiveryTermandGpType(e.value);
            let DocTypeId: number;
            if (this.GoodsDispatchNotesFormData.GatepassType == "Export") {
              DocTypeId = 83;
            } else {
              DocTypeId = 81;
            }
            this.GetSupplierBySaleOrderNo(this.GoodsDispatchNotesDetailForm.instance.getEditor("SaleOrderId").option("text"), DocTypeId);
          } else {
            this.getItem();
            this.getJobLot();
            // this.getUOMOnItemLeave();
          }
        }
      }
    }
  };
  getGPTypeDeleiveryTermandGpType(e) {
    this.service
      .GetGpTypeandDEliveryTermFromOrderId({
        Id: e,
      })
      .subscribe(
        (result) => {
          if (result.length > 0) {
            this.GoodsDispatchNotesFormData.DeliveryTerm = result[0].DeliveryTerm;
            this.GoodsDispatchNotesFormData.GatepassType = result[0].GatepassType;
            this.ItemOnBaseOfOrderNo(e);
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  GetSupplierBySaleOrderNo(OrderId, DocTypeId) {
    this.service
      .GetSupplierBySaleOrderNo({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        DocNo: OrderId,
        DocumentTypeId: DocTypeId,
      })
      .subscribe(
        (result) => {
          this.supplierNameList = result;
          this.GoodsDispatchNotesFormData.PendingParties = result.length;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  ItemOnBaseOfOrderNo(e) {
    this.service
      .getItemByPurchaseOrderId({
        Id: e,
      })
      .subscribe(
        (result: any) => {
          let data = result;
          this.itemList = result;

          this.itemNameList = new DataSource({
            store: data,
            paginate: true,
            pageSize: 7,
            loadMode: "raw",
          });
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  //#endregion
  async GetUom(e) {
    this.uomList = await this.commonMethods.getUOM(e);
  }
  //#region  ItemName Leave
  ItemNameLeave = (e) => {
    this.GetUom(e.value);
    if (this.detailEditMode == false) {
      this.GoodsDispatchNotesDetailFormData.GrossWeight = this.GoodsDispatchNotesFormData.FactoryWeight;
    }
    if (this.GoodsDispatchNotesDetailFormData.SaleOrderId > 0) {
      for (let i = 0; i < this.itemList.length; i++) {
        if (e.value == this.itemList[i].OrderItemId) {
          this.GoodsDispatchNotesDetailFormData.ItemUomId = this.itemList[i].OrderItemUOMId;
          this.GoodsDispatchNotesDetailFormData.JobLotId = this.itemList[i].JobLotId;
          this.GoodsDispatchNotesDetailFormData.EBWPerUnit = this.itemList[i].BagWeight;
          this.GoodsDispatchNotesDetailFormData.AreaCity = this.itemList[i].CityArea;
          this.GoodsDispatchNotesDetailFormData.LabReportRef = this.itemList[i].LabSampleNo;
          this.GoodsDispatchNotesDetailFormData.CropYear = this.itemList[i].Crop;
          this.GoodsDispatchNotesDetailFormData.ItemQty = this.itemList[i].OrderItemQty;
          this.GoodsDispatchNotesDetailFormData.PackingTypeId = this.PackingTypeList[0].Id;
        }
      }
    } else {
      this.GrossWeightReadOnly = false;
      if (this.GoodsDispatchNotesFormData.SupplierWeight > this.GoodsDispatchNotesFormData.FactoryWeight) {
        this.GoodsDispatchNotesDetailFormData.GrossWeight = this.GoodsDispatchNotesFormData.FactoryWeight;
      } else if (this.GoodsDispatchNotesFormData.FactoryWeight > this.GoodsDispatchNotesFormData.SupplierWeight) {
        this.GoodsDispatchNotesDetailFormData.GrossWeight = this.GoodsDispatchNotesFormData.SupplierWeight;
      }
      this.getJobLot();
    }
  };
  //==================================22-Nov-2021====================================
  onLoadClick = (e) => {
    if (e.Status == "Open") {
      this.WarningPopup("Gate Pass is not Accepted yet!!");
      this.GoodsDispatchNotesFormData.GpNo = null;
      this.GoodsDispatchNotesForm.instance.getEditor("GpNo").focus();
    } else if (e.Status == "Accepted") {
      this.GoodsDispatchNotesFormData.GpNo = e.GpSrNo;
      this.popupVisible = !this.popupVisible;
    }
  };
  //#region GatePassLeave
  GatePassLeave = (e) => {
    if (e.value > 0) {
      this.GatePassNumberReadOnly = true;
      if (this.SaleOrderCompulsoryForGdnConfiguration == true) {
        this.GetDataByGpNumberWhenConfigurationIsSaleOrderCompulsoryForGdn(e.value);
      } else {
        this.ReadByGpNoForGdnDeliveryOrder(e.value);
      }
      this.GoodsDispatchNotesForm.instance.getEditor("CarriageAmount").focus();
    }
  };

  GetDataByGpNumberWhenConfigurationIsSaleOrderCompulsoryForGdn(e) {
    this.service
      .GetByGpNoForGDN({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        GpSrNo: e,
      })
      .subscribe(
        (result) => {
          if (result?.length > 0) {
            this.GoodsDispatchNotesFormData.BiltyNo = result[0]?.BiltyNo;
            this.GoodsDispatchNotesFormData.Container = result[0].Container;
            this.GoodsDispatchNotesFormData.Container1 = result[0].Container1;
            this.GoodsDispatchNotesFormData.FactoryWeight = result[0].FactoryWeight;
            this.GoodsDispatchNotesFormData.BalanceWeight = result[0].FactoryWeight;
            this.GoodsDispatchNotesFormData.OutwardGatePassId = result[0].Id;
            this.GoodsDispatchNotesFormData.CarriageAmount = result[0].NetPaid;
            this.GoodsDispatchNotesFormData.NoOfPackages = result[0].NoOfPackages;
            this.GoodsDispatchNotesFormData.RemarksHeader = result[0].OtherRemarks;
            this.saleOrderIdValue = result[0].SaleOrderId;
            this.GoodsDispatchNotesFormData.SupplierCustomerId = result[0].SupplierCustomerId;
            if (result[0].WareHouseCode != "" || result[0].WareHouseCode != null) {
              for (let i = 0; i < this.warehouseList.length; i++) {
                if (result[0].WareHouseCode == this.warehouseList[i].WareHouseCode) {
                  this.GoodsDispatchNotesDetailFormData.WarehouseId = this.warehouseList[i].Id;
                }
              }
            }
            if (result[0].SaleOrderId > 0) {
              this.PurchasOrderList = result;
              this.GoodsDispatchNotesDetailFormData.SaleOrderId = this.PurchasOrderList[0].SaleOrderId;
            } else {
              this.ErrorPopup("Sale Order Id Not Found");
            }
            this.GoodsDispatchNotesFormData.SupplierWeight = result[0].SupplierWeight;
            this.GoodsDispatchNotesFormData.PartyWeight = result[0].SupplierWeight;
            this.GoodsDispatchNotesFormData.VehicleNo = result[0].VehicleNo;
            this.GoodsDispatchNotesFormData.VehicleType = result[0].VehicleType;
            this.GoodsDispatchNotesFormData.PendingParties = 1;
            this.getWeightData(result[0].Id);
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  //#endregion
  //#region  ReadByGpNoForGdnDeliveryOrder
  ReadByGpNoForGdnDeliveryOrder(e) {
    this.service
      .ReadByGpNoForGdnDeliveryOrder({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        GpSrNo: e,
      })
      .subscribe(
        (result) => {
          if (result.length > 0) {
            this.saleOrderIdValue = result[0].SaleOrderId;
            this.GatePassIdValue = result[0].Id;
            this.GoodsDispatchNotesFormData.OutwardGatePassId = result[0].Id;
            this.OrderStatusValue = result[0].OrderStatus;
            this.GoodsDispatchNotesFormData.DeliveryTerm = result[0].OrderStatus;
            this.GoodsDispatchNotesFormData.VehicleNo = result[0].VehicleNo;
            this.GoodsDispatchNotesFormData.BiltyNo = result[0].BiltyNo;
            this.GoodsDispatchNotesFormData.FactoryWeight = result[0].FactoryWeight;
            this.GoodsDispatchNotesFormData.CarriageAmount = result[0].NetPaid;
            this.GoodsDispatchNotesFormData.DeliveryTerm = result[0].OrderStatus;
            if (result[0].OrderStatus == "DeliverOrder") {
              this.showNHideDetailForm = false;
              this.showDetailColumn(false);
              this.GetCustomerByDeliveryOrderId(result[0].Id);
              this.getWeightForValidationIfGPisAgainstDO(e);
            } else {
              this.showNHideDetailForm = true;
              this.showDetailColumn(true);
              this.ErrorPopup("Gate Pass Number is either Incorrect or Not Approved!");
            }
          }
        },
        (error) => {
          this.ErrorPopup("Gate Pass Number is either Incorrect or Not Approved!");
          this.HandleError(error);
        }
      );
  }
  //#endregion
  //#region GetCustomerByDeliveryOrderId
  GetCustomerByDeliveryOrderId(e) {
    this.service
      .GetCustomerByDeliveryOrderId({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        Id: e,
      })
      .subscribe(
        (result) => {
          this.supplierNameList = [];
          if (result?.length > 0) {
            result.map((item) => {
              this.supplierNameList.push({ Id: item.SupplierCustomerId, CompanyName: item.CompanyName });
            });
            this.GoodsDispatchNotesFormData.PendingParties = result.length;
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  //#endregion
  //#region GettingWeightForValidation
  getWeightForValidationIfGPisAgainstDO(e) {
    this.service
      .GetWeightForValidationsIfGPisAgainstDO({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        DocumentTypeId: 86,
        DocNo: e,
      })
      .subscribe(
        (result) => {
          this.GoodsDispatchNotesFormData.DiffWeight = result;
          this.GoodsDispatchNotesFormData.BalanceWeight = this.GoodsDispatchNotesFormData.FactoryWeight - result;
        },
        (error) => {
          this.HandleError(error);
          this.GoodsDispatchNotesFormData.BalanceWeight = 0;
          this.GoodsDispatchNotesFormData.PendingParties = 0;
        }
      );
  }
  //#endregion
  //#endregion
  //#region  Cutomer Name Leave
  DeliveryOrderLoadFunc = (e) => {
    if (this.GoodsDispatchNotesParamsId > 0 == false) {
      this.service
        .DeliveryOrderLoad({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          DocumentTypeId: 84,
          SupplierCustomerId: this.GoodsDispatchNotesFormData.SupplierCustomerId,
          Id: this.saleOrderIdValue,
        })
        .subscribe(
          (result) => {
            if (result?.length > 0) {
              this.dataSource = [];
              result.map((item) => {
                this.dataSource.push({
                  SaleOrderId: item.OrderId,
                  SaleOrderNo: item.OrderNo,
                  AdLsWeight: item.AddLesswt,
                  AreaCity: item.City,
                  ContainerNo: item.ContainerNo,
                  CropYear: item.CropYear,
                  EBWTotal: item.EbTotal,
                  EBWPerUnit: item.EbUnit,
                  GrossWeight: item.GrossWight,
                  Item: item.Item,
                  ItemId: item.ItemId,
                  JobLot: item.Job,
                  JobLotId: item.JobId,
                  LabReportRef: item.LabNo,
                  NetBillWeight: item.NetWeight,
                  PackingType: item.PackingType,
                  PackingTypeId: item.PackingTypeId,
                  ItemQty: item.Qty,
                  StockWeight: item.StockWeight,
                  UOMEquivalent: item.UOM,
                  ItemUomId: item.UOMId,
                  WtCut: item.WtCut,
                  WtCutTotal: item.WtCutTotal,
                  WarehouseId: item.WareHouse,
                });
              });
            }
          },
          (error) => this.HandleError(error)
        );
    }
  };
  //#endregion
  //=================================================================================
  //#endregion

  onSave() {
    if (this.GoodsDispatchNotesParamsId > 0) {
      if (this.UserRightsObject.canUpdate) {
        this.handleSave();
      } else {
        this.ErrorPopup("You dont have right to update!");
      }
    } else {
      if (this.UserRightsObject.canSave) {
        this.handleSave();
      } else {
        this.ErrorPopup("You dont have Right to Save!");
      }
    }
  }

  handleSave() {
    const result: any = this.GoodsDispatchNotesForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      this.WarningPopup("Please Fill Required Fields!");
      return;
    }
    if (this.dataSource.length > 0 == false) {
      this.WarningPopup("Please Add Detail Record!");
    } else {
      this.TotalNetWeightInDetailGrid = 0;
      this.TotalGrossWeightInDetailGrid = 0;
      for (let i = 0; i < this.dataSource.length; i++) {
        this.TotalNetWeightInDetailGrid += this.dataSource[i].NetBillWeight;
        this.TotalGrossWeightInDetailGrid += this.dataSource[i].GrossWeight;
        if (this.dataSource[i].CropYear != null && this.dataSource[i].CropYear != "") {
        } else {
          this.WarningPopup("Crop Year is required in Detail Grid at Row No " + (i + 1) + " .");
          return;
        }
        if (this.dataSource[i].PackingTypeId != null && this.dataSource[i].PackingTypeId != 0) {
        } else {
          this.WarningPopup("Packing Type is Required in Detail Grid at Row No " + (i + 1) + " .");
          return;
        }
      }
      if (this.TotalNetWeightInDetailGrid > this.GoodsDispatchNotesFormData.FactoryWeight) {
        this.WarningPopup("Your NetWeight in Detail is Greater than Factory Weight!");
        return;
      }
      for (let i = 0; i < this.dataSource.length; i++) {
        if (
          this.dataSource[i].EBWPerUnit == 0 ||
          this.dataSource[i].EBWPerUnit == null ||
          this.dataSource[i].EBWPerUnit == undefined ||
          (this.dataSource[i].EBWPerUnit <= 3 && this.dataSource[i].EBWPerUnit >= 0.4)
        ) {
        } else if (this.dataSource[i].EBWPerUnit > 3 || this.dataSource[i].EBWPerUnit < 0.4) {
          this.WarningPopup("EB. Unit can neither be greater than 3 nor less than 0.4 in Row No " + (i + 1) + " of Detail Grid.");
          return;
        }
      }
      if (this.GoodsDispatchNotesFormData.PendingParties == 1) {
        if (this.TotalGrossWeightInDetailGrid != this.GoodsDispatchNotesFormData.BalanceWeight) {
          this.WarningPopup("Total Gross Weight in Detail Grid is not Eqaul to Balance Weight!");
          return;
        }
      } else if (this.GoodsDispatchNotesFormData.PendingParties > 1) {
        if (this.TotalGrossWeightInDetailGrid >= this.GoodsDispatchNotesFormData.BalanceWeight) {
          this.WarningPopup("Total Gross Weight in Detail Grid cannot be greater nor be equal to Balance Weight because there are more parties yet!");
          return;
        }
      }
      this.GoodsDispatchNotesFormData.Id = this.GoodsDispatchNotesParamsId;
      this.GoodsDispatchNotesFormData.DocumentTypeId = 86;
      this.GoodsDispatchNotesFormData.BranchesId = this.branchList[0].Id;
      this.GoodsDispatchNotesFormData.ProjectsId = this.projectList[0].Id;
      this.GoodsDispatchNotesFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.GoodsDispatchNotesFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.GoodsDispatchNotesFormData.EntryUser = this.commonService.UserId();
      this.GoodsDispatchNotesFormData.EntryDate = new Date();
      this.GoodsDispatchNotesFormData.ModifyUser = this.commonService.UserId();
      this.GoodsDispatchNotesFormData.ModifyDate = new Date();
      this.GoodsDispatchNotesFormData.ContainerNo = this.GoodsDispatchNotesFormData.Container;
      this.GoodsDispatchNotesFormData.ContainerNo1 = this.GoodsDispatchNotesFormData.Container1;
      this.GoodsDispatchNotesFormData.TransporterDocRef = this.OrderStatusValue;
      this.GoodsDispatchNotesFormData.IsApproved = false;
      // this.GoodsDispatchNotesFormData.PostUser = this.commonService.UserId();
      // this.GoodsDispatchNotesFormData.PostDate = this.currentDate;
      this.GoodsDispatchNotesFormData.invGdnDetail = this.dataSource;
      if (this.GoodsDispatchNotesParamsId > 0) {
        this.ActivateLoadPanel("Updating");
      } else if (this.GoodsDispatchNotesParamsId > 0 == false) {
        this.ActivateLoadPanel("Saving");
      }
      this.service.saveGdn(this.GoodsDispatchNotesFormData).subscribe(
        (result) => {
          this.resetForm();
          this.DeActivateLoadPanel();
          this.GoodsDispatchNotesParamsId > 0 ? this.SuccessPopup("Record updated successfully!") : this.SuccessPopup("Record saved successfully!");
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
    }
  }

  DummyMethod() {}
  onToolbarPreparingOfLoaderPopup = (e) => {
    this.RefreshButtonInGridToolbar(e, () =>
      this.RefreshHistoryGridGrid(this.DummyMethod.bind(this), this.HistoryGridSateKey("PendingOutwardGatePassGDNPopupGrid"), this.PendingOutwardGatePassGDNPopupGrid)
    );
    this.FilterButtonInGridToolbar(e);
  };
}
