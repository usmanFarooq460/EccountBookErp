import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent, DxSwitchComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { validate } from "src/app/shared/Base/validationHelper";
import { ExpenseGridModel, JournalGridModel, PayblesDebitToItemModel, EmptyBagsModel, PurchaseInvoiceModel, PurchaseInvoiceDetailModel } from "../purchase-invoice.model";
import { PurchaseInvoiceService } from "../purchase-invoice.service";

@Component({
  selector: "app-purchase-bill-form",
  templateUrl: "./purchase-invoice-form.component.html",
  styleUrls: ["./purchase-invoice-form.component.scss"],
})
export class PurchaseInvoiceFormComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  detailGrid: DxDataGridComponent;

  @ViewChild(DxDataGridComponent, { static: false })
  journalGrid: DxDataGridComponent;

  @ViewChild(DxDataGridComponent, { static: false })
  expenseGrid: DxDataGridComponent;

  // Forms
  @ViewChild("PurchaseInvoiceForm", { static: false }) // Purchase Bill form instance
  PurchaseInvoiceForm: DxFormComponent;

  @ViewChild("PurchaseInvoiceForm1", { static: false }) // Purchase Bill form instance
  PurchaseInvoiceForm1: DxFormComponent;

  @ViewChild("PurchaseInvoiceForm2", { static: false }) // Purchase Bill form instance
  PurchaseInvoiceForm2: DxFormComponent;

  @ViewChild("PurchaseInvoiceForm3", { static: false }) // Purchase Bill form instance
  PurchaseInvoiceForm3: DxFormComponent;

  @ViewChild("PurchaseInvoiceForm4", { static: false }) // Purchase Bill form instance
  PurchaseInvoiceForm4: DxFormComponent;

  @ViewChild("PurchaseInvoiceForm5", { static: false }) // Purchase Bill form instance
  PurchaseInvoiceForm5: DxFormComponent;

  @ViewChild("PurchaseInvoiceForm6", { static: false }) // Purchase Bill form instance
  PurchaseInvoiceForm6: DxFormComponent;

  @ViewChild("PurchaseInvoiceForm7", { static: false }) // Purchase Bill form instance
  PurchaseInvoiceForm7: DxFormComponent;
  ////////////////

  PurchaseInvoiceFormData: PurchaseInvoiceModel; // Purchase Bill form object

  @ViewChild("PurchaseInvoiceDetailForm", { static: false }) // Purchase bill detail form instance
  PurchaseInvoiceDetailForm: DxFormComponent;
  PurchaseInvoiceDetailFormData: PurchaseInvoiceDetailModel; // purchase bill detail form object

  @ViewChild("SuppCustDetailUnderComboComponentForCustomer")
  SuppCustDetailUnderComboComponentForCustomer;

  @ViewChild("SuppCustDetailUnderComboComponentForComissionAgent")
  SuppCustDetailUnderComboComponentForComissionAgent;

  @ViewChild("SuppCustDetailUnderComboComponentForBrokerAgent")
  SuppCustDetailUnderComboComponentForBrokerAgent;

  // @ViewChild("popupForm", { static: false })
  // popupForm: DxFormComponent;
  // popupFormData: PopupModel;

  @ViewChild("switch", { static: false })
  switch: DxSwitchComponent;

  dataSource = new Array<PurchaseInvoiceDetailModel>();
  popupDataSource = [];
  journalDataSource = new Array<JournalGridModel>();
  paymentDueDataSource = [];
  expenseDataSource = new Array<ExpenseGridModel>();
  transpotationGridDataSource = new Array<PayblesDebitToItemModel>();
  branchList = [];
  projectList = [];
  paymentTermList = [];
  warehouseList = [];
  itemList = [];
  supplierCustomerList: any;
  uomList = [];
  jobLotList = [];
  deliveryTermList = ["Load", "Ponch"];
  commissionTypeList = ["Flat", "Percent", "Comm. Weight"];

  rateUOMList = [1, 5, 10, 25, 40, 60, 80, 100];
  accountList = [];
  transporterList = [];
  emptyBagsList = [];
  emptyBagsDataSource = new Array<EmptyBagsModel>();
  itemAccountList;
  loadGrnIds: string;
  loadGrnIdsForExpnese: string;
  loadGrnIds4EB: string;
  detailEditMode: boolean;
  updateDetailRowIndex: number;
  detailDataGridUpdated: boolean;
  supplierBillAmount: number;
  purchaseBillParamsId: number;
  SupplierGlAccountId: number;

  VoucherHeadId: any;

  IdsOfSelectRecordFromLoader: string = "";
  TotalItemAmountInDetailGrid: number;
  TotalNetWeightInDetailGrid: number;
  TotalFreightAmountInTranspotationGrid: number;
  TotalAmountInEmptyBagsGrid: number;
  TotalAmountInItemExpenseGrid: number;
  TotalCreditAmountInSupplierAddLessGrid: number;
  TotalDebitAmountInSupplierAddLessGrid: number;
  GrandTotalBillAmount: number;

  ListForAccordion = [
    {
      title: "Comission And Brokery",
    },
  ];
  canPrintonSave: boolean = true;
  loaderVisible: boolean;

  //===================================================================
  constructor(private commonMethods: CommonMethodsForCombos, private commonService: CommonBaseService, private service: PurchaseInvoiceService, private route: ActivatedRoute, private router: Router) {
    super();
  }

  async ngOnInit() {
    this.purchaseBillParamsId = this.route.snapshot.queryParams["Id"];
    await this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("InvfrmPurchaseInvoice"));
    this.FetchData();
    this.initForm();
  }

  async FetchData() {
    this.ActivateLoadPanel("Fetching data for Form Fields");
    this.branchList = await this.commonService.getBranch().catch((err) => this.HandleError(err));
    this.projectList = await this.commonService.getProject().catch((err) => this.HandleError(err));
    this.paymentTermList = await this.commonMethods.PaymentTermsGetAll().catch((err) => this.HandleError(err));
    this.supplierCustomerList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.SupplierCustomerByOrganizationAndCompany().catch((err) => this.HandleError(err)));
    this.warehouseList = await this.commonMethods.getWareHouse().catch((err) => this.HandleError(err));
    this.itemList = await this.commonMethods.ItemsGetAll().catch((err) => this.HandleError(err));
    this.jobLotList = await this.commonMethods.getJobLot().catch((err) => this.HandleError(err));
    let allChartOfAccounts = await this.commonMethods.CoaAllocationGetAll().catch((err) => this.HandleError(err));
    this.accountList = allChartOfAccounts.filter(({ AccountTypeId }) => AccountTypeId !== 15 && AccountTypeId !== 11 && AccountTypeId !== 2);
    this.transporterList = allChartOfAccounts.filter(({ AccountTypeId }) => AccountTypeId !== 15 && AccountTypeId !== 11 && AccountTypeId !== 2);
    this.itemAccountList = await this.commonMethods.GetInventoryOtherItems().catch((err) => this.HandleError(err));
    this.DeActivateLoadPanel();
  }

  //#region InitForm
  async initForm() {
    this.PurchaseInvoiceFormData = new PurchaseInvoiceModel();
    this.PurchaseInvoiceFormData.DocDate = new Date();
    //===========================================
    this.TotalItemAmountInDetailGrid = 0;
    this.TotalNetWeightInDetailGrid = 0;
    this.GrandTotalBillAmount = 0;
    this.TotalAmountInItemExpenseGrid = 0;
    this.TotalFreightAmountInTranspotationGrid = 0;
    this.TotalDebitAmountInSupplierAddLessGrid = 0;
    this.TotalCreditAmountInSupplierAddLessGrid = 0;
    this.TotalAmountInEmptyBagsGrid = 0;

    //===========================================
    if (this.purchaseBillParamsId > 0) {
      this.setFields4EditMode();
    } else {
      this.PurchaseInvoiceFormData.DocNo = await this.getDocumentNo();
    }
  }
  //#endregion
  //#region SetFieldsForEditMode
  setFields4EditMode() {
    if (this.purchaseBillParamsId > 0) {
      this.service.getPurchaseBillById(this.purchaseBillParamsId).subscribe(
        (result: PurchaseInvoiceModel) => {
          console.log("form result : ", result);

          this.PurchaseInvoiceFormData = result;
          this.PurchaseInvoiceFormData.DeliveryTerm = result.DeliveryTerm;
          this.dataSource = result.invPurchaseInvoiceDetailList;
          this.journalDataSource = result.InvPurchaseInvoicejournalList;
          this.expenseDataSource = this.PurchaseInvoiceFormData.InvPurchaseInvoiceExpList;
          // this.paymentDueDataSource = this.PurchaseInvoiceFormData.PaymentDuesSchedules;
          this.emptyBagsDataSource = this.PurchaseInvoiceFormData.InvPurchaseInvoiceEmptyBagslist;
          this.transpotationGridDataSource = this.PurchaseInvoiceFormData.InvPurchaseInvoiceFreightList;
          this.PurchaseInvoiceFormData.StockPartyId = result.StockPartyId;
        },
        (error) => this.HandleError(error)
      );
    }
  }
  //#endregion

  async getDocumentNo() {
    return await this.service
      .getDocumentNo({
        CompanyId: this.commonService.CompanyId(),
        OrganizationId: this.commonService.OrganizationId(),
        DocumentTypeId: 56,
      })
      .catch((error) => this.HandleError(error));
  }

  //#endregion
  handleDueDaysChange = (e) => {
    if (this.purchaseBillParamsId > 0 == false) {
      e.value &&
        e.value > 0 &&
        (this.PurchaseInvoiceFormData.DueDate = new Date(
          this.PurchaseInvoiceFormData.DocDate.getFullYear(),
          this.PurchaseInvoiceFormData.DocDate.getMonth(),
          this.PurchaseInvoiceFormData.DocDate.getDate() + +e.value
        ));
    }
  };

  handleCustomerChange = (e) => {
    if (e.value > 0) this.SuppCustDetailUnderComboComponentForCustomer.SetInfoObjectValues(e.value);
  };

  handleComissionBlock = (e) => {
    this.SuppCustDetailUnderComboComponentForComissionAgent.SetInfoObjectValues(e.value);
  };
  handleBrokeryBlock = (e) => {
    this.SuppCustDetailUnderComboComponentForBrokerAgent.SetInfoObjectValues(e.value);
  };

  calculatingCommissionAmountAndSettingInDetailGrid() {
    this.calculatingTotalItemAmountInDetailGrid();
    if (this.PurchaseInvoiceFormData.CommissionAgentId > 0) {
      if (this.PurchaseInvoiceFormData.CommissionType != null && this.PurchaseInvoiceFormData.CommissionType != "") {
        if (this.PurchaseInvoiceFormData.CommRate != null && this.PurchaseInvoiceFormData.CommRate != 0) {
          if (this.PurchaseInvoiceFormData.CommissionType == "Flat") {
            this.PurchaseInvoiceFormData.CommAmount = this.PurchaseInvoiceFormData.CommRate;
            this.PurchaseInvoiceFormData.CommRate = this.PurchaseInvoiceFormData.CommAmount;
          } else if (this.PurchaseInvoiceFormData.CommissionType == "Percent") {
            if (this.TotalItemAmountInDetailGrid > 0) {
              this.PurchaseInvoiceFormData.CommAmount = (this.TotalItemAmountInDetailGrid * this.PurchaseInvoiceFormData.CommRate) / 100;
            }
          } else if (this.PurchaseInvoiceFormData.CommissionType == "Comm. Weight") {
            this.calculateNetWeightInDetailGrid();
            if (this.PurchaseInvoiceFormData.CommRate > 0) {
              this.PurchaseInvoiceFormData.CommAmount = (this.TotalNetWeightInDetailGrid / this.PurchaseInvoiceFormData.CommRate) * this.PurchaseInvoiceFormData.CommRate;
            } else {
              this.PurchaseInvoiceForm.instance.getEditor("CommRate").focus();
            }
          }
          for (let i = 0; i < this.dataSource.length; i++) {
            this.dataSource[i].CommissionAmount = (this.PurchaseInvoiceFormData.CommAmount / this.TotalItemAmountInDetailGrid) * this.dataSource[i].ItemAmount;
          }
        }
      }
    }
  }

  handleBrokeryCalculations = (e) => {
    this.calculatingTotalItemAmountInDetailGrid();
    let brRate = this.PurchaseInvoiceFormData.BrokeryRate > 0 ? this.PurchaseInvoiceFormData.BrokeryRate : 0;
    if (this.PurchaseInvoiceFormData.BrokeryType !== null && this.PurchaseInvoiceFormData.BrokeryType !== undefined) {
      if (this.PurchaseInvoiceFormData.BrokeryType == "Flat") {
        this.PurchaseInvoiceFormData.BrokeryAmount = brRate;
      }
      if (this.PurchaseInvoiceFormData.BrokeryType == "Percent") {
        this.PurchaseInvoiceFormData.BrokeryAmount = (this.TotalItemAmountInDetailGrid * this.PurchaseInvoiceFormData.BrokeryRate) / 100;
        this.PurchaseInvoiceFormData.BrokeryAmount = parseFloat(this.PurchaseInvoiceFormData.BrokeryAmount.toFixed(2));
      }
      if (this.PurchaseInvoiceFormData.BrokeryType == "Comm. Weight") {
        this.calculateNetWeightInDetailGrid();
        if (this.PurchaseInvoiceFormData.BrokeryRate > 0) {
          this.PurchaseInvoiceFormData.BrokeryAmount = (this.TotalNetWeightInDetailGrid / this.PurchaseInvoiceFormData.BrokeryRate) * this.PurchaseInvoiceFormData.BrokeryRate;
        } else {
          this.PurchaseInvoiceForm.instance.getEditor("BrokeryRate").focus();
        }
      }
    }
  };

  calculateNetWeightInDetailGrid() {
    if (this.dataSource.length > 0) {
      this.TotalNetWeightInDetailGrid = 0;
      for (let i = 0; i < this.dataSource.length; i++) {
        this.TotalNetWeightInDetailGrid += this.dataSource[i].NetBillWeight;
      }
    } else {
      this.TotalNetWeightInDetailGrid = 0;
    }
  }

  handleLoaderPopupVisiblity(event) {
    this.loaderVisible = !this.loaderVisible;
  }

  loadDataAgainstSelectedGRNs(event) {
    console.log("loader selected data: ", event);
   
  }

  // getDataAgainstSelectedGrnsToSetInForm() {
  //   this.service.getGrnOnBillDetailLoad(this.IdsOfSelectRecordFromLoader).subscribe(
  //     (result) => {
  //       console.log("result after loadeing data from loader: ", result);
  //       if (result.length > 0) {
  //         this.PurchaseInvoiceFormData.SupplierCustomerId = result[0].SupplierCustomerId;
  //         this.PurchaseInvoiceFormData.CommissionAgentId = result[0].CommissionAgentId;
  //         this.PurchaseInvoiceFormData.CommissionType = result[0].CommissionType;
  //         this.PurchaseInvoiceFormData.CommRate = result[0].CommRate;
  //         this.PurchaseInvoiceFormData.CommAmount = result[0].CommAmount;
  //         this.PurchaseInvoiceFormData.CommissionRemarks = result[0].CommissionRemarks;
  //         this.PurchaseInvoiceFormData.UomScheduleIdCmRate = result[0].UomScheduleIdCmRate;
  //         this.PurchaseInvoiceFormData.RemarksHeader = result[0].RemarksHeader;
  //         // this.PurchaseInvoiceFormData.VehicleNo = result[0].VehicleNo;
  //         // this.PurchaseInvoiceFormData.InvGrnId = result[0].InvGrnId;
  //         // this.PurchaseInvoiceFormData.GpNO = result[0].GpNo;
  //         this.PurchaseInvoiceFormData.DeliveryTerm = result[0].DeliveryTerm;
  //         this.PurchaseInvoiceFormData.DueDays = result[0].OrderDueDays;
  //         this.PurchaseInvoiceFormData.DueDate = result[0].OrderDueDate;
  //         this.PurchaseInvoiceFormData.DeliveryTerm = result[0].DeliveryTerm;
  //         this.PurchaseInvoiceFormData.CommissionAgentId = result[0].BrokerAgentSupCustId;
  //         // this.PurchaseInvoiceFormData.InwardGatePassId = result[0].InwardGatePassId;

  //         this.dataSource = result;
  //         for (let i = 0; i < this.dataSource.length; i++) {
  //           this.dataSource[i].ExpenseAmount = 0;
  //         }

  //         this.loadGrnIds = "";
  //         this.loadGrnIdsForExpnese = "";
  //         this.loadGrnIds4EB = "";
  //         if (this.dataSource.length > 0) {
  //           for (let item of this.dataSource) {
  //             this.loadGrnIds = this.loadGrnIds + "," + item.InvGrnId;
  //           }

  //           for (let item of this.dataSource) {
  //             this.loadGrnIds4EB = this.loadGrnIds4EB + "," + item.InvGrnId;
  //           }
  //           for (let item of this.dataSource) {
  //             this.loadGrnIdsForExpnese = this.loadGrnIdsForExpnese + "," + item.InvGrnId;
  //           }
  //         }
  //         this.GetFreightByGrnIds(this.loadGrnIds);
  //         this.GetDataForExpenseGridAgainstGrnIds(this.loadGrnIdsForExpnese);
  //         this.GetEmptyBagsByGrnIds(this.loadGrnIds4EB);
  //         this.loadGrnIds = "";
  //         this.loadGrnIds4EB = "";
  //         this.IdsOfSelectRecordFromLoader = "";
  //         this.calculatingTotalItemAmountInDetailGrid();
  //         this.calculateGrandBillAmount();
  //       } else {
  //         this.WarningPopup("Failed To Load Data Against GRN!");
  //       }
  //     },
  //     (error) => {
  //       this.HandleError(error);
  //     }
  //   );
  // }

  getSupplierGlIdBySupcusId = (e) => {
    let glfilterlist = [];
    glfilterlist = this.supplierCustomerList._store._array.filter(({ Id }) => Id == e);
    this.SupplierGlAccountId = glfilterlist[0].GlAccountId;
  };

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
        if (e.value == this.PurchaseInvoiceFormData.SupplierCustomerId) {
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
    if (this.dataSource?.length > 0) {
      this.TotalItemAmountInDetailGrid = 0;
      this.dataSource.map(({ ItemAmount }) => (this.TotalItemAmountInDetailGrid += ItemAmount));
    } else {
      this.TotalItemAmountInDetailGrid = 0;
    }
  }

  //#endregion
  //#region  Detail Grid
  onRowUpdateInDetailGrid = (e) => {
    this.calculateGrandBillAmount();
    this.BillAmountPoportionInDetailGrid();
  };
  onRateCutChangeInDetailGrd = (newData, value, currentRowData) => {
    newData.RateCut = value;
    if (currentRowData.NetBillWeight > 0 && currentRowData.EquivalentPoRate > 0 && value > 0) {
      newData.RateCutAmount = (currentRowData.NetBillWeight / currentRowData.EquivalentPoRate) * value;
      newData.ItemAmount = currentRowData.ItemAmount - newData.RateCutAmount;
    }
  };
  BillAmountPoportionInDetailGrid() {
    let itemAmountinDetailGridAtIndexOfI = 0;
    let expenseAmountInDetailGridAtIndexOfI = 0;
    let commissionAmountInDetailGridAtIndexOfI = 0;
    let freightAmountInTransportationGridAtIndexOfI = 0;
    if (this.dataSource?.length > 0) {
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
        // if (this.dataSource[i].CarriageAmount > 0) {
        //   freightAmountInTransportationGridAtIndexOfI = this.dataSource[i].CarriageAmount;
        // } else {
        //   freightAmountInTransportationGridAtIndexOfI = 0;
        // }
        this.dataSource[i].BillAmount = itemAmountinDetailGridAtIndexOfI + expenseAmountInDetailGridAtIndexOfI + commissionAmountInDetailGridAtIndexOfI + freightAmountInTransportationGridAtIndexOfI;
      }
    }
  }

  // GetEmptyBagsByGrnIds = (e) => {
  //   this.emptyBagsDataSource = [];
  //   this.service.GetEmptyBagsByGrn(e).subscribe(
  //     (result) => {
  //       console.log("Empty Bags Result: ", result);
  //       // result?.map((item) => {
  //       //   this.emptyBagsDataSource.push({
  //       //     InvGrnId: item.InvGrnId,
  //       //     ItemId: item.ItemId,
  //       //     ItemName: item.ItemName,
  //       //     PurchaseQty: item.PurchaseQty,
  //       //     Rate: 0,
  //       //     Amount: 0,
  //       //     Remarks: item.Remarks,
  //       //     ReceivedQty: 0,
  //       //     Id: null,
  //       //     InvPurchaseInvoiceId: null,
  //       //     TypeId: null,
  //       //   });
  //       // });
  //       this.calculateGrandBillAmount();
  //     },
  //     (error) => this.HandleError(error)
  //   );
  //   this.loadGrnIds4EB = null;
  // };

  //#endregion
  //#region  Supplier Customer GrnLoadForPurchaseInvoice

  //#endregion
  //#region Transpotation Grid Value To Detail Grid
  // GetFreightByGrnIds = (e) => {
  //   this.transpotationGridDataSource = [];
  //   this.service.GetTransporterAndFreight(e).subscribe(
  //     (result) => {
  //       // result.map((item) => {
  //       //   this.transpotationGridDataSource.push({
  //       //     InvGrnId: item.MainId,
  //       //     TansporterId: item.Transporter,
  //       //     FreightAmount: item.CarriageAmount,
  //       //     Remarks: "",
  //       //   });
  //       // });
  //       this.setTransportationExpenseInDetailGridProportionally(1);
  //     },
  //     (error) => this.HandleError(error)
  //   );
  //   this.loadGrnIds = null;
  // };
  setTransportationExpenseInDetailGridProportionally = (e) => {
    this.calculatingTotalItemAmountInDetailGrid();
    this.TotalFreightAmountInTranspotationGrid = 0;
    for (let i = 0; i < this.transpotationGridDataSource.length; i++) {
      this.TotalFreightAmountInTranspotationGrid += this.transpotationGridDataSource[i].FreightAmount;
    }
    // if (this.TotalItemAmountInDetailGrid > 0 && this.TotalFreightAmountInTranspotationGrid) {
    //   for (let i = 0; i < this.dataSource.length; i++) {
    //     this.dataSource[i].CarriageAmount = (this.TotalFreightAmountInTranspotationGrid / this.TotalItemAmountInDetailGrid) * this.dataSource[i].ItemAmount;
    //   }
    // } else {
    //   this.TotalFreightAmountInTranspotationGrid = 0;
    // }
    this.calculateGrandBillAmount();
  };
  onFreightChangeInTranspotationGrid(newData, value, currentRowData) {
    newData.FreightAmount = value;
  }

  //#endregion
  //#region EmptyBagsGridMethods
  onEmptyBagGridRowUpdated = (e) => {
    if (this.emptyBagsDataSource.length) {
      this.TotalAmountInEmptyBagsGrid = 0;
      for (let i = 0; i < this.emptyBagsDataSource.length; i++) {
        if (this.emptyBagsDataSource[i].Amount > 0) {
          this.TotalAmountInEmptyBagsGrid += this.emptyBagsDataSource[i].Amount;
        }
      }
    }
    this.calculateGrandBillAmount();
  };

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
  // GetDataForExpenseGridAgainstGrnIds(e) {
  //   this.service.GetExpenseGridDataByGrnIds(e)
  //   // .subscribe(
  //   //   (result) => {
  //   //     result?.map((item) => {
  //   //       // if (item.BagPrice > 0) {
  //   //       //   this.expenseDataSource.push({
  //   //       //     InvRevExpItemId: null,
  //   //       //     Qty: item.ItemQty,
  //   //       //     Rate: item.BagPrice,
  //   //       //     Amount: item.ItemQty * item.BagPrice,
  //   //       //     Remarks: "",
  //   //       //   });
  //   //       // }
  //   //     });
  //   //     this.onRowUpdatedItemGrd(1);
  //   //   },
  //   //   (error) => {
  //   //     this.HandleError(error);
  //   //   }
  //   // );
  // }

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
    if (this.PurchaseInvoiceFormData?.CommissionAgentId != undefined && this.PurchaseInvoiceFormData?.CommissionAgentId != 0) {
      if (this.PurchaseInvoiceFormData?.CommissionAgentId == this.PurchaseInvoiceFormData.SupplierCustomerId && this.PurchaseInvoiceFormData.CommAmount > 0) {
        this.GrandTotalBillAmount += this.PurchaseInvoiceFormData.CommAmount;
      }
    }

    if (this.TotalCreditAmountInSupplierAddLessGrid > 0 || this.TotalDebitAmountInSupplierAddLessGrid > 0) {
      this.GrandTotalBillAmount += this.TotalDebitAmountInSupplierAddLessGrid;
      this.GrandTotalBillAmount -= this.TotalCreditAmountInSupplierAddLessGrid;
    }
    if (this.TotalAmountInEmptyBagsGrid > 0) {
      this.GrandTotalBillAmount += this.TotalAmountInEmptyBagsGrid;
    }
    if (this.transpotationGridDataSource.length > 0) {
      for (let i = 0; i < this.transpotationGridDataSource.length; i++) {
        if (this.transpotationGridDataSource[i].TansporterId == this.SupplierGlAccountId) {
          this.GrandTotalBillAmount += this.transpotationGridDataSource[i].FreightAmount;
        }
      }
    }
    if (this.GrandTotalBillAmount != undefined) this.PurchaseInvoiceFormData.BillAmount = this.GrandTotalBillAmount;
  }

  //#endregion
  //==========================================================================================================@hamzafarooqi55
  //#region Save
  onSave() {
    if (this.purchaseBillParamsId > 0) {
      if (this.UserRightsObject.canUpdate) {
        this.handleSave();
      } else {
        this.ErrorPopup("You don't have Right to update!");
      }
    } else {
      if (this.UserRightsObject.canSave) {
        this.handleSave();
      } else {
        this.ErrorPopup("You don't have Right to Save!");
      }
    }
  }
  resetForm() {
    this.router.navigate([], { queryParams: { Id: null } });
    this.PurchaseInvoiceFormData = null;
    this.dataSource = null;
    this.transpotationGridDataSource = [];
    this.expenseDataSource = [];
    this.journalDataSource = [];
    this.emptyBagsDataSource = [];

    this.purchaseBillParamsId = null;
    this.PurchaseInvoiceForm.instance.getEditor("PaymentTermsId").focus();
    this.initForm();
  }
  /* print */
  printAfterSave = ({ value }) => {
    if (value) {
      this.canPrintonSave = true;
    } else {
      this.canPrintonSave = false;
    }
  };

  GetVoucherHeadIdForReport = (e) => {
    this.service
      .getvoucherheadId({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 56,
        DocumentTypeSrNo: e,
      })
      .subscribe(
        (result) => {
          this.VoucherHeadId = null;
          this.VoucherHeadId = result;
        },
        (error) => this.HandleError(error)
      );
  };
  onPrint(e) {
    this.GetVoucherHeadIdForReport(e);
    this.service
      .getVoucherpdfReport({
        Id: this.VoucherHeadId,
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocumentTypeId: 56,
        ReportName: "103-AcRptPurchaseSalesVoucherSlip",
      })
      .subscribe(
        (result) => window.open(result),
        (error) => this.HandleError(error)
      );
  }
  handleSave() {
    console.log("inside the hanlde save");

    this.calculateGrandBillAmount();
    if (validate(this.PurchaseInvoiceForm)) {
      if (this.dataSource.length > 0 == false) {
        this.WarningPopup("No Detail Record Found!");
        return;
      }

      if (this.transpotationGridDataSource.length > 0) {
        for (let i = 0; i < this.transpotationGridDataSource.length; i++) {
          if (this.transpotationGridDataSource[i].FreightAmount > 0) {
            if (this.transpotationGridDataSource[i].TansporterId > 0 == false) {
              this.WarningPopup("Please Select Account Against Freight in Transpotation Grid!");
              return;
            }
          }
        }
      }
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
      if (this.PurchaseInvoiceFormData.CommAmount > 0) {
        if (this.PurchaseInvoiceFormData.CommissionAgentId > 0 == false) {
          this.WarningPopup("Please Select Comission Agent Id In Form Header!");
          return;
        }
      }
      for (let i = 0; i < this.dataSource.length; i++) {
        this.dataSource[i].ItemCgsRate = 0;
        if (this.dataSource[i].ItemId > 0 == false) {
          this.WarningPopup("Item Id is required in Detail Grid.");
          return;
        }
        if (this.dataSource[i].ItemQty > 0 == false) {
          this.WarningPopup("Item Quantity is required in Detail Grid. ");
          return;
        }
        if (this.dataSource[i].ItemRate > 0 == false) {
          this.WarningPopup("Item Rate is required in Detail Grid. ");
          return;
        }
        if (this.dataSource[i].ItemUOMId > 0 == false) {
          this.WarningPopup("Item UOM is required in Detail Grid. ");
          return;
        }
        if (this.dataSource[i].UomScheduleIdRate > 0 == false) {
          this.WarningPopup("Rate UOM is required in Detail Grid. ");
          return;
        }
      }

      this.PurchaseInvoiceFormData.DocumentTypeId = 56;
      this.PurchaseInvoiceFormData.SupplierInvoiceDate = new Date();
      this.PurchaseInvoiceFormData.SupplierInvoiceNo = 1;

      this.PurchaseInvoiceFormData.BranchesId = this.branchList[0].Id;
      this.PurchaseInvoiceFormData.ProjectsId = this.projectList[0].Id;

      this.PurchaseInvoiceFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.PurchaseInvoiceFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.PurchaseInvoiceFormData.FinancialYearId = this.commonService.FinancialYearId();
      this.PurchaseInvoiceFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.PurchaseInvoiceFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.PurchaseInvoiceFormData.EntryDate = new Date();
      this.PurchaseInvoiceFormData.ModifyDate = new Date();
      this.PurchaseInvoiceFormData.InvPurchaseInvoiceFreightList = this.transpotationGridDataSource;
      this.PurchaseInvoiceFormData.InvPurchaseInvoiceExpList = this.expenseDataSource;
      this.PurchaseInvoiceFormData.InvPurchaseInvoicejournalList = this.journalDataSource;
      this.PurchaseInvoiceFormData.InvPurchaseInvoiceEmptyBagslist = this.emptyBagsDataSource;

      this.PurchaseInvoiceFormData.invPurchaseInvoiceDetailList = this.dataSource;
      this.service.savePurchaseBill(this.PurchaseInvoiceFormData).subscribe(
        (result) => {
          this.purchaseBillParamsId ? this.SuccessPopup("Record updated successfully") : this.SuccessPopup("Record saved successfully!");
          if (this.purchaseBillParamsId > 0) {
            if (this.canPrintonSave) {
              this.onPrint(this.purchaseBillParamsId);
            }
          } else if (this.purchaseBillParamsId > 0 == false) {
            if (this.canPrintonSave) {
              this.onPrint(result);
            }
          }
          this.resetForm();
        },
        (error) => {
          this.HandleError(error);
        }
      );
    }
  }
}
//#endregion
