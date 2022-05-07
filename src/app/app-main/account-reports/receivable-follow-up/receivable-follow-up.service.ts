import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ReceivableFollowUpService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(private http: HttpClient) {}

  GetAllReceivables(data) {
    return this.http.post<any>(this.apiUrl + "Voucher/Receivables", data, { headers: this.headers });
  }

  FollowUpHistoryGetAll(data) {
    return this.http.post<any>(this.apiUrl + "AccountsPayRecFollowUpHistory/GetAll", data, { headers: this.headers });
  }


  GetReceivablesByInvoice(data) {
    return this.http.post<any>(this.apiUrl + "Voucher/GetReceivablesByInvoice", data, { headers: this.headers });
  }
  getProject(data) {
    return this.http.post<any>(this.apiUrl + "Projects/GetByOrganizationCompanyId", data, { headers: this.headers });
  }

  getBranch(data) {
    return this.http.post<any>(this.apiUrl + "Branches/GetAll", data, { headers: this.headers });
  }

  SupplierCustomer(data) {
    return this.http.post<any>(this.apiUrl + "SupplierCustomer/GetByOrganizationCompanyId", data, { headers: this.headers });
  }

  AcRptAccounts_ReceivablesWithStatus_122(data) {
    return this.http.post<any>(this.apiUrl + "AccountsHistoryReports/AcRptAccounts_ReceivablesWithStatus_122", data, { headers: this.headers });
  }

  save(data) {
    return this.http.post<any>(this.apiUrl + "AccountsPayRecFollowUpHistory/Save", data, {
      headers: this.headers,
    });
  }

  getById(id) {
    let params = new HttpParams().set("Id", id);
    return this.http.get(this.apiUrl + "InvDeliveryOrder/GetByID", {
      headers: this.headers,
      params: params,
    });
  }

  PDFReportSlip262(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/DeliveryOrderSlip_262", data, {
      headers: this.headers,
    });
  }
  AccountGetAll(data) {
    return this.http.post<any>(this.apiUrl + "AccountTypes/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  AllLevelsAccount(data) {
    return this.http.post<any>(this.apiUrl + "ChartofAccount/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
}
