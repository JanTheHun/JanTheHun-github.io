import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {

  apiKey: string;

  constructor() {
    this.apiKey = environment.API_KEY;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const clonedRequest = request.clone({
      setParams: {
        api_key: this.apiKey
      }
    });
    console.log(clonedRequest);
    return next.handle(clonedRequest);
  }
}
