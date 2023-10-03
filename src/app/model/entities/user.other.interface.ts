import { IEntity } from "./_entity.interface";

export interface IUserOther extends IEntity {
    readonly user_id: number;
    readonly name: string;
    readonly url: string;
    readonly pos: number;
}   
