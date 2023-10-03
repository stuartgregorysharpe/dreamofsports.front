import { CEntity } from "./_entity";

export class CUserVideo extends CEntity {
    public user_id: number;
    public url: string | File;
    public pos: number;
}   
