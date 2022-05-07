import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineBankService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  CountryGetAll(data) {
    return this.http.post<any>(this.apiUrl + "Country/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  CityGetAll(data) {
    return this.http.post<any>(this.apiUrl + "City/GetByOrganizationCompanyIdNCountryId", data, {
      headers: this.headers,
    });
  }
  AccountsGetAll(data) {
    return this.http.post<any>(this.apiUrl + "COAAllocation/GetAll", data, {
      headers: this.headers,
    });
  }

  BankGetAll(data) {
    return this.http.post<any>(this.apiUrl + "Bank/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  BankSave(data) {
    return this.http.post<any>(this.apiUrl + "Bank/Save", data, {
      headers: this.headers,
    });
  }
  BankReadById(id) {
    return this.http.get<any>(this.apiUrl + "Bank/GetByID", {
      params: this.params.set("Id", id),
    });
  }
}
