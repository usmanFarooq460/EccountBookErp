import { Component, OnInit, ViewChild } from "@angular/core";
import { FcyPaymentDetailModel, FcyPaymentModel } from "../fcy-payment.model";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { FcyPaymentService } from "../fcy-payment.service";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { validate } from "src/app/shared/Base/validationHelper";
import { ActivatedRoute, Router } from "@angular/router";
import { ProceedChargesTypeModel } from "../fcy-payment.model";

@Component({
  selector: "app-fcy-payement-form",
  templateUrl: "./fcy-payement-form.component.html",
  styleUrls: ["./fcy-payement-form.component.scss"],
})
export class FcyPayementFormComponent extends BaseActions implements OnInit {
  @ViewChild("FcyPaymentForm", { static: false })
  FcyPaymentForm: DxFormComponent;
  FcyPaymentFormData: FcyPaymentModel;
  @ViewChild("FcyPaymentDetailForm", { static: false })
  FcyPaymentDetailForm: DxFormComponent;
  FcyPaymentDetailFormData: FcyPaymentDetailModel;
  @ViewChild("ProceedChargesAccountDefinationForm", { static: false })
  ProceedChargesAccountDefinationForm: DxFormComponent;
  ProceedChargesAccountDefinationFormData: ProceedChargesTypeModel;
  @ViewChild("detailGrid", { static: false })
  detailGrid: DxDataGridComponent;
  @ViewChild("ProceedChargesAccountDefinationHitoryGrid", { static: false })
  ProceedChargesAccountDefinationHitoryGrid: DxDataGridComponent;
  @ViewChild("SuppCustDetailUnderComboComponent", { static: false })
  SuppCustDetailUnderComboComponent;
  //DataVariables
  PaymentTermsList = [];
  SupplierList: any;
  InvoiceNumbersList = [];
  BanksList: any;
  FcyCodeList = [];
  ImportContractNumbersList = [];
  GainLossAccountList: any;
  ChargesTypeList = [];
  dataSource = [];
  companyList = [];
  branchesList = [];
  projectsList = [];
  ProceedsChargesGlAccountList: any;
  ProceedsChargesTypeAccountList: any;
  RecordToBeCompared: any;
  //Conditional Variables
  FcyPaymentParamsId: number = 0;
  ProceedsChargesTypeAccountDefinationParamsId: number;
  updateRowIndex: number;
  detailEditMode: boolean;
  InvoiceNumberReadOnly: boolean = true;
  ContractNumberReadOnly: boolean = true;
  ProceedChargesAccountDefinationFormPopupVisibile: boolean = false;
  constructor(private commonMethods: CommonMethodsForCombos, private route: ActivatedRoute, private router: Router, private service: FcyPaymentService, private commonBaseService: CommonBaseService) {
    super();
  }
  async ngOnInit() {
    this.FcyPaymentParamsId = this.route.snapshot.queryParams["Id"];
    this.ProceedChargesAccountList();
    await this.FetchData();
    this.InitForm();
  }

  async FetchData() {
    this.projectsList = await this.commonBaseService.getProject();
    this.branchesList = await this.commonBaseService.getBranch();
    this.PaymentTermsList = await this.commonMethods.GetStaticColumnNamesByActivity("FcyPaymentVoucherPaymentTerms");
    this.ChargesTypeList = await this.commonMethods.GetStaticColumnNamesByActivity("FcyPaymentVoucherChargesType");
    this.BanksList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetAccountsIncludingAccountTypeIds("15"));
    this.FcyCodeList = await this.commonMethods.MultiCurrency();
    this.GainLossAccountList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetAccountsExcludingAccountTypeIds("2,4,11,12,15"));
    this.ProceedsChargesGlAccountList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetAccountsExcludingAccountTypeIds("2,5,11,12"));
  }

  InitForm() {
    this.FcyPaymentFormData = new FcyPaymentModel();
    this.FcyPaymentDetailFormData = new FcyPaymentDetailModel();
    this.ProceedChargesAccountDefinationFormData = new ProceedChargesTypeModel();
    this.FcyPaymentFormData.ProjectId = this.projectsList[0].Id;
    this.FcyPaymentFormData.BranchId = this.branchesList[0].Id;
    this.FcyPaymentFormData.DocumentDate = new Date();
    this.FcyPaymentFormData.ExmLcPaymentTerm = this.PaymentTermsList[0].term;

    if (this.FcyPaymentParamsId > 0 == false) {
      this.GetDocumentNumber();
    } else if (this.FcyPaymentParamsId > 0) {
      this.GetById();
    }
  }

  resetForm() {
    this.InitForm();
  }
  
  //#region ComboFills
  GetById() {
    this.ActivateLoadPanel("Fetching Data");
    this.service.GetBYId(this.FcyPaymentParamsId).subscribe(
      (result: any) => {
        this.DeActivateLoadPanel();
        this.RecordToBeCompared = JSON.parse(JSON.stringify(result));
        this.dataSource = result.ExImFcBankPaymentsDeductionslst;
        this.FcyPaymentFormData = result;
        this.handleMainFormCalculations(1);
      },
      (error) => {
        this.DeActivateLoadPanel();
        this.HandleError(error);
      }
    );
  }
  onProceedAccountEdid(data) {
    this.ProceedsChargesTypeAccountDefinationParamsId = data.Id;
    this.service.ProceedAccountGetById(this.ProceedsChargesTypeAccountDefinationParamsId).subscribe(
      (result: any) => {
        this.ProceedChargesAccountDefinationFormData = result;
        this.ProceedChargesAccountDefinationFormData.ProceedsChargesGlAccount = result.ProceedsChargesGlAccount;
      },
      (error) => {
        this.HandleError(error);
      }
    );
  }
  handlePaymentTermChange = (e) => {
    if (e.value == "Invoice Payment") {
      this.InvoiceNumberReadOnly = false;
      this.ContractNumberReadOnly = true;
      this.FcyPaymentFormData.ExImLcOrderId = null;
      this.GetSupplierFromImInvoice();
      if (this.FcyPaymentFormData.SupplierCustomerId > 0) {
        this.GetInvoiceNumbersListBySupplierId({ value: this.FcyPaymentFormData.SupplierCustomerId });
      }
    } else if (e.value == "Advanced Payment") {
      this.FcyPaymentFormData.ExImInvoiceId = null;
      this.InvoiceNumberReadOnly = true;
      this.ContractNumberReadOnly = false;
      this.GetSupplierCustomersFromImContract();
      if (this.FcyPaymentFormData.SupplierCustomerId > 0) {
        this.GetContractNumbersListBySupplierId({ value: this.FcyPaymentFormData.SupplierCustomerId });
      }
    } else {
      this.InvoiceNumberReadOnly = true;
      this.ContractNumberReadOnly = true;
      this.FcyPaymentFormData.SupplierCustomerId = null;
      this.SupplierList = null;
    }
  };
  async GetSupplierFromImInvoice() {
    this.SupplierList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetSupplierCustomerFromImInvoice());
  }
  async GetSupplierCustomersFromImContract() {
    this.SupplierList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.GetSupplierCustomerFromImContract());
  }
  GetDocumentNumber() {
    this.service
      .GenerateCode({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 204,
      })
      .subscribe(
        (result) => {
          this.FcyPaymentFormData.DocumentNo = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  handleSupplierChange = (e) => {
    if (e.value > 0) this.SuppCustDetailUnderComboComponent.SetInfoObjectValues(e.value);
    if (e.value > 0 && this.FcyPaymentFormData.ExmLcPaymentTerm == "Invoice Payment") {
      this.GetInvoiceNumbersListBySupplierId(e);
    } else if (e.value > 0 && this.FcyPaymentFormData.ExmLcPaymentTerm == "Advanced Payment") {
      this.GetContractNumbersListBySupplierId(e);
    } else {
      this.FcyPaymentFormData.ExImInvoiceId = null;
      this.InvoiceNumbersList = [];
      this.ImportContractNumbersList = [];
    }
  };
  GetInvoiceNumbersListBySupplierId(e) {
    this.service
      .InvoiceNumbersBySupplierId({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        SupplierCustomerId: e.value,
      })
      .subscribe(
        (result) => {
          this.InvoiceNumbersList = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  GetContractNumbersListBySupplierId(e) {
    this.service
      .ContractNumbersBySupplierId({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        SupplierCustomerId: e.value,
      })
      .subscribe(
        (result) => {
          this.ImportContractNumbersList = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  handleInvoiceNumberChange = (e) => {
    if (e.value > 0) {
      this.GetAmountsDataByInvoiceId(e);
      this.GetRateDataByInvoiceId(e);
    } else {
      this.FcyPaymentFormData.TotalInvoiceAmount = 0;
      this.FcyPaymentFormData.TotalPaidAmount = 0;
      this.FcyPaymentFormData.InvoiceBalanceAmount = 0;
      this.FcyPaymentFormData.MultiCurrencyId = 0;
      this.FcyPaymentFormData.VoucherExchangeRate = 0;
    }
  };
  handleContractNumberChange = (e) => {
    if (e.vaue > 0) {
      this.FcyPaymentFormData.MultiCurrencyId = this.ImportContractNumbersList.find(({ Id }) => Id == e.value).FcurrencyId;
    }
  };
  GetAmountsDataByInvoiceId(e) {
    this.service
      .GetAmountsDataByInvoiceId({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        Id: e.value,
      })
      .subscribe(
        (result) => {
          this.FcyPaymentFormData.TotalInvoiceAmount = result[0].InvoiceAmount;
          this.FcyPaymentFormData.TotalPaidAmount = result[0].FcyPaidAmount;
          this.FcyPaymentFormData.InvoiceBalanceAmount = result[0].InvoiceAmount - result[0].FcyPaidAmount;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  GetRateDataByInvoiceId(e) {
    this.service
      .GetRateDataByInvoiceId({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        Id: e.value,
      })
      .subscribe(
        (result) => {
          this.FcyPaymentFormData.MultiCurrencyId = result[0].MultiCurrencyId;
          this.FcyPaymentFormData.VoucherExchangeRate = result[0].ExchangeCurrencyRate;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  ProceedChargesAccountList() {
    this.service
      .ProceedChargesAccountList({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
      })
      .subscribe(
        (result) => {
          this.GenerateProceedChargesAccountList(result);
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  async GenerateProceedChargesAccountList(data) {
    this.ProceedsChargesTypeAccountList = await this.commonMethods.GenerateDataSourceFromList(data);
  }
  //#endregion
  addDetailRecord2Grid() {
    if (validate(this.FcyPaymentDetailForm)) {
      this.FcyPaymentDetailFormData.ProceedsChargesTypeCode = this.FcyPaymentDetailForm.instance.getEditor("ExImProceedsChargesTypeId").option("text");
      if (this.updateRowIndex >= 0) {
        this.dataSource[this.updateRowIndex] = this.FcyPaymentDetailFormData;
        this.updateRowIndex = -1;
        this.detailEditMode = false;
      } else {
        this.dataSource.push(this.FcyPaymentDetailFormData);
      }
      this.handleMainFormCalculations(1);
      this.FcyPaymentDetailFormData = new FcyPaymentDetailModel();
      this.FcyPaymentDetailForm.instance.getEditor("Type").focus();
    }
  }
  editDetailRecordRow(editObject, index) {
    this.detailEditMode = true;
    this.updateRowIndex = index;
    this.FcyPaymentDetailFormData = editObject;
  }
  deleteDetailRecordRow(index) {
    this.dataSource.splice(index, 1);
    this.handleMainFormCalculations(1);
  }
  //#region Validations
  validateInvoiceNumber = (e) => {
    if (this.FcyPaymentFormData.ExmLcPaymentTerm == "Invoice Payment" && e.value > 0 == false) {
      return false;
    } else {
      return true;
    }
  };
  validateContractNumber = (e) => {
    if (this.FcyPaymentFormData.ExmLcPaymentTerm == "Advance Payment" && e.value > 0 == false) {
      return false;
    } else {
      return true;
    }
  };
  handleProceedChargesAccountDefinationPopupVisibility() {
    this.ProceedChargesAccountDefinationFormPopupVisibile = !this.ProceedChargesAccountDefinationFormPopupVisibile;
  }

  //#endregion

  //#region Calculations
  handleMainFormCalculations = (e) => {
    let FcyAmount = 0;
    let ExchangeRate = 0;
    let LoacalAmount = 0;
    let BankDebitAmount = 0;
    if (this.FcyPaymentFormData.FcGrossAmount > 0) {
      FcyAmount = this.FcyPaymentFormData.FcGrossAmount;
    }
    if (this.FcyPaymentFormData.ExchangeRate > 0) {
      ExchangeRate = this.FcyPaymentFormData.ExchangeRate;
    }
    LoacalAmount = FcyAmount * ExchangeRate;
    this.FcyPaymentFormData.FcNetAmount = FcyAmount;
    this.FcyPaymentFormData.NetAmountRs = parseFloat(LoacalAmount.toFixed(2));
    let totalFcyAmountInDetailGrid = 0;
    let totalLocalAmountInDetailGrid = 0;
    let grandTotalOfLocalAmountInDetailGrid = 0;
    if (this.dataSource.length > 0) {
      for (let i = 0; i < this.dataSource.length; i++) {
        grandTotalOfLocalAmountInDetailGrid += parseFloat(this.dataSource[i].RsAmount);
        if (this.dataSource[i].Type == "Local") {
          totalLocalAmountInDetailGrid += parseFloat(this.dataSource[i].RsAmount);
        } else if (this.dataSource[i].Type == "Foreign") {
          totalFcyAmountInDetailGrid += parseFloat(this.dataSource[i].FcAmount);
        }
      }
    }
    this.FcyPaymentFormData.FcyChargesLocalAmount = parseFloat((totalFcyAmountInDetailGrid * ExchangeRate).toFixed(2));
    this.FcyPaymentFormData.HcyChargesLocalAmount = parseFloat(totalLocalAmountInDetailGrid.toFixed(2));
    BankDebitAmount = LoacalAmount - grandTotalOfLocalAmountInDetailGrid;
    this.FcyPaymentFormData.BankDrAmount = parseFloat(BankDebitAmount.toFixed(2));
  };
  HandleDetailFormCalculations = (e) => {
    let exchangeRate = 0;
    let fcyAmount = 0;
    let localAmount = 0;
    if (this.FcyPaymentFormData.ExchangeRate > 0) {
      exchangeRate = this.FcyPaymentFormData.ExchangeRate;
    }
    if (this.FcyPaymentDetailFormData.FcAmount > 0) {
      fcyAmount = this.FcyPaymentDetailFormData.FcAmount;
    }
    localAmount = fcyAmount * exchangeRate;
    this.FcyPaymentDetailFormData.RsAmount = parseFloat(localAmount.toFixed(2));
  };

  //#endregion
  ResetForm() {
    this.dataSource = [];
    this.FcyPaymentParamsId = null;
    this.InitForm();
  }
  ResetProceedAccountDefinationForm() {
    this.ProceedChargesAccountList();
    this.ProceedChargesAccountDefinationFormData = new ProceedChargesTypeModel();
    this.ProceedChargesAccountDefinationForm.instance.getEditor("ProceedsChargesGlAccount").focus();
  }
  SaveProceedAccount() {
    if (validate(this.ProceedChargesAccountDefinationForm)) {
      this.ProceedChargesAccountDefinationFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.ProceedChargesAccountDefinationFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.ProceedChargesAccountDefinationFormData.EntryDate = new Date();
      this.ProceedChargesAccountDefinationFormData.ModifyDate = new Date();
      this.ProceedChargesAccountDefinationFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.ProceedChargesAccountDefinationFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.ProceedsChargesTypeAccountDefinationParamsId > 0 ? this.ActivateLoadPanel("Saving") : this.ActivateLoadPanel("Updating");
      this.service.ProceedChargesAccountSave(this.ProceedChargesAccountDefinationFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();

          this.ResetProceedAccountDefinationForm();
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
    }
  }
  Save() {
    if (validate(this.FcyPaymentForm)) {
      if (this.dataSource.length > 0 == false) {
        this.WarningPopup("Detail Grid Data is Required!");
        return;
      }
      if (this.FcyPaymentParamsId > 0 == false) {
        this.FcyPaymentFormData.IsApproved = false;
      }
      this.FcyPaymentFormData.EntryDate = new Date();
      this.FcyPaymentFormData.ModifyDate = new Date();
      this.FcyPaymentFormData.PostDate = new Date();
      this.FcyPaymentFormData.ModifyUser = parseInt(sessionStorage.getItem("UserId"));
      this.FcyPaymentFormData.EntryUser = parseInt(sessionStorage.getItem("UserId"));
      this.FcyPaymentFormData.PostUser = parseInt(sessionStorage.getItem("UserId"));
      this.FcyPaymentFormData.DocumentTypeId = 204;
      this.FcyPaymentFormData.OrganizationId = parseInt(sessionStorage.getItem("OrganizationId"));
      this.FcyPaymentFormData.CompanyId = parseInt(sessionStorage.getItem("CompanyId"));
      this.FcyPaymentFormData.FinancialYearId = parseInt(sessionStorage.getItem("FinancialYearId"));
      this.FcyPaymentFormData.ExImFcBankPaymentsDeductionslst = this.dataSource;

      this.FcyPaymentParamsId > 0 ? this.ActivateLoadPanel("Updating Voucher") : this.ActivateLoadPanel("Saving Voucher");
      this.service.Save(this.FcyPaymentFormData).subscribe(
        (result) => {
          this.DeActivateLoadPanel();
          this.router.navigate([], { queryParams: { Id: null } });
          this.ResetForm();
        },
        (error) => {
          this.DeActivateLoadPanel();
          this.HandleError(error);
        }
      );
    }
  }
}
