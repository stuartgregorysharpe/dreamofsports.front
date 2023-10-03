import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CAuthService } from '../auth.service';

@Injectable()
export class CAthletGuard {    
    constructor (
        private authService: CAuthService,
        private router: Router,
    ) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {  
        if (this.authService.authData?.type === "athlet") {
            return true;
        }     

        this.router.navigateByUrl ("/");
        return false;
    }    
}
