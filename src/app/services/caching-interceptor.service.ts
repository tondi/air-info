import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler } from '@angular/common/http';

import { tap, share } from 'rxjs/operators';

import { RequestCache } from './request-cache.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
    constructor(private cache: RequestCache) { }
    requestsPending: Map<String, Observable<HttpEvent<any>>> = new Map();

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const cachedResponse = this.cache.get(req);
        return cachedResponse ? of(cachedResponse) : this.handleRequestPending(req, next);
    }

    handleRequestPending(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const sameRequest = this.requestsPending.get(req.url);
        return sameRequest ? 
            sameRequest : 
            this.requestsPending.set(req.url, this.sendRequest(req, next, this.cache).pipe(share())).get(req.url);
    }

    sendRequest(
        req: HttpRequest<any>,
        next: HttpHandler,
        cache: RequestCache
    ): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    cache.put(req, event);
                }
            })
        );
    }
}