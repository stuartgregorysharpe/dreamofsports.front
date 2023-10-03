import { TUserType } from "./user.authdata.interface";

export interface IUserRegister {
    readonly lang_id: number;
    readonly type: TUserType;
    readonly sub_type: string;
    readonly email: string;
    readonly code: string;
    readonly password: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly phoneNumber: string;
}
