import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineItemCatagoryService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  ItemCatagoryGetAll(data) {
    return this.http.post<any>(this.apiUrl + "ItemCategory/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  ItemCatagorySave(data) {
    return this.http.post<any>(this.apiUrl + "ItemCategory/Save", data, {
      headers: this.headers,
    });
  }

  ItemCatagoryGetById(id) {
    return this.http.get<any>(this.apiUrl + "ItemCategory/GetByID", {
      params: this.params.set("Id", id),
    });
  }
}
