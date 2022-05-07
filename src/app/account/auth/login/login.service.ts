import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  tokenApiUrl = environment.tokenApiUrl;
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  params = new HttpParams();
  login(data) {
    ({
      "Content-Type": "application/x-www-form-urlencoded",
    });
    return this.http.post<any>(this.tokenApiUrl, data, {
      headers: this.headers,
    });
  }

  LoginWithOutToken(data) {
    return this.http.post<any>(this.apiUrl + "UserAccount/Login", data, {
      headers: this.headers,
    });
  }

  financialYearId(data) {
    return this.http.post<any>(this.apiUrl + "FinancialYear/ReadActiveByOrganizationIdNCompanyId", data, {
      headers: this.headers,
    });
  }
  loggedIn() {
    let IsLoggedIn = parseInt(sessionStorage.getItem("IsLoggedIn"));
    let IsLoggedInKey = IsLoggedIn / 13 + 7;
    return !!sessionStorage.getItem("DisplayName") && !!sessionStorage.getItem("SelectedCompanyId") && !!sessionStorage.getItem("AccessToken") && IsLoggedInKey % 7 == 0;
  }
  GetMultipleCompanyForUser(data) {
    return this.http.post<any>(this.apiUrl + "UserAccountAllocation/GetAllCompaniesByUserId", data, {
      headers: this.headers,
    });
  }
  ComanyGetById(id) {
    return this.http
      .get<any>(this.apiUrl + "Company/GetByID", {
        params: this.params.set("Id", id),
      })
      .toPromise();
  }
}
