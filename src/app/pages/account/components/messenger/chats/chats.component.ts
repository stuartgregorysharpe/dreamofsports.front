import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { cfg } from "src/app/app.config";
import { CAppService } from "src/app/common/services/app.service";
import { CAuthService } from "src/app/common/services/auth.service";
import { CChatRepository } from "src/app/common/services/repositories/chat.repository";
import { CSocketService } from "src/app/common/services/socket.service";
import { IChat } from "src/app/model/entities/chat.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { CUser } from "src/app/model/entities/user";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "chats",
    templateUrl: "chats.component.html",
})
export class CChatsComponent implements OnInit, OnDestroy, OnChanges {
    @Input() public current_id: number;
    public chats: IChat[] = [];
    public filteredChats: IChat[] = null;
    public search: string = "";
    // socket
    private lids: number[] = [];

    constructor(
        private appService: CAppService,
        private socketService: CSocketService,
        private authService: CAuthService,   
        private chatRepository: CChatRepository,
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get langs(): ILang[] {return this.appService.langs;}
    get words(): IWords {return this.appService.words;}
    get supabaseUrl(): string {return cfg.supabaseUrl;}
    get user(): CUser {return this.authService.user;}
    
    public ngOnInit(): void {
        this.initChats();
        this.appService.isBrowser && this.initSocket();
    }

    public ngOnDestroy(): void {
        this.destroySocket();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.resetUnreadInCurrent();
    }

    private async initChats(): Promise<void> {
        try {
            this.chats = await this.chatRepository.loadAll();
            this.resetUnreadInCurrent();
            this.applyFilter();
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    private initSocket(): void {
        this.lids.push(this.socketService.on(`chat-update-for-user-${this.user.id}`, data => this.onChatUpdate(data)));
        this.lids.push(this.socketService.on(`chat-delete-for-user-${this.user.id}`, data => this.onChatDelete(data)));
    }

    private destroySocket(): void {
        this.socketService.off(this.lids);
    }

    private onChatUpdate(data: IChat): void {        
        const existed = this.chats.find(c => c.id === data.id);

        if (existed) {
            existed.id !== this.current_id ? (existed.unread = data.unread) : this.resetUnreadInCurrent();
            const index = this.chats.indexOf(existed);
            this.appService.moveArrayElement(this.chats, index, 0);            
        } else {
            this.chats.unshift(data);
        }        

        this.applyFilter();
    }

    private onChatDelete(data: number): void {
        const index = this.chats.findIndex(c => c.id === data);
        index !== -1 && this.chats.splice(index, 1);
        this.applyFilter();
    }

    private async resetUnreadInCurrent(): Promise<void> {
        try {
            if (!this.current_id) return; 
            const current = this.chats.find(c => c.id === this.current_id);
            current && (current.unread = 0);
            await this.chatRepository.resetUnread(this.current_id);
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public applyFilter(): void {
        this.filteredChats = [];

        for (let chat of this.chats) {
            for (let lang of this.langs) {
                if (chat.name[lang.slug]?.toLowerCase().includes(this.search.toLowerCase())) {
                    this.filteredChats.push(chat);
                    break;
                }
            }
        }        
    }

    public resetFilter(): void {
        this.search = "";
        this.applyFilter();
    }
}