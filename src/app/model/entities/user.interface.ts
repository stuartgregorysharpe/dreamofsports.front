import { TUserType } from "../dto/user.authdata.interface";
import { IEntity } from "./_entity.interface";
import { IAthlet } from "./athlet.interface";
import { IFirm } from "./firm.interface";
import { IUserEmail } from "./user.email.interface";
import { IUserImage } from "./user.image.interface";
import { IUserLink } from "./user.link.interface";
import { IUserPhone } from "./user.phone.interface";
import { IUserSocial } from "./user.social.interface";
import { IUserVideo } from "./user.video.interface";

export interface IUser extends IEntity {
    readonly type: TUserType;
    readonly lang_id: number;
    readonly email: string;
    readonly filled: boolean;
    readonly payed_until: string;
    // relations
    readonly athlet: IAthlet;
    readonly firm: IFirm;
    readonly phones: IUserPhone[];
    readonly emails: IUserEmail[];
    readonly links: IUserLink[];
    readonly socials: IUserSocial[];
    readonly images: IUserImage[];
    readonly videos: IUserVideo[];
}
