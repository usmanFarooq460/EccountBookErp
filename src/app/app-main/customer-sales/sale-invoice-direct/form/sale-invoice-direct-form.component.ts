import { ThrowStmt } from "@angular/compiler";
import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent, DxSwitchComponent } from "devextreme-angular";
import notify from "devextreme/ui/notify";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { validate } from "src/app/shared/Base/validationHelper";
import {
  SaleInvoiceDirectExpenseModel,
  SaleInvoiceDirectJournalModel,
  SaleOrderDetailModelInLoader,
  SaleOrderLoaderFormModel,
  SaleInvoiceDirectMainModel,
  SaleInvoiceDirectDetailModel,
} from "../sale-invoice-direct.model";
import { PurchaseInvoiceDirectService } from "../sale-invoice-direct.service";
import { LoaderForAvailableTransactionsForIssuanceComponent } from "src/app/shared/ui/loader-for-available-transactions-for-issuance/loader-for-available-transactions-for-issuance.component";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "app-sale-invoice-direct-form",
  templateUrl: "./sale-invoice-direct-form.component.html",
  styleUrls: ["../detail/detail.component.scss"],
})
export class SaleInvoiceDirectFormComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  popupGrid: DxDataGridComponent;
  @ViewChild(DxDataGridComponent, { static: false })
  detailGrid: DxDataGridComponent;
  @ViewChild(DxDataGridComponent, { static: false })
  journalGrid: DxDataGridComponent;
  @ViewChild(DxDataGridComponent, { static: false })
  expenseGrid: DxDataGridComponent;
  @ViewChild(LoaderForAvailableTransactionsForIssuanceComponent, { static: false })
  availableStockLoader: LoaderForAvailableTransactionsForIssuanceComponent;
  @ViewChild(DxDataGridComponent, { static: false })
  orderDetailGrid: DxDataGridComponent;
  @ViewChild(DxDataGridComponent, { static: false })
  availableStockGridAgainstOrder: DxDataGridComponent;
  // @ViewChild(DxDataGridComponent, { static: false })
  // EmptyBagsDataGrid: DxDataGridComponent;
  @ViewChild("MainForm", { static: false }) // Purchase Bill form instance
  MainForm: DxFormComponent;
  MainFormData: SaleInvoiceDirectMainModel; // Purchase Bill form object
  @ViewChild("DetailForm", { static: false }) // Purchase bill detail form instance
  DetailForm: DxFormComponent;
  DetailFormData: SaleInvoiceDirectDetailModel; // purchase bill detail form object
  @ViewChild("SaleOrderLoaderForm", { static: false })
  SaleOrderLoaderForm: DxFormComponent;
  SaleOrderLoaderFormData: SaleOrderLoaderFormModel;
  @ViewChild("popupForm", { static: false })
  popupForm: DxFormComponent;
  popupFormData: any;
  @ViewChild("switch", { static: false })
  switch: DxSwitchComponent;
  dataSource = [];
  popupDataSource = [];
  journalDataSource = new Array<SaleInvoiceDirectJournalModel>();
  paymentDueDataSource = [];
  expenseDataSource = new Array<SaleInvoiceDirectExpenseModel>();

  companyList = [];
  branchList = [];
  projectList = [];
  paymentTermList = [];
  warehouseList = [];
  itemList = [];
  supplierCustomerList: any;
  uomList = [];
  jobLotList = [];
  PackingTypeList = [];
  batchList = [];
  deliveryTermList = ["Load", "Ponch"];
  commissionTypeList = ["Flat", "Percent", "Comm. Weight"];
  rateUOMList = [1, 5, 10, 25, 40, 60, 80, 100];
  accountList = [];

  emptyBagsList = [];
  RecordListAgainstSelectedPurchaseOrders = [];

  itemAccountList;
  loadStatus: boolean;
  loadGrnIds: string;
  loadGrnIdsForExpnese: string;
  loadGrnIds4EB: string;
  updateDetailRowIndex: number;
  dataLoadedFromLoader: boolean;
  amountStatus: boolean = true;
  detailDataGridUpdated: boolean;
  supplierBillAmount: number;
  loadButtonStatus: boolean;
  purchaseInvoiceDirectParamsId: number;
  SupplierGlAccountId: number;
  id4submit: number;
  organizationId: number;
  companyId: number;
  canView: boolean;
  canSave: boolean;
  canPrint: boolean;
  canUpdate: boolean;
  //===================================================================
  ApprovalPopupHeight: number = window.innerHeight - 200;
  ApprovalPopupWidth: number = window.innerWidth - 200;
  ApprovalPopupGridWidth: number = window.innerWidth - 250;
  ApprovalPopupGridHeight: number = window.innerHeight - 350;
  SaleOrderLoaderPopupHeight: number = window.innerHeight - 100;
  SaleOrderLoaderPopupWidth: number = window.innerWidth - 100;
  FormWidth = this.SaleOrderLoaderPopupWidth - 30;
  FormHeight = (this.SaleOrderLoaderPopupHeight * 40) / 100;
  heightForColumnContainingForm: any = (this.SaleOrderLoaderPopupHeight * 12) / 100 + "px";
  heightForColumnContainingGrid: any = (this.SaleOrderLoaderPopupHeight * 80) / 100 + "px";
  heightForUpperGridsColumn: any = (this.heightForColumnContainingGrid * 38) / 100 + "px";
  heightForUpperGrids: any = (this.heightForUpperGridsColumn * 90) / 100 + "px";
  heightForLowerGridColumn: any = (this.heightForColumnContainingGrid * 58) / 100 + "px";
  heightForLowerGrid: any = (this.heightForLowerGridColumn * 90) / 100 + "px";

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    event.target.innerWidth;
    let height = event.target.innerHeight;
    let width = event.target.innerWidth;
    this.ApprovalPopupHeight = height - (height * 35) / 100;
    this.ApprovalPopupWidth = width - (width * 35) / 100;
    this.ApprovalPopupGridWidth = width - (width * 37) / 100;
    this.ApprovalPopupGridHeight = height - (height * 46) / 100;

    this.SaleOrderLoaderPopupHeight = height - (height * 15) / 100;
    this.SaleOrderLoaderPopupWidth = width - (width * 15) / 100;
    this.FormWidth = this.SaleOrderLoaderPopupWidth - 30;
    this.FormHeight = (this.SaleOrderLoaderPopupHeight * 40) / 100;
    this.heightForColumnContainingForm = (this.SaleOrderLoaderPopupHeight * 12) / 100 + "px";
    this.heightForColumnContainingGrid = (this.SaleOrderLoaderPopupHeight * 78) / 100 + "px";
    this.heightForUpperGridsColumn = (this.heightForColumnContainingGrid * 37) / 100 + "px";
    this.heightForLowerGridColumn = (this.heightForColumnContainingGrid * 57) / 100 + "px";
    this.heightForUpperGrids = (this.heightForUpperGridsColumn * 90) / 100 + "px";
    this.heightForLowerGrid = (this.heightForLowerGridColumn * 90) / 100 + "px";
  }
  popupVisible: boolean = false;
  ConfirmationVisible: boolean = false;
  filter: boolean = false;
  message: string = "";
  IdsOfSelectRecordFromLoader: string = "";
  OutstandingPurchaseOrderList = [];
  updateRowIndex: number = 0;
  detailEditMode: boolean = false;
  comissionBlockReadOnly: boolean = true;
  loadPanelVisible: boolean = false;
  loadPanelMessage: string = "";
  LoaderPopupGridPageSize: any;

  purchaseOrderListForCombo = [];
  CoaAccountsList = [];
  //I am defining heare a mode (Loader Mode !)
  //This will help me in comparing the quantity and weight of invoice with Purchase Order Quantity and Weight;
  LoaderMode: boolean = false;
  BalanceQuantityFromPurchaseOrder: number = 0;
  BalanceWeightFromPurchaseOrder: number = 0;
  TotalGrossWeightInDetailGrid: number = 0;
  TotalQuantityInDetailGrid: number = 0;
  //===================================================================
  //01-Dec-2021
  warningPopupVisibility: boolean = false;
  loaderVisibilityForAvailableTransactions: boolean = false;
  issuanceByLoaderConfiguration: boolean = false;
  fieldsReadabilityByLoaderConfiguration: boolean = false;
  //===================================================================VariablesForSaleOrderLoader

  OrderListByCustomerId = [];
  OrderDetailListByOrderId = new Array<SaleOrderDetailModelInLoader>();
  availableStockListAgainstOrderDetail = new Array<SaleInvoiceDirectDetailModel>();
  finalDataListToBeLoaded = new Array<SaleInvoiceDirectDetailModel>();

  constructor(
    private commonMethods: CommonMethodsForCombos,
    private commonService: CommonBaseService,
    private service: PurchaseInvoiceDirectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  async ngOnInit() {
    this.purchaseInvoiceDirectParamsId = this.route.snapshot.queryParams["Id"];
    this.MainFormData = new SaleInvoiceDirectMainModel();
    if (this.purchaseInvoiceDirectParamsId > 0 == false) {
      this.getDocumentNo();
    }
    this.companyList = await this.commonService.getCompany();
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.supplierCustomerList = await this.commonMethods.SupplierCustomerGetAll();
    // this.paymentTermList = await this.commonMethods.PaymentTermsGetAll();
    // this.itemList = await this.commonMethods.GetItemsForComboBind();
    // console.log(this.itemList);
    // this.warehouseList = await this.commonMethods.getWareHouse();
    // this.jobLotList = await this.commonMethods.getJobLot();

    // this.itemAccountList = await this.commonMethods.GetInventoryOtherItems();
    // this.batchList = await this.commonMethods.CropYear();
    // this.PackingTypeList = await this.commonMethods.GetAllPackingTypes();
    // console.log(this.PackingTypeList);
    // this.CoaAccountsList = await this.commonMethods.CoaAllocationGetAll();

    console.log(this.paymentTermList);
    console.log(this.jobLotList);

    console.log(this.batchList);
    this.userRights();

    this.initForm();
    this.checkConfiguration();
  }
  //#region InitForm
  initForm() {
    this.DetailFormData = new SaleInvoiceDirectDetailModel();
    this.SaleOrderLoaderFormData = new SaleOrderLoaderFormModel();
    this.organizationId = this.commonService.OrganizationId();

    this.companyId = this.commonService.CompanyId();
    this.MainFormData.CompanyId = this.companyList[0].Id;
    this.MainFormData.BranchesId = this.branchList[0].Id;
    this.MainFormData.ProjectsId = this.projectList[0].Id;
    this.MainFormData.DocDate = new Date();
    // this.popupFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    // this.popupFormData.ToDate = new Date();

    if (this.purchaseInvoiceDirectParamsId > 0) {
      this.setFields4EditMode();
    }
  }
  //#endregion

  //#region SetFieldsForEditMode
  setFields4EditMode() {
    if (this.purchaseInvoiceDirectParamsId > 0) {
      this.id4submit = this.purchaseInvoiceDirectParamsId;
      this.service.getSaleInvoiceById(this.purchaseInvoiceDirectParamsId).subscribe(
        (result: any) => {},
        (error) => console.log(error)
      );
    } else {
      this.id4submit = null;
    }
  }
  //#endregion
  //#region  ComboFills

  getDocumentNo() {
    this.service
      .getDocumentNo({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        DocumentTypeId: 99,
      })
      .subscribe(
        (result) => (this.MainFormData.DocNo = result),
        (error) => console.log(error)
      );
  }
  //#region  ItemUOM
  handleItemChangedInDetail = (e) => {
    this.getUomAgainstItemId(e);
  };
  async getUomAgainstItemId(e) {
    this.uomList = await this.commonMethods.getUOM(e.value);
    console.log(this.uomList);
  }
  //#endregion
  //#endregion
  onCellPrepared = (e) => {
    if (e.rowType === "data") {
      e.cellElement.style.padding = "0px";
      e.cellElement.style.verticalAlign = "middle";
    }
  };

  // //#region ClassicBomb
  // onCellHoverdInDetailGrid = (e) => {
  //   e.component.refresh(true);
  // };
  // //#endregion
  //#region
  userRights() {
    this.commonService
      .userRights({
        UserId: this.commonService.UserId(),
        ScreenName: "InvfrmPurchasedirectInvoice",
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
  //#endregion
  //#region  MiniMethods
  loadPopupForAvailableStockLoader() {
    // this.popupVisible = !this.popupVisible;
    this.loaderVisibilityForAvailableTransactions = true;
    // this.availableStockLoader.loadData();
  }

  filtering() {
    this.filter = !this.filter;
  }
  checkClick(e) {
    this.warningPopupVisibility = false;
  }
  // handleDueDaysChange = (e) => {
  //   if (this.purchaseInvoiceDirectParamsId > 0 == false) {
  //     e.value &&
  //       e.value > 0 &&
  //       (this.MainFormData.PaymentDuesSchedule = new Date(this.MainFormData.DocDate.getFullYear(), this.MainFormData.DocDate.getMonth(), this.MainFormData.DocDate.getDate() + +e.value));
  //   }
  // };

  //#endregion
  //=================================================================================
  //#region VALIDATIONS
  checkValidationForTransporterIdIntTranspotationGrid(e) {
    let rowData = e.data;
    if (rowData.FreightAmount > 0) {
      if (e.value > 0) {
        return true;
      } else {
        return false;
      }
    } else if (rowData.FreightAmount > 0 == false) {
      return true;
    }
  }
  checkValidationForFreightAmountTranspotationGrid(e) {
    let rowData = e.data;
    if (rowData.TansporterId > 0) {
      if (e.value > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  checkValidationForAccountInItemAddLsGrid = (e) => {
    let rowData = e.data;
    if (rowData.Amount > 0) {
      if (e.value > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };
  checkValidationForAmmountInItemAddLsGrid = (e) => {
    let rowData = e.data;
    if (rowData.InvRevExpItemId > 0) {
      if (e.value > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };
  checkValidationForAccountInSupplierAddLsGrid = (e) => {
    let rowData = e.data;
    if (rowData.JvDebit > 0 || rowData.JvCredit > 0) {
      if (e.value > 0) {
        if (e.value == this.MainFormData.SupplierCustomerId) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  };
  //#endregion
  handleDueDaysChange = (e) => {
    if (this.purchaseInvoiceDirectParamsId > 0 == false) {
      e.value &&
        e.value > 0 &&
        (this.MainFormData.SupplierInvoiceDate = new Date(this.MainFormData.DocDate.getFullYear(), this.MainFormData.DocDate.getMonth(), this.MainFormData.DocDate.getDate() + +e.value));
    }
  };
  //==========================================================================================================@hamzafarooqi55
  //#region  ThreeMainCalculations
  handleCalculationsInDetailFrom = (e) => {
    let qty = 0;
    let itemUom = 0;
    let grossWeight = 0;
    let netWeight = 0;
    if (parseInt(this.DetailFormData.UOMCodeItem) > 0) {
      itemUom = parseInt(this.DetailFormData.UOMCodeItem);
    } else {
      itemUom = parseInt(this.DetailForm.instance.getEditor("ItemUOMId").option("text"));
    }
    if (this.DetailFormData.ItemQty > 0) {
      qty = parseInt(this.DetailForm.instance.getEditor("ItemQty").option("text"));
    }
    if (itemUom > 0) {
      grossWeight = qty * itemUom;
    }
    this.DetailFormData.GrossWeight = parseInt(grossWeight.toFixed(2));

    let oneBagWeght = 0;
    let totalBagsWeight = 0;
    if (this.DetailFormData.EBWeight > 0) {
      oneBagWeght = parseFloat(this.DetailForm.instance.getEditor("EBWeight").option("text"));
    }
    if (qty > 0) {
      totalBagsWeight = qty * oneBagWeght;
    }
    this.DetailFormData.EBTotalWt = parseInt(totalBagsWeight.toFixed(2));
    let weight_unit = 0;
    let totalWeightCut = 0;
    if (this.DetailFormData.WeightCut > 0) {
      weight_unit = parseFloat(this.DetailForm.instance.getEditor("WeightCut").option("text"));
    }

    if (qty > 0) {
      totalWeightCut = qty * weight_unit;
    }
    this.DetailFormData.WeightCutTotal = parseInt(totalWeightCut.toFixed(2));
    let addless = 0;
    if (this.DetailFormData.AdLsWeight > 0) {
      addless = parseFloat(this.DetailForm.instance.getEditor("AdLsWeight").option("text"));
    }
    netWeight = grossWeight - totalBagsWeight - totalWeightCut + addless;

    this.DetailFormData.NetBillWeight = parseInt(netWeight.toFixed(2));
    this.DetailFormData.NetStockWeight = parseInt(netWeight.toFixed(2));
    let rate = 0;
    let amount = 0;
    if (this.DetailFormData.ItemRate > 0) {
      rate = parseInt(this.DetailForm.instance.getEditor("ItemRate").option("text"));
    }
    let rateuom = 0;
    if (parseInt(this.DetailFormData.RateUOM) > 0) {
      rateuom = parseInt(this.DetailFormData.RateUOM);
    } else {
      rateuom = parseInt(this.DetailForm.instance.getEditor("UomScheduleIdRate").option("text"));
    }
    if (this.DetailFormData.UomScheduleIdRate > 0 && netWeight > 0) {
      amount = (netWeight / rateuom) * rate;
    }
    let rateCut_Unit = 0;
    let totalRateCut = 0;
    if (this.DetailFormData.RateCut > 0) {
      rateCut_Unit = parseFloat(this.DetailForm.instance.getEditor("RateCut").option("text"));
    }

    if (rateuom > 0 && netWeight > 0) {
      totalRateCut = (netWeight / rateuom) * rateCut_Unit;
    }
    this.DetailFormData.RateCutAmount = parseInt(totalRateCut.toFixed(2));
    amount = amount - totalRateCut;
    this.DetailFormData.ItemAmount = parseInt(amount.toFixed(2));
  };
  handleCalculationsForProportionatingAmounts = (e) => {
    if (this.dataSource.length > 0) {
      //#region Handling Calculation of Comission and Proportionating Commission
      let comRate = 0;
      let comRateUom = 0;
      let comAmount = 0;
      if (this.MainFormData.CommRate > 0) {
        comRate = parseFloat(this.MainForm.instance.getEditor("CommRate").option("text"));
      }
      if (this.MainFormData.UomScheduleIdCmRate > 0) {
        comRateUom = parseInt(this.MainForm.instance.getEditor("UomScheduleIdCmRate").option("text"));
      }
      if (this.MainFormData.CommissionType == "Flat") {
        comAmount = parseInt(comRate.toFixed(2));
      }
      let totalItemAmountInDetailGrid = 0;
      let totalNetWeightInDetailGrid = 0;
      for (let i = 0; i < this.dataSource.length; i++) {
        let amountAtI = 0;
        if (this.dataSource[i].ItemAmount > 0) {
          amountAtI = this.dataSource[i].ItemAmount;
        }
        totalItemAmountInDetailGrid += amountAtI;
        let netWeightAtI = 0;
        if (this.dataSource[i].NetBillWeight > 0) {
          netWeightAtI = this.dataSource[i].NetBillWeight;
        }
        totalNetWeightInDetailGrid += netWeightAtI;
      }

      if (this.MainFormData.CommissionType == "Percent") {
        if (totalItemAmountInDetailGrid * comRate > 0) {
          comAmount = (totalItemAmountInDetailGrid * comRate) / 100;
          comAmount = parseInt(comAmount.toFixed(2));
        }
      }
      if (this.MainFormData.CommissionType == "Comm. Weight") {
        if (comRateUom > 0) {
          comAmount = (totalNetWeightInDetailGrid / comRateUom) * comRate;
          comAmount = parseInt(comAmount.toFixed(2));
        }
      }
      this.MainFormData.CommAmount = comAmount;

      //#region TotalItemAddLessAmount
      let totalItemAddlessAmount = 0;
      if (this.expenseDataSource.length > 0) {
        for (let i = 0; i < this.expenseDataSource.length; i++) {
          let itemAddLessAmountAtI = 0;
          if (this.expenseDataSource[i].Amount > 0) {
            itemAddLessAmountAtI = this.expenseDataSource[i].Amount;
          }
          totalItemAddlessAmount += itemAddLessAmountAtI;
        }
      }
      //#endregion

      //#endregion Proportionating Amounts
      for (let i = 0; i < this.dataSource.length; i++) {
        let itemAmountAtI = 0;
        if (this.dataSource[i].ItemAmount > 0) {
          itemAmountAtI = this.dataSource[i].ItemAmount;
        }
        let comAmountAtI = 0;
        if (comAmount > 0 && totalItemAmountInDetailGrid) {
          comAmountAtI = (comAmount / totalItemAmountInDetailGrid) * itemAmountAtI;
        }
        this.dataSource[i].CommissionAmount = parseInt(comAmountAtI.toFixed(2));
        let itemAddLessAmountAtI = 0;
        if (totalItemAddlessAmount > 0 && totalItemAmountInDetailGrid > 0) {
          itemAddLessAmountAtI = (totalItemAddlessAmount / totalItemAmountInDetailGrid) * itemAmountAtI;
        }
        this.dataSource[i].ExpenseAmount = parseInt(itemAddLessAmountAtI.toFixed(2));
        let billAmountAtI = itemAmountAtI + comAmountAtI + itemAddLessAmountAtI;
        this.dataSource[i].BillAmount = parseInt(billAmountAtI.toFixed(2));
      }

      //#endregion
      //#region CalculatingGrandBillAmount
      let grandBillAmount = 0;
      grandBillAmount = totalItemAmountInDetailGrid + totalItemAddlessAmount;
      if (this.MainForm.instance.getEditor("CommissionAgentId").option("text") != null && this.MainForm.instance.getEditor("CommissionAgentId").option("text") != "") {
        if (this.MainFormData.CommissionAgentId == this.MainFormData.SupplierCustomerId) {
          grandBillAmount += comAmount;
        }
      }
      let totalCreditAmountInSupplierAddLessGrid = 0;
      let totalDebitAmountInSupplierAddLessGrid = 0;
      if (this.journalDataSource.length > 0) {
        for (let i = 0; i < this.journalDataSource.length; i++) {
          let creditAtI = 0;
          if (this.journalDataSource[i].JvCredit > 0) {
            creditAtI = this.journalDataSource[i].JvCredit;
          }
          let debitAtI = 0;
          if (this.journalDataSource[i].JvDebit > 0) {
            debitAtI = this.journalDataSource[i].JvDebit;
          }
          totalCreditAmountInSupplierAddLessGrid += creditAtI;
          totalDebitAmountInSupplierAddLessGrid += debitAtI;
        }
      }
      grandBillAmount -= totalDebitAmountInSupplierAddLessGrid;
      grandBillAmount += totalCreditAmountInSupplierAddLessGrid;

      this.MainFormData.BillAmount = parseInt(grandBillAmount.toFixed(2));
      //#endregion
    }
  };

  //#endregion
  //#region  Detail Grid
  onRowUpdateInDetailGrid = (e) => {
    if (this.dataSource.length > 0 == false) {
      this.comissionBlockReadOnly = true;
    } else {
      this.comissionBlockReadOnly = false;
    }
  };

  addDetailRecord2Grid() {
    if (validate(this.DetailForm)) {
      if (this.DetailFormData.GrossWeight > 0 && this.DetailFormData.NetBillWeight > 0) {
        this.DetailFormData.ItemName = this.DetailForm.instance.getEditor("ItemId").option("text");
        this.DetailFormData.JobLotDescription = this.DetailForm.instance.getEditor("JobLotId").option("text");
        this.DetailFormData.PackTypeDesc = this.DetailForm.instance.getEditor("PackingTypeId").option("text");
        this.DetailFormData.UOMCodeItem = this.DetailForm.instance.getEditor("ItemUOMId").option("text");
        this.DetailFormData.RateUOM = this.DetailForm.instance.getEditor("UomScheduleIdRate").option("text");
        this.DetailFormData.WareHouseName = this.DetailForm.instance.getEditor("WarehouseId").option("text");
        if (this.updateRowIndex >= 0) {
          this.dataSource[this.updateRowIndex] = this.DetailFormData;
          this.updateRowIndex = -1;
          this.detailEditMode = false;
        } else {
          this.dataSource.push(this.DetailFormData);
        }
        this.detailGrid.instance.refresh();

        this.DetailFormData = new SaleInvoiceDirectDetailModel();
        this.DetailForm.instance.getEditor("ItemId").focus();
        this.handleCalculationsForProportionatingAmounts(1);
        // this.DetailFormData.PurchaseOrderId = this.PurchasOrderList[0].PurchaseOrderId;
      } else {
        notify("Gross Or Net Weight Is not Greater Than 0", "error");
      }
    }
  }
  deleteDetailRecordRow(index) {
    this.dataSource.splice(index, 1);
    this.handleCalculationsForProportionatingAmounts(1);
  }
  editDetailRecordRow(editObject, index) {
    this.detailEditMode = true;
    this.updateRowIndex = index;
    this.DetailFormData = editObject;
    this.DetailFormData.ItemQty = editObject.ItemQty;
  }

  //#endregion
  //#region Fetching Data Afeter Purchase Order Selection
  //#region GetPurchaseOrderDataByPurchaseOrderId

  //#endregion
  //#region  Supplier Customer GrnLoadForPurchaseInvoice
  getSupplierGlIdBySupcusId = (e) => {
    let glfilterlist = [];
    console.log(this.supplierCustomerList);
    glfilterlist = this.supplierCustomerList.filter(({ Id }) => Id == e.value);
    console.log(glfilterlist);
    this.SupplierGlAccountId = glfilterlist[0].GlAccountId;
    this.accountList = this.CoaAccountsList.filter(({ AccountTypeId }) => AccountTypeId !== 15 && AccountTypeId !== 11 && AccountTypeId !== 2);
    for (let i = 0; i < this.accountList.length; i++) {
      if (this.SupplierGlAccountId == this.accountList[i].ChartofAccountId) {
        this.accountList.splice(i, 1);
      }
    }
    this.handleCalculationsForProportionatingAmounts(1);
  };
  //#endregion

  //#region EmptyBagsGridMethods

  onRateChangeInEmptyBags = (newData, value, currentRowData) => {
    newData.Rate = value;
    newData.Amount = value * currentRowData.PurchaseQty;
  };
  //#endregion
  //#region Item Expense Grid
  onQtyChangeInItemGrd = (newData, value, currentRowData) => {
    newData.Qty = value;
    newData.Amount = value * currentRowData.Rate;
  };
  onRateChangeInItemGrd = (newData, value, currentRowData) => {
    newData.Rate = value;
    newData.Amount = currentRowData.Qty * value;
  };
  onExpenseAmountChangeInItemGrid = (newData, value, currentRowData) => {
    newData.Amount = value;
    newData.Rate = value / currentRowData.Qty;
  };

  //#endregion
  //#region Supplier Add/Ls Grid
  onQtyChangeInSupplierGrd = (newData, value, currentRowData) => {
    newData.JvQty = value;
    if (currentRowData.JvRate > 0) {
      newData.JvCredit = value * currentRowData.JvRate;
      newData.JvDebit = 0;
    } else {
      newData.JvCredit = 0;
      newData.JvDebit = 0;
    }
  };
  onRateChangeInSupplierGrd = (newData, value, currentRowData) => {
    newData.JvRate = value;
    if (currentRowData.JvQty > 0) {
      newData.JvCredit = value * currentRowData.JvQty;
    } else {
      newData.JvCredit = 0;
    }
    // newData.JvRate = value;
    // const { JvQty, JvPrcnt } = currentRowData;
    // if (!JvPrcnt) {
    //   value > 0 && JvQty > 0 ? ((newData.JvCredit = this.calculateAmountSupplierNItemGrd(value, JvQty)), (newData.JvDebit = null)) : ((newData.JvCredit = 0), (newData.JvDebit = 0));
    // }
  };
  onDebAmountChangeInSupplierGrd = (newData, value, currentRowData) => {
    newData.JvDebit = value;
    if (value > 0) {
      newData.JvCredit = null;
      newData.JvRate = value / currentRowData.JvQty;
    }
  };
  onCreAmountChangeInSupplierGrd = (newData, value, currentRowData) => {
    newData.JvCredit = value;
    if (value > 0) {
      newData.JvDebit = null;
      newData.JvRate = value / currentRowData.JvQty;
    }
  };
  setQtyInLoaderGrid = (newData, value, currentRowData) => {
    newData.ItemQty = value;
    console.log("hamza");
  };
  //#endregion

  //==========================================================================================================@hamzafarooqi55
  //#region ImplementationOfLoaderWithAvailableStockTransactions
  async checkConfiguration() {
    this.issuanceByLoaderConfiguration = await this.commonMethods.CheckConfiguration("IssuanceByLoader", true);
    if (this.issuanceByLoaderConfiguration == true) {
      this.fieldsReadabilityByLoaderConfiguration = true;
    } else if (this.issuanceByLoaderConfiguration == false) {
      this.fieldsReadabilityByLoaderConfiguration == false;
    }
  }
  closeAvailableTransactionsForIssuancePopup(e) {
    this.loaderVisibilityForAvailableTransactions = false;
  }
  loadSelectedData(data) {
    this.loaderVisibilityForAvailableTransactions = false;
    console.log(data);

    for (let i = 0; i < data.length; i++) {
      if (this.dataSource.length > 0 == false) {
        this.dataSource.push({
          ItemId: data[i].ItemId,
          PackingTypeId: data[i].InvPackingTypeId,
          CropYear: data[i].CropBatch,
          JobLotId: data[i].JobLotId,
          ItemQty: data[i].QtyBalance,
          ItemUOMId: data[i].ItemUom,
          GrossWeight: data[i].WeightBalance,
          EBWeight: 0,
          EBTotalWt: 0,
          AdLsWeight: 0,
          NetBillWeight: data[i].WeightBalance,
          NetStockWeight: data[i].WeightBalance,
          ItemRate: parseInt(data[i].AVgRate),
          UomScheduleIdRate: data[i].RateUomId,
          ItemAmount: data[i].ItemAmount,
          WarehouseId: data[i].WarehouseId,
          RateCut: 0,
          RateCutAmount: 0,
          WeightCut: 0,
          WeightCutTotal: 0,
          RemarksDetail: " ",
          RefRefDocumentTypeId: data[i].RefDocumentTypeId,
          RefRefDocIdNo: data[i].RefDocIdNo,
          RefDocSubId: data[i].RefDocSubIdNo,
          ItemName: data[i].ItemName,
          UOMCodeItem: data[i].PackSize,
          JobLotDescription: data[i].JobLotCode,
          PackTypeDesc: data[i].PackingType,
          WareHouseName: data[i].WareHouseCode,
          DcNo: 5555555,
          RateUOM: data[i].Equivalent,
        });
      } else if (this.dataSource.length > 0) {
        let flag = false;
        for (let j = 0; j < this.dataSource.length; j++) {
          if (
            data[i].RefDocumentTypeId == this.dataSource[j].RefRefDocumentTypeId &&
            data[i].RefDocSubIdNo == this.dataSource[j].RefDocSubId &&
            data[i].RefDocIdNo == this.dataSource[j].RefRefDocIdNo &&
            data[i].ItemId == this.dataSource[j].ItemId &&
            data[i].ItemUom == this.dataSource[j].ItemUOMId &&
            data[i].CropBatch == this.dataSource[j].CropYear &&
            data[i].JobLotId == this.dataSource[j].JobLotId &&
            data[i].InvPackingTypeId == this.dataSource[j].PackingTypeId &&
            parseInt(data[i].Equivalent) == parseInt(this.dataSource[j].RateUOM) &&
            parseInt(data[i].AVgRate) == parseInt(this.dataSource[j].ItemRate)
          ) {
            flag = true;
          }
        }
        if (flag == false) {
          this.dataSource.push({
            ItemId: data[i].ItemId,
            PackingTypeId: data[i].InvPackingTypeId,
            CropYear: data[i].CropBatch,
            JobLotId: data[i].JobLotId,
            ItemQty: data[i].QtyBalance,
            ItemUOMId: data[i].ItemUom,
            GrossWeight: data[i].WeightBalance,
            EBWeight: 0,
            EBTotalWt: 0,
            AdLsWeight: 0,
            NetBillWeight: data[i].WeightBalance,
            NetStockWeight: data[i].WeightBalance,
            ItemRate: parseInt(data[i].AVgRate),
            UomScheduleIdRate: data[i].RateUomId,
            ItemAmount: data[i].ItemAmount,
            WarehouseId: data[i].WarehouseId,
            RateCut: 0,
            RateCutAmount: 0,
            WeightCut: 0,
            WeightCutTotal: 0,
            RemarksDetail: " ",
            RefRefDocumentTypeId: data[i].RefDocumentTypeId,
            RefRefDocIdNo: data[i].RefDocIdNo,
            RefDocSubId: data[i].RefDocSubIdNo,
            ItemName: data[i].ItemName,
            UOMCodeItem: data[i].PackSize,
            JobLotDescription: data[i].JobLotCode,
            PackTypeDesc: data[i].PackingType,
            WareHouseName: data[i].WareHouseCode,
            DcNo: 5555555,
            RateUOM: data[i].Equivalent,
          });
        }
      }
    }
  }

  //#endregion

  //#region  ImplementationOfLoaderWithAvailableStockAgainstSaleOrder
  loadPopupForSaleOrderLoader() {
    this.popupVisible = !this.popupVisible;
  }
  getOrderListByCustomerId = (e) => {
    this.service
      .GetSaleOrderNumbersByCustomerId({
        OrderSupCustId: e.value,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.OrderListByCustomerId = result;
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );
  };
  getOrderDetailByOrderId() {
    let orderNo = parseInt(this.SaleOrderLoaderForm.instance.getEditor("OrderId").option("text"));
    this.service
      .GetSaleOrderDataByIdandOrganizationIdandCompanyIdinSaleOrderLoader({
        Id: this.SaleOrderLoaderFormData.OrderId,
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          for (let i = 0; i < result.length; i++) {
            this.OrderDetailListByOrderId.push({
              Crop: result[i].Crop,
              Equivalent: result[i].Equivalent,
              SaleOrderDetailId: result[i].Id,
              ItemName: result[i].ItemName,
              JobLotCode: result[i].JobLotCode,
              JobLotId: result[i].JobLotId,
              OrderItemId: result[i].OrderItemId,
              OrderItemQty: result[i].OrderItemQty,
              OrderItemRate: result[i].OrderItemRate,
              OrderItemRateUOMId: result[i].OrderItemRateUOMId,
              OrderItemUOMId: result[i].OrderItemUOMId,
              RateUOM: result[i].RateUOM,
              SaleOrderId: result[i].SaleOrderId,
              SaleOrderNo: orderNo,
            });
          }
          console.log("this is order detail list");
          console.log(this.OrderDetailListByOrderId);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getAvailabelStockDataAgainstOrderId = (e) => {
    console.log(e);
    let selectedDataOfOrderDetail = e.currentSelectedRowKeys;
    let selectedRowKeys = e.selectedRowKeys;

    console.log("this is selected record");
    console.log(selectedDataOfOrderDetail);

    this.getAvailableStock(selectedDataOfOrderDetail, selectedRowKeys);
  };
  getAvailableStock(selectedDataOfOrderDetail, selectedRowKeys) {
    if (selectedDataOfOrderDetail.length > 0) {
      this.service
        .GetAvailableTransactionsForIssuance({
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          CompanyId: sessionStorage.getItem("CompanyId"),
          ItemId: selectedDataOfOrderDetail[0].OrderItemId,
          CropYear: selectedDataOfOrderDetail[0].Crop,
          JobLotId: selectedDataOfOrderDetail[0].JobLotId,
        })
        .subscribe(
          (result) => {
            if (result.length > 0 == false) {
              this.message = "No Stock Is Available For this Item!";
              this.warningPopupVisibility = true;
              for (let i = 0; i < selectedRowKeys.length; i++) {
                if (selectedRowKeys[i].SaleOrderDetailId == selectedDataOfOrderDetail[0].SaleOrderDetailId) {
                  console.log("de selecting row");
                  this.orderDetailGrid.instance.deselectRows(selectedRowKeys[i]);
                }
              }
              return;
            } else if (result.length > 0) {
              for (let i = 0; i < result.length; i++) {
                this.availableStockListAgainstOrderDetail.push({
                  Id: 0,
                  InvSaleInvoiceId: 0,
                  InvGdnId: 0,
                  InvGdnDetailId: 0,
                  SaleOrderId: selectedDataOfOrderDetail[0].SaleOrderId,
                  ItemId: result[i].ItemId,
                  PackingTypeId: result[i].InvPackingTypeId,
                  CropYear: result[i].CropBatch,
                  JobLotId: result[i].JobLotId,
                  ItemQty: result[i].QtyBalance,
                  ItemUOMId: result[i].ItemUom,
                  GrossWeight: result[i].WeightBalance,
                  EBWeight: 0,
                  EBTotalWt: 0,
                  AdLsWeight: 0,
                  NetBillWeight: 0,
                  NetStockWeight: 0,
                  ItemRate: selectedDataOfOrderDetail[0].OrderItemRate,
                  UomScheduleIdRate: result[i].RateUomId,
                  ItemAmount: result[i].ItemAmount,
                  WarehouseId: result[i].WarehouseId,
                  LabAnalisysNo: " ",
                  GpDate: new Date(),
                  RateCut: 0,
                  RateCutAmount: 0,
                  WeightCut: 0,
                  WeightCutTotal: 0,
                  GpNo: 0,
                  VehicleNo: "",
                  IsTaxable: "",
                  TaxNameId: 0,
                  TaxPercent: 0,
                  TaxDescriptions: "",
                  TaxAmount: 0,
                  ItemCgsRate: 0,
                  AvgCgsRate: 0,
                  RemarksDetail: "",
                  BillAmount: 0,
                  FreightAmount: 0,
                  ExpenseAmount: 0,
                  JournalAmount: 0,
                  CommissionAmount: 0,
                  RefRefDocumentTypeId: result[i].RefDocumentTypeId,
                  RefRefDocIdNo: result[i].RefDocIdNo,
                  RefDocSubId: result[i].RefDocSubIdNo,
                  SaleOrderDetailId: selectedDataOfOrderDetail[0].SaleOrderDetailId,
                  SaleGLAC: " ",
                  ItemCode: "",
                  ItemName: result[i].ItemName,
                  UOMCodeItem: result[i].PackSize,
                  JobLotDescription: result[i].JobLotCode,
                  PackTypeDesc: result[i].PackingType,
                  WareHouseName: result[i].WareHouseCode,
                  DcNo: result[i].DocCodeNo,
                  SaleOrder: selectedDataOfOrderDetail[0].SaleOrderNo,
                  RateUOM: result[i].Equivalent,
                });
              }
            }
          },
          (error) => {
            console.log(error);
          }
        );
    }

    console.log(this.availableStockListAgainstOrderDetail);
  }
  generateFinalDataToBeLoadedInDetailGrid = (e) => {
    let availableStockData = e.selectedRowsData;
    console.log(availableStockData);
    if (this.popupDataSource.length > 0 == false) {
      this.popupDataSource = availableStockData;
    }
  };
  loadFinalDataDetailGrid() {}

  //#endregion
  //#region Save
  onSave() {
    if (this.purchaseInvoiceDirectParamsId > 0) {
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
  resetForm() {
    this.MainFormData = null;
    this.dataSource = [];

    this.expenseDataSource = [];
    this.journalDataSource = [];
    this.LoaderMode = false;
    this.dataSource = new Array<SaleInvoiceDirectDetailModel>();
    this.expenseDataSource = new Array<SaleInvoiceDirectExpenseModel>();
    this.journalDataSource = new Array<SaleInvoiceDirectJournalModel>();

    this.purchaseInvoiceDirectParamsId = null;
    this.id4submit = null;
    this.MainForm.instance.getEditor("PaymentTermsId").focus();
    this.initForm();
    this.getDocumentNo();
  }
  handleSave() {
    const result: any = this.MainForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      if (this.dataSource.length > 0 == false) {
        this.message = "No Detail Record Found!";
        this.ConfirmationVisible = !this.ConfirmationVisible;
        return;
      }
      return;
    } else {
      // if (this.MainFormData.OrderDueDays > 0 == false) {
      //   this.MainFormData.OrderDueDate = new Date();
      // }
      if (this.issuanceByLoaderConfiguration == true) {
        for (let i = 0; i < this.dataSource.length; i++) {
          if (this.dataSource[i].RefRefDocumentTypeId > 0 == false || this.dataSource[i].RefRefDocIdNo > 0 == false || this.dataSource[i].RefDocSubId > 0 == false) {
            this.message = "Please use Loader for Entry in Detail !";
            this.warningPopupVisibility = true;
            return;
          }
        }
      }
      if (this.journalDataSource.length > 0) {
        for (let i = 0; i < this.journalDataSource.length; i++) {
          if (this.journalDataSource[i].JvDebit > 0 || this.journalDataSource[i].JvCredit > 0) {
            if (this.journalDataSource[i].ChartofAccountId > 0 == false) {
              this.message = "Please Select Account in Supplier Add/Ls Grid!";
              this.ConfirmationVisible = !this.ConfirmationVisible;
              return;
            }
          }
        }
      }
      if (this.expenseDataSource.length > 0) {
        for (let i = 0; i < this.expenseDataSource.length; i++) {
          if (this.expenseDataSource[i].Amount > 0) {
            if (this.expenseDataSource[i].InvRevExpItemId > 0 == false) {
              this.message = "Please Select Other Item Account against Expense in Item Add/Ls Grid!";
              this.ConfirmationVisible = !this.ConfirmationVisible;
              return;
            }
          }
        }
      }
      if (this.MainFormData.CommAmount > 0) {
        if (this.MainFormData.CommissionAgentId > 0 == false) {
          this.message = "Please Select Comission Agent Id In Form Header!";
          this.ConfirmationVisible = !this.ConfirmationVisible;
          return;
        }
      }
      this.TotalGrossWeightInDetailGrid = 0;
      this.TotalQuantityInDetailGrid = 0;
      for (let i = 0; i < this.dataSource.length; i++) {
        this.dataSource[i].ItemCgsRate = 0;
        if (this.dataSource[i].ItemId > 0 == false) {
          this.message = "Item Id is required in Detail Grid.Please Contanct the support Team!";
          this.ConfirmationVisible = !this.ConfirmationVisible;
          return;
        }
        if (this.dataSource[i].ItemQty > 0 == false) {
          this.message = "Item Quantity is required in Detail Grid.Please Contact the support Team!";
          this.ConfirmationVisible = !this.ConfirmationVisible;
          return;
        }
        if (this.dataSource[i].ItemRate > 0 == false) {
          this.message = "Item Rate is required in Detail Grid.Please Contact the support Team!";
          this.ConfirmationVisible = !this.ConfirmationVisible;
          return;
        }
        if (this.dataSource[i].ItemUOMId > 0 == false) {
          this.message = "Item UOM is required in Detail Grid.Please Contact the support Team!";
          this.ConfirmationVisible = !this.ConfirmationVisible;
          return;
        }
        if (this.dataSource[i].UomScheduleIdRate > 0 == false) {
          this.message = "Rate UOM is required in Detail Grid.Please Contact the support Team!";
          this.ConfirmationVisible = !this.ConfirmationVisible;
          return;
        }
        if (this.dataSource[i].GrossWeight > 0 == false) {
          this.message = "Gross Weight is required in Detail Grid Row Number " + (i + 1) + " .";
          this.ConfirmationVisible = !this.ConfirmationVisible;
          return;
        }
        if (this.dataSource[i].NetBillWeight > 0 == false) {
          this.message = "Net Bill Weight is required in Detail Grid Row Number " + (i + 1) + " .";
          this.ConfirmationVisible = !this.ConfirmationVisible;
          return;
        }
        if (this.dataSource[i].NetStockWeight > 0 == false) {
          this.message = "Net Stock Weight is required in Detail Grid Row Number " + (i + 1) + " .";
          this.ConfirmationVisible = !this.ConfirmationVisible;
          return;
        }
        if (this.dataSource[i].ItemAmount > 0 == false) {
          this.message = "Item Amount is required in Detail Grid Row Number " + (i + 1) + " .";
          this.ConfirmationVisible = !this.ConfirmationVisible;
          return;
        }
        if (this.dataSource[i].PackingTypeId > 0 == false) {
          this.message = "Packing Type is required in Detail Grid Row Number " + (i + 1) + " .";
          this.ConfirmationVisible = !this.ConfirmationVisible;
          return;
        }
        this.TotalGrossWeightInDetailGrid += this.dataSource[i].GrossWeight;
        this.TotalQuantityInDetailGrid += this.dataSource[i].ItemQty;
      }
      // if(this.LoaderMode ==true)
      // {
      //   if(this.TotalGrossWeightInDetailGrid > this.MainFormData.BalanceWeight)
      //   {
      //     this.message="Total Gross Weight in Detail Grid must be equal to Balance Weight from Purchaser Order!";
      //     this.ConfirmationVisible= !this.ConfirmationVisible;
      //     return;
      //   }
      // }
      this.MainFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.MainFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));

      this.MainFormData.FinancialYearId = parseInt(sessionStorage.getItem("FinancialYearId"));
      this.MainFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.MainFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.MainFormData.EntryDate = new Date();
      this.MainFormData.ModifyDate = new Date();
      this.MainFormData.PostUser = parseInt(sessionStorage.getItem("UserId"));
      this.MainFormData.PostDate = new Date();
      this.MainFormData.IsAttachments = " ";
      this.MainFormData.DocumentTypeId = 99;
      this.MainFormData.IsApproved = false;
      this.MainFormData.DocumentTypeSrNo = 0;
      this.MainFormData.StockPartyId = 0;
      this.MainFormData.CashReceived = 0;
      this.MainFormData.ReferencePartyId = 0;
      this.MainFormData.OtherRemarks = " ";
      this.MainFormData.IsTaxable = " ";
      this.MainFormData.InvSaleInvoiceDetaillist = this.dataSource;
      this.MainFormData.InvSaleInvoiceJournalList = this.journalDataSource;
      this.MainFormData.InvSaleInvoiceExpenseList = this.expenseDataSource;
      this.MainFormData.PaymentDuesSchedules = [];
      this.MainFormData.InvSaleInvoiceFreightList = [];

      console.log(this.MainFormData);
      if (this.purchaseInvoiceDirectParamsId > 0) {
        this.loadPanelMessage = "Updating!";
        this.MainFormData.Id = this.purchaseInvoiceDirectParamsId;
      } else {
        this.loadPanelMessage = "Saving!";
        this.MainFormData.Id = 0;
      }
      this.loadPanelVisible = true;
      this.service.save(this.MainFormData).subscribe(
        (result) => {
          this.purchaseInvoiceDirectParamsId ? notify("Record updated successfully", "success") : notify("Record saved successfully!", "success");
          this.router.navigate([], { queryParams: { Id: null } });
          this.resetForm();
          this.loadPanelVisible = false;
        },
        (error) => {
          this.loadPanelVisible = false;
          this.message = error.ExceptionMessage;
          this.warningPopupVisibility = true;
          return;
        }
      );
    }
  }
}
//#endregion
