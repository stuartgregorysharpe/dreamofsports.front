import { TUserType } from "./user.authdata.interface";

export interface IUserEnterByEmail {
    readonly lang_id: number;
    readonly type: TUserType;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly phoneNumber: string;
}
