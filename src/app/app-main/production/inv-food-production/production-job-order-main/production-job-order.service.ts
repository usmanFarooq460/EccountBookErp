import { HttpHeaders, HttpParams, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProductionJobOrderService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  GetGenerateCode(data) {
    return this.http
      .post<any>(this.apiUrl + "ProductionJobOrder/GetGenerateCode", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  getAllPRoductionPalnts(data) {
    return this.http
      .post<any>(this.apiUrl + "ProductionPlant/GetAll", data, {
        headers: this.headers,
      })
      .toPromise();
  }

  Save(data) {
    return this.http.post<any>(this.apiUrl + "ProductionJobOrder/Save", data, {
      headers: this.headers,
    });
  }

  productionJobOrderGetAll(data) {
    return this.http.post<any>(this.apiUrl + "ProductionJobOrder/FormHistory", data, {
      headers: this.headers,
    });
  }

  GetByID(id) {
    return this.http.get<any>(this.apiUrl + "ProductionJobOrder/GetByID", {
      params: this.params.set("Id", id),
      headers: this.headers,
    });
  }
}
