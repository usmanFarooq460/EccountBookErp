import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineItemTaxScheduleService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}
  GetItems(data) {
    return this.http.post<any>(this.apiUrl + "Item/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  GetTaxesType(data) {
    return this.http.post<any>(this.apiUrl + "TaxesTypes/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  ItemTaxSchGetAll(data) {
    return this.http.post<any>(this.apiUrl + "ItemTaxSchedule/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  ItemTaxSchSave(data) {
    return this.http.post<any>(this.apiUrl + "ItemTaxSchedule/Save", data, {
      headers: this.headers,
    });
  }

  ItemTaxSchGetById(id) {
    return this.http.get<any>(this.apiUrl + "ItemTaxSchedule/GetByID", {
      params: this.params.set("Id", id),
    });
  }
}
