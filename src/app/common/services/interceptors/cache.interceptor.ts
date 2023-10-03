import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';
import { REQUEST } from "@nguniversal/express-engine/tokens";
import { Request } from "express";

const STATE_KEY_PREFIX = 'http_requests:';

@Injectable()
export class CCacheInterceptor implements HttpInterceptor {
	constructor (
		private transferState: TransferState,
		@Inject(PLATFORM_ID) private platformId: string,
		@Optional() @Inject(REQUEST) private request: Request, 
	) {}

	public intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// если на одной странице встречаются запросы с одинаковыми url, но разными body, то можно дописать к идентификатору запроса JSON.stringify(req.body)
		// иначе будет путаница
		const key = makeStateKey<HttpResponse<object>>(STATE_KEY_PREFIX + req.url + ":" + JSON.stringify(req.body)); 
		//const key = makeStateKey<HttpResponse<object>>(STATE_KEY_PREFIX + req.url);

		if (isPlatformBrowser(this.platformId)) {   
      		const cachedResponse = this.transferState.get(key, null); // Try reusing transferred response from server

			if (cachedResponse) {
        		this.transferState.remove(key); // cached response should be used for the very first time				
				return of(new HttpResponse({body: cachedResponse.body, status: 200, statusText: 'OK (from server)'})); // headers are not transferred by current implementation.
      		}
	  
			return next.handle(req);
		} else {  
			const headers = req.headers.set('vio-ip', this.request.headers["x-forwarded-for"]);
			const clonedRequest = req.clone({headers}); // add client IP to request IP (sometimes used for geo purposes)  	
			return next.handle(clonedRequest).pipe(tap(event => { // Try saving response to be transferred to browser				
				if (event instanceof HttpResponse && (event.status == 200 || event.status == 201)) { // Only body is preserved as it is and it seems sufficient for now. It would be nice to transfer whole response, but http response is not a POJO and it needs custom serialization/deserialization.
                    const response = {body: event.body};
          			this.transferState.set(key, response);
        		}				
			}));
		}
	}
}
