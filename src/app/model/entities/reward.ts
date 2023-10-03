import { CTranslatableEntity } from "./_translatable.entity";
import { ILang } from "./lang.interface";
import { IRewardTranslation } from "./reward.interface";

export class CReward extends CTranslatableEntity<IRewardTranslation> {
    public athlet_id: number;
    public date: string;
    public img: string | File;
    // relations
    public translations: IRewardTranslation[];

    public init(ll: ILang[]): CReward {
        this.date = new Date().toISOString().slice(0, 10);
        this.translations = ll.map(l => ({lang_id: l.id, name: ""}));
        return this;
    }
}
