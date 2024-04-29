import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResponseInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      retry(3),
      map(res => {
        if (res instanceof HttpResponse) {
          return res;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        let errMsg = "";

        //client side
        if (error.error instanceof ErrorEvent) {
          errMsg = `Error : ${error.message}`;
        } else {
          //server side
          errMsg = `Error Code : ${error.status}, Message: ${error.message}`;
        }
        return throwError(errMsg);
      })
    )
  }
}
