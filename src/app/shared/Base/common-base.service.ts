import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommonBaseService {
  apiUrl = environment.apiUrl;

  headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  params = new HttpParams();
  constructor(private http: HttpClient) {}
  async getCompany() {
    let data=await  this.http
      .post<any>(
        this.apiUrl + "Company/GetAll",
        { OrgCompanyTypeId: this.OrganizationId() },
        {
          headers: this.headers,
        }
      )
      .toPromise();
      return data.filter(({Id})=> Id==parseInt(sessionStorage.getItem("CompanyId")))
  }
  getCompanyData(data) {
    return this.http.post<any>(this.apiUrl + "Company/GetAll", data, {
      headers: this.headers,
    })
  }
  getOrganizationById(Id) {
    this.params = this.params.set("Id", Id);
    return this.http
      .get(this.apiUrl + "Organization/GetByID", {
        params: this.params,
      })
      .toPromise();
  }
  getOrganizationDataById(Id) {
    this.params = this.params.set("Id", Id);
    return this.http
      .get(this.apiUrl + "Organization/GetByID", {
        params: this.params,
      })
 
  }

  getBranch() {
    return this.http
      .post<any>(
        this.apiUrl + "Branches/GetAll",
        {
          OrganizationId: this.OrganizationId(),
          CompanyId: this.CompanyId(),
        },
        {
          headers: this.headers,
        }
      )
      .toPromise();
  }

  getProject() {
    return this.http
      .post<any>(
        this.apiUrl + "Projects/GetByOrganizationCompanyId",
        {
          OrganizationId: this.OrganizationId(),
          CompanyId: this.CompanyId(),
        },
        {
          headers: this.headers,
        }
      )
      .toPromise();
  }

  ////////////////////////////////////////////////////////

  CompanyId() {
    return +sessionStorage.getItem("CompanyId");
  }

  OrganizationId() {
    return +sessionStorage.getItem("OrganizationId");
  }
  FinancialYearId() {
    return +sessionStorage.getItem("FinancialYearId");
  }
  UserId() {
    return +sessionStorage.getItem("UserId");
  }
  RoleName() {
    return sessionStorage.getItem("RoleName");
  }

  userRights(data) {
    return this.http.post<any>(this.apiUrl + "UserRights/GetByUserIdScreenNameRightName", data);
  }
  configurations(data) {
    return this.http
      .post<any>(this.apiUrl + "ConfigrationsAllocation/HistoryConfiguration", data, {
        headers: this.headers,
      })
     
  }

  getViewRightsByUserId(data) {
    return this.http.post<any>(this.apiUrl + "UserRights/GetViewRightsByUserId", data, {
      headers: this.headers,
    });
  }
  // getViewRightsByUserId(id, CompId) {
  //   this.params.set("Id", id),
  //   this.params.set("CompanyId", CompId),
  //   return this.http.get<any>(this.apiUrl + "UserRights/GetViewRightsByUserId", {
  //     params: this.params,
  //   });
  // }

  ResetPassword(data) {
    return this.http.post<any>(this.apiUrl + "UserAccount/ResetPassword", data, {
      headers: this.headers,
    });
  }

  /////////////////////////////////////////////////////////////////
  // async getCompanyList(): Promise<any[]> {
  //   return await this.company({
  //     OrgCompanyTypeId: this.OrganizationId(),
  //   });
  // }
}
