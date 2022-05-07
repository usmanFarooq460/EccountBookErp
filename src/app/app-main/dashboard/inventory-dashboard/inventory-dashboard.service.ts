import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class InventoryDashboardService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  constructor(private http: HttpClient) {}

  InventoryDashboardPurchases(data) {
    return this.http.post<any>(this.apiUrl + "Dashboard/InventoryDashboardPurchase", data, {
      headers: this.headers,
    });
  }

  InventoryDashboardOutstandingPurchases(data) {
    return this.http.post<any>(this.apiUrl + "Dashboard/InventoryDashboardOutstandingPurchaseOrders", data, {
      headers: this.headers,
    });
  }

  InventoryDashboardOutstandingSaleOrder(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/SaleOrderHistory", data, {
      headers: this.headers,
    });
  }

  StockSummaryByActivity(data) {
    return this.http.post<any>(this.apiUrl + "InventoryReports/StockSummaryGeneralByWeightGetByActivity", data, {
      headers: this.headers,
    });
  }

  SalesSummaryByActivity(data) {
    return this.http.post<any>(this.apiUrl + "Dashboard/InventoryDashboardSalesByItem", data, {
      headers: this.headers,
    });
  }
  // DataForOutstandingPaddyPurchaseOrders(data) {
  //   return this.http.post<any>(this.apiUrl + "Dashboard/PaddyOutStandingPurchaseOrders", data, {
  //     headers: this.headers,
  //   });
  // }
  OrdersByParentCategories(data) {
    return this.http.post<any>(this.apiUrl + "Dashboard/OrdersByParentCategories", data, {
      headers: this.headers,
    });
  }
  Inventory_Dashboard_OrderDetailByParentCategory(data) {
    return this.http.post<any>(this.apiUrl + "Dashboard/Inventory_Dashboard_OrderDetailByParentCategory", data, {
      headers: this.headers,
    });
  }
}
