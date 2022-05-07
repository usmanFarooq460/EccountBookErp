import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ConfigurationService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  getConfigurationsList(data) {
    return this.http.post<any>(this.apiUrl + "ConfigrationsAllocation/HistoryConfiguration", data);
  }

  getBaseCurrency(data) {
    return this.http.post<any>(this.apiUrl + "MultiCurrency/GetByOrganizationCompanyId", data);
  }

  getControlAccounts(data) {
    return this.http.post<any>(this.apiUrl + "ChartofAccount/ReadAllParentGroupAccount", data);
  }

  getConfigurationKey(data) {
    let params = new HttpParams();
    params = params.append("ConfigName", data.ConfigName);
    params = params.append("OrganizationId", data.OrganizationId);
    params = params.append("CompanyId", data.CompanyId);
    return this.http.get<any>(this.apiUrl + "ConfigrationsAllocation/GetByKey", { params: params });
  }

  getCropYear(data) {
    return this.http.post<any>(this.apiUrl + "InvCropYear/GetAll", data);
  }

  getJobLot(data) {
    return this.http.post<any>(this.apiUrl + "JobLot/GetByOrganizationCompanyId", data);
  }

  getPackingType() {
    return this.http.get<any>(this.apiUrl + "InvPackingType/GetAll");
  }

  getWarehouse(data) {
    return this.http.post<any>(this.apiUrl + "InvWareHouse/GetByOrganizationCompanyId", data);
  }

  getCity(data) {
    return this.http.post<any>(this.apiUrl + "City/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }

  getAccounts(data) {
    return this.http.post<any>(this.apiUrl + "COAAllocation/GetAll", data);
  }

  getKeyOnFirstTime(data) {
    let params = new HttpParams().set("ConfigDescription", data);
    return this.http.get<any>(this.apiUrl + "ConfigrationsAllocation/ReadByConfigDescription", { headers: this.headers, params: params });
  }

  saveConfigurations(data) {
    return this.http.post<any>(this.apiUrl + "ConfigrationsAllocation/Save", data);
  }
}
