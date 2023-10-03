import { CEntity } from "./_entity";
import { CUser } from "./user";
import { CUserPostAttachment } from "./user.post.attachment";

export class CUserPost extends CEntity {
    public user_id: number;
    public title: string;
    public content: string;
    public created_at: Date;
    public attachment: CUserPostAttachment[];

    public init(): CUserPost {
        this.content = "";
        this.attachment = [];
        return this;
    }
}