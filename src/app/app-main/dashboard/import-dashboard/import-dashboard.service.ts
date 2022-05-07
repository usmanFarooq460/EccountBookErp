import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ImportDashboardService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  params = new HttpParams();

  constructor(private http: HttpClient) {}

  ReadImportDashboardData(data) {
    return this.http
      .post<any>(this.apiUrl + "OrganizationLevelDashboard/OrgGroup_ImportDashboard", data, {
        headers: this.headers,
      })
      .toPromise();
  }

  //#endregion
}
