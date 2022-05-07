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
  itemLedgerhistory(data) {
    return this.http.post<any>(this.apiUrl + "InvPurchaseInvoice/ItemLedgerHistory", data, {
      headers: this.headers,
    });
  }
}
