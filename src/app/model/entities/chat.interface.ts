import { IMultilangable } from "../multilangable.interface";

export interface IChat {
    id: number;
    name: IMultilangable;
    shortname: IMultilangable;
    img: string;
    unread: number;
}
