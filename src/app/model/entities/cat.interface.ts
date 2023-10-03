import { IMultilangable } from "../multilangable.interface";

export interface ICat {
    readonly id: number;
    readonly slug: string;
    readonly name: IMultilangable;
    readonly title?: IMultilangable;
    readonly description?: IMultilangable;
    readonly h1?: IMultilangable;
    // helpers
    readonly _level?: number;
    readonly _shift?: string;
    readonly _hasChildren?: boolean;
}
