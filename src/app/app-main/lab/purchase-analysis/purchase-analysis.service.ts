import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PurcahseAnalysisService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}

  // New
  getDataOnGatePassLeave(data) {
    return this.http.post<any>(this.apiUrl + "InvLabAnalysisPurchase/GetGpDetailByGatepassNo", data, {
      headers: this.headers,
    });
  }

  GetGpSrNoForPurchaseAnalysis(data) {
    return this.http.post<any>(this.apiUrl + "GatePassInward/GetGpSrNoForPurchaseAnalysis", data, {
      headers: this.headers,
    });
  }

  GetSampleAnalysisDetailByPo(data) {
    return this.http.post<any>(this.apiUrl + "InvLabAnalysisPurchase/GetSampleAnalysisDetailByPo", data, {
      headers: this.headers,
    });
  }

  GetPurchaseAnalysisDetailByPo(data) {
    return this.http.post<any>(this.apiUrl + "InvLabAnalysisPurchase/GetPurchaseAnalysisDetailByPo", data, {
      headers: this.headers,
    });
  }

  getDetailBySampleAnalysisNumber(data) {
    return this.http.post<any>(this.apiUrl + "InvLabSampleAnalysis/GetBySampleId", data, {
      headers: this.headers,
    });
  }

  // Ends

  SupplierCustomer(data) {
    return this.http.post<any>(this.apiUrl + "SupplierCustomer/GetByOrganizationCompanyId", data, {
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
    return this.http.post<any>(this.apiUrl + "InvLabSampleAnalysis/ReadByAnalysisGroupId", data, {
      headers: this.headers,
    });
  }

  //InUsed
  GetByGpNo(data) {
    return this.http.post<any>(this.apiUrl + "GatePassInward/GetByGpNo", data, {
      headers: this.headers,
    });
  }

  GetByPurchaseOrderNo(data) {
    return this.http.post<any>(this.apiUrl + "PurchaseOrder/ReadIDFromOrderNo", data, {
      headers: this.headers,
    });
  }
  GetByItemIdNNo(data) {
    return this.http.post<any>(this.apiUrl + "InvLabSampleAnalysis/GetSampleNoFromItemIdNPONo", data, {
      headers: this.headers,
    });
  }
  //Crud
  GenerateCode(data) {
    return this.http.post<any>(this.apiUrl + "InvLabAnalysisPurchase/GenerateCode", data, {
      headers: this.headers,
    });
  }
  purchaseAnalysisGetAll(data) {
    return this.http.post<any>(this.apiUrl + "InvLabAnalysisPurchase/GetAll", data, {
      headers: this.headers,
    });
  }
  purchaseAnalysisGetById(id) {
    return this.http.get<any>(this.apiUrl + "InvLabAnalysisPurchase/GetById", {
      params: this.params.set("Id", id),
    });
  }

  purchaseAnalysisSave(data) {
    return this.http.post<any>(this.apiUrl + "InvLabAnalysisPurchase/Save", data, {
      headers: this.headers,
    });
  }
  // PDF SLIPS
  PDFReportSlip653(data) {
    return this.http.post<any>(this.apiUrl + "LabHistoryPdfReports/RptInvLabPurchaseAnalysisSlip653", data, {
      headers: this.headers,
    });
  }
}
