import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { GlobalConstant } from "src/app/Common/global-constant";

@Injectable({
  providedIn: "root",
})
export class ScreenGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let RouteData = route.data.screenName as Array<string>;
    let NameOfScreen = RouteData[0];
    if (GlobalConstant.ScreenRightList.length > 0 == false) {
      this.LogOut();
      return false;
    }
    let ScreenRights = GlobalConstant.ScreenRightList.filter(({ ScreenName }) => ScreenName == NameOfScreen);
    if (ScreenRights == null || ScreenRights == undefined || ScreenRights.length > 0 == false) {
      this.LogOut();
      return false;
    }
    let checkIfValueIsTrueAgainstScreen: boolean = false;
    for (let i = 0; i < ScreenRights.length; i++) {
      if (ScreenRights[i].Value == true) {
        checkIfValueIsTrueAgainstScreen = true;
        break;
      }
    }
    if (checkIfValueIsTrueAgainstScreen == true) {
      return true;
    } else {
      this.LogOut();
      return false;
    }
  }

  LogOut() {
    console.clear();
    sessionStorage.clear();
    this.router.navigate(["/account/login"]);
  }
}
