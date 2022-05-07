import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "./login.service";
import { DxFormComponent } from "devextreme-angular";
import { fadeInRightOnEnterAnimation, fadeOutLeftOnLeaveAnimation, fadeInLeftOnEnterAnimation } from "angular-animations";
import { GlobalConstant } from "src/app/Common/global-constant";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  animations: [fadeOutLeftOnLeaveAnimation({ anchor: "fadeOutLeft", duration: 400, delay: 50 }), fadeInLeftOnEnterAnimation({ anchor: "fadeInLeft", duration: 400, delay: 50 })],
})
export class LoginComponent implements OnInit {
  @ViewChild("CompanySelectionForm", { static: false })
  CompanySelectionForm: DxFormComponent;
  CompanySelectionFormData: CompanyModel;

  submitted = false;
  error = "";
  OldPassword: string;
  CompanySelectionPanelVisible: boolean = false;
  CompanyList = [];
  DisplayName: string;
  AccessToken: string;
  breadCrumbItems: Array<{}>;
  financialYearList = [];
  constructor(private formBuilder: FormBuilder, private router: Router, private service: LoginService) {}
  loginForm = this.formBuilder.group({
    userName: ["", Validators.required],
    password: ["", Validators.required],
  });
  LoggedIn: boolean;
  ngOnInit() {
    document.body.removeAttribute("data-layout");
    document.body.classList.add("auth-body-bg");
    this.CompanySelectionFormData = new CompanyModel();
    sessionStorage.clear();
  }
  ngAfterViewInit() {}
  get field() {
    return this.loginForm.controls;
  }
  financialYear() {
    this.service
      .financialYearId({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          sessionStorage.setItem("FinancialYearId", result.Id);
          sessionStorage.setItem("StartPeriod", result.Start_Period);
          sessionStorage.setItem("EndPeriod", result.End_Period);
          if(this.service.loggedIn())
          {
            return;
          }else{
            this.GetCompaniesAgainstUserIds();
          }

          
          // this.GenerateIsLoggedInKey();
          // this.router.navigate(["/Approval-Dashboard"]);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  GetFinancialYear_ForOldBackEnd() {
    this.service
      .financialYearId({
        CompanyId: sessionStorage.getItem("CompanyId"),
        OrganizationId: sessionStorage.getItem("OrganizationId"),
      })
      .subscribe(
        (result) => {
          sessionStorage.setItem("FinancialYearId", result.Id);
          sessionStorage.setItem("StartPeriod", result.Start_Period);
          sessionStorage.setItem("EndPeriod", result.End_Period);
          if(this.service.loggedIn())
          {
            return;
          }
          this.GenerateIsLoggedInKey();
          this.router.navigate(["/Approval-Dashboard"]);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  GetCompaniesAgainstUserIds() {
    this.service
      .GetMultipleCompanyForUser({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        UserAccountId: sessionStorage.getItem("UserId"),
      })
      .subscribe(
        (result: any) => {
         
          this.CompanyList = result;
          
          if (result.length > 1) {
            this.CompanySelectionPanelVisible = true;
          } else if (result.length == 1) {
            
            sessionStorage.setItem("CompanyId", result[0].CompanyId);
            sessionStorage.setItem("CompanyName", result[0].CompName);
            sessionStorage.setItem("SelectedCompanyId", "true");
            this.CompanySelectionPanelVisible = false;
            this.GenerateIsLoggedInKey();
            this.financialYear();
            this.GetCompanyData(parseInt(sessionStorage.getItem("CompanyId")));
            if (sessionStorage.getItem("RoleName") == "Admin") {
              this.router.navigate(["/Approval-Dashboard"]);
            } else if(sessionStorage.getItem("RoleName")=="Group Admin") 
            {
              this.router.navigate(["/organizational-dashboard/accounts-dashboard"]);
            }else  {
              this.router.navigate(["/"])
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  saveCompany() {
    const result: any = this.CompanySelectionForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      let company;
      company = this.CompanySelectionFormData.CompanyId;
      sessionStorage.setItem("CompanyId", company);
      sessionStorage.setItem("SelectedCompanyId", "true");
      this.CompanySelectionPanelVisible = false;
      this.GenerateIsLoggedInKey();
      this.GetCompanyData(parseInt(sessionStorage.getItem("CompanyId")));
      this.financialYear();

      if (sessionStorage.getItem("RoleName") == "Admin") {
        this.router.navigate(["/Approval-Dashboard"]);
      } else {
        this.router.navigate(["/"])
      }
    }
  }
  async GetCompanyData(Id) {
    let CompanyData = await this.CompanyGetById(Id);
    sessionStorage.setItem("CompanyAddress", CompanyData.CompAddress);
    sessionStorage.setItem("CompanyName", CompanyData.CompName);
    GlobalConstant.CompanyNameOfLoggedInUser = CompanyData.CompCode;
  }
  async CompanyGetById(Id) {
    return await this.service.ComanyGetById(Id);
  }
  NavigateBackToLogin() {
    sessionStorage.clear();
    this.CompanySelectionPanelVisible = false;
  }
  getRandomInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  GenerateIsLoggedInKey() {
    let IsRequiredRandomNumber = false;
    while (IsRequiredRandomNumber == false) {
      let number = this.getRandomInt(100000, 999999);
      if (number % 7 == 0) {
        let loogedInKey = (number - 7) * 13;
        sessionStorage.setItem("IsLoggedIn", loogedInKey.toString());
        IsRequiredRandomNumber = true;
      }
    }
  }
  setFocus = (e) =>
    setTimeout(() => {
      e.component.focus();
    }, 0);
  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    } else {
      this.LoggedIn = true;
      this.service.login(`grant_type=password&username=${this.field.userName.value}&password=${this.field.password.value}`).subscribe(
        (result) => {
          this.LoggedIn = false;
          sessionStorage.setItem("CompanyId", result.CompanyId);
          sessionStorage.setItem("OrganizationId", result.OrganizationId);
          sessionStorage.setItem("CompanyName", result.CompanyName);
          sessionStorage.setItem("CompanyAddress", result.CompanyAddress);
          sessionStorage.setItem("DisplayName", result.DisplayName);
          sessionStorage.setItem("AccessToken", result.access_token);
          sessionStorage.setItem("UserId", result.UserId);
          sessionStorage.setItem("RoleName", result.RoleName);
          sessionStorage.setItem("SelectedCompanyId", "false");
          // this.OldPassword = result.Password;
          // GlobalConstant.CurrentPassword = this.OldPassword.toString();
          this.financialYear();
          // this.GetFinancialYear_ForOldBackEnd();
        },
        (error) => {
          this.LoggedIn = false;
          console.log(error);
          this.error = error ? error : "";
        }
      );
    }
  }
}
class CompanyModel {
  CompanyId: number;
}
