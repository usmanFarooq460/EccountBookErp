import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineWarehouseService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  WarehouseGetAll(data) {
    return this.http.post<any>(this.apiUrl + "InvWareHouse/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  WarehouseSave(data) {
    return this.http.post<any>(this.apiUrl + "InvWareHouse/Save", data, {
      headers: this.headers,
    });
  }

  WarehouseGetById(id) {
    return this.http.get<any>(this.apiUrl + "InvWareHouse/GetByID", {
      params: this.params.set("Id", id),
    });
  }
}
