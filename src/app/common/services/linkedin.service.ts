import { Injectable } from "@angular/core";
import { CAppService } from "./app.service";
import { TUserType } from "src/app/model/dto/user.authdata.interface";

@Injectable()
export class CLinkedinService {
    constructor(private appService: CAppService) {}
    
    get clientId(): string {return this.appService.settings["linkedin-client-id"];}

    public signIn(type: TUserType): void {   
        const redirect_uri = `${window.location.origin}/${this.appService.lang.slug}/auth/linkedin-entered/${type}`;
        const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.clientId}&redirect_uri=${redirect_uri}&scope=r_emailaddress`;
        const element = document.createElement("a");
        element.href = url;
        element.click();
    }
}
