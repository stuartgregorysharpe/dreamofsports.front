import { CEntity } from "./_entity";

export class CUserEmail extends CEntity {
    public user_id: number;
    public value: string;
    public pos: number;

    public init(pos: number): CUserEmail {
        this.value = "";
        this.pos = pos;
        return this;
    }
}