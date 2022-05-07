import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class InvFoodProductionSummaryService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  GetSummeryValues(data) {
    return this.http.post<any>(this.apiUrl + "foodProduction/GetSummeryValues", data, {
      headers: this.headers,
    });
  }

  GetSummeryDetails(data) {
    return this.http.post<any>(this.apiUrl + "InvFoodProductionReports/InvFoodProductionRecoverySummeryReport", data, {
      headers: this.headers,
    });
  }

  GetJobOrderNoForInvFoodProductionForComboBind(data) {
    return this.http.post<any>(this.apiUrl + "ProductionJobOrder/GetJobOrderAll", data, {
      headers: this.headers,
    });
  }
}
