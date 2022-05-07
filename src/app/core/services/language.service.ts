import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root",
})
export class LanguageService {
  public languages: string[] = ["en", "ar", , "ur", "es", "ps", "zh"];

  constructor(public translate: TranslateService, private cookieService: CookieService) {
    let browserLang;
    this.translate.addLangs(this.languages);
    if (this.cookieService.check("lang")) {
      browserLang = this.cookieService.get("lang");
    }  
    else {
      browserLang = translate.getBrowserLang();
    }
    translate.use(browserLang.match(/en|ar|ur|es|ps|zh/) ? browserLang : "en");
  }

  public setLanguage(lang) {
    this.translate.use(lang);
    this.cookieService.set("lang", lang);
  }
}
