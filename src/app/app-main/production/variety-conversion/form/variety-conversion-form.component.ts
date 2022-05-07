import { Component, HostListener, Injectable, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent, DxTabPanelComponent } from "devextreme-angular";
import notify from "devextreme/ui/notify";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { validate } from "src/app/shared/Base/validationHelper";
import { VarietyConversionModel, VarietyConversionDetailModel, PackingMaterialModel, DummyModelForSummary, AvailableTrasactionsForIssuanceModel } from "../variety-conversion-model";
import { VarietyConversionService } from "../variety-conversion-service";

@Component({
  selector: "app-variety-conversion-form",
  templateUrl: "./variety-conversion-form.component.html",
  styleUrls: [],
})
export class VarietyConversionFormComponent implements OnInit {
  @ViewChild("packingMaterialGrid", { static: false })
  packingMaterialGrid: DxDataGridComponent;
  @ViewChild("overheadGrid", { static: false })
  overheadGrid: DxDataGridComponent;
  @ViewChild("outputGrid", { static: false })
  outputGrid: DxDataGridComponent;
  @ViewChild("inputGrid", { static: false })
  inputGrid: DxDataGridComponent;

  @ViewChild("tabPanel", { static: false })
  tabPanel: DxTabPanelComponent;
  @ViewChild("stockConversionForm", { static: false })
  stockConversionForm: DxFormComponent;
  stockConversionFormData: VarietyConversionModel;
  @ViewChild("stockConversionDetailForm", { static: false })
  stockConversionDetailForm: DxFormComponent;
  sotckConversionDetailFormData: VarietyConversionDetailModel;

  @ViewChild("summaryForm", { static: false })
  summaryForm: DxFormComponent;
  summaryFormData: DummyModelForSummary;

  @ViewChild("AvailableTransactionsForIssuancePopupForm", { static: false })
  AvailableTransactionsForIssuancePopupForm: DxFormComponent;
  AvailableTransactionsForIssuancePopupFormData: AvailableTrasactionsForIssuanceModel;
  //#region Conditional Variables
  stockConversionParamsId: number;
  id4submit: number;
  message: string;
  warningPopupVisibility: boolean = false;
  detailEditMode: boolean = false;
  updateRowIndex: number;
  ManualRateReadOnly: boolean = false;
  visibleIndexInDetailTabs: number = 1;
  AverageRateFormulaForHeadRiceOnly: boolean;
  AverageRateFormulaForByProductAndHeadRice: boolean;
  RateReadOnlyInDetailForm: boolean = false;
  canSave: boolean;
  canUpdate: boolean;
  canPrint: boolean;

  //#endregion

  //#region Data Variables
  warehouseList = [];
  itemList = [];
  uomList = [];
  tempUOMList = [];
  bagTypeList = [];
  cropYearList = [];
  jobLotList = [];
  accountHeadList = [];
  inputDataSource = [];
  outputDataSource = [];
  overheadDataSource = [];
  branchList = [];
  projectList = [];
  MoistureSlabList = [];
  packingMaterialDataSource = new Array<PackingMaterialModel>();
  entryTypeList = [
    { Id: 1, Label: "Issue" },
    { Id: 2, Label: "Recovery By Product" },
    { Id: 3, Label: "Recovery Head Rice" },
  ];
  chargeToList = [
    { Id: 2, Label: "Recovery By Product" },
    { Id: 3, Label: "Recovery Head Rice" },
  ];
  //#endregion

  //#region FilteredDataListsForInput
  inventoryParentCategoriesList = [];

  //#endregion

  //#region AvailableTransactionsForIssuanceBloack
  loaderVisibilityForAvailableTransactions: boolean = false;

  //#endregion
  constructor(private service: VarietyConversionService, private commonService: CommonBaseService, private route: ActivatedRoute, private router: Router) {}

  async ngOnInit() {
    this.stockConversionParamsId = this.route.snapshot.queryParams["Id"];
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    console.log("Data from common Methods");
    this.userRights();
    this.getBagType();
    this.getCOAAllocation();
    this.getInventoryParentCategory();
    this.getItem();
    this.MoistureSlabGetAll();
    this.initForm();

    this.setFields4editMode();
  }

  initForm() {
    if (this.stockConversionParamsId > 0 == false) {
      this.getDocumentNo();
    }

    this.stockConversionFormData = new VarietyConversionModel();
    this.sotckConversionDetailFormData = new VarietyConversionDetailModel();
    this.summaryFormData = new DummyModelForSummary();
    this.AvailableTransactionsForIssuancePopupFormData = new AvailableTrasactionsForIssuanceModel();
    this.stockConversionFormData.DocDate = new Date();
    this.stockConversionFormData.BranchedId = this.branchList[0].Id;
    this.stockConversionFormData.ProjectsId = this.projectList[0].Id;
    this.AverageRateFormulaForHeadRiceOnly = true;
    this.AverageRateFormulaForByProductAndHeadRice = false;
    this.RateReadOnlyInDetailForm = false;
  }

  //#region OnFormInitialization
  setFields4editMode() {
    !isNaN(this.stockConversionParamsId)
      ? ((this.id4submit = this.stockConversionParamsId),
        this.service.getStockConversionById(this.stockConversionParamsId).subscribe(
          (result: any) => {
            this.stockConversionFormData = result;
            this.overheadDataSource = result.invStockConversionAddExpenses;
            this.packingMaterialDataSource = result.invStockConversionPackings;
            let detailRecord = result.invStockConversionDetails;
            this.inputDataSource = detailRecord.filter(({ EntryType }) => EntryType == "Issue");
            for (let i = 0; i < this.inputDataSource.length; i++) {
              this.inputDataSource[i].AmountWithoutExpenses = this.inputDataSource[i].Amount;
            }
            this.outputDataSource = detailRecord.filter(({ EntryType }) => EntryType != "Issue");

            for (let i = 0; i < this.outputDataSource.length; i++) {
              this.outputDataSource[i].AmountWithoutExpenses = this.outputDataSource[i].Amount - this.outputDataSource[i].PackingMaterialAmount - this.outputDataSource[i].ExpenseAmount;
            }
            this.GenerateSummaryForUser();
          },
          (error) => console.log(error)
        ))
      : (this.id4submit = null);
  }

  //#endregion
  loadPopup() {
    this.loaderVisibilityForAvailableTransactions = true;
  }
  closeAvailableTransactionsForIssuancePopup(e) {
    if (e == "false") {
      this.loaderVisibilityForAvailableTransactions = false;
    }
  }
  //#region Combos Fill
  //#region  Warehouse
  getWarehouse() {
    this.service
      .getWareHouse({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => (this.warehouseList = result),
        (error) => console.log(error)
      );
  }
  //#endregion
  //#region Item
  getItem() {
    this.service
      .getItem({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => (this.itemList = result),
        (error) => console.log(error)
      );
  }

  //#endregion

  //#region UOM

  getUOM(e) {
    this.service
      .getUOM({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        ItemId: e,
      })
      .subscribe(
        (result) => {
          this.uomList = result;
        },
        (error) => console.log(error)
      );
  }

  //#endregion
  //#region  CropYear
  getCropYear() {
    this.service.getCropYear().subscribe(
      (result) => (this.cropYearList = result),
      (error) => console.log(error)
    );
  }

  //#endregion

  //#region JobLot
  getJobLot() {
    this.service
      .getJobLot({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => (this.jobLotList = result),
        (error) => console.log(error)
      );
  }

  //#endregion
  //#region BagType
  getBagType() {
    this.service.getBagType().subscribe(
      (result) => (this.bagTypeList = result),
      (error) => console.log(error)
    );
  }

  //#endregion

  //#region DocumnntNumber

  getDocumentNo() {
    this.service
      .getDocumentNo({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.stockConversionFormData.DocSrNo = result;
          console.log("this is data from common methods");
        },
        (error) => console.log(error)
      );
  }
  //#endregion
  //#region ChartOfAccount

  getCOAAllocation() {
    this.service
      .getCOAAllocation({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => (this.accountHeadList = result),
        (error) => console.log(error)
      );
  }
  //#endregion
  MoistureSlabGetAll() {
    this.service
      .MoistureSlabGetAll({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.MoistureSlabList = result;
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  //#endregion

  //#region Conditional Api Calling

  getStockNAverageRate() {
    this.service
      .getStockNAverageRate({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        ItemId: this.sotckConversionDetailFormData.ItemId,
        ToDate: this.stockConversionFormData.DocDate,
      })
      .subscribe(
        (result) => {
          if (result[0].AvgRate > 0) {
            this.sotckConversionDetailFormData.AverageRate = parseInt(result[0].AvgRate);
            if (this.detailEditMode == false) {
              this.sotckConversionDetailFormData.Rate = parseInt(result[0].AvgRate);
            }
          } else {
            this.sotckConversionDetailFormData.AverageRate = 0;
          }
        },
        (error) => console.log(error)
      );
  }

  //#endregion

  //#region FetchingFilteredDataForInput
  getInventoryParentCategory() {
    this.service
      .ItemStockFilterFromInventoryTransaction({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        Activity: "GetPaddyRiceParentCategories",
      })
      .subscribe(
        (result) => {
          this.inventoryParentCategoriesList = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getWarehouseByParentCategory() {
    this.service
      .ItemStockFilterFromInventoryTransaction({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ItemCategoryId: this.stockConversionFormData.parentCategoryId,
        Activity: "GetAllWarehousesByParentCategory",
      })
      .subscribe(
        (result) => {
          this.warehouseList = result;
          this.getItemStockByJobLot();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getCropByWarehouseId() {
    this.service
      .ItemStockFilterFromInventoryTransaction({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ItemCategoryId: this.stockConversionFormData.parentCategoryId,
        WarehouseId: this.sotckConversionDetailFormData.WarehouseId,
        Activity: "GetAllCropYearsByByParentCategoryWarehouses",
      })
      .subscribe(
        (result) => {
          this.cropYearList = result;
          this.getItemStockByJobLot();
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getItemsByCropYear() {
    this.service
      .ItemStockFilterFromInventoryTransaction({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ItemCategoryId: this.stockConversionFormData.parentCategoryId,
        WarehouseId: this.sotckConversionDetailFormData.WarehouseId,
        CropYear: this.sotckConversionDetailFormData.CropBatch,
        Activity: "GetAllItemsByCropByWarehouseByInventoryParentCategory",
      })
      .subscribe(
        (result) => {
          this.itemList = result;
          this.getItemStockByJobLot();
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getLotsByItem() {
    this.service
      .ItemStockFilterFromInventoryTransaction({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ItemCategoryId: this.stockConversionFormData.parentCategoryId,
        WarehouseId: this.sotckConversionDetailFormData.WarehouseId,
        CropYear: this.sotckConversionDetailFormData.CropBatch,
        ItemId: this.sotckConversionDetailFormData.ItemId,
        Activity: "GetAllLotsByItemByCropByWarehouseByInventoryParentCategory",
      })
      .subscribe(
        (result) => {
          this.jobLotList = result;
          this.getItemStockByJobLot();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  userRights() {
    this.commonService
      .userRights({
        UserId: this.commonService.UserId(),
        ScreenName: "InvfrmPurchaseInvoice",
        RightName: this.commonService.RoleName(),
      })
      .subscribe(
        (result) => {
          for (let { RightName, Value } of result) {
            if (RightName === "Save") {
              this.canSave = Value;
            }
            if (RightName === "Print") {
              this.canPrint = Value;
            }
            if (RightName === "Update") {
              this.canUpdate = Value;
            }
          }
        },
        (error) => console.log(error)
      );
  }

  getItemStockByJobLot() {
    this.service
      .ItemStockFilterFromInventoryTransaction({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        ItemCategoryId: this.stockConversionFormData.parentCategoryId,
        WarehouseId: this.sotckConversionDetailFormData.WarehouseId,
        CropYear: this.sotckConversionDetailFormData.CropBatch,
        ItemId: this.sotckConversionDetailFormData.ItemId,
        ToDate: new Date(),
        JobLotId: this.sotckConversionDetailFormData.JobLotId,
        Activity: "GetCurrentItemStockByWarehouseByJobLotAndCropYear",
      })
      .subscribe(
        (result) => {
          if (result[0].AvailableItemStock == null) {
            this.sotckConversionDetailFormData.Stock = 0;
          } else {
            this.sotckConversionDetailFormData.Stock = result[0].AvailableItemStock;
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  //#endregion

  //#region Handling Combo Values Change In Detail Form
  handleWarehouseChange = (e) => {
    if (this.sotckConversionDetailFormData.EntryType == "Issue") {
      this.getCropByWarehouseId();
    }
  };
  handleItemChange = (event) => {
    if (this.sotckConversionDetailFormData.EntryType == "") {
      this.message = "Please Select Entry Type First!";
      this.warningPopupVisibility = true;
    } else if (this.sotckConversionDetailFormData.EntryType == "Issue") {
      this.getLotsByItem();
      // this.getStockNAverageRate(event.value);
      this.getUOM(event.value);
    } else {
      this.getUOM(event.value);
    }
  };
  handleCropYearChange = (e) => {
    if (this.sotckConversionDetailFormData.EntryType == "Issue") {
      this.getItemsByCropYear();
    }
  };
  handleJobLotChange = (e) => {
    if (this.sotckConversionDetailFormData.EntryType == "Issue") {
      this.getItemStockByJobLot();
      this.getStockNAverageRate();
    }
  };

  handleMoistrueChange = (e) => {
    console.log(e);
    for (let i = 0; i < this.MoistureSlabList.length; i++) {
      if (e.value >= this.MoistureSlabList[i].MinValue && e.value <= this.MoistureSlabList[i].MaxValue) {
        this.sotckConversionDetailFormData.MoistureSlabId = this.MoistureSlabList[i].Id;
      }
    }
  };
  handleMoistureSlabChange = (e) => {
    console.log(e);
  };

  validateRateInDetailForm = (e) => {
    if (this.sotckConversionDetailFormData.EntryType == "Issue" || this.sotckConversionDetailFormData.EntryType == "Recovery By Product") {
      if (e.value > 0 == false) {
        return false;
      } else if (e.value > 0) {
        return true;
      }
    } else {
      return true;
    }
  };

  // getFilteredData=(e)=>
  // {
  //   let jobLot=this.sotckConversionDetailFormData.JobLotId;
  //   let item = this.sotckConversionDetailFormData.ItemId;
  //   let crop=this.sotckConversionDetailFormData.CropBatch;
  //   let warehouse=this.sotckConversionDetailFormData.WarehouseId;
  //   let entryType=this.sotckConversionDetailFormData.EntryType;
  //   if(jobLot>0 && item>0 && crop!="" && warehouse>0 && entryType=="Issue")
  //   {
  //     this.getItemStockByJobLot();
  //   }
  //   else if()
  // }

  //#endregion

  //#region DetailData
  //#region MiniMethods
  deleteInputDetailRow(data, index) {
    this.inputDataSource.splice(index, 1);
    this.deleteDataFromSummary(data);
  }

  deleteOutputDetailRow(data, index) {
    this.outputDataSource.splice(index, 1);
    this.deleteDataFromSummary(data);
  }
  checkClick(e) {
    if (e == "false") {
      this.warningPopupVisibility = false;
    }
  }

  handleEntryTypeChange = (e) => {
    if (e.value == "Recovery Head Rice") {
      this.RateReadOnlyInDetailForm = true;
    } else {
      this.RateReadOnlyInDetailForm = false;
    }
    if (e.value == "Issue") {
      this.getWarehouseByParentCategory();
    } else if (e.value != "Issue") {
      this.getWarehouse();
      this.getCropYear();
      this.getItem();
      this.getJobLot();
    }
  };
  handleParentCategoryChanged = (e) => {
    if (e.value > 0) {
      this.getWarehouseByParentCategory();
    }
  };

  //#endregion
  //#region MainMethods

  handleWeightAndAmountCalculation = (e) => {
    let ItemUom = parseInt(this.stockConversionDetailForm.instance.getEditor("ItemUomId").option("text"));
    let RateUom = parseInt(this.stockConversionDetailForm.instance.getEditor("RateUOMId").option("text"));
    let qty = parseFloat(this.stockConversionDetailForm.instance.getEditor("Qty").option("text"));
    let rate = parseFloat(this.stockConversionDetailForm.instance.getEditor("Rate").option("text"));
    if (ItemUom > 0 && qty > 0) {
      let NetWeight = ItemUom * qty;
      this.sotckConversionDetailFormData.Weight = parseFloat(NetWeight.toFixed(2));
    }
    if (rate > 0 && RateUom > 0 && this.sotckConversionDetailFormData.Weight > 0) {
      let NetAmount = (this.sotckConversionDetailFormData.Weight / RateUom) * rate;
      this.sotckConversionDetailFormData.AmountWithoutExpenses = parseFloat(NetAmount.toFixed(2));
    }
  };
  addDetailRecord2Grid() {
    if (validate(this.stockConversionDetailForm)) {
      if (this.sotckConversionDetailFormData.Stock > 0 == false && this.sotckConversionDetailFormData.EntryType == "Issue") {
        this.message = "Stock is not available for Issuance!";
        this.warningPopupVisibility = true;
        return;
      } else {
        this.sotckConversionDetailFormData.WareHouseName = this.stockConversionDetailForm.instance.getEditor("WarehouseId").option("text");
        this.sotckConversionDetailFormData.ItemName = this.stockConversionDetailForm.instance.getEditor("ItemId").option("text");
        this.sotckConversionDetailFormData.UOMDescription = this.stockConversionDetailForm.instance.getEditor("ItemUomId").option("text");
        this.sotckConversionDetailFormData.JobLotDescription = this.stockConversionDetailForm.instance.getEditor("JobLotId").option("text");
        this.sotckConversionDetailFormData.PackTypeDesc = this.stockConversionDetailForm.instance.getEditor("PackingtypeId").option("text");
        this.sotckConversionDetailFormData.Equivalent = this.stockConversionDetailForm.instance.getEditor("RateUOMId").option("text");
        this.sotckConversionDetailFormData.MoistureSlabDescription = this.stockConversionDetailForm.instance.getEditor("MoistureSlabId").option("text");
        if (this.sotckConversionDetailFormData.EntryType == "Issue") {
          this.sotckConversionDetailFormData.Amount = this.sotckConversionDetailFormData.AmountWithoutExpenses;
        }
        if (this.updateRowIndex >= 0) {
          if (this.sotckConversionDetailFormData.EntryType == "Issue") {
            this.tabPanel.instance.option("selectedIndex", 0);
            this.inputDataSource[this.updateRowIndex] = this.sotckConversionDetailFormData;
          } else {
            this.tabPanel.instance.option("selectedIndex", 1);
            this.outputDataSource[this.updateRowIndex] = this.sotckConversionDetailFormData;
          }
          this.updateRowIndex = -1;
          this.detailEditMode = false;

          this.proportionateOverheadGrid();

          this.proportionatedPackingMaterialAmountInOutputGrid();
        } else {
          if (this.sotckConversionDetailFormData.EntryType == "Issue") {
            this.tabPanel.instance.option("selectedIndex", 0);
            this.inputDataSource.push(this.sotckConversionDetailFormData);
          } else {
            this.tabPanel.instance.option("selectedIndex", 1);
            this.outputDataSource.push(this.sotckConversionDetailFormData);
          }

          this.proportionateOverheadGrid();

          this.proportionatedPackingMaterialAmountInOutputGrid();
        }

        // this.stockConversionDetailForm.instance.resetValues();
        this.sotckConversionDetailFormData = new VarietyConversionDetailModel();
        this.stockConversionDetailForm.instance.getEditor("EntryType").focus();
        this.GenerateSummaryForUser();
      }
    }
  }

  editDetailRecordRow(data, index) {
    this.detailEditMode = true;
    this.updateRowIndex = index;
    this.sotckConversionDetailFormData = data;
  }
  //#endregion
  //#endregion

  //#region PackingMaterialGrid
  onQuantityChangedInPackingMaterialGrid = (newData, value, currentRowData) => {
    newData.ItemQty = value;
    if (currentRowData.ItemRate > 0 && value > 0) {
      newData.ItemAmount = value * currentRowData.ItemRate;
    }
  };
  onRateChangedInPackingMaterialGrid = (newData, value, currentRowData) => {
    newData.ItemRate = value;
    if (value > 0 && currentRowData.ItemQty > 0) {
      newData.ItemAmount = value * currentRowData.ItemQty;
    }
  };
  onRowUpdatedInPackingMaterialGrid = (e) => {
    let data = { EntryType: "PackingMaterial", Qty: e.data.ItemQty, Rate: e.data.ItemRate, Amount: e.data.ItemAmount };
    this.GenerateSummaryForUser();
    this.proportionatedPackingMaterialAmountInOutputGrid();
  };
  onRowInsertedInPackingMaterialGrid = (e) => {
    let data = { EntryType: "PackingMaterial", Qty: e.data.ItemQty, Rate: e.data.ItemRate, Amount: e.data.ItemAmount };
    this.GenerateSummaryForUser();
    this.proportionatedPackingMaterialAmountInOutputGrid();
  };
  onRowRemovedInPackingMaterialGrid = (e) => {
    let data = { EntryType: "PackingMaterial", Qty: e.data.ItemQty, Rate: e.data.ItemRate, Amount: e.data.ItemAmount };
    this.deleteDataFromSummary(data);
    this.proportionatedPackingMaterialAmountInOutputGrid();
  };

  proportionatedPackingMaterialAmountInOutputGrid() {
    let totalPackingMaterialAmountAgainstHeadRice = 0;
    let totalPackingMaterialAmountAgainstByProduct = 0;
    let totalHeadRiceWeightInOutput = 0;
    let totalByProductWeightInOutput = 0;

    if (this.outputDataSource.length > 0 && this.packingMaterialDataSource.length > 0) {
      for (let i = 0; i < this.outputDataSource.length; i++) {
        if (this.outputDataSource[i].EntryType == "Recovery By Product") {
          totalByProductWeightInOutput += this.outputDataSource[i].Weight;
        } else if (this.outputDataSource[i].EntryType == "Recovery Head Rice") {
          totalHeadRiceWeightInOutput += this.outputDataSource[i].Weight;
        }
      }
      for (let i = 0; i < this.packingMaterialDataSource.length; i++) {
        if (this.packingMaterialDataSource[i].ChargeTo == "Recovery Head Rice") {
          totalPackingMaterialAmountAgainstHeadRice += this.packingMaterialDataSource[i].ItemAmount;
        } else if (this.packingMaterialDataSource[i].ChargeTo == "Recovery By Product") {
          totalPackingMaterialAmountAgainstByProduct += this.packingMaterialDataSource[i].ItemAmount;
        }
      }
      for (let i = 0; i < this.outputDataSource.length; i++) {
        if (this.outputDataSource[i].EntryType == "Recovery Head Rice") {
          let overheadCharges = (totalPackingMaterialAmountAgainstHeadRice / totalHeadRiceWeightInOutput) * this.outputDataSource[i].Weight;
          this.outputDataSource[i].PackingMaterialAmount = parseFloat(overheadCharges.toFixed(2));
        } else if (this.outputDataSource[i].EntryType == "Recovery By Product") {
          let overheadCharges = (totalPackingMaterialAmountAgainstByProduct / totalByProductWeightInOutput) * this.outputDataSource[i].Weight;
          this.outputDataSource[i].PackingMaterialAmount = parseFloat(overheadCharges.toFixed(2));
        }
      }
    } else if (this.outputDataSource.length > 0 && this.packingMaterialDataSource.length > 0 == false) {
      for (let i = 0; i < this.outputDataSource.length; i++) {
        this.outputDataSource[i].PackingMaterialAmount = 0;
      }
    }
  }

  //#endregion

  //#region OverheadGrid
  setRemarksInOverheadGrid = (newData, value, currentRowData) => {
    newData.LedgerRemarks = value;
  };
  setExpenseAmountInOverheadGrid = (newData, value, currentRowData) => {
    newData.ExpAmount = value;
  };
  rowInsertedInOverheadGrid = (e) => {
    let data = { EntryType: "Overheads", Amount: e.data.ExpAmount };
    this.GenerateSummaryForUser();
    this.proportionateOverheadGrid();
  };
  rowUpdatedInOverheadGrid = (e) => {
    let data = { EntryType: "Overheads", Amount: e.data.ExpAmount };
    this.GenerateSummaryForUser();
    this.proportionateOverheadGrid();
  };
  rowDeletedInOverheadGrid = (e) => {
    let data = { EntryType: "Overheads", Amount: e.data.ExpAmount };

    this.deleteDataFromSummary(data);
    this.proportionateOverheadGrid();
  };

  proportionateOverheadGrid() {
    let totalOverheadAmountAgainstHeadRice = 0;
    let totalOverheadAmountAgainstByProduct = 0;
    let totalHeadRiceWeightInOutput = 0;
    let totalByProductWeightInOutput = 0;

    if (this.outputDataSource.length > 0 && this.overheadDataSource.length > 0) {
      for (let i = 0; i < this.outputDataSource.length; i++) {
        if (this.outputDataSource[i].EntryType == "Recovery By Product") {
          totalByProductWeightInOutput += this.outputDataSource[i].Weight;
        } else if (this.outputDataSource[i].EntryType == "Recovery Head Rice") {
          totalHeadRiceWeightInOutput += this.outputDataSource[i].Weight;
        }
      }
      for (let i = 0; i < this.overheadDataSource.length; i++) {
        if (this.overheadDataSource[i].ChargeTo == "Recovery Head Rice") {
          totalOverheadAmountAgainstHeadRice += this.overheadDataSource[i].ExpAmount;
        } else if (this.overheadDataSource[i].ChargeTo == "Recovery By Product") {
          totalOverheadAmountAgainstByProduct += this.overheadDataSource[i].ExpAmount;
        }
      }
      for (let i = 0; i < this.outputDataSource.length; i++) {
        if (this.outputDataSource[i].EntryType == "Recovery Head Rice") {
          let overheadCharges = (totalOverheadAmountAgainstHeadRice / totalHeadRiceWeightInOutput) * this.outputDataSource[i].Weight;
          this.outputDataSource[i].ExpenseAmount = parseFloat(overheadCharges.toFixed(2));
        } else if (this.outputDataSource[i].EntryType == "Recovery By Product") {
          let overheadCharges = (totalOverheadAmountAgainstByProduct / totalByProductWeightInOutput) * this.outputDataSource[i].Weight;
          this.outputDataSource[i].ExpenseAmount = parseFloat(overheadCharges.toFixed(2));
        }
      }
    } else if (this.outputDataSource.length > 0 && this.overheadDataSource.length > 0 == false) {
      for (let i = 0; i < this.outputDataSource.length; i++) {
        this.outputDataSource[i].ExpenseAmount = 0;
      }
    }
  }
  //#endregion

  //#region GenerateSummary
  GenerateSummaryForUser() {
    this.summaryFormData = new DummyModelForSummary();
    for (let i = 0; i < this.inputDataSource.length; i++) {
      if (i == 0) {
        this.summaryFormData.TotalQuantityForInput = this.inputDataSource[i].Qty;
        this.summaryFormData.TotalWeightForInput = this.inputDataSource[i].Weight;
        this.summaryFormData.AverageRateForInput = this.inputDataSource[i].Rate;
        this.summaryFormData.TotalAmountForInput = this.inputDataSource[i].Amount;
      } else if (i > 0) {
        this.summaryFormData.TotalQuantityForInput += this.inputDataSource[i].Qty;
        this.summaryFormData.TotalWeightForInput += this.inputDataSource[i].Weight;
        this.summaryFormData.AverageRateForInput += this.inputDataSource[i].Rate;
        this.summaryFormData.TotalAmountForInput += this.inputDataSource[i].Amount;
      }
    }

    for (let i = 0; i < this.outputDataSource.length; i++) {
      if (this.outputDataSource[i].EntryType == "Recovery By Product") {
        if (this.summaryFormData.TotalAmountForOutput > 0 == false && this.summaryFormData.TotalWeightForOutput > 0 == false) {
          this.summaryFormData.TotalQuantityForOutput = this.outputDataSource[i].Qty;
          this.summaryFormData.TotalWeightForOutput = this.outputDataSource[i].Weight;
          this.summaryFormData.AverageRateForOutput = this.outputDataSource[i].Rate;
          this.summaryFormData.TotalAmountForOutput = this.outputDataSource[i].Amount;
        } else {
          this.summaryFormData.TotalQuantityForOutput += this.outputDataSource[i].Qty;
          this.summaryFormData.TotalWeightForOutput += this.outputDataSource[i].Weight;
          this.summaryFormData.AverageRateForOutput += this.outputDataSource[i].Rate;
          this.summaryFormData.TotalAmountForOutput += this.outputDataSource[i].Amount;
        }
      } else if (this.outputDataSource[i].EntryType == "Recovery Head Rice") {
        if (this.summaryFormData.TotalAmountFinishGoods > 0 == false && this.summaryFormData.TotalWeightFinishGoods > 0 == false) {
          this.summaryFormData.TotalQuantityFinishGoods = this.outputDataSource[i].Qty;
          this.summaryFormData.TotalWeightFinishGoods = this.outputDataSource[i].Weight;
          this.summaryFormData.AverageRateFinishGoods = this.outputDataSource[i].Rate;
          this.summaryFormData.TotalAmountFinishGoods = this.outputDataSource[i].Amount;
        } else {
          this.summaryFormData.TotalQuantityFinishGoods += this.outputDataSource[i].Qty;
          this.summaryFormData.TotalWeightFinishGoods += this.outputDataSource[i].Weight;
          this.summaryFormData.AverageRateFinishGoods += this.outputDataSource[i].Rate;
          this.summaryFormData.TotalAmountFinishGoods += this.outputDataSource[i].Amount;
        }
      }
    }
    for (let i = 0; i < this.packingMaterialDataSource.length; i++) {
      if (i == 0) {
        this.summaryFormData.TotalQuantityForPackingMaterial = this.packingMaterialDataSource[i].ItemQty;
        this.summaryFormData.AverageRateForPackingMaterial = this.packingMaterialDataSource[i].ItemRate;
        this.summaryFormData.TotalAmountForPackingMaterial = this.packingMaterialDataSource[i].ItemAmount;
      } else if (i > 0) {
      }
      this.summaryFormData.TotalQuantityForPackingMaterial += this.packingMaterialDataSource[i].ItemQty;
      this.summaryFormData.AverageRateForPackingMaterial += this.packingMaterialDataSource[i].ItemRate;
      this.summaryFormData.TotalAmountForPackingMaterial += this.packingMaterialDataSource[i].ItemAmount;
    }
    for (let i = 0; i < this.overheadDataSource.length; i++) {
      if (i == 0) {
        this.summaryFormData.TotalAmountForOverHeads = this.overheadDataSource[i].ExpAmount;
      } else if (i > 0) {
        this.summaryFormData.TotalAmountForOverHeads += this.overheadDataSource[i].ExpAmount;
      }
    }

    if (this.summaryFormData.TotalAmountForInput > 0 && this.summaryFormData.TotalWeightForInput > 0) {
      this.summaryFormData.AverageRateForInput = (this.summaryFormData.TotalAmountForInput / this.summaryFormData.TotalWeightForInput) * 40;
    }
    if (this.summaryFormData.TotalAmountForOutput > 0 && this.summaryFormData.TotalWeightForOutput > 0) {
      this.summaryFormData.AverageRateForOutput = (this.summaryFormData.TotalAmountForOutput / this.summaryFormData.TotalWeightForOutput) * 40;
    }
    if (this.summaryFormData.TotalAmountFinishGoods > 0 && this.summaryFormData.TotalWeightFinishGoods > 0) {
      let rate = (this.summaryFormData.TotalAmountFinishGoods / this.summaryFormData.TotalWeightFinishGoods) * 40;
      this.summaryFormData.AverageRateFinishGoods = parseFloat(rate.toFixed(2));
    }

    // console.log(data);
    // if (data.EntryType == "Issue") {
    //   if (this.summaryFormData.TotalQuantityForInput > 0 && this.summaryFormData.TotalAmountForInput > 0) {
    //     this.summaryFormData.TotalQuantityForInput += data.Qty;
    //     this.summaryFormData.TotalWeightForInput += data.Weight;
    //     this.summaryFormData.AverageRateForInput += data.Rate;
    //     this.summaryFormData.TotalAmountForInput += data.Amount;
    //   } else {
    //     this.summaryFormData.TotalQuantityForInput = data.Qty;
    //     this.summaryFormData.TotalWeightForInput = data.Weight;
    //     this.summaryFormData.AverageRateForInput = data.Rate;
    //     this.summaryFormData.TotalAmountForInput = data.Amount;
    //   }
    // } else if (data.EntryType == "Recovery By Product") {
    //   if (this.summaryFormData.TotalQuantityForOutput > 0 && this.summaryFormData.TotalAmountForOutput > 0) {
    //     this.summaryFormData.TotalQuantityForOutput += data.Qty;
    //     this.summaryFormData.TotalWeightForOutput += data.Weight;
    //     this.summaryFormData.AverageRateForOutput += data.Rate;
    //     this.summaryFormData.TotalAmountForOutput += data.Amount;
    //   } else {
    //     this.summaryFormData.TotalQuantityForOutput = data.Qty;
    //     this.summaryFormData.TotalWeightForOutput = data.Weight;
    //     this.summaryFormData.AverageRateForOutput = data.Rate;
    //     this.summaryFormData.TotalAmountForOutput = data.Amount;
    //   }
    // } else if (data.EntryType == "Recovery Head Rice") {
    //   if (this.summaryFormData.TotalQuantityFinishGoods > 0 && this.summaryFormData.TotalAmountFinishGoods > 0) {
    //     this.summaryFormData.TotalQuantityFinishGoods += data.Qty;
    //     this.summaryFormData.TotalWeightFinishGoods += data.Weight;
    //     this.summaryFormData.AverageRateFinishGoods += data.Rate;
    //     this.summaryFormData.TotalAmountFinishGoods += data.Amount;
    //   } else {
    //     this.summaryFormData.TotalQuantityFinishGoods = data.Qty;
    //     this.summaryFormData.TotalWeightFinishGoods = data.Weight;
    //     this.summaryFormData.AverageRateFinishGoods = data.Rate;
    //     this.summaryFormData.TotalAmountFinishGoods = data.Amount;
    //   }
    // } else if (data.EntryType == "Overheads") {
    //   if (this.summaryFormData.TotalAmountForOverHeads > 0) {
    //     this.summaryFormData.TotalAmountForOverHeads += data.Amount;
    //   } else {
    //     this.summaryFormData.TotalAmountForOverHeads = data.Amount;
    //   }
    // } else if (data.EntryType == "PackingMaterial") {
    //   if (this.summaryFormData.TotalQuantityForPackingMaterial > 0 && this.summaryFormData.TotalAmountForPackingMaterial > 0) {
    //     this.summaryFormData.TotalQuantityForPackingMaterial += data.Qty;
    //     this.summaryFormData.AverageRateForPackingMaterial += data.Rate;
    //     this.summaryFormData.TotalAmountForPackingMaterial += data.Amount;
    //   } else {
    //     this.summaryFormData.TotalQuantityForPackingMaterial = data.Qty;
    //     this.summaryFormData.AverageRateForPackingMaterial = data.Rate;
    //     this.summaryFormData.TotalAmountForPackingMaterial = data.Amount;
    //   }

    // }
  }

  deleteDataFromSummary(data) {
    if (data.EntryType == "Issue") {
      this.summaryFormData.TotalQuantityForInput -= data.Qty;
      this.summaryFormData.TotalWeightForInput -= data.Weight;
      this.summaryFormData.AverageRateForInput -= data.Rate;
      this.summaryFormData.TotalAmountForInput -= data.Amount;
    } else if (data.EntryType == "Recovery By Product") {
      this.summaryFormData.TotalQuantityForOutput -= data.Qty;
      this.summaryFormData.TotalWeightForOutput -= data.Weight;
      this.summaryFormData.AverageRateForOutput -= data.Rate;
      this.summaryFormData.TotalAmountForOutput -= data.Amount;
    } else if (data.EntryType == "Recovery Head Rice") {
      this.summaryFormData.TotalQuantityFinishGoods -= data.Qty;
      this.summaryFormData.TotalWeightFinishGoods -= data.Weight;
      this.summaryFormData.AverageRateFinishGoods -= data.Rate;
      this.summaryFormData.TotalAmountFinishGoods -= data.Amount;
    } else if (data.EntryType == "Overheads") {
      this.summaryFormData.TotalAmountForOverHeads -= data.Amount;
    } else if (data.EntryType == "PackingMaterial") {
      this.summaryFormData.TotalQuantityForPackingMaterial -= data.Qty;
      this.summaryFormData.AverageRateForPackingMaterial -= data.Rate;
      this.summaryFormData.TotalAmountForPackingMaterial -= data.Amount;
    }
  }
  //#endregion
  //#region Ma inCalculation
  // handleMainCaluculations() {
  //   let totalAmountInInputGrid = 0;
  //   let totalAmountInPackingMaterialGrid = 0;
  //   let totalAmountInOverheadsGrid = 0;
  //   let totalAmountForByProductInOutputGrid = 0;
  //   let totalHeadRiceWeightInOutpuGrid = 0;
  //   let totalWeightInOutputGrid = 0;

  //   for (let i = 0; i < this.inputDataSource.length; i++) {
  //     totalAmountInInputGrid += this.inputDataSource[i].Amount;
  //   }
  //   for (let i = 0; i < this.packingMaterialDataSource.length; i++) {
  //     totalAmountInPackingMaterialGrid += this.packingMaterialDataSource[i].ItemAmount;
  //   }
  //   for (let i = 0; i < this.overheadDataSource.length; i++) {
  //     totalAmountInOverheadsGrid += this.overheadDataSource[i].ExpAmount;
  //   }
  //   for (let i = 0; i < this.outputDataSource.length; i++) {
  //     if (this.outputDataSource[i].EntryType == "Recovery By Product") {
  //       totalAmountForByProductInOutputGrid += this.outputDataSource[i].Amount;
  //     }
  //     if (this.outputDataSource[i].EntryType == "Recovery Head Rice") {
  //       totalHeadRiceWeightInOutpuGrid += this.outputDataSource[i].Weight;
  //     }
  //     totalWeightInOutputGrid += this.outputDataSource[i].Weight;
  //   }

  //   let A1 = totalAmountInInputGrid + totalAmountInPackingMaterialGrid + totalAmountInOverheadsGrid;

  //   if (this.AverageRateFormulaForHeadRiceOnly == true) {
  //     let A2 = A1 - totalAmountForByProductInOutputGrid;
  //     let A3 = A2 / totalHeadRiceWeightInOutpuGrid;
  //     let AvgRate = A3 * 40;
  //     let opposite = (totalHeadRiceWeightInOutpuGrid / 40) * AvgRate;
  //     console.log(A2);
  //     console.log(opposite);
  //     console.log(AvgRate);
  //     for (let i = 0; i < this.outputDataSource.length; i++) {
  //       if (this.outputDataSource[i].EntryType == "Recovery Head Rice") {
  //         if (parseInt(this.outputDataSource[i].Equivalent) > 0) {
  //           let Rate = A3 * parseInt(this.outputDataSource[i].Equivalent);
  //           this.outputDataSource[i].Rate = parseInt(Rate.toFixed(0));
  //           let Amount = (this.outputDataSource[i].Weight / parseInt(this.outputDataSource[i].Equivalent)) * parseInt(Rate.toFixed(0));
  //           this.outputDataSource[i].Amount = parseInt(Amount.toFixed(0));
  //         } else {
  //           let Rate = A3;
  //           this.outputDataSource[i].Rate = parseInt(A3.toFixed(2));
  //           let Amount = (this.outputDataSource[i].Weight / 1) * parseInt(Rate.toFixed(0));
  //           this.outputDataSource[i].Amount = parseInt(Amount.toFixed(2));
  //         }
  //       }
  //     }
  //   } else if (this.AverageRateFormulaForByProductAndHeadRice == true) {
  //     let A2 = A1 / totalWeightInOutputGrid;
  //     for (let i = 0; i < this.outputDataSource.length; i++) {
  //       if (this.outputDataSource[i].EntryType == "Recovery Head Rice" || this.outputDataSource[i].EntryType == "Recovery By Product") {
  //         if (parseInt(this.outputDataSource[i].Equivalent) > 0) {
  //           let Rate = A2 * parseInt(this.outputDataSource[i].Equivalent);
  //           this.outputDataSource[i].Rate = parseInt(Rate.toFixed(0));
  //           let Amount = (this.outputDataSource[i].Weight / parseInt(this.outputDataSource[i].Equivalent)) * parseInt(Rate.toFixed(2));
  //           this.outputDataSource[i].Amount = parseInt(Amount.toFixed(2));
  //         } else {
  //           let Rate = A2;
  //           this.outputDataSource[i].Rate = parseInt(A2.toFixed(2));
  //           let Amount = (this.outputDataSource[i].Weight / 1) * parseInt(Rate.toFixed(2));
  //           this.outputDataSource[i].Amount = parseInt(Amount.toFixed(2));
  //         }
  //       }
  //     }
  //   }
  // }

  handleAverageRateCalculation() {
    let totalAmountInInput = 0;
    let totalByProductAmountInOutput = 0;
    let totalHeadRiceWeightinOutput = 0;
    for (let i = 0; i < this.inputDataSource.length; i++) {
      totalAmountInInput += parseInt(this.inputDataSource[i].AmountWithoutExpenses);
    }
    for (let i = 0; i < this.outputDataSource.length; i++) {
      if (this.outputDataSource[i].EntryType == "Recovery By Product") {
        totalByProductAmountInOutput += parseInt(this.outputDataSource[i].AmountWithoutExpenses);
      } else if (this.outputDataSource[i].EntryType == "Recovery Head Rice") {
        totalHeadRiceWeightinOutput += parseInt(this.outputDataSource[i].Weight);
      }
    }
    let Aa1 = parseInt(totalAmountInInput.toFixed(2)) - parseInt(totalByProductAmountInOutput.toFixed(2));
    let headRiceRateFor1KgWithoutExpese = parseInt(Aa1.toFixed(2)) / parseInt(totalHeadRiceWeightinOutput.toFixed(2));

    //#region CalculatingAndAssigningAvgRates

    for (let i = 0; i < this.outputDataSource.length; i++) {
      if (this.outputDataSource[i].EntryType == "Recovery By Product") {
        let totalAmount = parseInt(this.outputDataSource[i].AmountWithoutExpenses) + parseInt(this.outputDataSource[i].PackingMaterialAmount) + parseInt(this.outputDataSource[i].ExpenseAmount);
        this.outputDataSource[i].Amount = parseFloat(totalAmount.toFixed(2));
      } else if (this.outputDataSource[i].EntryType == "Recovery Head Rice") {
        // let rateWithoutExpenseFor1Kg = totalAmountInInput - totalByProductAmountInOutput / totalHeadRiceWeightinOutput;

        let rateWiehtoutExpeseAgainstUom = parseFloat(headRiceRateFor1KgWithoutExpese.toFixed(2)) * parseInt(this.outputDataSource[i].Equivalent);
        this.outputDataSource[i].Rate = parseInt(rateWiehtoutExpeseAgainstUom.toFixed(2));

        let amountWithoutExpense = (parseInt(this.outputDataSource[i].Weight) / parseInt(this.outputDataSource[i].Equivalent)) * parseFloat(rateWiehtoutExpeseAgainstUom.toFixed(2));
        this.outputDataSource[i].AmountWithoutExpenses = parseFloat(amountWithoutExpense.toFixed(2));

        let amountWithExpenses = parseInt(amountWithoutExpense.toFixed(2)) + parseInt(this.outputDataSource[i].PackingMaterialAmount) + parseInt(this.outputDataSource[i].ExpenseAmount);
        this.outputDataSource[i].Amount = parseInt(amountWithExpenses.toFixed(2));
      }
    }

    //#endregion
    this.GenerateSummaryForUser();
  }
  //#endregion
  //#region ResetForm
  resetForm() {
    this.inputDataSource = [];
    this.outputDataSource = [];
    this.packingMaterialDataSource = [];
    this.overheadDataSource = [];
    this.id4submit = 0;
    this.detailEditMode = false;
    this.initForm();
    this.stockConversionDetailForm.instance.getEditor("EntryType").focus();
  }
  onSave() {
    if (this.stockConversionParamsId > 0) {
      if (this.canUpdate) {
        this.handleSave();
      } else {
        notify("You don't have right to update", "error");
        return;
      }
    } else {
      if (this.canSave) {
        this.handleSave();
      } else {
        notify("You don't have right to save", "error");
        return;
      }
    }
  }
  //#endregion
  handleSave() {
    if (validate(this.stockConversionForm)) {
      if (this.inputDataSource.length > 0 == false) {
        this.message = "Input Detail Data Not Found!";
        this.warningPopupVisibility = true;
        return;
      } else if (this.outputDataSource.length > 0 == false) {
        this.message = "Output Detail Data Not Found!";
        this.warningPopupVisibility = true;
        return;
      }
      for (let i = 0; i < this.packingMaterialDataSource.length; i++) {
        if (this.packingMaterialDataSource[i].ItemAmount > 0 && this.packingMaterialDataSource[i].ItemId > 0 == false) {
          this.message = "Plese Select Item in Packing Material Detail Grid Row #" + (i + 1) + " .";
          this.warningPopupVisibility = true;
          return;
        }
      }
      for (let i = 0; i < this.overheadDataSource.length; i++) {
        if (this.overheadDataSource[i].ExpAmount > 0 && this.overheadDataSource[i].ChartOfAccountId > 0 == false) {
          this.message = "Please Select Account Against Expense in OverHead Detail Grid Row #" + (i + 1) + " .";
          this.warningPopupVisibility = true;
          return;
        }
      }
      for (let i = 0; i < this.inputDataSource.length; i++) {
        this.inputDataSource[i].Amount = this.inputDataSource[i].AmountWithoutExpenses;
      }

      let totalPackingMaterialAmountInPackingMatrialGrid = 0;
      let totalPackingMaterialAmountInOutputGrid = 0;
      let totalExpenseAmountInOverHeadeGrid = 0;
      let totalExpenseAmountInOutputGrid = 0;

      for (let i = 0; i < this.outputDataSource.length; i++) {
        totalExpenseAmountInOutputGrid += parseInt(this.outputDataSource[i].ExpenseAmount.toFixed(2));
        totalPackingMaterialAmountInOutputGrid += parseInt(this.outputDataSource[i].PackingMaterialAmount.toFixed(0));
      }

      for (let i = 0; i < this.overheadDataSource.length; i++) {
        totalExpenseAmountInOverHeadeGrid += parseInt(this.overheadDataSource[i].ExpAmount.toFixed(2));
      }
      for (let i = 0; i < this.packingMaterialDataSource.length; i++) {
        totalPackingMaterialAmountInPackingMatrialGrid += parseInt(this.packingMaterialDataSource[i].ItemAmount.toFixed(2));
      }
      if (
        totalPackingMaterialAmountInOutputGrid > 0 &&
        totalPackingMaterialAmountInPackingMatrialGrid > 0 &&
        totalPackingMaterialAmountInOutputGrid != totalPackingMaterialAmountInPackingMatrialGrid
      ) {
        this.message = "Packing Material Amount in Packing Material Grid is not equal to Packing Material Amount in Output Grid!";
        this.warningPopupVisibility = !this.warningPopupVisibility;
        return;
      }
      console.log(totalExpenseAmountInOutputGrid);
      console.log(totalExpenseAmountInOverHeadeGrid);
      if (totalExpenseAmountInOutputGrid > 0 && totalExpenseAmountInOverHeadeGrid > 0 && totalExpenseAmountInOutputGrid != totalExpenseAmountInOverHeadeGrid) {
        this.message = "Expense Amount in Overhead Grid is not equal to Expense Amount in Output Grid!";
        this.warningPopupVisibility = !this.warningPopupVisibility;
        return;
      }
      this.handleAverageRateCalculation();
      this.stockConversionFormData.Id = this.id4submit;

      this.stockConversionFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.stockConversionFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.stockConversionFormData.EntryDate = new Date();
      this.stockConversionFormData.ModifyDate = new Date();
      this.stockConversionFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.stockConversionFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.stockConversionFormData.DocTypeId = 66;
      this.stockConversionFormData.invStockConversionDetails = [];
      this.stockConversionFormData.invStockConversionAddExpenses = this.overheadDataSource;
      this.stockConversionFormData.invStockConversionPackings = this.packingMaterialDataSource;
      let lengthOfDetail = this.inputDataSource.length + this.outputDataSource.length;
      for (let i = 0; i < this.inputDataSource.length; i++) {
        this.stockConversionFormData.invStockConversionDetails.push(this.inputDataSource[i]);
      }
      for (let i = 0; i < this.outputDataSource.length; i++) {
        this.stockConversionFormData.invStockConversionDetails.push(this.outputDataSource[i]);
      }
      console.log(this.stockConversionFormData);
      this.service.saveStockConversion(this.stockConversionFormData).subscribe(
        (result) => {
          this.stockConversionParamsId ? notify("Record updated successfully", "success") : notify("Record saved successfully!", "success");
          this.router.navigate([], { queryParams: { Id: null } });
          this.resetForm();
        },
        (error) => console.log(error)
      );
    }
  }
}
