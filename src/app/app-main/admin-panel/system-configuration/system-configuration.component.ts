import { Component, OnInit, ViewChild } from "@angular/core";
import { DxFormComponent } from "devextreme-angular";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { AccountsConfiguration } from "./configuration.model";
import { ConfigurationService } from "./configuration.service";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import DataSource from "devextreme/data/data_source";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "app-system-configuration",
  templateUrl: "./system-configuration.component.html",
  styles: [],
})
export class SystemConfigurationComponent extends BaseActions implements OnInit {
  currencyList = [];
  cashControlList = [];
  bankControlList = [];
  cropYearList = [];
  jobLotList = [];
  packingTypeList = [];
  expenseLaborList = [];
  warehouseList = [];
  cityAreaList = [];
  accountList = [];
  cashAccountList = [];
  DiscountAllowedAccList: any = [];
  DiscountReceivedAccList = [];
  LocationAcclist: any = [];
  freightOutwardAccList: any = [];
  accumulatedBudgetList = [{ list: "Stop" }, { list: "Warn" }, { list: "Ignore" }];
  ManageStockBy = ["Item, WareHouse", "Item, WareHouse, CropYear", "Item, WareHouse, CropYear, Job/Lot", "Item, WareHouse, CropYear, Job/Lot, packingType,PackUom"];

  bankCtrlVal: number;
  currencyVal: number;
  cashCtrlVal: number;
  chequeBookVal: boolean;
  minusVal: boolean;
  smsPV_val: boolean;
  smsRV_val: boolean;
  cropYearVal: number;
  jobLotVal: number;
  packTypeVal: number;
  expAccVal: number;
  warehouseVal: number;
  cityVal: number;
  agStockVal: number;
  diffBalVal: number;
  poGPVal: boolean;
  moreByGP: boolean;
  openOrderQtyVal: boolean;
  gpWeGRNVal: boolean;
  purchaseFrEqVal: boolean;
  briManVal: boolean;
  poGRNVal: boolean;
  // purByInvVal: boolean;
  purByInvVal: string;
  FreightInwardAcVal: number;
  soCompGPO: boolean;
  moreByGPSale: boolean;
  openOrderQtySaleVal: boolean;
  gpWeGDNVal: boolean;
  soCompGDN: boolean;
  credSale: boolean;
  accumulatedBudgetVal: string;
  accountsConfigCashInHandVal: number;
  BackDaysEntryVal: number;
  StockConversionFinancialVal: boolean;
  storeIssuanceVal: boolean;
  expenseAmmountVal: boolean;
  debitToProductVal: boolean;
  actualExpensesVal: boolean;
  IssuanceByLoaderVal: boolean;
  stockInMinusVal: boolean;
  ManageStockByVal: number;
  LabCompulsoryForWeighBridgeVal: boolean;
  PoUpdateAfterApprovedVal: boolean;
  WbCompulsoryForGpInward: boolean;
  receiptsbyInvoiceVal: string;
  FreightOutwardAcVal: number;
  SaleOrderLoadCustomerVal: boolean;
  AllowCgsEntryVal:boolean;
  cashInHandAccountVal: number;
  POSDiscountAllowedAccVal: number;
  POSDiscountReceivedAccVal: number;
  locationAccountVal: number;
  WsrmDiscountAllowedAccVal: number;
  WsrmDiscountReceivedAccVal: number;
  ImplementPriceFromSaleOrderVal: boolean;
  ImplementDiscountFromSaleOrderVal: boolean;

  IPCam01Val: string;
  IPCam02Val: string;
  IPCam03Val: string;
  IPCam04Val: string;
  PortNo01Val: string;
  PortNo02Val: string;
  PortNo03Val: string;
  PortNo04Val: string;
  UserNameCamer01Val: string;
  UserNameCamer02Val: string;
  UserNameCamer03Val: string;
  UserNameCamer04Val: string;
  PasswordCamer01Val: string;
  PasswordCamer02Val: string;
  PasswordCamer03Val: string;
  PasswordCamer04Val: string;
  cameraPicBoxVal: string;
  AttachmentFolderPathVal: string;
  backupFolderPathVal: string;
  reportFolderPathVal: string;
  localDrivePathVal: string;
  ServerFileURLVal: string;
  BackupIntervalDaysVal: string;
  LogoVal: string;
  //==================================================
  CONFIG_KEY_AND_ID: any;

  constructor(private service: ConfigurationService, private commonService: CommonBaseService, private commonMethods: CommonMethodsForCombos) {
    super();
  }

  ngOnInit(): void {
    this.getBaseCurrency();
    this.getControlAccounts();
    this.getCropYear();
    this.getJobLot();
    this.getPackingType();
    this.getCity();
    this.getWarehouse();
    this.getAccounts();
    this.getConfigurationsList();
    this.setFields4Update();
  }

  setFields4Update() {
    this.service
      .getConfigurationsList({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => {
          for (let { ConfigDescription, ConfigKey } of result) {
            /////////////////////////////////////// accounts config ///////////////////////////////////
            if (ConfigDescription === "Base Currency") {
              this.currencyVal = +ConfigKey;
            }
            if (ConfigDescription === "Cash Control Account") {
              this.cashCtrlVal = +ConfigKey;
            }
            if (ConfigDescription === "Bank Control Account") {
              this.bankCtrlVal = +ConfigKey;
            }
            if (ConfigDescription === "CashInHandAc") {
              this.accountsConfigCashInHandVal = +ConfigKey;
            }
            if (ConfigDescription === "MonthlyBudget") {
              this.accumulatedBudgetVal = ConfigKey;
            }
            if (ConfigDescription === "BackDaysEntry") {
              this.BackDaysEntryVal = +ConfigKey;
            }
            if (ConfigDescription === "CheqBook Enabled") {
              ConfigKey === "True" ? (this.chequeBookVal = true) : (this.chequeBookVal = false);
            }
            if (ConfigDescription === "is Minus balance Allowed") {
              ConfigKey === "True" ? (this.minusVal = true) : (this.minusVal = false);
            }
            if (ConfigDescription === "Send SMS Payment Voucher (Value From)") {
              ConfigKey === "True" ? (this.smsPV_val = true) : (this.smsPV_val = false);
            }
            if (ConfigDescription === "Send SMS Receipts Voucher (Value From)") {
              ConfigKey === "True" ? (this.smsRV_val = true) : (this.smsRV_val = false);
            }
            if (ConfigDescription === "ExpenseAccountAllowOnPaymentVoucher") {
              ConfigKey === "True" ? (this.expenseAmmountVal = true) : (this.expenseAmmountVal = false);
            }
            if (ConfigDescription === "StockConversionFinancial Effect") {
              ConfigKey === "True" ? (this.StockConversionFinancialVal = true) : (this.StockConversionFinancialVal = false);
            }
            if (ConfigDescription === "StoreIssuanceFinancialEffect") {
              ConfigKey === "True" ? (this.storeIssuanceVal = true) : (this.storeIssuanceVal = false);
            }
            if (ConfigDescription === "ContractWagesChargetoProduct") {
              ConfigKey === "True" ? (this.debitToProductVal = true) : (this.debitToProductVal = false);
            }
            if (ConfigDescription === "Apply On Actual Expenses") {
              ConfigKey === "True" ? (this.actualExpensesVal = true) : (this.actualExpensesVal = false);
            }
            /////////////////////////////////////// accounts config ///////////////////////////////////
            /////////////////////////////////////// inventory ///////////////////////////////////
            if (ConfigDescription === "Default Crop Year") {
              this.cropYearVal = +ConfigKey;
            }
            if (ConfigDescription === "Job/Lot") {
              this.jobLotVal = +ConfigKey;
            }
            if (ConfigDescription === "Paking Type") {
              this.packTypeVal = +ConfigKey;
            }
            if (ConfigDescription === "Warehouse") {
              this.warehouseVal = +ConfigKey;
            }
            if (ConfigDescription === "City Area") {
              this.cityVal = +ConfigKey;
            }
            if (ConfigDescription === "StockAgainstAccount") {
              this.agStockVal = +ConfigKey;
            }
            if (ConfigDescription === "ExpensesLabourOtherAc") {
              this.expAccVal = +ConfigKey;
            }
            if (ConfigDescription === "DifferenceBalanceAc") {
              this.diffBalVal = +ConfigKey;
            }
            if (ConfigDescription === "IssuanceByLoader") {
              ConfigKey === "True" ? (this.IssuanceByLoaderVal = true) : (this.IssuanceByLoaderVal = false);
            }
            if (ConfigDescription === "IsMinusStockAllowed") {
              ConfigKey === "True" ? (this.stockInMinusVal = true) : (this.stockInMinusVal = false);
            }
            if (ConfigDescription === "CheckStockItemWareHouse") {
              if (ConfigKey === "True") this.ManageStockByVal = 0;
            }
            if (ConfigDescription === "CheckStockItemWareHouseCropYear") {
              if (ConfigKey === "True") this.ManageStockByVal = 1;
            }
            if (ConfigDescription === "CheckStockItemWareHouseCropYearJobLot") {
              if (ConfigKey === "True") this.ManageStockByVal = 2;
            }
            if (ConfigDescription === "CheckStockItemWareHouseCropYearJobLotPackingTypeUom") {
              if (ConfigKey === "True") this.ManageStockByVal = 3;
            }

            /////////////////////////////////////// inventory ///////////////////////////////////
            /////////////////////////////////////// purchase ///////////////////////////////////
            if (ConfigDescription === "PO Compulsory in GPI") {
              ConfigKey === "True" ? (this.poGPVal = true) : (this.poGPVal = false);
            }
            if (ConfigDescription === "More Than 1 Weight By 1GpNo Against") {
              ConfigKey === "True" ? (this.moreByGP = true) : (this.moreByGP = false);
            }
            if (ConfigDescription === "Open Order Quantity") {
              ConfigKey === "True" ? (this.openOrderQtyVal = true) : (this.openOrderQtyVal = false);
            }
            if (ConfigDescription === "Gp Weight Check In GRN") {
              ConfigKey === "True" ? (this.gpWeGRNVal = true) : (this.gpWeGRNVal = false);
            }
            if (ConfigDescription === "PurchaeInvoiceFreightEqual") {
              ConfigKey === "True" ? (this.purchaseFrEqVal = true) : (this.purchaseFrEqVal = false);
            }
            if (ConfigDescription === "WeighBridgeManualWeight") {
              ConfigKey === "True" ? (this.briManVal = true) : (this.briManVal = false);
            }
            if (ConfigDescription === "POCompulsoryforGrn") {
              ConfigKey === "True" ? (this.poGRNVal = true) : (this.poGRNVal = false);
            }
            if (ConfigDescription === "LabCompulsoryForWeighBridge") {
              ConfigKey === "True" ? (this.LabCompulsoryForWeighBridgeVal = true) : (this.LabCompulsoryForWeighBridgeVal = false);
            }
            if (ConfigDescription === "PoUpdateAfterApproved") {
              ConfigKey === "True" ? (this.PoUpdateAfterApprovedVal = true) : (this.PoUpdateAfterApprovedVal = false);
            }
            if (ConfigDescription === "WbCompulsoryForGpInward") {
              ConfigKey === "True" ? (this.WbCompulsoryForGpInward = true) : (this.WbCompulsoryForGpInward = false);
            }
            if (ConfigDescription === "PaymentByInvoicePurchaseInvoice") {
              this.purByInvVal = ConfigKey;
            }
            if (ConfigDescription === "FreightInwardAc") {
              this.FreightInwardAcVal = +ConfigKey;
            }
            /////////////////////////////////////// purchase ///////////////////////////////////
            /////////////////////////////////////// sale ///////////////////////////////////
            if (ConfigDescription === "SO Compulsory in GPO") {
              ConfigKey === "True" ? (this.soCompGPO = true) : (this.soCompGPO = false);
            }
            if (ConfigDescription === "More Than 1 Weight By 1GpNoO Against") {
              ConfigKey === "True" ? (this.moreByGPSale = true) : (this.moreByGPSale = false);
            }
            if (ConfigDescription === "Open Sale Order Quantity") {
              ConfigKey === "True" ? (this.openOrderQtySaleVal = true) : (this.openOrderQtySaleVal = false);
            }
            if (ConfigDescription === "Gp Weight Check In GDN") {
              ConfigKey === "True" ? (this.gpWeGDNVal = true) : (this.gpWeGDNVal = false);
            }
            if (ConfigDescription === "SOCompulsoryforGdn") {
              ConfigKey === "True" ? (this.soCompGDN = true) : (this.soCompGDN = false);
            }
            if (ConfigDescription === "CreditAmountInItemSaleGL") {
              ConfigKey === "True" ? (this.credSale = true) : (this.credSale = false);
            }
            if (ConfigDescription === "SaleOrderLoadCustomerWise") {
              ConfigKey === "True" ? (this.SaleOrderLoadCustomerVal = true) : (this.SaleOrderLoadCustomerVal = false);
            }
            if (ConfigDescription === "ReceiptsByInvoiceSalesInvoice") {
              this.receiptsbyInvoiceVal = ConfigKey;
            }
            if (ConfigDescription === "FreightOutwardAc") {
              this.FreightOutwardAcVal = +ConfigKey;
            }
            /////////////////////////////////////// sale ///////////////////////////////////

            // ===========================Point  Of Sale =================================//
            if (ConfigDescription === "PosCashInHandAc") {
              this.cashInHandAccountVal = +ConfigKey;
            }

            if (ConfigDescription === "PosDiscountAllowed") {
              this.POSDiscountAllowedAccVal = +ConfigKey;
            }

            if (ConfigDescription === "PosDiscountReceived") {
              this.POSDiscountReceivedAccVal = +ConfigKey;
            }

            if (ConfigDescription === "WsRmDiscountAllowed") {
              this.WsrmDiscountAllowedAccVal = +ConfigKey;
            }

            if (ConfigDescription === "WsRmDiscountReceived") {
              this.WsrmDiscountReceivedAccVal = +ConfigKey;
            }

            if (ConfigDescription === "LocationAccount") {
              this.locationAccountVal = +ConfigKey;
            }

            if (ConfigDescription === "ImplementPriceFromSaleOrder") {
              ConfigKey === "True" ? (this.ImplementPriceFromSaleOrderVal = true) : (this.ImplementPriceFromSaleOrderVal = false);
            }

            if (ConfigDescription === "ImplementDiscountFromSaleOrder") {
              ConfigKey === "True" ? (this.ImplementDiscountFromSaleOrderVal = true) : (this.ImplementDiscountFromSaleOrderVal = false);
            }

            // ======================================== Point Of Sale =================================//

            // ======================================= Camera COnfig 20 jan =================================//

            if (ConfigDescription === "IpCameraAddress01") {
              this.IPCam01Val = ConfigKey;
            }
            if (ConfigDescription === "IpCameraAddress02") {
              this.IPCam02Val = ConfigKey;
            }
            if (ConfigDescription === "IpCameraAddress03") {
              this.IPCam03Val = ConfigKey;
            }
            if (ConfigDescription === "IpCameraAddress04") {
              this.IPCam04Val = ConfigKey;
            }
            if (ConfigDescription === "PortNo01") {
              this.PortNo01Val = ConfigKey;
            }
            if (ConfigDescription === "PortNo02") {
              this.PortNo02Val = ConfigKey;
            }
            if (ConfigDescription === "PortNo03") {
              this.PortNo03Val = ConfigKey;
            }
            if (ConfigDescription === "PortNo04") {
              this.PortNo04Val = ConfigKey;
            }
            if (ConfigDescription === "UserNameCamer01") {
              this.UserNameCamer01Val = ConfigKey;
            }
            if (ConfigDescription === "UserNameCamer02") {
              this.UserNameCamer02Val = ConfigKey;
            }
            if (ConfigDescription === "UserNameCamer03") {
              this.UserNameCamer03Val = ConfigKey;
            }
            if (ConfigDescription === "UserNameCamer04") {
              this.UserNameCamer04Val = ConfigKey;
            }
            if (ConfigDescription === "PasswordCamer01") {
              this.PasswordCamer01Val = ConfigKey;
            }
            if (ConfigDescription === "PasswordCamer02") {
              this.PasswordCamer02Val = ConfigKey;
            }
            if (ConfigDescription === "PasswordCamer03") {
              this.PasswordCamer03Val = ConfigKey;
            }
            if (ConfigDescription === "PasswordCamer04") {
              this.PasswordCamer04Val = ConfigKey;
            }
            if (ConfigDescription === "CameraPictureBox") {
              this.cameraPicBoxVal = ConfigKey;
            }
            // ======================================= Camera COnfig 20 jan =================================//

            // ======================================= System Config 20 jan =================================//
            if (ConfigDescription === "Attachment Folder Path") {
              this.AttachmentFolderPathVal = ConfigKey;
            }
            if (ConfigDescription === "Backup Folder Path") {
              this.backupFolderPathVal = ConfigKey;
            }
            if (ConfigDescription === "Report Folder Path") {
              this.reportFolderPathVal = ConfigKey;
            }
            if (ConfigDescription === "ShareLocalDrivePath") {
              this.localDrivePathVal = ConfigKey;
            }
            if (ConfigDescription === "ServerFileURL") {
              this.ServerFileURLVal = ConfigKey;
            }
            if (ConfigDescription === "BackupIntervalDays") {
              this.BackupIntervalDaysVal = ConfigKey;
            }
            if (ConfigDescription === "Logo") {
              this.LogoVal = ConfigKey;
            }

            // ======================================= System Config 20 jan =================================//
          }
        },
        (error) => console.log(error)
      );
  }

  getConfigurationsList() {
    this.service
      .getConfigurationsList({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => {},
        (error) => console.log(error)
      );
  }

  getBaseCurrency() {
    this.service
      .getBaseCurrency({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => {
          this.currencyList = result;
        },
        (error) => console.log(error)
      );
  }

  getControlAccounts() {
    this.service
      .getControlAccounts({
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
        FinancialYearId: parseInt(sessionStorage.getItem("FinancialYearId")),
        Account_Level: 3,
      })
      .subscribe(
        (result) => {
          this.cashControlList = result.filter(({ AccountTypeId }) => AccountTypeId === 2);
          this.bankControlList = result.filter(({ AccountTypeId }) => AccountTypeId === 15);
        },
        (error) => console.log(error)
      );
  }

  getCropYear() {
    this.service
      .getCropYear({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => (this.cropYearList = result),
        (error) => console.log(error)
      );
  }

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

  getPackingType() {
    this.service.getPackingType().subscribe(
      (result) => (this.packingTypeList = result),
      (error) => console.log(error)
    );
  }

  getWarehouse() {
    this.service
      .getWarehouse({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => (this.warehouseList = result),
        (error) => console.log(error)
      );
  }

  getCity() {
    this.service
      .getCity({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => (this.cityAreaList = result),
        (error) => console.log(error)
      );
  }

  getAccounts() {
    this.service
      .getAccounts({
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
      })
      .subscribe(
        (result) => {
          this.expenseLaborList = result.filter(({ AccountTypeId }) => AccountTypeId === 11);
          this.accountList = result.filter(({ AccountTypeId }) => AccountTypeId !== 11 && AccountTypeId !== 15 && AccountTypeId !== 2);
          this.cashAccountList = result.filter(({ AccountTypeId }) => AccountTypeId == 2);
          this.DiscountAllowedAccList = new DataSource({
            store: result.filter(({ AccountTypeId }) => AccountTypeId == 11),
            loadMode: "raw",
            paginate: true,
            pageSize: 10,
          });
          this.DiscountReceivedAccList = result.filter(({ AccountTypeId }) => AccountTypeId == 10);
          this.LocationAcclist = new DataSource({
            store: result.filter(({ AccountTypeId }) => AccountTypeId !== 2 && AccountTypeId !== 10 && AccountTypeId !== 11 && AccountTypeId !== 12 && AccountTypeId !== 15),
            loadMode: "raw",
            paginate: true,
            pageSize: 10,
          });
          this.freightOutwardAccList = new DataSource({
            store: result.filter(({ AccountTypeId }) => AccountTypeId !== 2 && AccountTypeId !== 15 && AccountTypeId !== 10),
            loadMode: "raw",
            paginate: true,
            pageSize: 10,
          });
        },
        (error) => console.log(error)
      );
  }

  saveConfigurations(id, configId, text, value) {
    this.service
      .saveConfigurations({
        Id: id,
        ConfigrationsDefinitionId: configId,
        ConfigDescription: text,
        ConfigKey: value,
        IsActive: true,
        OrganizationId: parseInt(sessionStorage.getItem("OrganizationId")),
        CompanyId: parseInt(sessionStorage.getItem("CompanyId")),
      })
      .subscribe(
        (result) => {},
        (error) => console.log(error)
      );
  }

  async getConfigIdAndIdByConfigNameAndSave(configName, value) {
    this.CONFIG_KEY_AND_ID = await this.commonMethods.GetConfigKeyAndIdByConfigName(configName);
    this.saveConfigurations(this.CONFIG_KEY_AND_ID.Id, this.CONFIG_KEY_AND_ID.ConfigrationsDefinitionId, configName, value);
  }

  onSwitchChange({ value }, configName) {
    value ? (value = "True") : (value = "False");
    this.getConfigIdAndIdByConfigNameAndSave(configName, value);
  }

  onComboChange({ value }, configName) {
    
    this.getConfigIdAndIdByConfigNameAndSave(configName, value);
  }

  async HandleConfigOperationsInCaseOfRadioButtons(configName, value) {
    this.CONFIG_KEY_AND_ID = await this.commonMethods.GetConfigKeyAndIdByConfigName(configName);
    this.saveConfigurations(this.CONFIG_KEY_AND_ID.Id, this.CONFIG_KEY_AND_ID.ConfigrationsDefinitionId, configName, value);
  }

  onRadioButtonChange = (e) => {
    if (e.value == "Item, WareHouse") {
      this.HandleConfigOperationsInCaseOfRadioButtons("CheckStockItemWareHouse", "True");
      this.HandleConfigOperationsInCaseOfRadioButtons("CheckStockItemWareHouseCropYear", "False");
      this.HandleConfigOperationsInCaseOfRadioButtons("CheckStockItemWareHouseCropYearJobLot", "False");
      this.HandleConfigOperationsInCaseOfRadioButtons("CheckStockItemWareHouseCropYearJobLotPackingTypeUom", "False");
    } else if (e.value == "Item, WareHouse, CropYear") {
      this.HandleConfigOperationsInCaseOfRadioButtons("CheckStockItemWareHouse", "False");
      this.HandleConfigOperationsInCaseOfRadioButtons("CheckStockItemWareHouseCropYear", "True");
      this.HandleConfigOperationsInCaseOfRadioButtons("CheckStockItemWareHouseCropYearJobLot", "False");
      this.HandleConfigOperationsInCaseOfRadioButtons("CheckStockItemWareHouseCropYearJobLotPackingTypeUom", "False");
    } else if (e.value == "Item, WareHouse, CropYear, Job/Lot") {
      this.HandleConfigOperationsInCaseOfRadioButtons("CheckStockItemWareHouse", "False");
      this.HandleConfigOperationsInCaseOfRadioButtons("CheckStockItemWareHouseCropYear", "False");
      this.HandleConfigOperationsInCaseOfRadioButtons("CheckStockItemWareHouseCropYearJobLot", "True");
      this.HandleConfigOperationsInCaseOfRadioButtons("CheckStockItemWareHouseCropYearJobLotPackingTypeUom", "False");
    } else if (e.value == "Item, WareHouse, CropYear, Job/Lot, packingType,PackUom") {
      this.HandleConfigOperationsInCaseOfRadioButtons("CheckStockItemWareHouse", "False");
      this.HandleConfigOperationsInCaseOfRadioButtons("CheckStockItemWareHouseCropYear", "False");
      this.HandleConfigOperationsInCaseOfRadioButtons("CheckStockItemWareHouseCropYearJobLot", "False");
      this.HandleConfigOperationsInCaseOfRadioButtons("CheckStockItemWareHouseCropYearJobLotPackingTypeUom", "True");
    }
  };
}
