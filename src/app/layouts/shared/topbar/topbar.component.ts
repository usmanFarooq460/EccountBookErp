import { Component, OnInit, Inject, Output, EventEmitter, ViewChild } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import notify from "devextreme/ui/notify";
import { ConnectionService } from "ng-connection-service";
import { LanguageService } from "../../../core/services/language.service";
import { GlobalConstant } from "src/app/Common/global-constant";
import { notification, notificationTimer } from "src/app/shared/Base/notify";
import { CommonBaseService } from "src/app/shared/Base/common-base.service";
import { DxFormComponent } from "devextreme-angular";
import { TopBarModel, NotificationModel } from "./topbar.model";
import { MENU } from "src/app/layouts/shared/sidebar/menu";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { ShortcutKeysService } from "src/app/shared/Base/shortcut-Keys.service";
import { take } from "rxjs/operators";
import { BaseActions } from "src/app/shared/Base/BaseActions";
import { ShortCutKeysNewDesignComponent } from "../../../app-main/customer-sales/short-cut-keys-new-design/short-cut-keys-new-design.component";
@Component({
  selector: "app-topbar",
  templateUrl: "./topbar.component.html",
  styleUrls: ["./topbar.component.scss"],
})
export class TopbarComponent extends BaseActions implements OnInit {
  element: any;
  configData: any;
  cookieValue;
  SelectedLanguageFlagValue: string;
  SelectedLangugeCountryName: string;
  valueset: string;
  UserName: any;
  redirecting: any;
  passwordValue: string;
  password1Value: string;
  valueOfOldPassword: any;
  resetPasswordPopup: boolean = false;
  @ViewChild("resetPasswordForm", { static: false })
  resetPasswordForm: DxFormComponent;
  resetPasswordFormData: TopBarModel;
  PasswordValue: any;
  showUtilities: boolean;
  //=================================21 Jan 2022 @hamzamfarooqi55
  FilterBoxList: any;
  @ViewChild("TopBarForm", { static: false })
  TopBarForm: DxFormComponent;
  TopBarFormData: any;
  getMeLoggedOut() {
    sessionStorage.clear();
    this.router.navigate(["/account/login"]);
  }
  listLang = [
    { text: "English", flag: "./../../../../assets/images/flags/us.jpg", lang: "en" },
    { text: "Arabic", flag: "./../../../../assets/images/flags/us.jpg", lang: "ar" },
    { text: "Urdu", flag: "./../../../../assets/images/flags/us.jpg", lang: "ur" },
    { text: "Spanish", flag: "./../../../../assets/images/flags/us.jpg", lang: "es" },
    { text: "Pashto", flag: "./../../../../assets/images/flags/us.jpg", lang: "ps" },
    { text: "Chinese", flag: "./../../../../assets/images/flags/us.jpg", lang: "zh" },
  ];
  // tslint:disable-next-line: max-line-length
  //========================================================23 Jan 2022
  notificationList = new Array<NotificationModel>();
  CompanyName = "";
  time: Date;
  companyProfileDetail: CompanyInfo;
  showCompanyProfile: boolean;
  @ViewChild(ShortCutKeysNewDesignComponent) keyCompnent;
  //===================================================================
  constructor(
    @Inject(DOCUMENT) private document: any,
    private connection: ConnectionService,
    private CommonService: CommonBaseService,
    private router: Router,
    public languageService: LanguageService,
    public cookiesService: CookieService,
    private commonMethods: CommonMethodsForCombos,
    private keyboardShortcuts: ShortcutKeysService
  ) {
    super();
    this.keyboardShortcuts
      .addShortcut({ keys: "shift.n" })
      .pipe(take(50000))
      .subscribe((result) => {
        this.TopBarForm.instance.getEditor("NavigationBox").focus();
      });
    this.connection.monitor().subscribe((isConnected) => {
      GlobalConstant.isConnected = false;
      GlobalConstant.isConnected = isConnected;
      if (GlobalConstant.isConnected) {
        clearTimeout(this.redirecting);
        GlobalConstant.noInternetConnection = false;
        notificationTimer("Internet connected!", "success", 10000, 400);
        document.getElementById("wifi-icon").setAttribute("style", "color:#00e000;");
      } else {
        notify("Internet Disconnected!", "error");
        GlobalConstant.noInternetConnection = true;
        this.redirecting = setTimeout(function () {
          sessionStorage.clear();
          router.navigate(["/account/login"]);
        }, 120000);
        document.getElementById("wifi-icon").setAttribute("style", "color:#fe2712;");
      }
    });
    setTimeout(() => {
      this.cookieValue = this.cookiesService.get("lang");

      const val: Array<any> = this.listLang.filter((x) => x.lang == this.cookieValue);

      if (val.length === 0) {
        // if (this.flagvalue === undefined) {
        //   this.valueset = "assets/images/flags/us.jpg";
        // }
      } else {
        this.SelectedLangugeCountryName = val[0].text;
        this.SelectedLanguageFlagValue = val[0].flag;
        // this.countryName = val.map((element) => element.text && console.log(element.text));
        // this.flagvalue = val.map((element) => element.flag && console.log(element.flag) );
      }
    }, 3000);
  }
  @Output() mobileMenuButtonClicked = new EventEmitter();
  @Output() settingsButtonClicked = new EventEmitter();
  async ngOnInit() {
    this.resetPasswordFormData = new TopBarModel();
    this.element = document.documentElement;
    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3,
    };
    let currentDate = new Date();
    this.notificationList.push({
      NotificationIconBg: "bg-primary",
      NotificationIcon_Remix: "ri-guide-line",
      NotificationTitle: "Having Issue in Navigation?",
      NotificationBody: "Dear User! We have introduced navigation option in topbar.Press Shift+N, Search your screen and press Enter.",
      NotifiationTime: currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString(),
      NotificationId: 1,
      NotificationStatus: true,
    });
    setInterval(() => {
      this.time = new Date();
    }, 1000);
    this.getCompanyProfileDetail();

    this.displayName();
    this.TopBarFormData = { NavigationBox: "" };
    this.ScreenViewRightByUserId();
    let CompanyData = await this.commonMethods.CompanyGetById(parseInt(sessionStorage.getItem("CompanyId")));
    this.CompanyName = CompanyData.CompCode;
    this.setLanguage("Pakistan", "en", "");
  }
  resetPassword() {
    this.resetPasswordPopup = !this.resetPasswordPopup;
  }
  validatelength = (e) => {
    if (e.value.length >= 6) {
      return true;
    } else {
      return false;
    }
  };
  validateformat = (e) => {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(e.value)) {
      return true;
    } else {
      return false;
    }
  };
  matchPassword1 = (e) => {
    this.password1Value = e.value;
    return true;
  };
  matchPassword = (e) => {
    this.passwordValue = e.value;
    if (this.passwordValue == this.password1Value) {
      return true;
    } else {
      return false;
    }
  };
  Submit() {
    const result: any = this.resetPasswordForm.instance.validate();
    if (!result.isValid) {
      result.brokenRules[0].validator.focus();
      return;
    } else {
      this.CommonService.ResetPassword({
        OrganizationId: sessionStorage.getItem("OrganizationId"),
        CompanyId: sessionStorage.getItem("CompanyId"),
        OldPassword: this.resetPasswordFormData.OldPassword,
        Password: this.resetPasswordFormData.Password,
        Id: sessionStorage.getItem("UserId"),
      }).subscribe(
        (result) => {
          this.resetPasswordPopup = !this.resetPasswordPopup;
          notify("Updated Successfully", "success");
          this.resetPasswordFormData = {
            OldPassword: "",
            Password1: "",
            Password: "",
          };
        },
        (error) => {
          this.HandleError(error);
        }
      );
    }
  }
  openUtilitiesPopup(e) {
    this.showUtilities = !this.showUtilities;
  }
  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }
  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }
  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle("fullscreen-enable");
    if (!document.fullscreenElement && !this.element.mozFullScreenElement && !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
  /**
   * Translate language
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.SelectedLangugeCountryName = text;
    this.SelectedLanguageFlagValue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }
  displayName() {
    this.UserName = sessionStorage.getItem("DisplayName");
  }
  logout() {
    sessionStorage.clear();
    this.router.navigate(["/account/login"]);
  }
  //======================================21 Jan 2022 (@hamzamfarooqi55)
  ScreenViewRightByUserId() {
    this.CommonService.getViewRightsByUserId({
      EntryUser: this.CommonService.UserId(),
      CompanyId: sessionStorage.getItem("CompanyId"),
    }).subscribe(
      (result) => {
        this.filterDataForSearchBox(result);
      },
      (error) => console.log(error)
    );
  }
  filterDataForSearchBox(data) {
    let filterBoxList = [];
    if (data.length > 0) {
      for (let i = 0; i < MENU.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (MENU[i].label == data[j].ModuleDescription && data[j].Value == true) {
            let subItemsInMenuAtI: Array<any> = MENU[i].subItems;
            let screenData = subItemsInMenuAtI.find(({ ScreenName }) => ScreenName == data[j].ScreenName);
            if (screenData != undefined && screenData != null) {
              filterBoxList.push(screenData);
            }
          }
        }
      }
      this.GenerateDataSoruce(filterBoxList);
    }
  }
  async GenerateDataSoruce(data) {
    this.FilterBoxList = await this.commonMethods.GenerateDataSourceFromList(data);
  }
  navigateToSelectedScreen = (e) => {
    // console.log(e);
    this.router.navigate([e.value]);
    this.TopBarFormData.NavigationBox = "";
  };
  //===========================================
  RemoveFromNotification(Id) {
    let index;
    for (let i = 0; i < this.notificationList.length; i++) {
      if (this.notificationList[i].NotificationId == Id) {
        index = i;
        break;
      }
    }
    this.notificationList.splice(index, 1);
  }
  async getCompanyProfileDetail() {
    let RoleName = sessionStorage.getItem("RoleName");
    if (RoleName == "Group Admin") {
      this.CommonService.getOrganizationDataById(sessionStorage.getItem("OrganizationId")).subscribe(
        (result: any) => {
          this.companyProfileDetail = new CompanyInfo();
          this.companyProfileDetail.CompName = result.OrgCode;
          this.companyProfileDetail.CompAddress = result.OrgAddress;
          this.companyProfileDetail.CompBaseCurr = result.OrgBaseCurr;
          this.companyProfileDetail.CompCountry = result.OrgCountry;
          this.companyProfileDetail.CompEmailA = result.OrgEmailA;
          this.companyProfileDetail.CompMobileA = result.OrgMobileA;
          this.companyProfileDetail.CompType = result.OrgReportingTitle;
          this.companyProfileDetail.CompContactPerson = result.OrgContactPerson;
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.CommonService.getCompanyData({
        OrgCompanyTypeId: sessionStorage.getItem("OrganizationId"),
        Id: sessionStorage.getItem("CompanyId"),
      }).subscribe(
        (result) => {
          this.companyProfileDetail = new CompanyInfo();
          this.companyProfileDetail = result[0];
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  showPopUp() {
    this.showCompanyProfile = !this.showCompanyProfile;
  }
  ChangeNotificationStatus(Id) {
    if (this.notificationList.find(({ NotificationId }) => NotificationId == Id).NotificationStatus == true) {
    }
    for (let i = 0; i < this.notificationList.length; i++) {
      if (this.notificationList[i].NotificationId == Id) {
        this.notificationList[i].NotificationStatus = false;
        break;
      }
    }
  }
}
class CompanyInfo {
  CompEmailA: string;
  CompContactPerson: string;
  CompMobileA: string;
  CompName: string;
  CompAddress: string;
  CompCountry: string;
  CompBaseCurr: string;
  CompType: string;
}
