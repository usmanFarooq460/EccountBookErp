import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import { validate } from "src/app/shared/Base/validationHelper";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { fcBankReceiptService } from "../fc-bank-receipt.service";
import { FcBankReceiptModel, FcBankReceiptDetailModel } from "../fc-bank-receipt.model";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
@Component({
  selector: "app-fc-bank-receipt-form",
  templateUrl: "./fc-bank-receipt-form.component.html",
  styleUrls: ["./fc-bank-receipt-form.component.scss"],
})
export class FcBankReceiptFormComponent extends BaseActions implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  dataGrid: DxDataGridComponent;
  @ViewChild("fcyBankReceiptForm1", { static: false })
  fcyBankReceiptForm1: DxFormComponent;
  @ViewChild("fcyBankReceiptForm2", { static: false })
  fcyBankReceiptForm2: DxFormComponent;
  @ViewChild("fcyBankReceiptForm3", { static: false })
  fcyBankReceiptForm3: DxFormComponent;
  FcyBankReceiptFormData: FcBankReceiptModel;
  @ViewChild("FcyBankReceiptDetailForm", { static: false })
  FcyBankReceiptDetailForm: DxFormComponent;
  FcyBankReceiptDetailFormData: FcBankReceiptDetailModel;
  @ViewChild("SuppCustDetailUnderComboComponent", { static: false })
  SuppCustDetailUnderComboComponent;

  companyList = [];
  branchList = [];
  projectList = [];
  expGlAcList = [];
  supplierCustomerList: any;
  PaymentTermList = [{ name: "Advanced Payment" }, { name: "Invoice Payment" }];
  bankDrAcList: any;
  MultiCurrencyList = [];
  LcorderList: any;
  InvoiceNoList = [];
  ChargesTypeList = [];
  ChargesTypeListheader = [];
  detailTypeList = [{ name: "Local" }, { name: "Foreign" }];
  LocalAmountDetailTotal: number;
  LcorderEnabled: boolean = false;
  InvoiceNoEnabled: boolean = true;
  dataSource = [];
  updateRowIndex: number;
  detailEditMode: boolean;
  fcBankReceiptParamsId: number;
  //SMS
  GainLossGlAcList: any;
  VoucherHeadId = 0;
  constructor(private commonService: CommonBaseService, private commonMethods: CommonMethodsForCombos, private service: fcBankReceiptService, private route: ActivatedRoute, private router: Router) {
    super();
  }
  async ngOnInit() {
    this.fcBankReceiptParamsId = this.route.snapshot.queryParams["Id"];
    this.MUST_PRINT_AFTER_SAVE = true;
    await this.FetchData();
    this.initForm();
  }
  async FetchData() {
    this.ActivateLoadPanel("Initializing Form!");
    this.SetUserRightsInUserRightsObject(await this.commonMethods.UserRightsByScreenName("Acfrmfcbankreceipt").catch((error) => this.HandleError(error)));
    this.companyList = await this.commonService.getCompany().catch((error) => this.HandleError(error));
    this.branchList = await this.commonService.getBranch().catch((error) => this.HandleError(error));
    this.projectList = await this.commonService.getProject().catch((error) => this.HandleError(error));
    this.MultiCurrencyList = await this.commonMethods.MultiCurrency().catch((error) => this.HandleError(error));
    let AccountsData = await this.commonMethods.CoaAllocationGetAll().catch((error) => this.HandleError(error));
    this.supplierCustomerList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.SupplierCustomerForExport().catch((error) => this.HandleError(error)));
    this.GainLossGlAcList = await this.commonMethods.GenerateDataSourceFromList(
      AccountsData.filter((item) => item.AccountTypeId != 2 && item.AccountTypeId != 4 && item.AccountTypeId != 11 && item.AccountTypeId != 12 && item.AccountTypeId != 15)
    );
    this.bankDrAcList = await this.commonMethods.GenerateDataSourceFromList(AccountsData.filter((item) => item.AccountTypeId == 15));
    this.ChargesType();
    this.DeActivateLoadPanel();
  }
  public initForm() {
    this.FcyBankReceiptFormData = new FcBankReceiptModel();
    this.FcyBankReceiptDetailFormData = new FcBankReceiptDetailModel();
    this.FcyBankReceiptFormData.CompanyId = this.companyList[0].Id;
    this.FcyBankReceiptFormData.BranchId = this.branchList[0].Id;
    this.FcyBankReceiptFormData.ProjectId = this.projectList[0].Id;
    this.FcyBankReceiptFormData.ExmLcPaymentTerm = this.PaymentTermList[1].name;
    this.FcyBankReceiptFormData.DocumentDate = new Date();
    this.fcBankReceiptParamsId > 0 ? this.setFields4editMode() : this.generateCode();
  }
  setFocus = (e) =>
    setTimeout(() => {
      e.component.focus();
    }, 0);
  //
  // Functions
  //#region EditMode
  setFields4editMode() {
    this.service.FcBankReceiptGetById(this.fcBankReceiptParamsId).subscribe(
      (result) => {
        this.FcyBankReceiptFormData = result;
        this.dataSource = result.FcBankReceiptDetail;
      },
      (error) => console.log(error)
    );
  }
  //#endregion
  //#region Functions
  generateCode() {
    this.service
      .GenerateCode({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        DocumentTypeId: 203,
      })
      .subscribe(
        (result) => {
          this.FcyBankReceiptFormData.DocumentNo = result;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  SupplierCustomerByPaymentTerm(e) {
    this.service
      .SupplierCustomerByPaymentTerm({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        SupplierCustomerId: e,
      })
      .subscribe(
        (result) => {
          this.InvoiceNoList = [];
          this.supplierCustomerList = [];
          let FilterListCustomer = [];
          let FilterListInovoice = [];
          FilterListCustomer = result.filter(({ FilterType }) => FilterType == "PartyName");
          FilterListInovoice = result.filter(({ FilterType }) => FilterType == "InvoiceNo");
          if (FilterListCustomer.length) {
            for (let i = 0; i < FilterListCustomer.length; i++) {
              this.supplierCustomerList.push({
                Id: FilterListCustomer[i].Id,
                CompanyName: FilterListCustomer[i].RefName,
              });
            }
          }
          if (FilterListInovoice.length) {
            for (let i = 0; i < FilterListInovoice.length; i++) {
              this.InvoiceNoList.push({
                Id: FilterListInovoice[i].Id,
                InvoiceNo: FilterListInovoice[i].RefName,
              });
            }
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  GetLcNInvoiceNoByPaymentTerm = async (e) => {
    if (e.value == "Advanced Payment") {
      // this.LcorderNo(this.FcyBankReceiptFormData.SupplierCustomerId);
      this.supplierCustomerList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.SupplierCustomerForExport().catch((error) => this.HandleError(error)));
      this.LcorderEnabled = false;
      this.InvoiceNoEnabled = true;
      this.FcyBankReceiptFormData.ExImInvoiceId = null;
      this.FcyBankReceiptFormData.InvoiceAmount = null;
    } else if (e.value == "Invoice Payment") {
      // this.InvoiceNo(this.FcyBankReceiptFormData.SupplierCustomerId);
      this.SupplierCustomerByPaymentTerm(0);
      this.FcyBankReceiptFormData.InvoiceAmount = null;
      this.LcorderEnabled = true;
      this.InvoiceNoEnabled = false;
      this.FcyBankReceiptFormData.ExImLcOrderId = null;
    }
  };
  GetInvoiceNContractNo = (e) => {
    this.FcyBankReceiptFormData.InvoiceAmount = null;
    this.FcyBankReceiptFormData.InvoiceReceivedAmount = null;
    this.LcorderNo(e);
    this.SupplierCustomerByPaymentTerm(e.value);
    if (e.value > 0) this.SuppCustDetailUnderComboComponent.SetInfoObjectValues(e.value);
    // this.InvoiceNo(e);
  };
  LcorderNo = (e) => {
    if (this.FcyBankReceiptFormData.SupplierCustomerId) {
      this.service
        .LcOrderNoGetAll({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          SupplierCustomerId: this.FcyBankReceiptFormData.SupplierCustomerId,
        })
        .subscribe(
          (result) => {
            this.LcorderList = result;
          },
          (error) => {
            this.HandleError(error);
          }
        );
    }
  };
  GetVoucherExchangeRateandCurrencyId(e) {
    this.service
      .GetExRateAndCurrencyFromVoucher({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        Id: e.value,
      })
      .subscribe(
        (result) => {
          if (result != undefined && result != null) {
            this.FcyBankReceiptFormData.MultiCurrencyId = result[0].MultiCurrencyId;
            this.FcyBankReceiptFormData.VoucherExchangeRate = result[0].ExchangeCurrencyRate;
          }
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  getFcyByLcOrderId = (e) => {
    this.LcorderNo(null);
    if (this.FcyBankReceiptFormData.ExImLcOrderId) {
      if (this.fcBankReceiptParamsId > 0) {
        setTimeout(function () {
          let FcyCode = [];
          FcyCode = this.LcorderList.filter(({ Id }) => Id == this.FcyBankReceiptFormData.ExImLcOrderId);
          this.FcyBankReceiptFormData.MultiCurrencyId = FcyCode[0].FcurrencyId;
        }, 2000);
      } else {
        let FcyCode = [];
        FcyCode = this.LcorderList.filter(({ Id }) => Id == this.FcyBankReceiptFormData.ExImLcOrderId);
        this.FcyBankReceiptFormData.MultiCurrencyId = FcyCode[0].FcurrencyId;
      }
    }
  };

  // GetInvoiceAmount OnInvoice Leave
  InvoiceNoLeaveGetAmount = (e) => {
    this.GetVoucherExchangeRateandCurrencyId(e);
    if (e.value) {
      this.service
        .GetInvoiceBalance({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          Id: e.value,
        })
        .subscribe(
          (result) => {
            if (result) {
              if (this.fcBankReceiptParamsId > 0) {
                this.FcyBankReceiptFormData.InvoiceAmount = result[0].InvoiceAmount;
                this.FcyBankReceiptFormData.InvoiceReceivedAmount = result[0].FcyReceivedAmount - this.FcyBankReceiptFormData.FcGrossAmount;
              } else {
                this.FcyBankReceiptFormData.InvoiceAmount = result[0].InvoiceAmount;
                this.FcyBankReceiptFormData.InvoiceReceivedAmount = result[0].FcyReceivedAmount;
              }
            } else {
              this.FcyBankReceiptFormData.InvoiceAmount = null;
              this.FcyBankReceiptFormData.InvoiceReceivedAmount = null;
            }
          },
          (error) => {
            this.HandleError(error);
          }
        );
    }
  };
  ChargesType() {
    this.service
      .ChargesTypesGetAll({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          this.ChargesTypeList = result;
          this.ChargesTypeListheader = result;
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }
  //#endregion
  //#region  Calculations
  AmountHeaderCalc = (e) => {
    if (this.FcyBankReceiptFormData.FcGrossAmount > 0 && this.FcyBankReceiptFormData.ExchangeRate > 0) {
      this.FcyBankReceiptFormData.NetAmountRs = this.FcyBankReceiptFormData.FcGrossAmount * this.FcyBankReceiptFormData.ExchangeRate;
      this.FcyBankReceiptFormData.FcNetAmount = this.FcyBankReceiptFormData.FcGrossAmount;
      this.FcyBankReceiptFormData.BankDrAmount = this.FcyBankReceiptFormData.NetAmountRs;
    } else {
      this.FcyBankReceiptFormData.FcNetAmount = this.FcyBankReceiptFormData.FcGrossAmount;
      this.FcyBankReceiptFormData.NetAmountRs = 0;
    }
  };
  AmountFcBankChargesMinus = (e) => {
    this.FcyBankReceiptFormData.FcNetAmount = this.FcyBankReceiptFormData.FcGrossAmount - this.FcyBankReceiptFormData.FcFBCharges;
    if (this.FcyBankReceiptFormData.ExchangeRate) {
      // this.FcyBankReceiptFormData.FcBankChargesAmountRs = this.FcyBankReceiptFormData.FcFBCharges * this.FcyBankReceiptFormData.ExchangeRate;
      // this.FcyBankReceiptFormData.BankDrAmount = this.FcyBankReceiptFormData.NetAmountRs - this.FcyBankReceiptFormData.FcBankChargesAmountRs;
      this.FcyBankReceiptFormData.BankDrAmount = this.FcyBankReceiptFormData.NetAmountRs - this.LocalAmountDetailTotal;
    }
    // } else {
    //   this.FcyBankReceiptFormData.FcNetAmount = this.FcyBankReceiptFormData.FcGrossAmount;
    // }
  };
  AmountDetailCalcFcToRs = (e) => {
    if (this.FcyBankReceiptFormData.ExchangeRate > 0) {
      this.FcyBankReceiptDetailFormData.RsAmount = this.FcyBankReceiptDetailFormData.FcAmount * this.FcyBankReceiptFormData.ExchangeRate;
    } else {
      this.FcyBankReceiptDetailFormData.RsAmount;
    }
  };
  balanceAmountCalc = (e) => {
    if (this.FcyBankReceiptFormData.ExmLcPaymentTerm == "Invoice Payment") {
      if (this.FcyBankReceiptFormData.InvoiceAmount > 0) {
        if (this.FcyBankReceiptFormData.InvoiceReceivedAmount > 0) {
          this.FcyBankReceiptFormData.InvoiceBalanceAmount = this.FcyBankReceiptFormData.InvoiceAmount - this.FcyBankReceiptFormData.InvoiceReceivedAmount;
        } else {
          this.FcyBankReceiptFormData.InvoiceBalanceAmount = this.FcyBankReceiptFormData.InvoiceAmount - 0;
        }
      } else {
        this.FcyBankReceiptFormData.InvoiceBalanceAmount = this.FcyBankReceiptFormData.InvoiceAmount - this.FcyBankReceiptFormData.InvoiceReceivedAmount;
      }
    } else {
      this.FcyBankReceiptFormData.InvoiceBalanceAmount = 0;
    }
  };
  DetailGridTotal = (e) => {
    if (this.dataSource.length > 0) {
      this.LocalAmountDetailTotal = e.component.getTotalSummaryValue("RsAmount");
      if (this.LocalAmountDetailTotal > 0 && this.FcyBankReceiptFormData.NetAmountRs > 0) {
        let grandtotal = 0;
        grandtotal = this.FcyBankReceiptFormData.NetAmountRs - this.LocalAmountDetailTotal;
        this.FcyBankReceiptFormData.BankDrAmount = this.FcyBankReceiptFormData.NetAmountRs - this.LocalAmountDetailTotal;
      }
    }
  };
  //#endregion
  //#region DetailGridFunctions
  editDetailRecordRow(editObject, index) {
    this.detailEditMode = true;
    this.updateRowIndex = index;
    this.FcyBankReceiptDetailFormData.Type = editObject.Type;
    this.FcyBankReceiptDetailFormData.ExImProceedsChargesTypeId = editObject.ExImProceedsChargesTypeId;
    this.FcyBankReceiptDetailFormData.ProceedsRemarks = editObject.ProceedsRemarks;
    this.FcyBankReceiptDetailFormData.FcAmount = editObject.FcAmount;
    this.FcyBankReceiptDetailFormData.RsAmount = editObject.RsAmount;
  }
  deleteDetailRecordRow(index) {
    this.dataSource.splice(index, 1);
  }
  //Add Data To Grid
  addDetailRecord2Grid() {
    if (validate(this.FcyBankReceiptDetailForm)) {
      let FcyAmountInDetail = 0;
      if (this.FcyBankReceiptDetailFormData.FcAmount > 0 == false) {
        this.WarningPopup("Fcy Amount is Required!");
        return;
      } else if (this.FcyBankReceiptDetailFormData.RsAmount > 0 == false) {
        this.WarningPopup("Loacal Amount is Required!");
        return;
      }
      FcyAmountInDetail += this.FcyBankReceiptDetailFormData.FcAmount;
      if (this.dataSource != null && this.dataSource != undefined) {
        if (this.dataSource.length > 0) {
          this.dataSource.map((item) => (FcyAmountInDetail += item.FcAmount));
        }
      }
      if (FcyAmountInDetail > this.FcyBankReceiptFormData.FcNetAmount) {
        this.WarningPopup("Fcy Bank Charges Amount in Detail Cannot be Greater than Fcy Net Amount!");
        return;
      }
      if (this.FcyBankReceiptDetailFormData.RsAmount > this.FcyBankReceiptFormData.BankDrAmount) {
        this.WarningPopup("Local Bank Charges Amount in Detail Cannot be Greater than Bank Debit Amount!");
        return;
      }
      this.FcyBankReceiptDetailFormData.ProceedsChargesTypeCode = this.FcyBankReceiptDetailForm.instance.getEditor("ExImProceedsChargesTypeId").option("text");
      if (this.updateRowIndex >= 0) {
        this.dataSource[this.updateRowIndex] = this.FcyBankReceiptDetailFormData;
        this.updateRowIndex = -1;
        this.detailEditMode = false;
      } else {
        this.dataSource.push(this.FcyBankReceiptDetailFormData);
      }
      this.dataGrid.instance.refresh();
      this.FcyBankReceiptDetailForm.instance.getEditor("ExImProceedsChargesTypeId").focus();
      this.FcyBankReceiptDetailFormData = new FcBankReceiptDetailModel();
    }
  }
  //#endregion

  handleMainCalculations() {
    let TotalFcyAmountInDetail = 0;
    let TotalLocalAmountInDetail = 0;
    if (this.dataSource != null && this.dataSource != undefined) {
      if (this.dataSource.length > 0) {
        this.dataSource.map((item) => {
          TotalFcyAmountInDetail += item.FcAmount;
          TotalLocalAmountInDetail += item.RsAmount;
        });
      }
    }
    // this.FcyBankReceiptFormData.fc
  }
  //#region ResetForm
  resetForm() {
    this.fcBankReceiptParamsId = 0;
    this.router.navigate([], { queryParams: { Id: null } });
    this.dataSource = [];
    this.initForm();
  }
  //#endregion
  //#region Userrigts
  onSave() {
    if (this.fcBankReceiptParamsId > 0 == false && this.UserRightsObject.canSave == false) {
      this.WarningPopup("You don't have Right to Update!");
      return;
    } else if (this.fcBankReceiptParamsId > 0 && this.UserRightsObject.canUpdate == false) {
      this.WarningPopup("You don't have Right to Update!");
      return;
    }
    this.handleSave();
  }
  //#endregion
  onPrint(e) {
    this.ActivateLoadPanel("Loading Report!");
    this.service
      .getFcyVoucherPdfReport({
        Id: e,
        OrganizationId: this.commonService.OrganizationId(),
        CompanyId: this.commonService.CompanyId(),
        DocumentTypeId: 203,
        CompanyAddress: sessionStorage.getItem("CompanyAddress"),
        CompanyName: sessionStorage.getItem("CompanyName"),
        ApprovedFilter: "All",
        ReportName: "102-AcRptPaymentReceiptsVoucherSlip",
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
  GetVoucherHeadIdForReport = (e) => {
    this.service
      .getvoucherheadId({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        DocumentTypeId: 203,
        DocumentTypeSrNo: e,
      })
      .subscribe(
        (result) => {
          if (this.MUST_PRINT_AFTER_SAVE) {
            this.onPrint(result);
          }
        },
        (error) => this.HandleError(error)
      );
  };
  //#region Save
  handleSave() {
    if (validate(this.fcyBankReceiptForm1 && this.fcyBankReceiptForm2 && this.fcyBankReceiptForm3)) {
      if (this.dataSource.length > 0 == false) {
        this.WarningPopup("Detail Record Not Found!");
      } else {
        if (this.FcyBankReceiptFormData.ExmLcPaymentTerm == "Advanced Payment" && this.FcyBankReceiptFormData.ExImLcOrderId == null) {
          this.WarningPopup("Contract No Is Required");
          this.fcyBankReceiptForm3.instance.getEditor("ExImLcOrderId").focus();
          return;
        }
        if (this.FcyBankReceiptFormData.ExmLcPaymentTerm == "Invoice Payment" && this.FcyBankReceiptFormData.ExImInvoiceId == null) {
          this.WarningPopup("Invoice No Required");
          this.fcyBankReceiptForm3.instance.getEditor("ExImInvoiceId").focus();
          return;
        }
        if (this.FcyBankReceiptFormData.ExmLcPaymentTerm == "Invoice Payment" && this.FcyBankReceiptFormData.VoucherHeadId == null) {
          this.WarningPopup("Gain Loss Ac Required");
          this.fcyBankReceiptForm3.instance.getEditor("VoucherHeadId").focus();
          return;
        }
        if (this.FcyBankReceiptFormData.ExmLcPaymentTerm == "Invoice Payment" && this.FcyBankReceiptFormData.FcGrossAmount > this.FcyBankReceiptFormData.InvoiceBalanceAmount) {
          this.WarningPopup("Fcy Gross Amount Is Greater Than Your Balance Amount Are You Sure To Save");
          return;
        }
        this.FcyBankReceiptFormData.DocumentTypeId = 203;
        this.FcyBankReceiptFormData.EntryUser = this.commonService.UserId();
        this.FcyBankReceiptFormData.CompanyId = this.commonService.CompanyId();
        this.FcyBankReceiptFormData.OrganizationId = this.commonService.OrganizationId();
        this.FcyBankReceiptFormData.FinancialYearId = this.commonService.FinancialYearId();
        this.FcyBankReceiptFormData.EntryUser = this.commonService.UserId();
        this.FcyBankReceiptFormData.EntryDate = new Date();
        this.FcyBankReceiptFormData.ModifyUser = this.commonService.UserId();
        this.FcyBankReceiptFormData.ModifyDate = new Date();
        this.FcyBankReceiptFormData.FcBankReceiptDetail = this.dataSource;
        this.fcBankReceiptParamsId > 0 ? this.ActivateLoadPanel("Updating!") : this.ActivateLoadPanel("Saving!");
        this.service.FcBankSave(this.FcyBankReceiptFormData).subscribe(
          (result) => {
            this.DeActivateLoadPanel();
            this.fcBankReceiptParamsId > 0 ? this.SuccessPopup("Record Updated Successfully!") : this.SuccessPopup("Record Saved Successfully!");
            this.GetVoucherHeadIdForReport(result);
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
}
