import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class GatePassOutwardService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  params = new HttpParams();

  constructor(private http: HttpClient) {}
  GpTypeGetAll() {
    return this.http.get<any>(this.apiUrl + "GatepassType/GetAll");
  }

  GetNetWeightFromWbTransactions(data) {
    return this.http.post<any>(this.apiUrl + "WbTransactions/GetNetWeightFromWbTransactions", data, {
      headers: this.headers,
    });
  }

  GenerateCode(data) {
    return this.http.post<any>(this.apiUrl + "GatePassOutward/GenerategpCode", data, {
      headers: this.headers,
    });
  }

  GenerateGpTypeCode(data) {
    return this.http.post<any>(this.apiUrl + "GatePassOutward/GenerateGPTypeCode", data, {
      headers: this.headers,
    });
  }

  GetSupplierBySaleOrderNo(data) {
    return this.http.post<any>(this.apiUrl + "SupplierCustomer/GetSupplierBySaleOrderNo", data, {
      headers: this.headers,
    });
  }
  GetTotalWeightFromDeliveryOrder(data) {
    return this.http.post<any>(this.apiUrl + "InvDeliveryOrder/GetTotalWeightFromDeliveryOrder", data, {
      headers: this.headers,
    });
  }

  checkDeliveryOrderNoInGatePass(data) {
    return this.http.post<any>(this.apiUrl + "InvDeliveryOrder/DeliveryOrderNoCheckinGatePass", data, {
      headers: this.headers,
    });
  }
  //Crud

  GetPendingGatepass() {
    return this.http.get<any>(this.apiUrl + "GatePassOutward/GetPendingGatepass");
  }
  GatepassSave(data) {
    return this.http.post<any>(this.apiUrl + "GatePassOutward/Save", data, {
      headers: this.headers,
    });
  }
  GatepassHistory(data) {
    return this.http.post<any>(this.apiUrl + "GatePassOutward/GatepassHistory", data, {
      headers: this.headers,
    });
  }
  ReadByGpDate(data) {
    return this.http.post<any>(this.apiUrl + "GatePassOutward/ReadByGpDate", data, {
      headers: this.headers,
    });
  }

  GetHistoryonlystatusOpen(data) {
    return this.http.post<any>(this.apiUrl + "GatePassOutward/GetHistoryonlystatusOpen", data, {
      headers: this.headers,
    });
  }
  GatepassGetById(id) {
    return this.http.get<any>(this.apiUrl + "GatePassOutward/GetByID", {
      params: this.params.set("Id", id),
    });
  }

  GetBalQtyBySaleOrderId(data) {
    return this.http.post<any>(this.apiUrl + "GatePassOutward/GetTotalReceivedQtyByPurchaseOrderId", data, {
      headers: this.headers,
    });
  }

  getpdfReport(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/GatePassOutwardSlipPdfReport", data, {
      headers: this.headers,
    });
  }
}
