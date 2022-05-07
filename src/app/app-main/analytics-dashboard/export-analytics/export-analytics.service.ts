import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ExportAnalyticsService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  ExportComparisonByCustomerAndItemPdf(data) {
    return this.http.post<any>(this.apiUrl + "ExportPdfReports/ExImInvoice_ExportComparisonsSummeryByCustomerItem_Report_536", data, {
      headers: this.headers,
    });
  }
  ExportComparisonByCustomerAndItem(data) {
    return this.http.post<any>(this.apiUrl + "ExportReport/ExImInvoice_ExportComparisonsSummeryByCustomerItem_Report", data, {
      headers: this.headers,
    });
  }
  ExportComparisonsPdf(data) {
    return this.http.post<any>(this.apiUrl + "ExportPdfReports/ExImInvoice_ExportComparisonsSummery_Report_535", data, {
      headers: this.headers,
    });
  }
  ExportComparisons(data) {
    return this.http.post<any>(this.apiUrl + "ExportReport/ExImInvoice_ExportComparisonsSummery_Report", data, {
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
