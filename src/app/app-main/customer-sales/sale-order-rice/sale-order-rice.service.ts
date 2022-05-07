import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PurchaseOrderService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(private http: HttpClient) {}

  getOrderCategory() {
    return this.http.get<any>(this.apiUrl + "InvOrderCategory/GetAll", {
      headers: this.headers,
    });
  }

  getCategorySerialNo(data) {
    return this.http.post<any>(this.apiUrl + "InvOrderCategory/GenerateSaleOrderCategoryCodebyId", data, { headers: this.headers });
  }

  getDocumentNo(data) {
    return this.http.post<any>(this.apiUrl + "SaleOrder/GenerateSaleOrderCodeByDocId", data, { headers: this.headers });
  }

  getSupplierName(data) {
    return this.http.post<any>(this.apiUrl + "SupplierCustomer/GetByOrganizationCompanyId", data, { headers: this.headers });
  }

  getPaymentTerm(data) {
    return this.http.post<any>(this.apiUrl + "InvDueTerms/GetByOrganizationCompanyId", data, { headers: this.headers });
  }

  getItem(data) {
    return this.http.post<any>(this.apiUrl + "Item/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  getUOM(data) {
    return this.http.post<any>(this.apiUrl + "UOMSchedule/SearchByObject", data, {
      headers: this.headers,
    });
  }

  getBatch() {
    return this.http.post<any>(this.apiUrl + "InvCropYear/GetAll", {
      headers: this.headers,
    });
  }

  getJobLot(data) {
    return this.http.post<any>(this.apiUrl + "JobLot/GetByOrganizationCompanyId", data, { headers: this.headers });
  }

  getTaxType(data) {
    return this.http.post<any>(this.apiUrl + "TaxesTypes/GetByOrganizationCompanyId", data, { headers: this.headers });
  }

  getTaxPercent(data) {
    return this.http.post<any>(this.apiUrl + "TaxScheduleMain/GetTaxSchedule", data, { headers: this.headers });
  }

  savePurchaseOrder(data) {
    return this.http.post<any>(this.apiUrl + "SaleOrder/Save", data, {
      headers: this.headers,
    });
  }

  getPurchaseOrderList(data) {
    return this.http.post<any>(this.apiUrl + "SaleOrder/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  getPurchaseOrderById(id) {
    let params = new HttpParams().set("Id", id);
    return this.http.get(this.apiUrl + "SaleOrder/GetByID", {
      headers: this.headers,
      params: params,
    });
  }
  getPurchaseOrderPdfReport(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/SaleOrderSlipPdfReport", data, {
      headers: this.headers,
    });
  }
}
