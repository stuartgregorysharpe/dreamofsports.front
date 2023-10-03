import { IMultilangable } from "../multilangable.interface";
import { IArticleCat } from "./article.cat.interface";

export interface IArticle {
    readonly id: number;
    readonly slug?: string;
    readonly date: Date | string;
    readonly img?: string;
    readonly img_s?: string;
    readonly name: IMultilangable;
    readonly content?: IMultilangable;
    readonly contentshort?: IMultilangable;
    readonly title?: IMultilangable;
    readonly description?: IMultilangable;
    readonly h1?: IMultilangable;
    // relations
    readonly cat?: IArticleCat;
}
