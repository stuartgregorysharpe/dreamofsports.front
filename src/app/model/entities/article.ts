import { IMultilangable } from "../multilangable.interface";
import { CEntity } from "./_entity";
import { IArticleCat } from "./article.cat.interface";
import { IArticle } from "./article.interface";

export class CArticle extends CEntity {
    public id: number;
    public slug?: string;
    public date: Date | string;
    public img?: string;
    public img_s?: string;
    public name: IMultilangable;
    public content?: IMultilangable;
    public contentshort?: IMultilangable;
    public title?: IMultilangable;
    public description?: IMultilangable;
    public h1?: IMultilangable;
    // relations
    public cat?: IArticleCat;
    // helpers
    public formattedDate?: string = "";

    public build (o: IArticle): CArticle {
        for (let field in o) {
            if (field === "date") {
                this[field] = o[field] ? new Date(o[field]) : null;
            } else {
                this[field] = o[field];
            }
        }
        
        this.formattedDate = this.formatDate("date", true);
        return this;
    }
}
