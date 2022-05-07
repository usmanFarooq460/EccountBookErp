import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent, DxSwitchComponent } from "devextreme-angular";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { ExpenseGridModel, JournalGridModel, PayblesDebitToItemModel, EmptyBagsModel, PopupModel, SaleInvoiceModel, SaleInvoiceDetailModel } from "../sale-invoice.model";
import { SaleInvoiceService } from "../sale-invoice.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { BaseActions } from "src/app/shared/Base/BaseActions";

@Component({
  selector: "app-sale-invoice-form",
  templateUrl: "./sale-invoice-form.component.html",
  styles: [],
})
export class SaleInvoiceFormComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  popupGrid: DxDataGridComponent;

  @ViewChild(DxDataGridComponent, { static: false })
  detailGrid: DxDataGridComponent;

  @ViewChild(DxDataGridComponent, { static: false })
  journalGrid: DxDataGridComponent;

  @ViewChild(DxDataGridComponent, { static: false })
  expenseGrid: DxDataGridComponent;

  @ViewChild(DxDataGridComponent, { static: false })
  PayablesDebitToItemGrid: DxDataGridComponent;

  @ViewChild(DxDataGridComponent, { static: false })
  EmptyBagsDataGrid: DxDataGridComponent;

  @ViewChild("SaleInvoiceForm", { static: false }) // Purchase Bill form instance
  SaleInvoiceForm: DxFormComponent;
  SaleInvoiceFormData: SaleInvoiceModel; // Purchase Bill form object

  @ViewChild("popupForm", { static: false })
  popupForm: DxFormComponent;
  popupFormData: PopupModel;

  @ViewChild("switch", { static: false })
  switch: DxSwitchComponent;

  dataSource = new Array<SaleInvoiceDetailModel>();
  popupDataSource = [];
  journalDataSource = new Array<JournalGridModel>();
  paymentDueDataSource = [];
  expenseDataSource = new Array<ExpenseGridModel>();
  transpotationGridDataSource = new Array<PayblesDebitToItemModel>();
  // companyList = [];
  branchList = [];
  projectList = [];
  paymentTermList = [];
  warehouseList = [];
  supplierCustomerList: any;
  uomList = [];
  jobLotList = [];
  deliveryTermList = [{ name: "Load" }, { name: "Ponch" }];
  commissionTypeList = ["Flat", "Percent", "Comm. Weight"];
  rateUOMList = [1, 5, 10, 25, 40, 60, 80, 100];
  accountList = [];
  transporterList = [];
  // emptyBagsDataSource = new Array<EmptyBagsModel>();
  itemAccountList;
  loadGdnIds: string;
  loadGdnIds4EB: string;
  updateDetailRowIndex: number;
  amountStatus: boolean = true;
  detailDataGridUpdated: boolean;
  purchaseBillParamsId: number;
  SupplierGlAccountId: number;
  id4submit: number;
  organizationId: number;
  companyId: number;
  canView: boolean;
  canSave: boolean;
  canPrint: boolean;
  canUpdate: boolean;

  //===================================================================
  // ApprovalPopupHeight: number = window.innerHeight - 200;
  // ApprovalPopupWidth: number = window.innerWidth - 200;
  // ApprovalPopupGridWidth: number = window.innerWidth - 250;

  // ApprovalPopupGridHeight: number = window.innerHeight - 350;

  // // @HostListener("window:resize", ["$event"])
  // // onResize(event) {
  // //   event.target.innerWidth;
  // //   let height = event.target.innerHeight;
  // //   let width = event.target.innerWidth;
  // //   this.ApprovalPopupHeight = height - (height * 35) / 100;
  // //   this.ApprovalPopupWidth = width - (width * 35) / 100;
  // //   this.ApprovalPopupGridWidth = width - (width * 37) / 100;
  // //   this.ApprovalPopupGridHeight = height - (height * 46) / 100;
  // // }
  popupVisible: boolean = false;
  IdsOfSelectRecordFromLoader: string = "";

  TotalItemAmountInDetailGrid = 0;
  TotalNetWeightInDetailGrid = 0;
  TotalFreightAmountInTranspotationGrid = 0;
  TotalAmountInEmptyBagsGrid = 0;
  TotalAmountInItemExpenseGrid = 0;
  TotalCreditAmountInSupplierAddLessGrid = 0;
  TotalDebitAmountInSupplierAddLessGrid = 0;
  GrandTotalBillAmount = 0;
  configurationsList = [];
  //===================================================================
  constructor(private commonService: CommonBaseService, private commonMethods: CommonMethodsForCombos, private service: SaleInvoiceService, private route: ActivatedRoute, private router: Router) {
    super();
  }

  async ngOnInit() {
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("InvfrmPurchaseInvoice"));
    this.purchaseBillParamsId = this.route.snapshot.queryParams["Id"];
    this.GetAllConfiguration();
    this.FetchData();
    this.initForm();
  }

  async FetchData() {
    this.branchList = await this.commonService.getBranch().catch((err) => console.log("err", err));
    this.projectList = await this.commonService.getProject().catch((err) => console.log("err", err));
    this.supplierCustomerList = await this.commonMethods.GenerateSupplierCustomerDataSourceForComboBind().catch((err) => console.log("err", err));
    this.paymentTermList = await this.commonMethods.PaymentTermsGetAll().catch((err) => console.log("err", err));
    this.warehouseList = await this.commonMethods.getWareHouse().catch((err) => console.log("err", err));
    this.jobLotList = await this.commonMethods.getJobLot().catch((err) => console.log("err", err));
    let allAccounts = await this.commonMethods.CoaAllocationGetAll().catch((err) => console.log("err", err));
    this.accountList = allAccounts.filter(({ AccountTypeId }) => AccountTypeId !== 15 && AccountTypeId !== 11 && AccountTypeId !== 2);
    this.transporterList = allAccounts.filter(({ AccountTypeId }) => AccountTypeId !== 15 && AccountTypeId !== 11 && AccountTypeId !== 2);
    this.itemAccountList = await this.commonMethods.GetInventoryOtherItems().catch((err) => console.log("err", err));
  }

  //#region InitForm
  initForm() {
    this.SaleInvoiceFormData = new SaleInvoiceModel();
    this.popupFormData = new PopupModel();
    this.organizationId = this.commonService.OrganizationId();
    this.companyId = this.commonService.CompanyId();
    this.SaleInvoiceFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
    this.SaleInvoiceFormData.DocDate = new Date();
    this.popupFormData.FromDate = new Date(sessionStorage.getItem("StartPeriod"));
    this.popupFormData.ToDate = new Date();

    if (this.purchaseBillParamsId > 0) {
      this.setFields4EditMode();
    } else if (this.purchaseBillParamsId > 0 == false) {
      this.getDocumentNo();
    }
  }
  //#endregion
  //#region SetFieldsForEditMode
  setFields4EditMode() {
    if (this.purchaseBillParamsId > 0) {
      this.id4submit = this.purchaseBillParamsId;
      this.service.getSaleInvoiceById(this.purchaseBillParamsId).subscribe(
        (result: SaleInvoiceModel) => {
          this.SaleInvoiceFormData = result;
          // this.SaleInvoiceFormData.DeliveryTerm = result.DeliveryTerm;
          this.dataSource = result.InvSaleInvoiceDetaillist;
          this.journalDataSource = result.InvSaleInvoiceJournalList;
          this.expenseDataSource = this.SaleInvoiceFormData.InvSaleInvoiceExpenseList;
          // this.paymentDueDataSource = this.SaleInvoiceFormData.PaymentDuesSchedules;
          this.transpotationGridDataSource = this.SaleInvoiceFormData.InvSaleInvoiceFreightList;
          this.SaleInvoiceFormData.StockPartyId = result[0].StockPartyId;
        },
        (error) => console.log(error)
      );
    } else {
      this.id4submit = 0;
    }
  }
  //#endregion

  //#region  ComboFills
  setFocus = (e) =>
    setTimeout(() => {
      e.component.focus();
    }, 0);

  getDocumentNo() {
    this.service
      .getDocumentNo({
        CompanyId: this.commonService.CompanyId(),
        OrganizationId: this.commonService.OrganizationId(),
        DocumentTypeId: 56,
      })
      .subscribe(
        (result) => (this.SaleInvoiceFormData.DocNo = result),
        (error) => this.HandleError(error)
      );
  }

  async getUOM(itemId) {
    this.uomList = await this.commonMethods.getUOM(itemId);
  }

  //#endregion
  //#region Configurations
  GetAllConfiguration() {
    this.commonService
      .configurations({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.configurationsList = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  //#endregion
  // onCellPrepared = (e) => {
  //   if (e.rowType === "data") {
  //     e.cellElement.style.padding = "0px";
  //     e.cellElement.style.verticalAlign = "middle";
  //   }
  // };

  //#region  MiniMethods

  handleDueDaysChange = (e) => {
    if (this.purchaseBillParamsId > 0 == false) {
      e.value &&
        e.value > 0 &&
        (this.SaleInvoiceFormData.OrderDueDate = new Date(
          this.SaleInvoiceFormData.DocDate.getFullYear(),
          this.SaleInvoiceFormData.DocDate.getMonth(),
          this.SaleInvoiceFormData.DocDate.getDate() + +e.value
        ));
    }
  };

  resetPopupGrid() {
    this.popupDataSource = [];
    this.popupGrid.instance.refresh(true);
    this.popupGrid.instance.repaint();
  }
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
        if (e.value == this.SaleInvoiceFormData.SupplierCustomerId) {
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
  //==========================================================================================================@hamzafarooqi55
  //#region  ThreeMainCalculations
  calculatingTotalItemAmountInDetailGrid() {
    if (this.dataSource.length > 0) {
      this.TotalItemAmountInDetailGrid = 0;
      this.dataSource.map(({ ItemAmount }) => (this.TotalItemAmountInDetailGrid += ItemAmount));
    } else {
      this.TotalItemAmountInDetailGrid = 0;
    }
  }

  //#endregion
  //#region  Detail Grid
  onRowUpdateInDetailGrid = (e) => {
    this.BillAmountPoportionInDetailGrid();
    this.calculateGrandBillAmount();
  };
  // onRateCutChangeInDetailGrd = (newData, value, currentRowData) => {
  //   newData.RateCut = value;
  //   newData.RateCutAmount = (currentRowData.NetBillWeight / currentRowData.EquivalentPoRate) * value;
  //   newData.ItemAmount = currentRowData.ItemAmount - newData.RateCutAmount;
  // };
  BillAmountPoportionInDetailGrid() {
    let CreditAmountInItemSaleGLConfiguration: boolean = false;
    let itemAmountinDetailGridAtIndexOfI = 0;
    let expenseAmountInDetailGridAtIndexOfI = 0;
    let commissionAmountInDetailGridAtIndexOfI = 0;
    if (this.dataSource.length > 0) {
      for (let { ConfigDescription, ConfigKey } of this.configurationsList) {
        if (ConfigDescription == "CreditAmountInItemSaleGL") {
          if (ConfigKey == "True") {
            CreditAmountInItemSaleGLConfiguration = true;
          } else if (ConfigKey == "False" || ConfigKey == undefined) {
            CreditAmountInItemSaleGLConfiguration = false;
          }
        }
      }
      for (let i = 0; i < this.dataSource.length; i++) {
        if (this.dataSource[i].ItemAmount > 0) {
          itemAmountinDetailGridAtIndexOfI = this.dataSource[i].ItemAmount;
        } else {
          itemAmountinDetailGridAtIndexOfI = 0;
        }
        if (this.dataSource[i].ExpenseAmount > 0) {
          expenseAmountInDetailGridAtIndexOfI = this.dataSource[i].ExpenseAmount;
        } else {
          expenseAmountInDetailGridAtIndexOfI = 0;
        }
        if (this.dataSource[i].CommissionAmount > 0) {
          commissionAmountInDetailGridAtIndexOfI = this.dataSource[i].CommissionAmount;
        } else {
          commissionAmountInDetailGridAtIndexOfI = 0;
        }
        if (CreditAmountInItemSaleGLConfiguration == false) {
          this.dataSource[i].BillAmount = itemAmountinDetailGridAtIndexOfI;
        } else if (CreditAmountInItemSaleGLConfiguration == true) {
          this.dataSource[i].BillAmount = itemAmountinDetailGridAtIndexOfI + expenseAmountInDetailGridAtIndexOfI - commissionAmountInDetailGridAtIndexOfI;
        }
      }
    } else {
      return;
    }
  }

  //#endregion
  //#region PopupLoaderForPendingGrns
  ShowLoaderPopup: boolean;

  handlePopupVisibility(e) {
    this.ShowLoaderPopup = !this.ShowLoaderPopup;
  }

  loadDataAgainstSelectedGRNs() {
    if (this.popupGrid.instance.getSelectedRowsData().length > 0) {
      this.dataSource.length = 0;
      let selectedrecord;
      selectedrecord = this.popupGrid.instance.getSelectedRowsData();
      if (selectedrecord.length > 0) {
        //Checking : if selected GRNs are against same customers
        let previousSupplierId = selectedrecord[0].SupplierCustomerId;
        for (let i = 1; i < selectedrecord.length; i++) {
          if (selectedrecord[i].SupplierCustomerId != previousSupplierId) {
            this.WarningPopup("Please Slect GRNs of 1 Customer because Purchase Invoice can be made against 1 Customer Only!");
            return;
          }
          previousSupplierId = selectedrecord[i].SupplierCustomerId;
        }
        this.getSupplierGlIdBySupcusId(selectedrecord[0].SupplierCustomerId);
        this.IdsOfSelectRecordFromLoader = "";
        for (let item of selectedrecord) {
          this.IdsOfSelectRecordFromLoader = this.IdsOfSelectRecordFromLoader + "," + item.Id;
        }
      }
      this.getDataAgainstSelectedGrnsToSetInForm();
      this.popupVisible = !this.popupVisible;
    } else {
      this.WarningPopup("Please Select any GRN First!");
    }
  }

  getSelectedDataFromLoader(e) {
    console.log("selected Data", e);
    if (e?.length > 0 == false) {
      this.WarningPopup("Please Select Record To Proceed");
      return;
    }
    let selectedrecord = e;
    let previousSupplierId = selectedrecord[0].SupplierCustomerId;
    for (let i = 1; i < selectedrecord.length; i++) {
      if (selectedrecord[i].SupplierCustomerId != previousSupplierId) {
        this.WarningPopup("Please Slect GRNs of 1 Customer because Purchase Invoice can be made against 1 Customer Only!");
        return;
      }
      previousSupplierId = selectedrecord[i].SupplierCustomerId;
    }
    this.getSupplierGlIdBySupcusId(selectedrecord[0].SupplierCustomerId);
    this.ShowLoaderPopup = false;
    this.IdsOfSelectRecordFromLoader = "";
    for (let item of selectedrecord) {
      this.IdsOfSelectRecordFromLoader = this.IdsOfSelectRecordFromLoader + "," + item.Id;
    }
    this.getDataAgainstSelectedGrnsToSetInForm();
  }
  //#endregion
  //#region Fetching Data Afet GDN Selection

  getDataAgainstSelectedGrnsToSetInForm() {
    // this.dataSource = null;
    // this.transpotationGridDataSource = [];
    // this.expenseDataSource = [];
    // this.journalDataSource = [];
    // this.emptyBagsDataSource = [];

    this.dataSource = new Array<SaleInvoiceDetailModel>();
    this.expenseDataSource = new Array<ExpenseGridModel>();
    this.journalDataSource = new Array<JournalGridModel>();
    // this.emptyBagsDataSource = new Array<EmptyBagsModel>();
    this.transpotationGridDataSource = new Array<PayblesDebitToItemModel>();
    this.service.getGdnDataOnSelection(this.IdsOfSelectRecordFromLoader).subscribe(
      (result) => {
        if (result.length > 0) {
          this.loadGdnIds = "";
          this.loadGdnIds4EB = "";
          this.IdsOfSelectRecordFromLoader = "";
          this.SaleInvoiceFormData.SupplierCustomerId = result[0].SupplierCustomerId;
          this.SaleInvoiceFormData.CommissionAgentId = result[0].BrokerAgentSupCustId;
          this.SaleInvoiceFormData.CommissionType = result[0].CommissionType;
          this.SaleInvoiceFormData.ReferencePartyId = result[0].ReferencePartyId;
          this.SaleInvoiceFormData.CommRate = result[0].CommRate;
          this.SaleInvoiceFormData.CommAmount = result[0].CommAmount;
          this.SaleInvoiceFormData.CommissionRemarks = result[0].CommissionRemarks;
          this.SaleInvoiceFormData.UomScheduleIdCmRate = result[0].UomScheduleIdCmRate;
          this.SaleInvoiceFormData.RemarksHeader = result[0].RemarksHeader;
          this.SaleInvoiceFormData.VehicleNo = result[0].VehicleNo;
          this.SaleInvoiceFormData.InvGdnId = result[0].InvGdnId;
          this.SaleInvoiceFormData.GpNO = result[0].GpNo;
          // this.SaleInvoiceFormData.DeliveryTerm = result[0].DeliveryTerm;
          this.SaleInvoiceFormData.OrderDueDays = result[0].OrderDueDays;
          this.SaleInvoiceFormData.OrderDueDate = result[0].OrderDueDate;
          this.SaleInvoiceFormData.OutwardGatePassId = result[0].OutwardGatePassId;

          let NewDataList = [];
          for (let i = 0; i < result.length; i++) {
            NewDataList.push({
              PurchaseGLAC: result[i].PurchaseGLAC,
              InvGdnId: result[i].InvGdnId,
              InvGdnDetailId: 0,
              ItemId: result[i].ItemId,
              ItemName: result[i].ItemName,
              CropYear: result[i].CropYear,
              ItemUomId: result[i].ItemUomId,
              ItemCode: result[i].ItemCode,
              UOMCodeItem: result[i].UOMCodeItem,
              ItemQty: result[i].ItemQty,
              LabReportRef: result[i].LabReportRef,
              SaleOrderId: result[i].SaleOrderId,
              SaleOrder: result[i].SaleOrder,
              EBWPerUnit: result[i].EBWPerUnit,
              EBWTotal: result[i].EBWTotal,
              WtCutTotal: result[i].WtCutTotal,
              NetBillWeight: result[i].NetBillWeight,
              NetStockWeight: result[i].StockWeight,
              GrossWeight: result[i].GrossWeight,
              ItemRate: result[i].OrderItemRate,
              OrderItemRateUOMId: result[i].OrderItemRateUOMId,
              RateUOM: 0,
              ItemAmount: 1500,
              RateCut: 0,
              RateCutAmount: 0,
              BillAmount: result[i].BillAmount,
              CarriageAmount: result[i].CarriageAmount,
              ExpenseAmount: result[i].ExpenseAmount,
              CommissionAmount: result[i].CommAmount,
              WarehouseId: result[i].WarehouseId,
              JobLotId: result[i].JobLotId,
              PackingTypeId: result[i].PackingTypeId,
              RefDocumentTypeId: result[i].RefDocumentTypeId,
              RefDocSubIdNo: result[i].RefDocSubIdNo,
              RefDocIdNo: result[i].RefDocIdNo,
            });
          }
          this.dataSource = NewDataList;

          if (this.dataSource.length > 0) {
            for (let i = 0; i < this.dataSource.length; i++) {
              this.dataSource[i].ExpenseAmount = 0;
            }
            for (let item of this.dataSource) {
              this.loadGdnIds = this.loadGdnIds + "," + item.InvGdnId;
            }
            for (let item of this.dataSource) {
              this.loadGdnIds4EB = this.loadGdnIds4EB + "," + item.InvGdnId;
            }
            this.getAllDataForExpenseGridAgainstGdnIds(this.loadGdnIds4EB);
            this.GetFreightByGdnIds(this.loadGdnIds);
            this.calculateGrandBillAmount();
          }
        } else {
          this.WarningPopup("Failed To Load Data Against GRN!");
        }
      },
      (error) => {}
    );
  }

  // loadDataAgainstSelectedGRNs() {
  //   if (this.popupGrid.instance.getSelectedRowsData().length > 0) {
  //     this.dataSource.length = 0;
  //     let selectedrecord;
  //     selectedrecord = this.popupGrid.instance.getSelectedRowsData();
  //     if (selectedrecord.length > 0) {
  //       //Checking : if selected GRNs are against same customers
  //       let previousSupplierId = selectedrecord[0].SupplierCustomerId;
  //       for (let i = 1; i < selectedrecord.length; i++) {
  //         if (selectedrecord[i].SupplierCustomerId != previousSupplierId) {
  //           this.WarningPopup("Please Slect GRNs of 1 Customer because Purchase Invoice can be made against 1 Customer Only!");
  //           return;
  //         }
  //         previousSupplierId = selectedrecord[i].SupplierCustomerId;
  //       }
  //       this.getSupplierGlIdBySupcusId(selectedrecord[0].SupplierCustomerId);
  //       this.IdsOfSelectRecordFromLoader = "";
  //       for (let item of selectedrecord) {
  //         this.IdsOfSelectRecordFromLoader = this.IdsOfSelectRecordFromLoader + "," + item.Id;
  //       }
  //     }
  //     this.getDataAgainstSelectedGrnsToSetInForm();
  //   } else {
  //     this.WarningPopup("Please Select any GRN First!");
  //   }
  // }

  //#endregion
  //#region  Supplier Customer GrnLoadForPurchaseInvoice

  getSupplierGlIdBySupcusId = (e) => {
    let glfilterlist = [];
    glfilterlist = this.supplierCustomerList._store._array.filter(({ Id }) => Id == e);
    this.SupplierGlAccountId = glfilterlist[0].GlAccountId;
  };

  //#endregion
  //#region Transpotation Grid Value To Detail Grid
  GetFreightByGdnIds = (e) => {
    this.transpotationGridDataSource = [];
    this.service.GetTransporterAndFreight(e).subscribe(
      (result) => {
        console.log("Result of ",result);
        
        result.map((item) => {
          this.transpotationGridDataSource.push({
            InvGdnId: item.MainId,
            TansporterId: item.Transporter,
            FreightAmount: item.CarriageAmount,
            Debit:null,
            FrQty:null,
            FrRate:null,
            FrWeight:null,
            Id:null,
            InvSaleInvoiceId:null
          });
        });
        this.setTransportationExpenseInDetailGridProportionally(null);
      },
      (error) => this.HandleError(error)
    );
    this.loadGdnIds = null;
  };
  setTransportationExpenseInDetailGridProportionally = (e) => {
    this.calculatingTotalItemAmountInDetailGrid();

    this.TotalFreightAmountInTranspotationGrid = 0;
    for (let i = 0; i < this.transpotationGridDataSource.length; i++) {
      this.TotalFreightAmountInTranspotationGrid += this.transpotationGridDataSource[i].FreightAmount;
    }
    if (this.TotalItemAmountInDetailGrid > 0 && this.TotalFreightAmountInTranspotationGrid) {
      for (let i = 0; i < this.dataSource.length; i++) {
        this.dataSource[i].CarriageAmount = (this.TotalFreightAmountInTranspotationGrid / this.TotalItemAmountInDetailGrid) * this.dataSource[i].ItemAmount;
      }
    } else {
      this.TotalFreightAmountInTranspotationGrid = 0;
    }

    this.calculateGrandBillAmount();
  };
  onFreightChangeInTranspotationGrid(newData, value, currentRowData) {
    newData.FreightAmount = value;
  }
  //#endregion
  //#region Item Expense Grid
  getAllDataForExpenseGridAgainstGdnIds(e) {
    this.service.GetExpenseGridDataByGdnIds(e).subscribe(
      (result) => {
        result.map((item) => {
          this.expenseDataSource.push({
            InvRevExpItemId: null,
            InvSaleInvoiceId: null,
            Id: null,
            Qty: item.ItemQty,
            Rate: item.BagPrice,
            Amount: item.ItemQty * item.BagPrice,
            Remarks: "",
          });
          this.onRowUpdatedItemGrd(1);
        });
      },
      (error) => {
        this.HandleError(error);
      }
    );
  }
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
  onRowUpdatedItemGrd = (e) => {
    this.calculatingTotalItemAmountInDetailGrid();
    this.TotalAmountInItemExpenseGrid = 0;
    if (this.expenseDataSource.length > 0) {
      for (let i = 0; i < this.expenseDataSource.length; i++) {
        this.TotalAmountInItemExpenseGrid += this.expenseDataSource[i].Amount;
      }
      for (let i = 0; i < this.dataSource.length; i++) {
        this.dataSource[i].ExpenseAmount = (this.TotalAmountInItemExpenseGrid / this.TotalItemAmountInDetailGrid) * this.dataSource[i].ItemAmount;
      }
    }
    this.calculateGrandBillAmount();
  };

  //#endregion
  //#region Supplier Add/Ls Grid
  onQtyChangeInSupplierGrd = (newData, value, currentRowData) => {
    newData.JvQty = value;
    newData.JvDebit = 0;

    if (currentRowData.JvRate > 0) {
      newData.JvCredit = value * currentRowData.JvRate;
    } else {
      newData.JvCredit = 0;
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
  onSuupplierAddLessRowUpdated = (e) => {
    this.TotalCreditAmountInSupplierAddLessGrid = 0;
    this.TotalDebitAmountInSupplierAddLessGrid = 0;
    if (this.journalDataSource.length > 0) {
      for (let i = 0; i < this.journalDataSource.length; i++) {
        if (this.journalDataSource[i].JvDebit > 0) {
          this.TotalDebitAmountInSupplierAddLessGrid += this.journalDataSource[i].JvDebit;
        } else if (this.journalDataSource[i].JvCredit > 0) {
          this.TotalCreditAmountInSupplierAddLessGrid += this.journalDataSource[i].JvCredit;
        }
      }
    }
    this.calculateGrandBillAmount();
  };
  // onPercentChangeInSupplierGrd(newData, value, currentRowData) {
  //   newData.JvPercent=value;
  //   newData.JvQty=0;
  //   newData.JvRate=0;
  //   if (this.TotalItemAmountInDetailGrid > 0 && value > 0) {
  //     newData.JvCredit = (this.TotalItemAmountInDetailGrid * value) / 100;
  //     newData.JvDebit=0;
  //   }
  //   if (this.TotalItemAmountInDetailGrid > 0 && value < 0) {
  //     newData.JvDebit = (this.TotalItemAmountInDetailGrid * Math.abs(value)) / 100;
  //     newData.JvCredit = 0;
  //   }

  // }

  //#endregion
  //#region CommissionBlock
  handleComissionBlock = (e) => {
    this.calculatingCommissionAmountAndSettingInDetailGrid();
    if (this.SaleInvoiceFormData?.CommissionAgentId > 0) {
      this.calculateGrandBillAmount();
    }
  };
  calculatingCommissionAmountAndSettingInDetailGrid() {
    this.calculatingTotalItemAmountInDetailGrid();
    if (this.SaleInvoiceFormData?.CommissionAgentId > 0) {
      if (this.SaleInvoiceFormData.CommissionType != null && this.SaleInvoiceFormData.CommissionType != "") {
        if (this.SaleInvoiceFormData.CommRate != null && this.SaleInvoiceFormData.CommRate != 0) {
          if (this.SaleInvoiceFormData.CommissionType == "Flat") {
            this.SaleInvoiceFormData.CommAmount = this.SaleInvoiceFormData.CommRate;
            this.SaleInvoiceFormData.CommRate = this.SaleInvoiceFormData.CommAmount;
          } else if (this.SaleInvoiceFormData.CommissionType == "Percent") {
            if (this.TotalItemAmountInDetailGrid > 0) {
              this.SaleInvoiceFormData.CommAmount = (this.TotalItemAmountInDetailGrid * this.SaleInvoiceFormData.CommRate) / 100;
            }
          } else if (this.SaleInvoiceFormData.CommissionType == "Comm. Weight") {
            if (this.dataSource.length > 0) {
              this.TotalNetWeightInDetailGrid = 0;
              for (let i = 0; i < this.dataSource.length; i++) {
                this.TotalNetWeightInDetailGrid += this.dataSource[i].NetBillWeight;
              }
            } else {
              this.TotalNetWeightInDetailGrid = 0;
            }

            //Now We have Net Bill Weight:
            //Now We will check UOM For Calculating Comission Amount
            if (this.SaleInvoiceFormData.UomScheduleIdCmRate > 0) {
              this.SaleInvoiceFormData.CommAmount = (this.TotalNetWeightInDetailGrid / this.SaleInvoiceFormData.UomScheduleIdCmRate) * this.SaleInvoiceFormData.CommRate;
            } else {
              this.WarningPopup("Please Select UOM Schedual to Calculate Comission Amount!");
              this.SaleInvoiceForm.instance.getEditor("UomScheduleIdCmRate").focus();
            }
          }

          for (let i = 0; i < this.dataSource.length; i++) {
            this.dataSource[i].CommissionAmount = (this.SaleInvoiceFormData.CommAmount / this.TotalItemAmountInDetailGrid) * this.dataSource[i].ItemAmount;
          }
        } else {
          this.SaleInvoiceForm.instance.getEditor("CommRate").focus();
        }
      } else {
        this.SaleInvoiceForm.instance.getEditor("CommissionType").focus();
      }
    }
  }
  //#endregion
  //#region BillAmount
  calculateGrandBillAmount() {
    this.GrandTotalBillAmount = 0;
    if (this.TotalItemAmountInDetailGrid > 0) {
      this.GrandTotalBillAmount += this.TotalItemAmountInDetailGrid;
    }
    if (this.TotalAmountInItemExpenseGrid > 0) {
      this.GrandTotalBillAmount += this.TotalAmountInItemExpenseGrid;
    }
    if (this.SaleInvoiceFormData?.CommissionAgentId != undefined && this.SaleInvoiceFormData?.CommissionAgentId != 0) {
      if (this.SaleInvoiceFormData?.CommissionAgentId == this.SaleInvoiceFormData.SupplierCustomerId && this.SaleInvoiceFormData.CommAmount > 0) {
        this.GrandTotalBillAmount += this.SaleInvoiceFormData.CommAmount;
      }
    }

    if (this.TotalCreditAmountInSupplierAddLessGrid > 0 || this.TotalDebitAmountInSupplierAddLessGrid > 0) {
      this.GrandTotalBillAmount -= this.TotalDebitAmountInSupplierAddLessGrid;
      this.GrandTotalBillAmount += this.TotalCreditAmountInSupplierAddLessGrid;
    }
    if (this.transpotationGridDataSource.length > 0) {
      for (let i = 0; i < this.transpotationGridDataSource.length; i++) {
        if (this.transpotationGridDataSource[i].TansporterId == this.SupplierGlAccountId) {
          this.GrandTotalBillAmount += this.transpotationGridDataSource[i].FreightAmount;
        }
      }
    }
    this.SaleInvoiceFormData.BillAmount = parseInt(this.GrandTotalBillAmount.toFixed(0));
  }

  //#endregion
  //==========================================================================================================@hamzafarooqi55
  //#region Save
  onSave() {
    if (this.purchaseBillParamsId > 0) {
      if (this.UserRightsObject.canUpdate) {
        this.handleSave();
      } else {
        this.WarningPopup("You dont have Right to Update");
      }
    } else {
      if (this.UserRightsObject.canSave) {
        this.handleSave();
      } else {
        this.WarningPopup("You dont have Right to Save");
      }
    }
  }

  resetForm() {
    this.resetPopupGrid();
    // this.SaleInvoiceFormData = null;
    // this.dataSource = null;
    // this.transpotationGridDataSource = [];
    // this.expenseDataSource = [];
    // this.journalDataSource = [];
    // this.emptyBagsDataSource = [];

    this.dataSource = new Array<SaleInvoiceDetailModel>();
    this.expenseDataSource = new Array<ExpenseGridModel>();
    this.journalDataSource = new Array<JournalGridModel>();
    // this.emptyBagsDataSource = new Array<EmptyBagsModel>();
    this.transpotationGridDataSource = new Array<PayblesDebitToItemModel>();
    this.purchaseBillParamsId = null;
    this.id4submit = null;
    this.SaleInvoiceForm.instance.getEditor("PaymentTermsId").focus();
    this.initForm();
    // this.getDocumentNo();
  }

  handleSave() {
    this.calculateGrandBillAmount();

    const result: any = this.SaleInvoiceForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      if (this.dataSource.length > 0 == false) {
        this.WarningPopup("No Detail Record Found");
        return;
      }
      return;
    } else {
      if (this.journalDataSource.length > 0) {
        for (let i = 0; i < this.journalDataSource.length; i++) {
          if (this.journalDataSource[i].JvDebit > 0 || this.journalDataSource[i].JvCredit > 0) {
            if (this.journalDataSource[i].ChartofAccountId > 0 == false) {
              this.WarningPopup("Please Select Account in Supplier Add/Ls Grid!");
              return;
            }
          }
        }
      }
      if (this.expenseDataSource.length > 0) {
        for (let i = 0; i < this.expenseDataSource.length; i++) {
          if (this.expenseDataSource[i].Amount > 0) {
            if (this.expenseDataSource[i].InvRevExpItemId > 0 == false) {
              this.WarningPopup("Please Select Other Item Account against Expense in Item Add/Ls Grid!");
              return;
            }
          }
        }
      }
      if (this.SaleInvoiceFormData.CommAmount > 0) {
        if (this.SaleInvoiceFormData?.CommissionAgentId > 0 == false) {
          this.WarningPopup("Please Select Comission Agent Id In Form Header!");
          return;
        }
      }
      if (this.dataSource.length > 0) {
        for (let i = 0; i < this.dataSource.length; i++) {
          this.dataSource[i].ItemCgsRate = 0;
          if (this.dataSource[i].ItemId > 0 == false) {
            this.WarningPopup("Item Id is required in Detail Grid.Please Contanct the support Team!");
            return;
          }
          if (this.dataSource[i].ItemQty > 0 == false) {
            this.WarningPopup("Item Quantity is required in Detail Grid.Please Contact the support Team!");
            return;
          }
          if (this.dataSource[i].ItemRate > 0 == false) {
            this.WarningPopup("Item Rate is required in Detail Grid.Please Contact the support Team!");
            return;
          }
          // if (this.dataSource[i].ItemUOMId > 0 == false) {
          //   this.WarningPopup("Item UOM  is required in Detail Grid!");
          //   this.dataSource[i].ItemUOMId = this.dataSource[i].ItemUOMId;
          //   return;
          // }

          // this.dataSource[i].NetStockWeight = this.dataSource[i].NetStockWeight;
          // this.dataSource[i].EBTotalWt = this.dataSource[i].EBTotalWt;
          // this.dataSource[i].EBWeight = this.dataSource[i].EBWeight;
          // if (this.dataSource[i].EquivalentPoRate > 0) {
          //   this.dataSource[i].UomScheduleIdRate = this.dataSource[i].EquivalentPoRate;
          // } else {
          //   this.dataSource[i].UomScheduleIdRate = this.dataSource[i].OrderItemRateUOMId;
          // }
          // if (this.dataSource[i].UomScheduleIdRate > 0 == false) {
          //   this.WarningPopup("Rate UOM is required in Detail Grid.Please Contact the support Team!");
          //   return;
          // }
        }
      } else {
        this.WarningPopup("Detail Record Not Found");
        return;
      }
      if (this.transpotationGridDataSource.length > 0) {
        for (let i = 0; i < this.transpotationGridDataSource.length; i++) {
          if (this.transpotationGridDataSource[i].TansporterId > 0 == false) {
            this.WarningPopup("Transporter Is Required  in Transporation Grid");
            return;
          }
          if (this.transpotationGridDataSource[i].FreightAmount > 0 == false) {
            this.WarningPopup("Freight Amount Is Required in Transporation Grid");
            return;
          }
        }
      }

      if (this.journalDataSource.length > 0) {
        for (let i = 0; i < this.journalDataSource.length; i++) {
          if (this.journalDataSource[i].ChartofAccountId > 0 == false) {
            this.WarningPopup("Account(Cr) Required in Supplier Add Less Grid");
            return;
          }
          if (this.journalDataSource[i].JvQty > 0 == false) {
            this.WarningPopup("Qty Is Required in Supplier Add Less Grid ");
            return;
          }
          if (this.journalDataSource[i].JvRate > 0 == false) {
            this.WarningPopup("Rate Is Required in Supplier Add Less Grid ");
            return;
          }
          if (this.journalDataSource[i].JvDebit > 0 == false && this.journalDataSource[i].JvCredit > 0 == false) {
            this.WarningPopup("Amount Is Required in Supplier Add Less Grid ");
            return;
          }
        }
      }

      if (this.expenseDataSource.length > 0) {
        for (let i = 0; i < this.expenseDataSource.length; i++) {
          if (this.expenseDataSource[i].InvRevExpItemId > 0 == false) {
            this.WarningPopup("Item Is Required in Item Add Less Grid");
            return;
          }
          if (this.expenseDataSource[i].Qty > 0 == false) {
            this.WarningPopup("Qty Is Required in Item Add Less Grid ");
            this.message = "";
            return;
          }
          if (this.expenseDataSource[i].Rate > 0 == false) {
            this.WarningPopup("Rate Is Required in Item Add Less Grid ");
            return;
          }
          if (this.expenseDataSource[i].Amount > 0 == false) {
            this.WarningPopup("Amount Is Required in Item Add Less Grid ");
            return;
          }
        }
      }
      this.SaleInvoiceFormData.DocumentTypeId = 95;
      this.SaleInvoiceFormData.BranchesId = this.branchList[0].Id;
      this.SaleInvoiceFormData.ProjectsId = this.projectList[0].Id;
      this.SaleInvoiceFormData.SupplierInvoiceDate = this.SaleInvoiceFormData.OrderDueDate;
      this.SaleInvoiceFormData.SupplierInvoiceNo = this.SaleInvoiceFormData.DocNo;
      this.SaleInvoiceFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.SaleInvoiceFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.SaleInvoiceFormData.FinancialYearId = this.commonService.FinancialYearId();
      this.SaleInvoiceFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.SaleInvoiceFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.SaleInvoiceFormData.EntryDate = new Date();
      this.SaleInvoiceFormData.ModifyDate = new Date();
      this.SaleInvoiceFormData.PostDate = new Date();
      this.SaleInvoiceFormData.InvSaleInvoiceFreightList = this.transpotationGridDataSource;
      this.SaleInvoiceFormData.InvSaleInvoiceExpenseList = this.expenseDataSource;
      this.SaleInvoiceFormData.InvSaleInvoiceJournalList = this.journalDataSource;
      this.SaleInvoiceFormData.InvSaleInvoiceDetaillist = this.dataSource;
      console.log("Form Data: ", this.SaleInvoiceFormData);

      this.ActivateLoadPanel("Saving");
      this.service.saveSave(this.SaleInvoiceFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.purchaseBillParamsId > 0 ? this.SuccessPopup("Record Updated successfully!") : this.SuccessPopup("Record saved successfully!");
          this.router.navigate([], { queryParams: { Id: null } });
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
//#endregion
