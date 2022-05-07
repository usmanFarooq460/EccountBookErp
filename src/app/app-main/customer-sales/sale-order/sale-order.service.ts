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


  getCategorySerialNo(data) {
    return this.http.post<any>(this.apiUrl + "InvOrderCategory/GenerateSaleOrderCategoryCodebyId", data, { headers: this.headers });
  }

  getDocumentNo(data) {
    return this.http.post<any>(this.apiUrl + "SaleOrder/GenerateSaleOrderCodeByDocId", data, { headers: this.headers });
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

  getSaleOrderList(data) {
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

}
