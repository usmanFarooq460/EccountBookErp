import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class InventoryCommonService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  supplierCustomer(data) {
    return this.http.post<any>(this.apiUrl + "SupplierCustomer/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  JobLot(data) {
    return this.http.post<any>(this.apiUrl + "JobLot/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  item(data) {
    return this.http.post<any>(this.apiUrl + "Item/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  SupplierCustomerInfo(data) {
    return this.http.post<any>(this.apiUrl + "SupplierCustomer/SupplierCustomerRegister", data, {
      headers: this.headers,
    }).toPromise()
  }
  SupplierCustomerRegister(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/SupplierCustomerRegister", data, {
      headers: this.headers,
    });
  }
}
