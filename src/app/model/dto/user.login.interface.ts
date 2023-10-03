import { TUserType } from "./user.authdata.interface";

export interface IUserLogin {
    readonly type: TUserType;
    readonly email: string;
    readonly password: string;    
}