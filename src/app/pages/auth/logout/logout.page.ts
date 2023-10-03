import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Timeout } from "src/app/common/decorators/timeout";
import { CAppService } from "src/app/common/services/app.service";
import { CAuthService } from "src/app/common/services/auth.service";

@Component({
    selector: "logout-page",
    template: "",
})
export class CLogoutPage implements OnInit {
    constructor(
        private authService: CAuthService,
        private appService: CAppService,
        private router: Router,        
    ) {}

    @Timeout(1)
    public async ngOnInit(): Promise<void> {                
        this.authService.logout();            
        this.router.navigateByUrl(`/${this.appService.lang.slug}`);
    }
}