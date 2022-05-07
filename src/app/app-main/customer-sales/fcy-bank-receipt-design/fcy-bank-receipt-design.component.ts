import { Component, OnInit, ViewChild } from "@angular/core";
import { DxFormComponent } from "devextreme-angular";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { FcyBankReceiptDesignService } from "./fcy-bank-receipt-design.service";
import { FcBankReceiptDetailModel, fcyBankReceiptDesignModel } from "./fcy-bank-receipt-desing.model";

@Component({
  selector: "app-fcy-bank-receipt-design",
  templateUrl: "./fcy-bank-receipt-design.component.html",
  styleUrls: ["./fcy-bank-receipt-design.component.scss"],
})
export class FcyBankReceiptDesignComponent extends BaseActions implements OnInit {
  @ViewChild("fcyBankReceiptForm1", { static: false })
  fcyBankReceiptForm: DxFormComponent;
  @ViewChild("fcyBankReceiptForm2", { static: false })
  fcyBankReceiptForm2: DxFormComponent;
  @ViewChild("fcyBankReceiptForm3", { static: false })
  fcyBankReceiptForm3: DxFormComponent;
  fcyBankReceiptFormData: fcyBankReceiptDesignModel;
  @ViewChild("FcyBankReceiptDetailForm", { static: false })
  FcyBankReceiptDetailForm: DxFormComponent;
  FcyBankReceiptDetailFormData: FcBankReceiptDetailModel;

  @ViewChild("SuppCustDetailUnderComboComponent", { static: false })
  SuppCustDetailUnderComboComponent;
  InvoiceNoList = [];
  LcorderList = [];
  bankDrAcList: any;
  supplierCustomerList: any;
  MultiCurrencyList = [];
  detailTypeList = [];
  ChargesTypeList = [];
  AmountDetailCalcFcToRs = [];
  detailEditMode: boolean;
  dataSource = [];
  branchList = [];
  projectList = [];
  GainLossGlAcList: any;
  fcBankReceiptParamsId: number;
  LocalAmountDetailTotal: number;
  updateRowIndex;

  PaymentTermList = [{ name: "Advanced Payment" }, { name: "Invoice Payment" }];
  constructor(private commonMethods: CommonMethodsForCombos, private commonService: CommonBaseService, private service: FcyBankReceiptDesignService) {
    super();
  }

  async ngOnInit() {
    await this.FetchData();
    this.initForm();
  }
  initForm() {
    this.fcyBankReceiptFormData = new fcyBankReceiptDesignModel();
    this.fcyBankReceiptFormData.DocumentDate = new Date();
    this.fcyBankReceiptFormData.ExmLcPaymentTerm == this.PaymentTermList[0].name;
  }

  resetForm() {
    this.initForm();
  }

  async FetchData() {
    this.branchList = await this.commonService.getBranch();
    this.projectList = await this.commonService.getProject();
    this.MultiCurrencyList = await this.commonMethods.MultiCurrency();
    let AccountsData = await this.commonMethods.CoaAllocationGetAll().catch((error) => this.HandleError(error));
    this.supplierCustomerList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.SupplierCustomerForExport().catch((error) => this.HandleError(error)));
    this.GainLossGlAcList = await this.commonMethods.GenerateDataSourceFromList(
      AccountsData.filter((item) => item.AccountTypeId != 2 && item.AccountTypeId != 4 && item.AccountTypeId != 11 && item.AccountTypeId != 12 && item.AccountTypeId != 15)
    );
    this.bankDrAcList = await this.commonMethods.GenerateDataSourceFromList(AccountsData.filter((item) => item.AccountTypeId == 15));
    this.ChargesType();
  }

  GetLcNInvoiceNoByPaymentTerm = async (e) => {
    if (e.value == "Advanced Payment") {
      // this.LcorderNo(this.FcyBankReceiptFormData.SupplierCustomerId);
      this.supplierCustomerList = await this.commonMethods.GenerateDataSourceFromList(await this.commonMethods.SupplierCustomerForExport().catch((error) => this.HandleError(error)));
      this.fcyBankReceiptFormData.ExImInvoiceId = null;
      this.fcyBankReceiptFormData.InvoiceAmount = null;
    } else if (e.value == "Invoice Payment") {
      this.SupplierCustomerByPaymentTerm(0);
      this.fcyBankReceiptFormData.InvoiceAmount = null;
      this.fcyBankReceiptFormData.ExImLcOrderId = null;
    }
  };

  GetInvoiceNContractNo = (e) => {
    this.fcyBankReceiptFormData.InvoiceAmount = null;
    this.fcyBankReceiptFormData.InvoiceReceivedAmount = null;
    this.LcorderNo(e);
    this.SupplierCustomerByPaymentTerm(e.value);
    // this.InvoiceNo(e);
  };
  LcorderNo = (e) => {
    if (this.fcyBankReceiptFormData.SupplierCustomerId) {
      this.service
        .LcOrderNoGetAll({
          CompanyId: sessionStorage.getItem("CompanyId"),
          OrganizationId: sessionStorage.getItem("OrganizationId"),
          SupplierCustomerId: this.fcyBankReceiptFormData.SupplierCustomerId,
        })
        .subscribe(
          (result) => {
            this.LcorderList = result;
          },
          (error) => {
            console.log(error);
          }
        );
    }
  };

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
          console.log(error);
        }
      );
  }

  handleCustomerChange = (e) => {
    if (e.value > 0) this.SuppCustDetailUnderComboComponent.SetInfoObjectValues(e.value);
    this.LcorderNo(e);
    this.SupplierCustomerByPaymentTerm(e.value);
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
        },
        (error) => {
          this.HandleError(error);
        }
      );
  }

  addDetailRecord2Grid() {}

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

  onSave() {}
}
