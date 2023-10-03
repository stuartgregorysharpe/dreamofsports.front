import { IMultilangable } from "../multilangable.interface";
import { TGender } from "./athlet.interface";
import { ICat } from "./cat.interface";
import { ICountry } from "./country.interface";

// "athlet out" - объект для просмотра посетителями
export interface IAthletOut {
    id: number;
    top: boolean;
    favorite?: boolean;
    img?: string;
    img_s?: string;
    birthdate?: string;
    age?: number;
    gender?: TGender;
    height_meter?: number;
    height_foot?: number;
    weight_kg?: number;
    weight_pound?: number;
    no?: string; 
    firstname: IMultilangable;
    lastname: IMultilangable;
    region?: IMultilangable;
    city?: IMultilangable;
    bio?: IMultilangable;
    team?: IMultilangable; 
    role?: IMultilangable;
    // relations
    cat?: ICat;
    country?: ICountry;
    phones?: IAthletOutPhone[];
    emails?: IAthletOutEmail[];
    links?: IAthletOutLink[];
    socials?: IAthletOutSocial[];
    images?: IAthletOutImage[];
    videos?: IAthletOutVideo[];
    others?: IAthletOutOther[]; 
    rewards?: IAthletOutReward[];
}

export interface IAthletOutPhone {
    id: number;
    value: string;
}

export interface IAthletOutEmail {
    id: number;
    value: string;
}

export interface IAthletOutLink {
    id: number;
    value: string;
}

export interface IAthletOutSocial {
    id: number;
    value: string;
    img: string;
}

export interface IAthletOutImage {
    id: number;
    url: string;
}

export interface IAthletOutVideo {
    id: number;
    url: string;
}

export interface IAthletOutOther {
    id: number;
    url: string;
    name: string;
}

export interface IAthletOutReward {
    id: number;
    date: string;
    img: string;
    name: IMultilangable;
}