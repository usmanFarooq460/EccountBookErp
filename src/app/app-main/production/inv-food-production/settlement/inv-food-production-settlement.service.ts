import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class InvFoodProductionSettlementService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  // InvFoodProductionReports/InvFoodProductionSettlement
  getAllInvFoodProductionSettlement(data) {
    return this.http
      .post<any>(this.apiUrl + "InvFoodProductionReports/InvFoodProductionSettlement", data, {
        headers: this.headers,
      })
      .toPromise();
  }

  GetJobOrderNoForInvFoodProduction(data) {
    return this.http.post<any>(this.apiUrl + "ProductionJobOrder/GetJobOrderNoForInvFoodProduction", data, {
      headers: this.headers,
    });
  }

  GetSummeryValues(data) {
    return this.http.post<any>(this.apiUrl + "foodProduction/GetSummeryValues", data, {
      headers: this.headers,
    });
  }

  UpdateSettlement(data) {
    return this.http.post<any>(this.apiUrl + "foodProduction/UpdateSettlement", data, {
      headers: this.headers,
    });
  }
}
