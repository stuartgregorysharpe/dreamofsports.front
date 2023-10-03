import { Inject, Injectable, Optional } from "@angular/core";
import { REQUEST, RESPONSE } from "@nguniversal/express-engine/tokens";
import { Request, Response } from "express";
import { IKeyValue } from "src/app/model/keyvalue.interface";
import { CAppService } from "./app.service";

@Injectable()
export class CCookieService {
    private cookies: IKeyValue<string> = {};

    constructor(
        @Optional() @Inject(REQUEST) private req: Request<any>,
        @Optional() @Inject(RESPONSE) private res: Response<any>,
        private appService: CAppService,
    ) 
    {
        this.init();
    }

    private init(): void {
        const raw = this.appService.isBrowser ? document.cookie : this.req.headers.cookie;
        if (!raw) return;
        const entries = raw.split('; ');
        
        for (let entry of entries) {
            const parts = entry.split("=");
            this.cookies[parts[0]] = decodeURIComponent(parts[1]);
        }
    }

    public getItem(name: string): string {
        return this.cookies[name];
    }

    public setItem(name: string, value: string, maxAge: number = 999999999, path: string = '/'): void {
        const cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=${path}`;        
        this.appService.isBrowser ? 
            (document.cookie = cookie) : 
            this.res.cookie(name, value, { path, maxAge, encode: String });        
    }

    public removeItem(name: string): void {
        this.setItem(name, '', -1);
    }
}
