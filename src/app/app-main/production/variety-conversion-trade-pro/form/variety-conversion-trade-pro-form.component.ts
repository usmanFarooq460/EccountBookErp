import { Component, HostListener, Injectable, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent, DxTabPanelComponent } from "devextreme-angular";
import notify from "devextreme/ui/notify";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { validate } from "src/app/shared/Base/validationHelper";
import {
  VarietyConversionTradeProModel,
  VarietyConversionTradeProDetailModel,
  PackingMaterialModel,
  DummyModelForSummary,
  AvailableTrasactionsForIssuanceModel,
} from "../variety-conversion-trade-pro-model";
import { VarietyConversionTradeProService } from "../variety-conversion-trade-pro-service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "app-variety-conversion-form",
  templateUrl: "./variety-conversion-trade-pro-form.component.html",
  styleUrls: [],
})
export class VarietyConversionTradeProFormComponent implements OnInit {
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
  stockConversionFormData: VarietyConversionTradeProModel;
  @ViewChild("stockConversionDetailForm", { static: false })
  stockConversionDetailForm: DxFormComponent;
  sotckConversionDetailFormData: VarietyConversionTradeProDetailModel;
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
  errorPopupVisisble: boolean = false;
  successPopupVisible: boolean = false;
  loadPanelVisible: boolean = false;
  loadPanelMessage: string = "";
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
  configurationsList = [];
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
  EditingInInputGrid: boolean = false;
  //#endregion
  constructor(
    private commonMethods: CommonMethodsForCombos,
    private service: VarietyConversionTradeProService,
    private commonService: CommonBaseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  async ngOnInit() {
    this.stockConversionParamsId = this.route.snapshot.queryParams["Id"];
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.userRights();
    this.bagTypeList = await this.commonMethods.GetAllPackingTypes();
    this.accountHeadList = await this.commonMethods.GetAllCoaAllocations();
    this.warehouseList = await this.commonMethods.getWareHouse();
    this.itemList = await this.commonMethods.GetItemsForComboBind();

    this.getInventoryParentCategory();
    this.jobLotList = await this.commonMethods.getJobLot();
    this.initForm();
    if (this.stockConversionParamsId > 0) {
      this.setFields4editMode();
    }
  }
  initForm() {
    if (this.stockConversionParamsId > 0 == false) {
      this.getDocumentNo();
    }
    this.stockConversionFormData = new VarietyConversionTradeProModel();
    this.sotckConversionDetailFormData = new VarietyConversionTradeProDetailModel();
    this.summaryFormData = new DummyModelForSummary();
    this.AvailableTransactionsForIssuancePopupFormData = new AvailableTrasactionsForIssuanceModel();
    this.stockConversionFormData.DocDate = new Date();
    this.stockConversionFormData.BranchedId = this.branchList[0].Id;
    this.stockConversionFormData.ProjectsId = this.projectList[0].Id;
    this.AverageRateFormulaForHeadRiceOnly = true;
    this.AverageRateFormulaForByProductAndHeadRice = false;
    this.RateReadOnlyInDetailForm = false;
  }
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
          (error) => {
            this.message = error.ExceptionMessage;
            this.errorPopupVisisble = true;
          }
        ))
      : (this.id4submit = null);
  }
  loadPopup(e) {
    if (this.inputDataSource.length > 0 == false) {
      this.loaderVisibilityForAvailableTransactions = true;
    } else if (this.inputDataSource.length > 0) {
      if (this.inputDataSource[0].Identity > 0) {
        this.loaderVisibilityForAvailableTransactions = true;
      } else {
        this.message = "Cannot Load Data When Entry for Issuance is Done Manually!";
        this.errorPopupVisisble = true;
        return;
      }
    }
  }
  closeAvailableTransactionsForIssuancePopup(e) {
    if (e == "false") {
      this.loaderVisibilityForAvailableTransactions = false;
    }
  }
  getWarehouse() {
    this.service
      .getWareHouse({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => (this.warehouseList = result),
        (error) => {
          this.message = error.ExceptionMessage;
          this.errorPopupVisisble = true;
        }
      );
  }
  GetAllUom() {
    this.service
      .GetAllUom({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => {},
        (error) => {
          this.message = error.ExceptionMessage;
          this.errorPopupVisisble = true;
        }
      );
  }
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
        (error) => {
          this.message = error.ExceptionMessage;
          this.errorPopupVisisble = true;
        }
      );
  }
  validateUom(e) {
    if (e.value > 0 == false) {
      return false;
    } else {
      return true;
    }
  }
  getDocumentNo() {
    this.service
      .getDocumentNo({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocTypeId: 67,
      })
      .subscribe(
        (result) => {
          this.stockConversionFormData.DocSrNo = result;
        },
        (error) => {
          this.message = error.ExceptionMessage;
          this.errorPopupVisisble = true;
        }
      );
  }
  GetAvailableStock() {
    this.service
      .GetAvailableStock({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        WarehouseId: this.sotckConversionDetailFormData.WarehouseId,
        ItemId: this.sotckConversionDetailFormData.ItemId,
        JobLotId: this.sotckConversionDetailFormData.JobLotId,
        ToDate: this.stockConversionFormData.DocDate,
      })
      .subscribe(
        (result) => {
          if (this.inputDataSource.length > 0 == false) {
            this.sotckConversionDetailFormData.Stock = result;
          } else if (this.inputDataSource.length > 0) {
            let loadedStock = 0;
            for (let i = 0; i < this.inputDataSource.length; i++) {
              if (
                this.inputDataSource[i].ItemId == this.sotckConversionDetailFormData.ItemId &&
                this.inputDataSource[i].WarehouseId == this.sotckConversionDetailFormData.WarehouseId &&
                this.inputDataSource[i].JobLotId == this.sotckConversionDetailFormData.JobLotId
              ) {
                loadedStock += this.inputDataSource[i].Qty;
              }
            }
            this.sotckConversionDetailFormData.Stock = result - loadedStock;
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  GetAverageRate() {
    this.service
      .GetAverageRate({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        WarehouseId: this.sotckConversionDetailFormData.WarehouseId,
        ItemId: this.sotckConversionDetailFormData.ItemId,
        JobLotId: this.sotckConversionDetailFormData.JobLotId,
        ToDate: this.stockConversionFormData.DocDate,
      })
      .subscribe(
        (result) => {
          this.sotckConversionDetailFormData.AverageRate = result;
          this.sotckConversionDetailFormData.Rate = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getStockAndAverageRate = (e) => {
    if (this.stockConversionParamsId > 0 == false) {
      if (this.sotckConversionDetailFormData.EntryType == "Issue") {
        if (this.inputDataSource.length > 0 == false) {
          this.GetAverageRate();
          this.GetAvailableStock();
        } else if (this.inputDataSource.length > 0) {
          if (this.inputDataSource[0].Identity > 0 == false) {
            this.GetAverageRate();
            this.GetAvailableStock();
          }
        }
      }
    }
  };
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
          this.message = error.ExceptionMessage;
          this.errorPopupVisisble = true;
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
        (error) => {
          this.message = error.ExceptionMessage;
          this.errorPopupVisisble = true;
        }
      );
  }
  handleItemChange = (event) => {
    this.getUOM(event.value);
    this.getStockAndAverageRate(1);
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
  deleteInputDetailRow(data, index) {
    this.inputDataSource.splice(index, 1);
    this.deleteDataFromSummary(data);
  }
  deleteOutputDetailRow(data, index) {
    this.outputDataSource.splice(index, 1);
    this.deleteDataFromSummary(data);
  }
  checkClick(e) {
    this.warningPopupVisibility = false;
    this.successPopupVisible = false;
    this.errorPopupVisisble = false;
  }
  handleEntryTypeChange = (e) => {
    if (e.value == "Recovery Head Rice") {
      this.RateReadOnlyInDetailForm = true;
      this.tabPanel.instance.option("selectedIndex", 1);
    } else if (e.value == "Issue") {
      this.tabPanel.instance.option("selectedIndex", 0);
      this.RateReadOnlyInDetailForm = true;
    } else if (e.value == "Recovery By Product") {
      this.RateReadOnlyInDetailForm = false;
      this.tabPanel.instance.option("selectedIndex", 1);
    }
  };
  handleWeightAndAmountCalculation = (e) => {
    let qty = 0;
    if (parseFloat(this.stockConversionDetailForm.instance.getEditor("Qty").option("text")) > 0) {
      qty = parseFloat(this.stockConversionDetailForm.instance.getEditor("Qty").option("text"));
    }
    let rate = 0;
    if (parseFloat(this.stockConversionDetailForm.instance.getEditor("Rate").option("text")) > 0) {
      rate = parseFloat(this.stockConversionDetailForm.instance.getEditor("Rate").option("text"));
    }
    let Amount = qty * rate;
    this.sotckConversionDetailFormData.Amount = parseFloat(Amount.toFixed(2));
    this.sotckConversionDetailFormData.AmountWithoutExpenses = parseFloat(Amount.toFixed(2));
  };
  addDetailRecord2Grid() {
    if (validate(this.stockConversionDetailForm)) {
      this.sotckConversionDetailFormData.WareHouseName = this.stockConversionDetailForm.instance.getEditor("WarehouseId").option("text");
      this.sotckConversionDetailFormData.ItemName = this.stockConversionDetailForm.instance.getEditor("ItemId").option("text");
      this.sotckConversionDetailFormData.UOMDescription = this.stockConversionDetailForm.instance.getEditor("ItemUomId").option("text");
      this.sotckConversionDetailFormData.JobLotDescription = this.stockConversionDetailForm.instance.getEditor("JobLotId").option("text");
      this.sotckConversionDetailFormData.Equivalent = this.stockConversionDetailForm.instance.getEditor("RateUOMId").option("text");
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
      this.sotckConversionDetailFormData = new VarietyConversionTradeProDetailModel();
      this.stockConversionDetailForm.instance.getEditor("EntryType").focus();
      this.GenerateSummaryForUser();
    }
  }
  editDetailRecordRow(data, index) {
    this.detailEditMode = true;
    this.updateRowIndex = index;
    this.sotckConversionDetailFormData = data;
  }
  onQuantityChangeInInputGrid = (newData, value, currentRowData) => {
    newData.Qty = value;
    let weight = 0;
    if (value > 0 && parseInt(currentRowData.UOMDescription) > 0) {
      weight = value * parseInt(currentRowData.UOMDescription);
      newData.Weight = value * parseInt(currentRowData.UOMDescription);
    }
    if (currentRowData.Rate > 0 && parseInt(currentRowData.Equivalent) && weight > 0) {
      let NetAmount = (weight / parseInt(currentRowData.Equivalent)) * currentRowData.Rate;
      newData.Amount = parseInt(NetAmount.toFixed(2));
      newData.AmountWithoutExpenses = parseInt(NetAmount.toFixed(2));
    }
  };
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
    let totalByProductQuantityInOutput = 0;
    let totalHeadRiceQuantityInOutput = 0;
    if (this.outputDataSource.length > 0 && this.packingMaterialDataSource.length > 0) {
      for (let i = 0; i < this.outputDataSource.length; i++) {
        if (this.outputDataSource[i].EntryType == "Recovery By Product") {
          totalByProductQuantityInOutput += this.outputDataSource[i].Qty;
        } else if (this.outputDataSource[i].EntryType == "Recovery Head Rice") {
          totalHeadRiceQuantityInOutput += this.outputDataSource[i].Qty;
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
          let overheadCharges = (totalPackingMaterialAmountAgainstHeadRice / totalHeadRiceQuantityInOutput) * this.outputDataSource[i].Qty;
          this.outputDataSource[i].PackingMaterialAmount = parseFloat(overheadCharges.toFixed(2));
        } else if (this.outputDataSource[i].EntryType == "Recovery By Product") {
          let overheadCharges = (totalPackingMaterialAmountAgainstByProduct / totalByProductQuantityInOutput) * this.outputDataSource[i].Qty;
          this.outputDataSource[i].PackingMaterialAmount = parseFloat(overheadCharges.toFixed(2));
        }
      }
    } else if (this.outputDataSource.length > 0 && this.packingMaterialDataSource.length > 0 == false) {
      for (let i = 0; i < this.outputDataSource.length; i++) {
        this.outputDataSource[i].PackingMaterialAmount = 0;
      }
    }
  }
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
    let totalHeadRiceQtyInOutput = 0;
    let totalByProductQtyInOutput = 0;
    if (this.outputDataSource.length > 0 && this.overheadDataSource.length > 0) {
      for (let i = 0; i < this.outputDataSource.length; i++) {
        if (this.outputDataSource[i].EntryType == "Recovery By Product") {
          totalByProductQtyInOutput += this.outputDataSource[i].Qty;
        } else if (this.outputDataSource[i].EntryType == "Recovery Head Rice") {
          totalHeadRiceQtyInOutput += this.outputDataSource[i].Qty;
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
          let overheadCharges = (totalOverheadAmountAgainstHeadRice / totalHeadRiceQtyInOutput) * this.outputDataSource[i].Qty;
          this.outputDataSource[i].ExpenseAmount = parseFloat(overheadCharges.toFixed(2));
        } else if (this.outputDataSource[i].EntryType == "Recovery By Product") {
          let overheadCharges = (totalOverheadAmountAgainstByProduct / totalByProductQtyInOutput) * this.outputDataSource[i].Qty;
          this.outputDataSource[i].ExpenseAmount = parseFloat(overheadCharges.toFixed(2));
        }
      }
    } else if (this.outputDataSource.length > 0 && this.overheadDataSource.length > 0 == false) {
      for (let i = 0; i < this.outputDataSource.length; i++) {
        this.outputDataSource[i].ExpenseAmount = 0;
      }
    }
  }
  GenerateSummaryForUser() {
    this.summaryFormData = new DummyModelForSummary();
    if (this.inputDataSource.length > 0) {
      for (let i = 0; i < this.inputDataSource.length; i++) {
        if (i == 0) {
          this.summaryFormData.TotalQuantityForInput = this.inputDataSource[i].Qty;
          this.summaryFormData.TotalAmountForInput = this.inputDataSource[i].Amount;
        } else if (i > 0) {
          this.summaryFormData.TotalQuantityForInput += this.inputDataSource[i].Qty;
          this.summaryFormData.TotalAmountForInput += this.inputDataSource[i].Amount;
        }
      }
      this.summaryFormData.AverageRateForInput = this.summaryFormData.TotalAmountForInput / this.summaryFormData.TotalQuantityForInput;
    }
    if (this.outputDataSource.length > 0) {
      for (let i = 0; i < this.outputDataSource.length; i++) {
        if (this.outputDataSource[i].EntryType == "Recovery By Product") {
          if (this.summaryFormData.TotalAmountForOutput > 0 == false) {
            this.summaryFormData.TotalQuantityForOutput = this.outputDataSource[i].Qty;
            this.summaryFormData.AverageRateForOutput = this.outputDataSource[i].Rate;
            this.summaryFormData.TotalAmountForOutput = this.outputDataSource[i].Amount;
          } else {
            this.summaryFormData.TotalQuantityForOutput += this.outputDataSource[i].Qty;
            this.summaryFormData.AverageRateForOutput += this.outputDataSource[i].Rate;
            this.summaryFormData.TotalAmountForOutput += this.outputDataSource[i].Amount;
          }
        } else if (this.outputDataSource[i].EntryType == "Recovery Head Rice") {
          if (this.summaryFormData.TotalAmountFinishGoods > 0 == false) {
            this.summaryFormData.TotalQuantityFinishGoods = this.outputDataSource[i].Qty;
            this.summaryFormData.TotalAmountFinishGoods = this.outputDataSource[i].Amount;
          } else {
            this.summaryFormData.TotalQuantityFinishGoods += this.outputDataSource[i].Qty;
            this.summaryFormData.TotalAmountFinishGoods += this.outputDataSource[i].Amount;
          }
        }
      }
      if (this.summaryFormData.TotalAmountFinishGoods > 0) {
        this.summaryFormData.AverageRateFinishGoods = this.summaryFormData.TotalAmountFinishGoods / this.summaryFormData.TotalQuantityFinishGoods;
      }
      if (this.summaryFormData.TotalAmountForOutput > 0) {
        this.summaryFormData.AverageRateForOutput = this.summaryFormData.TotalAmountForOutput / this.summaryFormData.TotalQuantityForOutput;
      }
    }
    if (this.packingMaterialDataSource.length > 0) {
      for (let i = 0; i < this.packingMaterialDataSource.length; i++) {
        if (i == 0) {
          this.summaryFormData.TotalQuantityForPackingMaterial = this.packingMaterialDataSource[i].ItemQty;
          this.summaryFormData.TotalAmountForPackingMaterial = this.packingMaterialDataSource[i].ItemAmount;
        } else if (i > 0) {
        }
        this.summaryFormData.TotalQuantityForPackingMaterial += this.packingMaterialDataSource[i].ItemQty;
        this.summaryFormData.TotalAmountForPackingMaterial += this.packingMaterialDataSource[i].ItemAmount;
      }
      this.summaryFormData.AverageRateForPackingMaterial = this.summaryFormData.TotalAmountForPackingMaterial / this.summaryFormData.TotalQuantityForPackingMaterial;
    }
    if (this.overheadDataSource.length > 0) {
      for (let i = 0; i < this.overheadDataSource.length; i++) {
        if (i == 0) {
          this.summaryFormData.TotalAmountForOverHeads = this.overheadDataSource[i].ExpAmount;
        } else if (i > 0) {
          this.summaryFormData.TotalAmountForOverHeads += this.overheadDataSource[i].ExpAmount;
        }
      }
    }
  }
  deleteDataFromSummary(data) {
    if (data.EntryType == "Issue") {
      this.summaryFormData.TotalQuantityForInput -= data.Qty;
      this.summaryFormData.TotalAmountForInput -= data.Amount;
      if (this.summaryFormData.TotalAmountForInput > 0) {
        this.summaryFormData.AverageRateForInput = this.summaryFormData.TotalAmountForInput / this.summaryFormData.TotalQuantityForInput;
      } else {
        this.summaryFormData.AverageRateForInput = 0;
      }
    } else if (data.EntryType == "Recovery By Product") {
      this.summaryFormData.TotalQuantityForOutput -= data.Qty;
      this.summaryFormData.TotalAmountForOutput -= data.Amount;
      if (this.summaryFormData.TotalAmountForOutput > 0) {
        this.summaryFormData.AverageRateForOutput = this.summaryFormData.TotalAmountForOutput / this.summaryFormData.TotalQuantityForOutput;
      } else {
        this.summaryFormData.AverageRateForOutput = 0;
      }
    } else if (data.EntryType == "Recovery Head Rice") {
      this.summaryFormData.TotalQuantityFinishGoods -= data.Qty;
      this.summaryFormData.TotalAmountFinishGoods -= data.Amount;
      if (this.summaryFormData.TotalAmountFinishGoods > 0) {
        this.summaryFormData.AverageRateFinishGoods = this.summaryFormData.TotalAmountFinishGoods / this.summaryFormData.TotalQuantityFinishGoods;
      } else {
        this.summaryFormData.AverageRateFinishGoods = 0;
      }
    } else if (data.EntryType == "Overheads") {
      this.summaryFormData.TotalAmountForOverHeads -= data.Amount;
    } else if (data.EntryType == "PackingMaterial") {
      this.summaryFormData.TotalQuantityForPackingMaterial -= data.Qty;
      this.summaryFormData.TotalAmountForPackingMaterial -= data.Amount;
      if (this.summaryFormData.TotalAmountForPackingMaterial > 0) {
        this.summaryFormData.AverageRateForPackingMaterial = this.summaryFormData.TotalAmountForPackingMaterial / this.summaryFormData.TotalQuantityForPackingMaterial;
      } else {
        this.summaryFormData.AverageRateForPackingMaterial = 0;
      }
    }
  }
  handleAverageRateCalculation(e) {
    let totalAmountInInput = 0;
    let totalByProductAmountInOutput = 0;
    let totalHeadRiceQuantityInOutput = 0;
    for (let i = 0; i < this.inputDataSource.length; i++) {
      totalAmountInInput += parseInt(this.inputDataSource[i].AmountWithoutExpenses);
    }
    for (let i = 0; i < this.outputDataSource.length; i++) {
      if (this.outputDataSource[i].EntryType == "Recovery By Product") {
        totalByProductAmountInOutput += parseInt(this.outputDataSource[i].AmountWithoutExpenses);
      } else if (this.outputDataSource[i].EntryType == "Recovery Head Rice") {
        totalHeadRiceQuantityInOutput += parseInt(this.outputDataSource[i].Qty);
      }
    }
    let Aa1 = parseInt(totalAmountInInput.toFixed(2)) - parseInt(totalByProductAmountInOutput.toFixed(2));
    let headRiceRate = parseInt(Aa1.toFixed(2)) / parseInt(totalHeadRiceQuantityInOutput.toFixed(2));
    //#region CalculatingAndAssigningAvgRates
    for (let i = 0; i < this.outputDataSource.length; i++) {
      if (this.outputDataSource[i].EntryType == "Recovery By Product") {
        let totalAmount = parseInt(this.outputDataSource[i].AmountWithoutExpenses) + parseInt(this.outputDataSource[i].PackingMaterialAmount) + parseInt(this.outputDataSource[i].ExpenseAmount);
        this.outputDataSource[i].Amount = parseFloat(totalAmount.toFixed(2));
      } else if (this.outputDataSource[i].EntryType == "Recovery Head Rice") {
        // let rateWithoutExpenseFor1Kg = totalAmountInInput - totalByProductAmountInOutput / totalHeadRiceWeightinOutput;
        this.outputDataSource[i].Rate = parseFloat(headRiceRate.toFixed(2));
        let amountWithoutExpense = parseInt(this.outputDataSource[i].Qty) * parseFloat(headRiceRate.toFixed(2));
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
  resetForm(e) {
    this.inputDataSource = [];
    this.outputDataSource = [];
    this.packingMaterialDataSource = [];
    this.overheadDataSource = [];
    this.id4submit = 0;
    this.detailEditMode = false;
    this.initForm();
    this.stockConversionDetailForm.instance.getEditor("EntryType").focus();
  }
  onSave(e) {
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
  onClose(e) {
    this.router.navigate(["/production/variety-conversion-trade-pro-history"]);
  }

  //#endregion
  //#region LoadingSelectedDataForIssuance
  loadSelectedData(data) {
    if (this.inputDataSource.length > 0 == false) {
      for (let i = 0; i < data.length; i++) {
        this.inputDataSource.push({
          EntryType: "Issue",
          WarehouseId: data[i].WarehouseId,
          WareHouseName: data[i].WareHouseCode,
          ItemId: data[i].ItemId,
          ItemName: data[i].ItemName,
          ItemUomId: 0,
          UOMDescription: 0,
          JobLotId: data[i].JobLotId,
          JobLotDescription: data[i].JobLotCode,
          Qty: 0,
          Stock: data[i].BalQty,
          Rate: parseInt(data[i].AvgRate),
          AverageRate: parseInt(data[i].AvgRate),
          RateUOMId: 0,
          Equivalent: 0,
          Amount: 0,
          AmountWithoutExpenses: 0,
          Remarks: "",
          Identity: data[i].Identity,
        });
      }
    } else if (this.inputDataSource.length > 0) {
      let duplicateEntries = [];
      let newEntries = [];
      for (let i = 0; i < data.length; i++) {
        let flag = false;
        for (let j = 0; j < this.inputDataSource.length; j++) {
          if (data[i].Identity == this.inputDataSource[j].Identity) {
            flag = true;
          }
        }
        if (flag == false) {
          newEntries.push(data[i]);
        } else if (flag == true) {
          duplicateEntries.push(data[i]);
        }
      }
      for (let i = 0; i < newEntries.length; i++) {
        this.inputDataSource.push({
          EntryType: "Issue",
          WarehouseId: newEntries[i].WarehouseId,
          WareHouseName: newEntries[i].WareHouseCode,
          ItemId: newEntries[i].ItemId,
          ItemName: newEntries[i].ItemName,
          ItemUomId: 0,
          UOMDescription: 0,
          JobLotId: newEntries[i].JobLotId,
          JobLotDescription: newEntries[i].JobLotCode,
          Qty: 0,
          Stock: newEntries[i].BalQty,
          AverageRate: parseInt(data[i].AvgRate),
          Rate: parseInt(newEntries[i].AvgRate),
          RateUOMId: 0,
          Equivalent: 0,
          Amount: 0,
          AmountWithoutExpenses: 0,
          Remarks: "",
          Identity: newEntries[i].Identity,
        });
      }
      for (let i = 0; i < duplicateEntries.length; i++) {
        let loadedStock = 0;
        for (let j = 0; j < this.inputDataSource.length; j++) {
          if (duplicateEntries[i].Identity == this.inputDataSource[j].Identity) {
            loadedStock += this.inputDataSource[j].Qty;
          }
        }
        this.inputDataSource.push({
          EntryType: "Issue",
          WarehouseId: duplicateEntries[i].WarehouseId,
          WareHouseName: duplicateEntries[i].WareHouseCode,
          ItemId: duplicateEntries[i].ItemId,
          ItemName: duplicateEntries[i].ItemName,
          ItemUomId: 0,
          UOMDescription: 0,
          AverageRate: parseInt(data[i].AvgRate),
          JobLotId: duplicateEntries[i].JobLotId,
          JobLotDescription: duplicateEntries[i].JobLotCode,
          Qty: 0,
          Stock: duplicateEntries[i].BalQty - loadedStock,
          Rate: parseInt(duplicateEntries[i].AvgRate),
          RateUOMId: 0,
          Equivalent: 0,
          Amount: 0,
          AmountWithoutExpenses: 0,
          Remarks: "",
          Identity: duplicateEntries[i].Identity,
        });
      }
    }
    this.loaderVisibilityForAvailableTransactions = false;
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
      for (let i = 0; i < this.inputDataSource.length; i++) {
        if (this.inputDataSource[i].Qty > 0 == false) {
          this.message = "Qty not found in Input Grid Row #" + (i + 1) + " .";
          this.warningPopupVisibility = true;
          return;
        } else if (this.inputDataSource[i].ItemUomId > 0 == false) {
          this.message = "Item UOM not found in Input Grid Row #" + (i + 1) + " .";
          this.warningPopupVisibility = true;
          return;
        } else if (this.inputDataSource[i].Amount > 0 == false) {
          this.message = "Item Amount not found in Input Grid Row #" + (i + 1) + " .";
          this.warningPopupVisibility = true;
          return;
        }
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
      // let totalPackingMaterialAmountInPackingMatrialGrid = 0;
      // let totalPackingMaterialAmountInOutputGrid = 0;
      // let totalExpenseAmountInOverHeadeGrid = 0;
      // let totalExpenseAmountInOutputGrid = 0;
      // for (let i = 0; i < this.outputDataSource.length; i++) {
      //   totalExpenseAmountInOutputGrid += parseInt(this.outputDataSource[i].ExpenseAmount.toFixed(2));
      //   totalPackingMaterialAmountInOutputGrid += parseInt(this.outputDataSource[i].PackingMaterialAmount.toFixed(0));
      // }
      // for (let i = 0; i < this.overheadDataSource.length; i++) {
      //   totalExpenseAmountInOverHeadeGrid += parseInt(this.overheadDataSource[i].ExpAmount.toFixed(2));
      // }
      // for (let i = 0; i < this.packingMaterialDataSource.length; i++) {
      //   totalPackingMaterialAmountInPackingMatrialGrid += parseInt(this.packingMaterialDataSource[i].ItemAmount.toFixed(2));
      // }
      // if (
      //   totalPackingMaterialAmountInOutputGrid > 0 &&
      //   totalPackingMaterialAmountInPackingMatrialGrid > 0 &&
      //   totalPackingMaterialAmountInOutputGrid != totalPackingMaterialAmountInPackingMatrialGrid
      // ) {
      //   this.message = "Packing Material Amount in Packing Material Grid is not equal to Packing Material Amount in Output Grid!";
      //   this.warningPopupVisibility = !this.warningPopupVisibility;
      //   return;
      // }
      // if (totalExpenseAmountInOutputGrid > 0 && totalExpenseAmountInOverHeadeGrid > 0 && totalExpenseAmountInOutputGrid != totalExpenseAmountInOverHeadeGrid) {
      //   this.message = "Expense Amount in Overhead Grid is not equal to Expense Amount in Output Grid!";
      //   this.warningPopupVisibility = !this.warningPopupVisibility;
      //   return;
      // }
      this.handleAverageRateCalculation(1);
      this.stockConversionFormData.Id = this.id4submit;
      this.stockConversionFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.stockConversionFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.stockConversionFormData.EntryDate = new Date();
      this.stockConversionFormData.ModifyDate = new Date();
      this.stockConversionFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.stockConversionFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.stockConversionFormData.DocTypeId = 67;
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
      if (this.stockConversionParamsId > 0) {
        this.loadPanelMessage = "Updating";
      } else {
        this.loadPanelMessage = "Saving";
      }
      this.loadPanelVisible = true;
      console.group(this.stockConversionFormData);
      for (let i = 0; i < this.stockConversionFormData.invStockConversionDetails.length; i++) {
        this.stockConversionFormData.invStockConversionDetails[i].Id = 0;
      }
      this.service.saveStockConversion(this.stockConversionFormData).subscribe(
        (result) => {
          this.stockConversionParamsId ? notify("Record updated successfully", "success") : notify("Record saved successfully!", "success");
          this.router.navigate([], { queryParams: { Id: null } });
          this.resetForm(1);
          this.loadPanelVisible = false;
        },
        (error) => {
          this.loadPanelVisible = false;
          this.message = error.ExceptionMessage;
          this.errorPopupVisisble = true;
        }
      );
    }
  }
}
