import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SalesAnalyticsService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  SalesComparisonByCustomerAndItemPdf(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/InventoryStockEvaluation_LocalSalesComaprisonsByCustomerItem_Report_306", data, {
      headers: this.headers,
    });
  }
  SalesComparisonByCustomerAndItem(data) {
    return this.http.post<any>(this.apiUrl + "Inventory/InventoryStockEvaluation_LocalSalesComaprisonsByCustomerItem_Report", data, {
      headers: this.headers,
    });
  }
  SalesComparisonsPdf(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/InventoryStockEvaluation_LocalSalesComaprisons_Report_305", data, {
      headers: this.headers,
    });
  }
  SalesComparisons(data) {
    return this.http.post<any>(this.apiUrl + "Inventory/InventoryStockEvaluation_LocalSalesComaprisons_Report", data, {
      headers: this.headers,
    });
  }
  GetReportsList(data) {
    return this.http.post<any>(this.apiUrl + "CommonController/StaticColumnNames", data, {
      headers: this.headers,
    });
  }
  Bank(data) {
    return this.http.post<any>(this.apiUrl + "Bank/GetByOrganizationCompanyIdJson", data, {
      headers: this.headers,
    });
  }
}
