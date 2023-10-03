import { IKeyValue } from "../keyvalue.interface";
import { IMultilangable } from "../multilangable.interface";

export interface IPage {
    readonly id: number;
    readonly parent_id: number;
    readonly slug: string;
    readonly img?: string;
    readonly name: IMultilangable;
    readonly content?: IMultilangable;
    readonly title?: IMultilangable;
    readonly description?: IMultilangable;
    readonly h1?: IMultilangable;
    // relations
    readonly children: IPage[];
    readonly words?: IPageWords;
}

export type IPageWords = IKeyValue<IMultilangable>;