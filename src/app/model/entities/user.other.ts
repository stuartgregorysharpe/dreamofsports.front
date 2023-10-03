import { CEntity } from "./_entity";

export class CUserOther extends CEntity {
    public user_id: number;
    public name: string;
    public url: string | File;
    public pos: number;
}   
