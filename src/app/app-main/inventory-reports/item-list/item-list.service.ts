import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ItemLedgerService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}
  coaAccounts(data) {
    return this.http.post<any>(this.apiUrl + "COAAllocation/GetAll", data, {
      headers: this.headers,
    });
  }
  itemListhistory(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/RptItemList", data, {
      headers: this.headers,
    });
  }
  itemAccountsGet(data) {
    return this.http.post<any>(this.apiUrl + "Item/GLAccountReferedInItemDifinition", data, {
      headers: this.headers,
    });
  }

  ItemTypeGet(data) {
    return this.http.post<any>(this.apiUrl + "ItemType/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  ItemCategoryGet(data) {
    return this.http.post<any>(this.apiUrl + "ItemCategory/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  ItemClassGet(data) {
    return this.http.post<any>(this.apiUrl + "ItemClass/GetAll", data, {
      headers: this.headers,
    });
  }

  //Pdf Report mehtod
  InvRptItemsList_200(data) {
    return this.http.post<any>(this.apiUrl + "InventoryHistoryReports/InvRptItemsList_200", data, {
      headers: this.headers,
    });
  }
}
