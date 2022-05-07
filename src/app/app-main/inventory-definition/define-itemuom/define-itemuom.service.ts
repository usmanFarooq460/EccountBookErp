import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineItemUomService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  ItemUomGetAll(data) {
    return this.http.post<any>(this.apiUrl + "UOM/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  ItemUomSave(data) {
    return this.http.post<any>(this.apiUrl + "UOM/Save", data, {
      headers: this.headers,
    });
  }

  ItemUomGetById(id) {
    return this.http.get<any>(this.apiUrl + "UOM/GetByID", {
      params: this.params.set("Id", id),
    });
  }
}
