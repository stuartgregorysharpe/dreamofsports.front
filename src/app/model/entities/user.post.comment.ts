import { CEntity } from "./_entity";
import { CUser } from "./user";
import { CUserPostAttachment } from "./user.post.attachment";

export class CUserPostComment extends CEntity {
    public user_id: number;
    public content: string;
    public created_at: Date;

    public init(): CUserPostComment {
        this.content = "";
        return this;
    }
}