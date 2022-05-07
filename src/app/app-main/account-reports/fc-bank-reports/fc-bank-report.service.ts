import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class FcBankService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  Transactionstockrice(data) {
    return this.http.post<any>(this.apiUrl + "InventoryStockEvalautionDetail/TransactionStockGenrate", data, {
      headers: this.headers,
    });
  }

  ItemType() {
    return this.http.get<any>(this.apiUrl + "InventoryStockEvalautionDetail/InvItemTypeInStock");
  }

  ItemCategory() {
    return this.http.get<any>(this.apiUrl + "InventoryStockEvalautionDetail/InvItemCategoryTypeInStock");
  }

  WareHouse(data) {
    return this.http.post<any>(this.apiUrl + "InvWareHouse/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  LcOrderNoGetAll(data) {
    return this.http.post<any>(this.apiUrl + "ExImLcOrder/GetLcOrderNo", data, {
      headers: this.headers,
    });
  }
  BankListGetAll(data) {
    return this.http.post<any>(this.apiUrl + "Bank/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  FcBankReportGetAll(data) {
    return this.http.post<any>(this.apiUrl + "ExImFCBankReceipts/GetFcBankReceiptHistory", data, {
      headers: this.headers,
    });
  }
  CoaAccounts(data) {
    return this.http.post<any>(this.apiUrl + "COAAllocation/GetAll", data, {
      headers: this.headers,
    });
  }
  SupplierCustomerForExport(data) {
    return this.http.post<any>(this.apiUrl + "SupplierCustomer/ReadByOrganizationCompanyIdForExport", data, {
      headers: this.headers,
    });
  }
  EximBankReceipt_516(data) {
    return this.http.post<any>(this.apiUrl + "ExportReport/ExImRptFCBankReceipts_516", data, {
      headers: this.headers,
    });
  }
  getFcyVoucherPdfReport(data) {
    return this.http.post<any>(this.apiUrl + "AccountsPdfReports/ExpenseVoucherSlipPdfReprot", data, {
      headers: this.headers,
    });
  }
  PdfRegisterReport_517(data) {
    return this.http.post<any>(this.apiUrl + "ExportReport/ExImRptFcBankReceiptsRegister_517", data, {
      headers: this.headers,
    });
  }
}
