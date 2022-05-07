import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { SharedModule } from "./shared/shared.module";

import { VerticalComponent } from "./vertical/vertical.component";
import { HorizontalComponent } from "./horizontal/horizontal.component";
import { LayoutComponent } from "./layout/layout.component";
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from "ngx-ui-loader";

@NgModule({
  declarations: [VerticalComponent, HorizontalComponent, LayoutComponent],
  imports: [CommonModule, SharedModule, RouterModule, NgxUiLoaderModule, NgxUiLoaderRouterModule.forRoot({ showForeground: true, loaderId: "loader-for-route-change" })],
  exports: [VerticalComponent, HorizontalComponent],
})
export class LayoutsModule {}
