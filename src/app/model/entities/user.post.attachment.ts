import { CEntity } from "./_entity";

export class CUserPostAttachment extends CEntity {
    public post_id: number;
    public type: string;
    public file: string | File;
}   
