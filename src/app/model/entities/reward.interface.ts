import { IEntity } from "./_entity.interface";

export interface IReward extends IEntity {
    athlet_id: number;
    date: string;
    img: string;
    // relations
    translations: IRewardTranslation[];
}

export interface IRewardTranslation {
    id?: number;
    lang_id: number;
    reward_id?: number;
    name: string;    
}
