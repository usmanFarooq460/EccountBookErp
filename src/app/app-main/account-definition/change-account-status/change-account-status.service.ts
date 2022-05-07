import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ChangeAccountStatusService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  updateCOAllocaionAcccount(data) {
    return this.http.post<any>(this.apiUrl + "COAAllocation/AccountChangeStatus", data, {
      headers: this.headers,
    });
  }

  getStatusOnAccountValueChange(data) {
    return this.http.post<any>(this.apiUrl + "COAAllocation/GetPageNoandStatusbyAccountId", data, {
      headers: this.headers,
    });
  }

  getAccountsForComboBind(data) {
    return this.http
      .post<any>(this.apiUrl + "ChartofAccount/DetailAccount", data, {
        headers: this.headers,
      })
      .toPromise();
  }
}
