import { IMultilangable } from "../multilangable.interface";

export interface IEmployee {
    readonly id: number;
    readonly name: IMultilangable;
    readonly post: IMultilangable;
    readonly img: string;
}
