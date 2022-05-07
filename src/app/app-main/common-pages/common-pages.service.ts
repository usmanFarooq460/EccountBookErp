import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class CommonPagesService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  params = new HttpParams();
  constructor(private http: HttpClient) {}
  SupplierCustomerGetById(id) {
    return this.http.get<any>(this.apiUrl + "SupplierCustomer/GetByID", {
      params: this.params.set("Id", id),
    });
  }
}
