import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class performaInvoiceService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  GetAllSampleLogs(data) {
    return this.http.post<any>(this.apiUrl + "InvLabSampleLogRegister/GetForCombo", data, {
      headers: this.headers,
    });
  }

  getDataOnSampleLogLeave(id) {
    return this.http.get<any>(this.apiUrl + "InvLabSampleLogRegister/GetById", {
      params: this.params.set("Id", id),
      headers: this.headers,
    });
  }

  GenerateCode(data) {
    return this.http
      .post<any>(this.apiUrl + "InvLabSampleAnalysis/GenerateCode", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GetForComboPurchaseOrderBySupplierandItemId(data) {
    return this.http.post<any>(this.apiUrl + "PurchaseOrder/GetForComboPoBySupplierandItemId", data, {
      headers: this.headers,
    });
  }

  GetByItemPurchaseOrderNo(data) {
    return this.http.post<any>(this.apiUrl + "PurchaseOrder/ReadIDFromOrderNo", data, {
      headers: this.headers,
    });
  }

  GetAllGroups(data) {
    return this.http
      .post<any>(this.apiUrl + "InvLabGroupAnalysisStandards/GetItemByGroup", data, {
        headers: this.headers,
      })
      .toPromise();
  }

  GroupsLeave(data) {
    return this.http.post<any>(this.apiUrl + "InvLabSampleAnalysis/ReadByAnalysisGroupId", data, { headers: this.headers });
  }

  sampleAnalysisGetAll(data) {
    return this.http.post<any>(this.apiUrl + "InvLabSampleAnalysis/GetAll", data, {
      headers: this.headers,
    });
  }
  sampleAnalysisGetById(id) {
    return this.http.get<any>(this.apiUrl + "InvLabSampleAnalysis/GetById", {
      params: this.params.set("Id", id),
    });
  }
  GetPoNoGetAll(data) {
    return this.http.post<any>(this.apiUrl + "PurchaseOrder/GetPoForCombo", data, {
      headers: this.headers,
    });
  }
  sampleAnalysisSave(data) {
    return this.http.post<any>(this.apiUrl + "InvLabSampleAnalysis/Save", data, {
      headers: this.headers,
    });
  }
}
