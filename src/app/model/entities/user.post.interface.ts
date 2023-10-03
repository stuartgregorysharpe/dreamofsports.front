import { IUser } from "./user.interface";
import { IUserPostAttachment } from "./user.post.attachment.interface";
import { IUserPostComment, IusePostLike } from "./user.post.comment.interface";

export class IUserPost {
    readonly id: number;
    readonly user_id: number;
    readonly content: string;
    readonly user: IUser;
    readonly created_at: Date;
    readonly attachment: IUserPostAttachment[];
    readonly comments: IUserPostComment[];
    readonly likes: IusePostLike[];
}