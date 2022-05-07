import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class PdfReportsCommonServiceService {
  apiUrl = environment.apiUrl;
  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  constructor(private http: HttpClient) {}
  PurchaseOrderSlip_201(data) {
    return this.http
      .post<any>(this.apiUrl + "InventoryPdfReports/PurchaseOrderTradingSlipPdfReprot", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  SaleInvoiceSlip_232(data) {
    return this.http
      .post<any>(this.apiUrl + "InventoryPdfReports/RptSaleInvoiceSlip_232", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  VoucherReport_104_And_103(data) {
    return this.http
      .post<any>(this.apiUrl + "InventoryPdfReports/PurhcaseInvoiceVoucherPdfReport", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  WsrmSaleInvoiceSlip_700_And_716(data) {
    return this.http
      .post<any>(this.apiUrl + "posPdfReports/WsrmSalesInvoiceSlip_700", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  RetailSaleInvoiceSlip_708_And_718(data) {
    return this.http
      .post<any>(this.apiUrl + "posPdfReports/PosInvoiceSlip_708", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  PurchaseInvoiceSlip_230(data) {
    return this.http
      .post<any>(this.apiUrl + "InventoryPdfReports/RptPurchaseInvoiceSlip_230", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  PosSaleReturnSlip_And_Register(data) {
    return this.http
      .post<any>(this.apiUrl + "posPdfReports/WsRmSaleInvoiceReturnSlipAndRegister_716", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  ExportPreShipmentAnalysisSlip_513(data) {
    return this.http
      .post<any>(this.apiUrl + "ExportReport/invLabPreProductionSlip_513", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  ExportPreShipmentAnalysisRegister_514(data) {
    return this.http
      .post<any>(this.apiUrl + "ExportReport/invLabPreProductionRegister_514", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //========================================5 April-2022
  PurchaseOrderRiceSlip(data) {
    return this.http
      .post<any>(this.apiUrl + "InventoryPdfReports/PurchaseOrderSlipPdfReprot", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //========================================6 April-2022
  SaleOrderRiceSlip(data) {
    return this.http
      .post<any>(this.apiUrl + "InventoryPdfReports/SaleOrderSlipPdfReport", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //=======================================11 April-2022
    GoodsReceiptNotesSlip(data) {
    return this.http
      .post<any>(this.apiUrl + "InventoryPdfReports/GoodsReceiptNotesSlipandRegisterPdfReprot", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //========================================12 April-2022
  GatePassInward_Import_Slip_802(data) {
    return this.http
      .post<any>(this.apiUrl + "ImportPdfReports/GatePassInward_Import_Slip_802", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GatePassInward_Slip_251(data) {
    return this.http
      .post<any>(this.apiUrl + "InventoryPdfReports/GatePassInwardSlipandRegisterPdfReprot", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  GatePassInward_SupplyOrder_Slip_331(data) {
    return this.http
      .post<any>(this.apiUrl + "InventoryPdfReports/GatePassInwardAgainstSupplyOrderSlip331", data, {
        headers: this.headers,
      })
      .toPromise();
  }
  //============================================13 April-2022
    ImportContract_Slip_801(data) {
    return this.http
      .post<any>(this.apiUrl + "ImportPdfReports/ImpContractSlip_801", data, {
        headers: this.headers,
      })
      .toPromise();
  }
}
