import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DeliveryOrderService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(private http: HttpClient) {}

  getDocumentNo(data) {
    return this.http.post<any>(this.apiUrl + "InvDeliveryOrder/GenerateCode", data, { headers: this.headers });
  }

  GetDeliveryOrder(data) {
    return this.http.post<any>(this.apiUrl + "InvDeliveryOrder/DeliveryOrderLoad", data, { headers: this.headers });
  }

  getDeliveryOrderNoCheckinGatePass(data) {
    return this.http.post<any>(this.apiUrl + "InvDeliveryOrder/DeliveryOrderNoCheckinGatePass", data, { headers: this.headers });
  }

  GetAll(data) {
    return this.http.post<any>(this.apiUrl + "InvDeliveryOrder/FormHistory", data, { headers: this.headers });
  }

  GetPendingDeliveryOrderForIssuance(data) {
    return this.http.post<any>(this.apiUrl + "InvDeliveryOrder/GetPendingDeliveryOrderForIssuance", data, { headers: this.headers });
  }

  ReadIdByDocNo(data) {
    return this.http.post<any>(this.apiUrl + "InvDeliveryOrder/ReadIdByDocNo", data, { headers: this.headers });
  }

  getItemBySaleOrderId(data) {
    return this.http.post(this.apiUrl + "SaleOrder/ReadBySaleOrderId", data, {
      headers: this.headers,
    });
  }

  LoadSaleOrderForDeliveryOrder(data) {
    return this.http.post(this.apiUrl + "SaleOrder/LoadSaleOrderForDeliveryOrder", data, {
      headers: this.headers,
    });
  }

  LoadSaleOrderForDeliveryOrderInDetail(data) {
    return this.http.post(this.apiUrl + "SaleOrder/LoadSaleOrderForDeliveryOrderInDetail", data, {
      headers: this.headers,
    });
  }
  getItem(data) {
    return this.http.post<any>(this.apiUrl + "Item/GetByOrganizationCompanyId", data, {
      headers: this.headers,
    });
  }
  getOrderNo(data) {
    return this.http.post<any>(this.apiUrl + "SaleOrder/SaleOrderIdandNoGetForSupplierCustomerId", data, { headers: this.headers });
  }

  save(data) {
    return this.http.post<any>(this.apiUrl + "InvDeliveryOrder/Save", data, {
      headers: this.headers,
    });
  }

  getById(id) {
    let params = new HttpParams().set("Id", id);
    return this.http.get(this.apiUrl + "InvDeliveryOrder/GetByID", {
      headers: this.headers,
      params: params,
    });
  }
  PDFReportSlip262(data) {
    return this.http.post<any>(this.apiUrl + "InventoryPdfReports/DeliveryOrderSlip_262", data, {
      headers: this.headers,
    });
  }

  GetAvailableTransactionsForDeliveryOrderFilter(data) {
    return this.http.post<any>(this.apiUrl + "InventoryStockEvalautionDetail/GetAvailableTransactionsForDeliveryOrderFilter", data, {
      headers: this.headers,
    });
  }
}
