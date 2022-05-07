import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class GoodsDispatchNoteService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(private http: HttpClient) {}

  getCoaDetailAccounts(data) {
    return this.http.post<any>(this.apiUrl + "COAAllocation/GetAll", data);
  }

  GetByGpNoForGDN(data) {
    return this.http.post<any>(this.apiUrl + "GatePassOutward/GetByGpNo", data, {
      headers: this.headers,
    });
  }

  GetNetWeightAgainstGpId(data) {
    return this.http.post<any>(this.apiUrl + "WbTransactions/GetNetWeightFromWbTransactions", data, {
      headers: this.headers,
    });
  }

  ReadByGpNoForGdnDeliveryOrder(data) {
    return this.http.post<any>(this.apiUrl + "GatePassOutward/ReadByGpNoForGdnDeliveryOrder", data, {
      headers: this.headers,
    });
  }

  GetGpTypeandDEliveryTermFromOrderId(data) {
    return this.http.post<any>(this.apiUrl + "SaleOrder/GetGpTypeandDEliveryTerm", data, {
      headers: this.headers,
    });
  }

  GetCustomerByDeliveryOrderId(data) {
    return this.http.post<any>(this.apiUrl + "InvDeliveryOrder/CustomerLoadForDeliveryOrderId", data, {
      headers: this.headers,
    });
  }
  DeliveryOrderLoad(data) {
    return this.http.post<any>(this.apiUrl + "InvDeliveryOrder/DeliveryOrderLoad", data, {
      headers: this.headers,
    });
  }
  getPurchaseOrderById(id) {
    let params = new HttpParams().set("Id", id);
    return this.http.get(this.apiUrl + "SaleOrder/GetByID", {
      headers: this.headers,
      params: params,
    });
  }
  getItemByPurchaseOrderId(data) {
    return this.http.post(this.apiUrl + "SaleOrder/ReadBySaleOrderId", data, {
      headers: this.headers,
    });
  }

  GetSupplierBySaleOrderNo(data) {
    return this.http.post<any>(this.apiUrl + "SaleOrder/GetSupplierBySaleOrderNo", data, {
      headers: this.headers,
    });
  }

  getJobLotOnLeaveOfItem(data) {
    return this.http.post(this.apiUrl + "JobLot/GetList", data, {
      headers: this.headers,
    });
  }

  saveGdn(data) {
    return this.http.post<any>(this.apiUrl + "InvGdn/Save", data, {
      headers: this.headers,
    });
  }
  getDocumentNo(data) {
    return this.http.post<any>(this.apiUrl + "InvGdn/GenerateCode", data, { headers: this.headers });
  }
  GrnHistory(data) {
    return this.http.post<any>(this.apiUrl + "InvGdn/GetHistoryRecord", data, {
      headers: this.headers,
    });
  }

  getGrnById(id) {
    let params = new HttpParams().set("Id", id);
    return this.http.get(this.apiUrl + "InvGdn/GetByID", {
      headers: this.headers,
      params: params,
    });
  }
  getpdfReport(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/InvGdnSlipPdfReprot", data, {
      headers: this.headers,
    });
  }

  GetPendingGatePass(data) {
    return this.http.post<any>(this.apiUrl + "GatePassOutward/GetPendingGatepass", data, {
      headers: this.headers,
    });
  }

  GetWeightForValidationsIfGPisAgainstDO(data) {
    return this.http.post<any>(this.apiUrl + "InvGdn/GetGdnGrossWeightForValidation", data, {
      headers: this.headers,
    });
  }

  GetData(data) {
    return this.http.post<any>(this.apiUrl + "GatePassInward/GetDataByGpId", data, {
      headers: this.headers,
    });
  }
}
