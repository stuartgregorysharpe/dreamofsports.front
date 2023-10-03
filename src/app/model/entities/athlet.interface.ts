import { IEntity } from "./_entity.interface";

export interface IAthlet extends IEntity {
    readonly user_id: number;
    readonly cat_id: number;
    readonly country_id: number;
    readonly img: string;
    readonly img_s: string;
    readonly birthdate: string;
    readonly gender: TGender;
    readonly height_meter: number;
    readonly height_foot: number;
    readonly weight_kg: number;
    readonly weight_pound: number;
    readonly no: string; 
    readonly category: any;
    readonly metrics: any;
    // relations
    readonly translations: IAthletTranslation[];
}

export interface IAthletTranslation {
    readonly id?: number;
    readonly lang_id: number;
    readonly athlet_id?: number;
    readonly firstname: string;
    readonly lastname: string;
    readonly region: string;
    readonly city: string;
    readonly bio: string;
    readonly team: string; 
    readonly role: string;
}

export type TGender = "m" | "f";
