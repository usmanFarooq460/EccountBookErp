import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineItemGroupService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  ItemGroupGetAll(data) {
    return this.http.post<any>(this.apiUrl + "ItemGroup/GetAll", data, {
      headers: this.headers,
    });
  }

  ItemGroupSave(data) {
    return this.http.post<any>(this.apiUrl + "ItemGroup/Save", data, {
      headers: this.headers,
    });
  }

  ItemGroupGetById(id) {
    return this.http.get<any>(this.apiUrl + "ItemGroup/GetByID", {
      params: this.params.set("Id", id),
    });
  }
}
