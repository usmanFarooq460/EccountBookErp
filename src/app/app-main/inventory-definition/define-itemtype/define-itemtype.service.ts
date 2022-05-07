import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineItemtypeService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  ItemTypeGetAll(data) {
    return this.http.post<any>(this.apiUrl + "ItemType/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  ItemTypeSave(data) {
    return this.http.post<any>(this.apiUrl + "ItemType/Save", data, {
      headers: this.headers,
    });
  }

  ItemTypeGetById(id) {
    return this.http.get<any>(this.apiUrl + "ItemType/GetByID", {
      params: this.params.set("Id", id),
    });
  }
}
