import { IEntity } from "./_entity.interface";

export interface IUserImage extends IEntity {
    readonly user_id: number;
    readonly url: string;
    readonly pos: number;
}   
