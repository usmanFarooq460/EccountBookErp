import { Component } from "@angular/core";

import { Router } from "@angular/router";
import { BnNgIdleService } from "bn-ng-idle";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "EccountBook Cloud ERP";
  constructor(private router: Router, private SessionTimeOut: BnNgIdleService) {}
  ngOnInit() {
    this.SessionTimeOut.startWatching(600).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        sessionStorage.clear();
        this.router.navigate(["/account/login"]);

        return;
      }
    });
  }
}
