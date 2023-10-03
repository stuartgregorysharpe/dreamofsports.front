import { Component, OnInit } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CAuthService } from "src/app/common/services/auth.service";
import { CAthletRepository } from "src/app/common/services/repositories/athlet.repository";
import { CPostRepository } from "src/app/common/services/repositories/post.repository";
import { IAthletOut } from "src/app/model/entities/athlet.out.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { IUserPost } from "src/app/model/entities/user.post.interface";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "post-list",
    templateUrl: "post-list.component.html",
    styleUrls: ["../../../../common/styles/users.scss"],
})
export class CPostList implements OnInit {
    public posts: IUserPost[] = null;
    public loading: boolean = false;
    public loadingMore: boolean = false;    
    private sortDir: number = -1;
    private part: number = 0;
    private chunkLength: number = 12;
    public exhausted: boolean = false;  
    private started_at: Date = null;

    constructor(
        private appService: CAppService,
        private postRepository: CPostRepository,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get words(): IWords {return this.appService.words;}

    public ngOnInit(): void {
        this.initPosts();
    }

    public async initPosts(): Promise<void> {
        try {
            this.loading = true;
            const chunk = await this.postRepository.loadChunk(this.part, this.chunkLength);     
            this.posts = chunk.data;
            this.exhausted = this.part + 1 >= chunk.pagesQuantity;  
            this.loading = false;
        } catch (err) {
            this.loading = false;
            this.appService.notifyError(err);
        }
    }

    public async onLoadMore(): Promise<void> {
        try {		
            if (this.exhausted) return;
            this.loadingMore = true;
            this.part++;
            const chunk = await this.postRepository.loadChunk(this.part, this.chunkLength);  
            this.posts = [...this.posts, ...chunk.data];                                         
            this.exhausted = this.part + 1 >= chunk.pagesQuantity;  
            this.loadingMore = false;		                
		} catch (err) {
			this.loadingMore = false;
			this.appService.notifyError(err);
		}
    }

    formatDate(date: Date): string {
        return new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
    }
}