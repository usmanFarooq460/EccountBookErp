import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError, from, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { environment as en } from "src/environments/environment";
import { GlobalConstant } from "src/app/Common/global-constant"
@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token: string = sessionStorage.getItem("AccessToken");
    if (token) {
      request = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + token),
      });
    }
    if (!request.headers.has("Content-Type")) {
      request = request.clone({
        headers: request.headers.set("Content-Type", "application/json"),
      });
    }
    request = request.clone({
      headers: request.headers.set("Accept", "application/json"),
    });

    if (request.url == en.apiUrl + "UserRights/GetByUserIdScreenNameRightName") {
      request = request.clone({
        body: { ...request.body, CompanyId: sessionStorage.getItem("CompanyId") },
      });
    }
    GlobalConstant.LastApiCalled=request.url;
    return next.handle(request).pipe(
      map((event: any) => {
        if (event.body) {
          if (event.body.Status === false) {
            throw new Error(event.body.Message);
          } else if (event.body.Status === true) {
            if (event.body.Data) {
              event.body = event.body.Data.Result;
            }
          }
        }
        return event;
      }),
      catchError((err) => {
        // console.log(err);
        if (err instanceof HttpErrorResponse) {
          let serverError = err.error;
          const applicationError = err.headers.get("Application-Error");
          if (err.status === 0) {
            serverError = ServerError.Unreachable;
          } else if (err.status === 401) {
            serverError = ServerError.Unauthorized;
          }
          let modelStateError = "";
          if (serverError && typeof serverError == "object") {
            let modelErrors = serverError.errors;
            for (const key in modelErrors) {
              if (modelErrors[key]) {
                modelStateError += modelErrors[key] + "\n";
              }
            }
          }
          if(err.error)
          {
            if(err.error.error_description)
            {
              return throwError(err.error.error_description);
            }
            
          }
          // console.log(applicationError || modelStateError || serverError || "Server Error");
          return throwError(applicationError || modelStateError || serverError || "Server Error");
        } else {
          // err.ExceptionMessage = err;
      
          return throwError(err);
        }
      })
    );
  }
}
class ServerError {
  public static get Unreachable(): string {
    return "The URL is unreachable";
  }
  public static get Unauthorized(): string {
    return "Unauthorized access";
  }
  public static get ServerError(): string {
    return "Server Error";
  }
}
