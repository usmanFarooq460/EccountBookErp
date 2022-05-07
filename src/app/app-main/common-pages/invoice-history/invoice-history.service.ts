import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceHistoryService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  
  constructor(private http:HttpClient) { }


  GetHistoryForMainDetail(data) {
    return this.http.post<any>(this.apiUrl + "PosReports/WsrmSalesInvoiceSlipAndRegister", data, {
      headers: this.headers,
    });
  }
}
