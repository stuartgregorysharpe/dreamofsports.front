import { CTranslatableEntity } from "./_translatable.entity";
import { IFirmTranslation } from "./firm.interface";

export class CFirm extends CTranslatableEntity<IFirmTranslation> {
    public user_id: number;
    public img: string | File;
    public img_s: string;
    public reg_no: string;
    public reg_date: string;
    public reg_country_id: number;
    public fact_country_id: number;
    // relations
    public translations: IFirmTranslation[];
    // helpers
    public _name: string = "";
    public _shortname: string = "";

    public build(o: Object): CFirm {
        super.build(o);
        const t = this.translation(1);
        this._name = t.name;
        this._shortname = this._name.length ? this._name[0] : "";
        return this;
    }
}