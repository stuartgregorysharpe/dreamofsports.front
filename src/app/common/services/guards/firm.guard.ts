import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CAuthService } from '../auth.service';

@Injectable()
export class CFirmGuard {    
    constructor (
        private authService: CAuthService,
        private router: Router,
    ) {}

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {  
        if (this.authService.authData?.type === "firm") {
            return true;
        }     

        this.router.navigateByUrl ("/");
        return false;
    }    
}
