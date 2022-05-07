import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class fcBankReceiptService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  // GenerateCOde
  GenerateCode(data) {
    return this.http.post<any>(this.apiUrl + "ExImFCBankReceipts/GenerateCode", data, {
      headers: this.headers,
    });
  }

  SupplierCustomerByPaymentTerm(data) {
    return this.http.post<any>(this.apiUrl + "ExImInvoice/GetInvoiceNoandPartiesForFcBankReceipts", data, {
      headers: this.headers,
    });
  }
  GetExRateAndCurrencyFromVoucher(data) {
    return this.http.post<any>(this.apiUrl + "ExImInvoice/GetExchangeRateandCurrencyFromVoucher", data, {
      headers: this.headers,
    });
  }


  LcOrderNoGetAll(data) {
    return this.http.post<any>(this.apiUrl + "ExImLcOrder/GetLcOrderNoBySupplierCustomerId", data, {
      headers: this.headers,
    });
  }

  InvoiceNoGetAll(data) {
    return this.http.post<any>(this.apiUrl + "ExImInvoice/GetInvoiceNo", data, {
      headers: this.headers,
    });
  }
  ChargesTypesGetAll(data) {
    return this.http.post<any>(this.apiUrl + "ExImProceedsChargesType/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  FcBankSave(data) {
    return this.http.post<any>(this.apiUrl + "ExImFCBankReceipts/Save", data, {
      headers: this.headers,
    });
  }
  HistoryForm(data) {
    return this.http.post<any>(this.apiUrl + "ExImFCBankReceipts/GetFcBankReceiptHistory", data, {
      headers: this.headers,
    });
  }
  GetInvoiceBalance(data) {
    return this.http.post<any>(this.apiUrl + "ExImInvoice/GetFcYAmount", data, {
      headers: this.headers,
    });
  }

  FcBankReceiptGetById(id) {
    return this.http.get<any>(this.apiUrl + "ExImFCBankReceipts/GetByID", {
      params: this.params.set("Id", id),
    });
  }

  //Reports
  EximBankReceipt_516(data) {
    return this.http.post<any>(this.apiUrl + "ExportReport/ExImRptFCBankReceipts_516", data, {
      headers: this.headers,
    });
  }
  getvoucherheadId(data) {
    return this.http.post<any>(this.apiUrl + "Voucher/GetVoucherHeadIdByDocumentTypeIdandRefDocNoId", data, {
      headers: this.headers,
    });
  }
  getFcyVoucherPdfReport(data) {
    return this.http.post<any>(this.apiUrl + "AccountsPdfReports/ExpenseVoucherSlipPdfReprot", data, {
      headers: this.headers,
    });
  }
  //SMS
  getMessageBody(screeName) {
    let params = new HttpParams().set("ScreenName", screeName);
    return this.http.get<any>(this.apiUrl + "MessageBody/GetMessageBody", { params: params });
  }

  saveMessage(data) {
    return this.http.post<any>(this.apiUrl + "SmsHistory/Save", data);
  }
}
