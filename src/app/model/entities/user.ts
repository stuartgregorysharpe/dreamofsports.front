import { TUserType } from "../dto/user.authdata.interface";
import { CEntity } from "./_entity";
import { CAthlet } from "./athlet";
import { CFirm } from "./firm";
import { CUserEmail } from "./user.email";
import { CUserImage } from "./user.image";
import { CUserLink } from "./user.link";
import { CUserOther } from "./user.other";
import { CUserPhone } from "./user.phone";
import { CUserSocial } from "./user.social";
import { CUserVideo } from "./user.video";

export class CUser extends CEntity {
    public type: TUserType;
    public lang_id: number;
    public email: string;
    public password: string;    
    public filled: boolean;
    public payed_until: Date;
    // relations
    public athlet: CAthlet;
    public firm: CFirm;
    public phones: CUserPhone[];
    public emails: CUserEmail[];
    public links: CUserLink[];
    public socials: CUserSocial[];
    public images: CUserImage[];
    public videos: CUserVideo[];
    public others: CUserOther[];
    public followers: any[];

    public build (o: Object): CUser {
        for (let field in o) {
            if (field === "payed_until") {
                if (!o[field]) this.payed_until = null;                
                const now = new Date();
                const payed_until = new Date(o[field]);
                this.payed_until = payed_until.getTime() > now.getTime() ? payed_until : null;
            } else if (field === "athlet") {
                this[field] = o[field] ? new CAthlet().build(o[field]) : null;
            } else if (field === "firm") {
                this[field] = o[field] ? new CFirm().build(o[field]) : null;
            } else if (field === "phones") {
                this[field] = o[field] ? o[field].map(c => new CUserPhone().build(c)) : [];
            } else if (field === "emails") {
                this[field] = o[field] ? o[field].map(c => new CUserEmail().build(c)) : [];
            } else if (field === "links") {
                this[field] = o[field] ? o[field].map(c => new CUserLink().build(c)) : [];
            } else if (field === "socials") {
                this[field] = o[field] ? o[field].map(c => new CUserSocial().build(c)) : [];
            } else if (field === "images") {
                this[field] = o[field] ? o[field].map(i => new CUserImage().build(i)) : [];
            } else if (field === "videos") {
                this[field] = o[field] ? o[field].map(v => new CUserVideo().build(v)) : [];
            } else if (field === "others") {
                this[field] = o[field] ? o[field].map(o => new CUserOther().build(o)) : [];
            } else {
                this[field] = o[field];
            }            
        }
        
        return this;
    }  
}
