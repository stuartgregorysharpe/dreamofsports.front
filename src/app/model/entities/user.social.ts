import { CEntity } from "./_entity";

export class CUserSocial extends CEntity {
    public user_id: number;
    public social_id: number;
    public value: string;
    public pos: number;

    public init(pos: number): CUserSocial {
        this.social_id = null;
        this.value = "";
        this.pos = pos;
        return this;
    }
}