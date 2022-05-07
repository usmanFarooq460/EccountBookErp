import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { ClickOutsideModule } from "ng-click-outside";
import { LanguageService } from "../../core/services/language.service";
import { TranslateModule } from "@ngx-translate/core";

import { TopbarComponent } from "./topbar/topbar.component";
import { FooterComponent } from "./footer/footer.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { RightsidebarComponent } from "./rightsidebar/rightsidebar.component";
import { HorizontaltopbarComponent } from "./horizontaltopbar/horizontaltopbar.component";
import { HorizontalnavbarComponent } from "./horizontalnavbar/horizontalnavbar.component";
import { UiModule } from "src/app/shared/ui/ui.module";

import {
  DxButtonModule,
  DxDataGridModule,
  DxDateBoxModule,
  DxFormModule,
  DxNumberBoxModule,
  DxPopoverModule,
  DxPopupModule,
  DxSelectBoxModule,
  DxSpeedDialActionModule,
  DxTextBoxModule,
  DxTooltipModule,
  DxValidatorModule,
} from "devextreme-angular";
// import { UtilityModule } from "src/app/app-main/utilities/utilities.module";
@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [TopbarComponent, FooterComponent, SidebarComponent, RightsidebarComponent, HorizontaltopbarComponent, HorizontalnavbarComponent],
  imports: [
    CommonModule,
    TranslateModule,
    PerfectScrollbarModule,
    NgbDropdownModule,
    ClickOutsideModule,
    RouterModule,
    UiModule,
    DxButtonModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxFormModule,
    DxNumberBoxModule,
    DxPopoverModule,
    DxPopupModule,
    DxSelectBoxModule,
    DxSpeedDialActionModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxTooltipModule,
    // UtilityModule,
  ],
  exports: [TopbarComponent, FooterComponent, SidebarComponent, RightsidebarComponent, HorizontaltopbarComponent, HorizontalnavbarComponent],
  providers: [LanguageService],
})
export class SharedModule {}
