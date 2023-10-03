import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CAuthService } from "src/app/common/services/auth.service";
import { CChatMessageRepository } from "src/app/common/services/repositories/chat.message.repository";
import { CSocketService } from "src/app/common/services/socket.service";
import { CChatMessage } from "src/app/model/entities/chat.message";
import { IChatMessage } from "src/app/model/entities/chat.message.interface";
import { CUser } from "src/app/model/entities/user";

@Component({
    selector: "messages",
    templateUrl: "messages.component.html",
})
export class CMessagesComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
    @Input() public chat_id;
    @ViewChild("container", {static: false}) private containerRef: ElementRef;
    // messages
    public messages: CChatMessage[] = [];
    public loading: boolean = false;
    public loadingMore: boolean = false;    
    protected sortBy: string = "created_at";
    protected sortDir: number = -1;
    protected part: number = 0;
    protected chunkLength: number = 10;
    public exhausted: boolean = false;  
    protected started_at: Date = null;
    // socket
    private lids: number[] = [];

    constructor(
        private appService: CAppService,
        private authService: CAuthService,
        private socketService: CSocketService,        
        private chatMessageRepository: CChatMessageRepository,
    ) {}

    get container(): HTMLElement {return this.containerRef.nativeElement;}
    get user(): CUser {return this.authService.user;}
    get scrolledToTop(): boolean {return this.container.scrollHeight - this.container.offsetHeight + this.container.scrollTop < 300;}
    get canLoadMore(): boolean {return !this.loadingMore && !this.exhausted && this.scrolledToTop;}  

    public ngOnInit(): void {
        this.onScroll = this.onScroll.bind(this);
        this.appService.isBrowser && this.initSocket();
    }

    public ngAfterViewInit(): void {
        this.container.addEventListener("scroll", this.onScroll);
    }
    
    public ngOnChanges(changes: SimpleChanges): void {
        this.initMessages();        
    }

    public ngOnDestroy(): void {
        this.destroySocket();
    }

    private initSocket(): void {
        this.lids.push(this.socketService.on(`new-message-for-user-${this.user.id}`, data => this.onMessage(data)));
    }

    private destroySocket(): void {
        this.socketService.off(this.lids);
    }

    private async initMessages(): Promise<void> {
        try {
            this.loading = true;
            this.part = 0;
            this.started_at = new Date(); // для предотвращения дублей в бесконечной загрузке при добавлении новых элементов после момента, когда первый кусок загружен.
            const filter = {chat_id: this.chat_id};
            const chunk = await this.chatMessageRepository.loadChunk(this.part, this.chunkLength, this.sortBy, this.sortDir, filter);                 
            this.messages = chunk.data;                 
            this.exhausted = this.part + 1 >= chunk.pagesQuantity;  
            this.loading = false;
        } catch (err) {
            this.loading = false;
            this.appService.notifyError(err);            
        }
    }

    private async onScroll(): Promise<void> {
        try {	
            if (!this.canLoadMore) return;
            this.loadingMore = true;
            this.part++;            
            const filter: any = {created_at_less: this.started_at, chat_id: this.chat_id};
            const chunk = await this.chatMessageRepository.loadChunk(this.part, this.chunkLength, this.sortBy, this.sortDir, filter);     
            this.messages = [...this.messages, ...chunk.data];                                         
            this.exhausted = this.part + 1 >= chunk.pagesQuantity;  
            this.loadingMore = false;		                
		} catch (err) {
			this.loadingMore = false;
			this.appService.notifyError(err);
		}
    }

    private onMessage(data: IChatMessage): void {
        if (data.chat_id !== this.chat_id) return;
        const message = new CChatMessage().build(data);
        this.messages.unshift(message);        
    }
}