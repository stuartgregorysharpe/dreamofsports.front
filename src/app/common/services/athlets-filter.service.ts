import { Injectable } from "@angular/core";
import { TGender } from "src/app/model/entities/athlet.interface";

export interface IAthletsFilter {
    cat_slug?: string;
    country_id?: number; 
    age?: number[];
    top?: boolean;
    gender?: TGender;
}

@Injectable()
export class CAthletsFilterService {
    public filter: IAthletsFilter = {};
}
