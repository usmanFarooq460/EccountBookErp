import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { LayoutsModule } from "./layouts/layouts.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpConfigInterceptor } from "./interceptor/httpconfig.interceptor";
import { BnNgIdleService } from "bn-ng-idle";
import { CommonMethodsForCombos } from "src/app/shared/Base/common-methods-for-combos";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from "ngx-ui-loader";
export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    LayoutsModule,
    BrowserAnimationsModule,
    NgxUiLoaderModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
    BnNgIdleService,
    CommonMethodsForCombos,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
