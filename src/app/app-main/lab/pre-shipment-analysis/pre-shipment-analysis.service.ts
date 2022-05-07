import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
@Injectable({
  providedIn: "root",
})
export class PreShipmentAnalysisService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
  });
  constructor(private http: HttpClient) {}
  params = new HttpParams();
  GetExportSaleOrderNoBySupplierCustomerId(data) {
    return this.http.post<any>(this.apiUrl + "ExImLcOrder/GetLcOrderNoBySupplierCustomerId", data, { headers: this.headers });
  }
  onSave(data) {
    return this.http.post<any>(this.apiUrl + "InvLabPreProductionExportLotInspectionHeader/Save", data, {
      headers: this.headers,
    });
  }
  InspectionLabName(data) {
    return this.http
      .post<any>(this.apiUrl + "ExImLookUps/GetByLookTypeId", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  Getformhistory(data) {
    return this.http.post<any>(this.apiUrl + "InvLabPreProductionExportLotInspectionHeader/InvLabPreProductionExportLotInspectionHeader_SlipandRegister", data, {
      headers: this.headers,
    });
  }
  UpdateConfirmationDateAfterApproval(data) {
    return this.http.post<any>(this.apiUrl + "InvLabPreProductionExportLotInspectionHeader/UpdateConfirmationDateAfterApproval", data, {
      headers: this.headers,
    });
  }
  GetById(Id) {
    return this.http.get<any>(this.apiUrl + "InvLabPreProductionExportLotInspectionHeader/GetByID", {
      params: this.params.set("Id", Id),
    });
  }
  GenerateCode(data) {
    return this.http
      .post<any>(this.apiUrl + "InvLabPreProductionExportLotInspectionHeader/GenerateCode", data, {
        headers: this.headers,
      })
      .toPromise();
  }
}
