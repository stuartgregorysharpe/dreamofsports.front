import { Inject, Injectable, Optional } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CAuthService } from '../auth.service';
import { CAppService } from '../app.service';
import { CCookieService } from '../cookie.service';
import { REQUEST } from '@nguniversal/express-engine/tokens';

@Injectable()
export class CAuthGuard {   
    private blockedUrl: string = null;

    constructor (
        private authService: CAuthService,
        private appService: CAppService,
        private cookieService: CCookieService,
        private router: Router,
        @Optional() @Inject(REQUEST) private request: Request, 
    ) 
    {
        this.init();
    }

    private init(): void {
        this.blockedUrl = this.cookieService.getItem("blockedUrl") || null;
    }

    public getBlockedUrl(): string {
        const blockedUrl = this.blockedUrl;

        // reset after usage
        if (this.blockedUrl) {
            this.cookieService.removeItem("blockedUrl"); 
            this.blockedUrl = null;
        }
        
        return blockedUrl;
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {  
        if (this.authService.authData) {
            return true;
        }     

        const urlParts = this.request ? this.request.url.split("/") : window.location.pathname.split("/");
        urlParts[2] === "account" && this.router.navigateByUrl(`/`); // при прямом вводе урла /:lang/account перебрасываем на главную
        this.blockedUrl = state.url;
        this.cookieService.setItem("blockedUrl", this.blockedUrl);
        this.appService.popupLoginActive = true;
        return false;
    }    
}
