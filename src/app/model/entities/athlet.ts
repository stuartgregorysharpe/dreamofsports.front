import { CTranslatableEntity } from "./_translatable.entity";
import { TGender, IAthletTranslation } from "./athlet.interface";
import { CReward } from "./reward";

export class CAthlet extends CTranslatableEntity<IAthletTranslation> {
    public user_id: number;
    public cat_id: number;
    public category: any;
    public country_id: number;
    public img: string | File;
    public img_s: string;
    public birthdate: string;
    public gender: TGender;
    public height_meter: number;
    public height_foot: number;
    public weight_kg: number;
    public weight_pound: number;
    public no: string; 
    public metrics: any;
    public sub_type: string;
    // relations
    public translations: IAthletTranslation[];
    public rewards: CReward[];
    // helpers
    public _name: string = "";
    public _shortname: string = "";

    public build(o: Object): CAthlet {
        for (let field in o) {
            if (field === "rewards") {
                this[field] = o[field] ? o[field].map(o => new CReward().build(o)) : [];
            } else {
                this[field] = o[field];
            }            
        }

        const t = this.translation(1);
        const firstname = t.firstname || "";
        const lastname = t.lastname || "";
        this._name = [firstname, lastname].filter(p => p.length).join(" ");
        const letter1 = firstname.length ? firstname[0] : "";
        const letter2 = lastname.length ? lastname[0] : "";
        this._shortname = `${letter1}${letter2}`;
        return this;
    }
}
