import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PurchaseOrderHistoryService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  purchaseorderhistory(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/PurchaseOrderHistory", data, {
      headers: this.headers,
    });
  }
  updatestatusandapproved(data) {
    return this.http.post<any>(this.apiUrl + "PurchaseOrder/UpdateStatusandIsApprovedbyOrderId", data, {
      headers: this.headers,
    });
  }
  PoCombos(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/InventoryReportsComboByOrganizationAndCompanyId", data, {
      headers: this.headers,
    });
  }
  InvRptPurchaseOrderDetailRegisterRice_205(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvRptPurchaseOrderDetailRegisterRice_205", data, {
      headers: this.headers,
    });
  }

  InvOutstandingPurchaseOrderRptByAvgRate_207(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvOutstandingPurchaseOrderRptByAvgRate_207", data, {
      headers: this.headers,
    });
  }

  RptPurchaseOrderRegisterRice_206(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/RptPurchaseOrderRegisterRice_206", data, {
      headers: this.headers,
    });
  }
  InvRptPurchaseOrderRiceSlip_203(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvRptPurchaseOrderRiceSlip_203", data, {
      headers: this.headers,
    });
  }

  CityAreaGetAll(data) {
    return this.http.post<any>(this.apiUrl + "City/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  getBatch() {
    return this.http.post<any>(this.apiUrl + "InvCropYear/GetAll", {
      headers: this.headers,
    });
  }
  DataForReportsAgainstOutstandingPurchaseOrders(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/ReportsAgainstOutstandingPurchaseOrders", data, {
      headers: this.headers,
    });
  }

  InventoryParentCategories(data) {
    return this.http.post<any>(this.apiUrl + "ItemCategory/InventoryParentCategories", data, {
      headers: this.headers,
    });
  }
}
