import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { cfg } from "src/app/app.config";
import { CAppService } from "src/app/common/services/app.service";
import { CAudioService } from "src/app/common/services/audio.service";
import { CAuthService } from "src/app/common/services/auth.service";
import { CChatMessageRepository } from "src/app/common/services/repositories/chat.message.repository";
import { CChatRepository } from "src/app/common/services/repositories/chat.repository";
import { CSocketService } from "src/app/common/services/socket.service";
import { IChatMessageCreate } from "src/app/model/dto/chat.message.create.interface";
import { IChat } from "src/app/model/entities/chat.interface";
import { IChatMessage } from "src/app/model/entities/chat.message.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { CUser } from "src/app/model/entities/user";
import { IWords } from "src/app/model/entities/words.interface";

@Component({
    selector: "messenger",
    templateUrl: "messenger.component.html",
    styleUrls: ["messenger.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class CMessengerComponent implements OnChanges, OnInit, OnDestroy {
    @Input() public chat_id: number;
    public chat: IChat = null;
    public newMsgContent: string = "";
    public menuActive: boolean = false;
    public chatsActive: boolean = false;
    // socket
    private lids: number[] = [];

    constructor(
        private appService: CAppService,
        private authService: CAuthService,     
        private socketService: CSocketService,   
        private audioService: CAudioService,
        private chatRepository: CChatRepository,
        private chatMessageRepository: CChatMessageRepository,
        private router: Router,        
    ) {}

    get lang(): ILang {return this.appService.lang;}
    get langs(): ILang[] {return this.appService.langs;}
    get words(): IWords {return this.appService.words;}
    get user(): CUser {return this.authService.user;}
    // get forbidden(): boolean {return !this.user || !this.user.payed_until || this.user.payed_until.getTime() < new Date().getTime();}
    get forbidden(): boolean {return false;}
    get supabaseUrl(): string {return cfg.supabaseUrl;}

    public ngOnInit(): void {
        this.appService.isBrowser && this.initSocket();
    }

    public ngOnDestroy(): void {
        this.destroySocket();
    }

    public ngOnChanges(changes: SimpleChanges): void {        
        this.initChat();  
        this.chatsActive = false; // close mobile chatslist      
    }

    private initSocket(): void {
        this.lids.push(this.socketService.on(`chat-delete-for-user-${this.user.id}`, data => this.onChatDelete(data)));
        this.lids.push(this.socketService.on(`new-message-for-user-${this.user.id}`, data => this.onMessage(data)));
    }

    private destroySocket(): void {
        this.socketService.off(this.lids);
    }

    private async initChat(): Promise<void> {
        try {
            this.chat = this.chat_id ? await this.chatRepository.loadOne(this.chat_id) : null;
        } catch (err) {            
            err === 404 ? this.router.navigateByUrl(`/${this.lang.slug}/errors/404`) : this.appService.notifyError(err);
        }
    }

    public async onSubmit(): Promise<void> {
        try {
            if (!this.newMsgContent.length) return;
            this.newMsgContent = this.newMsgContent.substring(0, 1000);
            const dto: IChatMessageCreate = {chat_id: this.chat_id, content: this.newMsgContent};
            this.newMsgContent = "";
            await this.chatMessageRepository.create(dto);
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    public onKeyUp(event: KeyboardEvent): void {
        if (event.key === "Enter" && !event.shiftKey) {
            this.newMsgContent = this.newMsgContent.trim();
            this.onSubmit();
        }
    }   
    
    // пришло сообщение - подать сигнал
    private onMessage(data: IChatMessage): void {
        data.user_id !== this.user.id && this.audioService.alertOnMessage();
    }

    // удалить беседу
    public async onDelete(): Promise<void> {
        try {
            this.menuActive = false;            
            if (!window.confirm(this.words["common"]?.["sure"]?.[this.lang.slug])) return;            
            await this.chatRepository.delete(this.chat_id);
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    // удалить беседу и заблокировать собеседника
    public async onDeleteAndBan(): Promise<void> {
        try {
            this.menuActive = false;            
            if (!window.confirm(this.words["common"]?.["sure"]?.[this.lang.slug])) return;            
            await this.chatRepository.deleteAndBan(this.chat_id);
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    // беседа была удалена
    public onChatDelete(data: number): void {
        this.chat_id === data && this.router.navigateByUrl(`/${this.lang.slug}/account/messenger`);
    }
}
