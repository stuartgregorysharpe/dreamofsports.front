import { Injectable } from "@angular/core";
import { CAppService } from "./app.service";
import { TUserType } from "src/app/model/dto/user.authdata.interface";

@Injectable()
export class CGoogleService {
    constructor(private appService: CAppService) {}
    
    get clientId(): string {return this.appService.settings["google-client-id"];}

    public signIn(type: TUserType): void {        
        const endpoint: string = 'https://accounts.google.com/o/oauth2/v2/auth';            
        const form: HTMLFormElement = document.createElement('form');
        form.setAttribute('method', 'GET');
        form.setAttribute('action', endpoint);            
        const params = {
            client_id: this.clientId,
            redirect_uri: `${window.location.origin}/${this.appService.lang.slug}/auth/google-entered/${type}`,
            scope: 'profile email',
            response_type: 'token',            
            prompt: "select_account",
            cookie_policy: "none",
        };    
        
        for (let p in params) {
            let input: HTMLInputElement = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            form.appendChild(input);
        }    
    
        document.body.appendChild(form);
        form.submit();
    }

    public getUserEmail(): Promise<string> {
        const token = this.buildToken();
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`);
            xhr.onreadystatechange = (e) => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        let res = JSON.parse(xhr.response);                        
                        resolve(res.email);
                    } else {
                        console.log(xhr.response);
                        reject(xhr.status);
                    }
                }
            };
            
            xhr.send(null);
        });        
    } 

    /////////////////
    // utils
    /////////////////

    public buildToken(): string {
        const fragmentString: string = window.location.hash.substring(1);        
        const regex: RegExp = /([^&=]+)=([^&]*)/g;
        let params: Object = {};        
        let m: RegExpExecArray = null;

        while (m = regex.exec(fragmentString)) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }

        return params["access_token"];
    }
}