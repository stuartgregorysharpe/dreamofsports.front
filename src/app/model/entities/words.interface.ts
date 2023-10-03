import { IKeyValue } from "../keyvalue.interface";
import { IMultilangable } from "../multilangable.interface";

export type IWords = IKeyValue<IKeyValue<IMultilangable>>;
