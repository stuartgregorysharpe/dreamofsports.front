import { CEntity } from "./_entity";

export class CUserLink extends CEntity {
    public user_id: number;
    public value: string;
    public pos: number;

    public init(pos: number): CUserLink {
        this.value = "";
        this.pos = pos;
        return this;
    }
}