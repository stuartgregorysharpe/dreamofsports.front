import { Injectable } from "@angular/core";
import { IUserAuthData } from "src/app/model/dto/user.authdata.interface";
import { CAppService } from "./app.service";
import { CCookieService } from "./cookie.service";
import { CDataService } from "./data.service";
import { IUserLogin } from "src/app/model/dto/user.login.interface";
import { IUserRegister } from "src/app/model/dto/user.register.interface";
import { IUserVerify } from "src/app/model/dto/user.verify.interface";
import { IUserEnterByEmail } from "src/app/model/dto/user.enterbyemail.interface";
import { IUserRecover } from "src/app/model/dto/user.recover.interface";
import { IUserGetLinkedinEmail } from "src/app/model/dto/user.getlinkedinemail.interface";
import { CUser } from "src/app/model/entities/user";

@Injectable()
export class CAuthService {    
    public user: CUser = null;

    constructor(
        private dataService: CDataService,
        private appService: CAppService,
        private cookieService: CCookieService,
    ) 
    {
        const data = this.cookieService.getItem("authdata");
        data && this.init(JSON.parse(data));   
    }

    get authData(): IUserAuthData {return this.dataService.authData;}  
    set authData(v: IUserAuthData) {this.dataService.authData = v;}  
    
    private async init(data: IUserAuthData): Promise<void> {  
        try {
            this.authData = data;
            await this.loadMe();
        } catch (err) {
            this.appService.notifyError(err);
        }        
    }    
        
    public logout(): void {        
        this.authData = null;    
        this.cookieService.removeItem("authdata");                 
    }

    private save(): void {        
        this.cookieService.setItem("authdata", JSON.stringify(this.authData));
    }

    public login(dto: IUserLogin): Promise<number> {
        return new Promise((resolve, reject) => 
            this.dataService
                .usersLogin(dto)
                .subscribe({
                    error: err => reject(err.message),
                    next: res => {                
                        if (res.statusCode === 200) {    
                            this.init(res.data);             
                            this.save();                                        
                        }
                        resolve(res.statusCode);
                    }}));        
    }

    public register(dto: IUserRegister): Promise<number> {
        return new Promise((resolve, reject) => 
            this.dataService
                .usersRegister(dto)
                .subscribe({
                    error: err => reject(err.message),
                    next: res => {
                        if (res.statusCode === 201) {    
                            this.init(res.data);             
                            this.save();                                        
                        }
                        resolve(res.statusCode);
                    },    
                }));        
    }

    public enterByEmail(dto: IUserEnterByEmail): Promise<number> {
        return new Promise((resolve, reject) => 
            this.dataService
                .usersEnterByEmail(dto)
                .subscribe({
                    error: err => reject(err.message),
                    next: res => {
                        if ([200, 201].includes(res.statusCode)) {    
                            this.init(res.data);             
                            this.save();                                        
                        }
                        resolve(res.statusCode);
                    },    
                }));        
    }

    public verify(dto: IUserVerify): Promise<void> {
        return new Promise((resolve, reject) => 
            this.dataService
                .usersVerify(dto)
                .subscribe({
                    next: () => resolve(),
                    error: err => reject(err.message),
                }));
    }    

    public recover(dto: IUserRecover): Promise<number> {
        return new Promise((resolve, reject) => 
            this.dataService
                .usersRecover(dto)
                .subscribe({
                    error: err => reject(err.message),
                    next: res => resolve(res.statusCode),
                }));
    }

    public linkedinEmail(dto: IUserGetLinkedinEmail): Promise<string> {
        return new Promise((resolve, reject) => 
            this.dataService
                .usersLinkedinEmail(dto)
                .subscribe({
                    error: err => reject(err.message),
                    next: res => resolve(res.data),
                }));
    }
    
    public loadMe(): Promise<void> {
        return new Promise((resolve, reject) => 
            this.dataService
                .usersMe()
                .subscribe({
                    next: res => {
                        if (res.statusCode !== 200) {
                            reject(res.error);
                            return;
                        }

                        this.user = new CUser().build(res.data);
                        resolve();
                    }, 
                    error: err => reject(err.message),
                }));
    }  
}
