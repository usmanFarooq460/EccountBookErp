import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CoaAllocationService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  COAAllocationGetAll(data) {
    return this.http.post<any>(this.apiUrl + "COAAllocation/PendingAccountsForAllocation", data, {
      headers: this.headers,
    });
  }

  COAAllocationSave(data) {
    return this.http.post<any>(this.apiUrl + "COAAllocation/Save", data, {
      headers: this.headers,
    });
  }
}
