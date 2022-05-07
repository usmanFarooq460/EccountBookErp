import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class OpeningBalanceService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  OpeningBalanceGetAll(data) {
    return this.http.post<any>(this.apiUrl + "AccountsOpeningBalances/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  OpeningBalanceAccounts(data) {
    return this.http.post<any>(this.apiUrl + "AccountsOpeningBalances/GetAllOpBalanceAccounts", data, {
      headers: this.headers,
    });
  }
  OpeningBalanceSave(data) {
    return this.http.post<any>(this.apiUrl + "AccountsOpeningBalances/Save", data, {
      headers: this.headers,
    });
  }

  OpeningBalanceGetById(id) {
    return this.http.get<any>(this.apiUrl + "AccountsOpeningBalances/AccountsOpeningBalances", {
      params: this.params.set("Id", id),
    });
  }
}
