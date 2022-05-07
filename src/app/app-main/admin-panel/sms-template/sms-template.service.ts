import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SmsTemplateService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getScreenName(data) {
    return this.http.post<any>(this.apiUrl + "MessageBody/GetScreenName", data);
  }

  getMessageBody(screeName) {
    let params = new HttpParams().set("ScreenName", screeName);
    return this.http.get<any>(this.apiUrl + "MessageBody/GetMessageBody", { params: params });
  }

  getParams(screenName) {
    return this.http.post<any>(this.apiUrl + "SmsScreenParameterList/GetParameterByScreenName", screenName);
  }

  getGroups(data) {
    return this.http.post<any>(this.apiUrl + "ReceiverGroup/GetAllocateGroup", data);
  }

  saveSMSBody(data) {
    return this.http.post<any>(this.apiUrl + "MessageBody/Save", data);
  }
}
