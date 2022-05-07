import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DefineItemOthersService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  ItemOthersGetAll(data) {
    return this.http.post<any>(this.apiUrl + "InventoryItemsOther/GetAll", data, {
      headers: this.headers,
    });
  }

  ItemOthersSave(data) {
    return this.http.post<any>(this.apiUrl + "InventoryItemsOther/Save", data, {
      headers: this.headers,
    });
  }

  ItemOthersGetById(id) {
    return this.http.get<any>(this.apiUrl + "InventoryItemsOther/GetByID", {
      params: this.params.set("Id", id),
    });
  }
}
