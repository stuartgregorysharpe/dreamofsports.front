import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { cfg } from 'src/app/app.config';
import { CAppService } from 'src/app/common/services/app.service';
import { CAuthService } from 'src/app/common/services/auth.service';
import { CDataService } from 'src/app/common/services/data.service';
import { CPostRepository } from 'src/app/common/services/repositories/post.repository';
import { CUserRepository } from 'src/app/common/services/repositories/user.repository';
import { ILang } from 'src/app/model/entities/lang.interface';
import { CUserPost } from 'src/app/model/entities/user.post';
import { IUserPostAttachment } from 'src/app/model/entities/user.post.attachment.interface';
import { CUserPostComment } from 'src/app/model/entities/user.post.comment';
import { IUserPostComment } from 'src/app/model/entities/user.post.comment.interface';
import { IUserPost } from 'src/app/model/entities/user.post.interface';
import { IWords } from 'src/app/model/entities/words.interface';

@Component({
  selector: 'post',
  templateUrl: 'post.component.html',
  styleUrls: ['../../../../common/styles/users.scss'],
  providers: [MessageService, ConfirmationService]
})
export class CPost implements OnInit {
  @Input() public post: IUserPost = null;
  @Output() private onDelete: EventEmitter<string> = new EventEmitter();
  public items: MenuItem[] | undefined;
  public showComment = false;
  public responsiveOptions: any[] | undefined;
  public shareLinkVisible: boolean = false;
  public shareLinkValue: string = "";
  public myComment: string = "";
  public comments: IUserPostComment[] = [];
  public like: boolean = false;
  public follow: boolean = false;
  public subscribe: boolean = false;
  public save: boolean = false;
  public authorizeVisible:boolean = false;

  constructor(
    private appService: CAppService,
    private authService: CAuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dataService: CDataService,
    private postRepository: CPostRepository,
    private userRepository: CUserRepository
  ) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Save',
        escape: false,
        command: () => {
          this.toggleSave();
        },
      },
      {
        label: 'Complain',
        escape: false,
        command: () => {
        },
      },
      {
        label: 'Block',
        escape: false,
        command: () => {
          this.toggleBlock();
        },
      },
      {
        label: 'Delete',
        command: () => {
          if (!this.authService.authData) {
            this.authorizeVisible = true;
            return;
          }
          if (this.post.user_id === this.authService.authData?.id) {
            this.confirmationService.confirm({
              message: 'Are you sure that you want to proceed?',
              header: 'Confirmation',
              icon: 'pi pi-exclamation-triangle',
              accept: () => {
                this.delete().then(() => {
                  this.onDelete.emit(null);
                  this.messageService.add({ severity: 'info', summary: 'Delete', detail: 'Your post successfully deleted' });
                });
              },
              reject: (type: ConfirmEventType) => {
                switch (type) {
                  case ConfirmEventType.REJECT:
                    break;
                  case ConfirmEventType.CANCEL:
                    break;
                }
              }
            });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You can\'t delete other\'s post' });
          }
        },
      },
    ];
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    this.shareLinkValue = `${cfg.baseUrl}/post/${this.post.id}`;
    this.initData();
  }

  public async loadComments(): Promise<void> {
    try {
      const res = await this.postRepository.loadComments(this.post.id);
      this.comments = res;
    } catch (err) {

    }
  }

  public async initData(): Promise<void> {
    try {
      this.loadComments();
      const like = await this.postRepository.like(this.post.id, "like");
      this.like = like;
      const follow = await this.userRepository.ifFollow(this.post.user.id, "follow")
      this.follow = follow;
      this.subscribe = await this.userRepository.ifFollow(this.post.user_id, "subscribe");
      this.save = await this.postRepository.like(this.post.id, "save");
    } catch (err) {

    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  get telegramLink(): string { return `https://telegram.me/share/url?url=${this.shareLinkValue}` }
  get whatsappLink(): string { return `whatsapp://send?text=${this.shareLinkValue}` }
  get facebookLink(): string { return `https://www.facebook.com/sharer/sharer.php?u=${this.shareLinkValue}` }

  get lang(): ILang { return this.appService.lang; }
  get langs(): ILang[] { return this.appService.langs; }
  get words(): IWords { return this.appService.words; }

  get userImg(): string {
    if (this.post.user.type === "athlet") {
      return this.post.user.athlet.img ? `${cfg.supabaseUrl}/images/users/${this.post.user.athlet.img_s}` : '/images/default-avatar.jpg';
    } else {
      return this.post.user.firm.img ? `${cfg.supabaseUrl}/images/users/${this.post.user.firm.img_s}` : '/images/default-avatar.jpg';
    }
  }

  get userName(): string {
    if (this.post.user.type === "athlet") {
      const translation = this.post.user.athlet.translations.find((t) => t.lang_id === this.lang.id);
      return `${translation?.firstname} ${translation?.lastname}`
    } else {
      const translation = this.post.user.firm.translations.find((t) => t.lang_id === this.lang.id);
      return translation?.name;
    }
  }

  get srcMyImage(): string {
    if (this.authService.user?.type === "athlet") {
      return this.authService.user?.athlet.img ? `${cfg.supabaseUrl}/images/users/${this.authService.user?.athlet.img_s}` : '/images/default-avatar.jpg';
    } else {
      return this.authService.user?.firm.img ? `${cfg.supabaseUrl}/images/users/${this.authService.user?.firm.img_s}` : '/images/default-avatar.jpg';
    }
  }

  get authorized(): boolean {
    return !!this.authService.authData;
  }

  public commentImage(c: IUserPostComment): string {
    if (c.user?.type == "athlet") {
      return c.user?.athlet.img ? `${cfg.supabaseUrl}/images/users/${c.user?.athlet.img_s}` : '/images/default-avatar.jpg';
    } else if (c.user?.type == "firm") {
      return c.user?.firm.img ? `${cfg.supabaseUrl}/images/users/${c.user?.firm.img_s}` : '/images/default-avatar.jpg';
    } else {
      return "fan";
    }
  }

  public commentUserName(c: IUserPostComment): string {
    if (c.user.type === "athlet") {
      const translation = c.user.athlet.translations.find((t) => t.lang_id === this.lang.id);
      return `${translation?.firstname} ${translation?.lastname}`
    } else {
      const translation = c.user.firm.translations.find((t) => t.lang_id === this.lang.id);
      return translation?.name;
    }
  }

  public toggleComment(): void {
    this.showComment = !this.showComment;
  }

  public getUrl(attachment: IUserPostAttachment): string {
    const type = attachment.type;
    switch (type) {
      case "image": case "video":
        return typeof (attachment.file) === "string" ?
          `${cfg.supabaseUrl}/attachment/post/${attachment.file}` :
          URL.createObjectURL(attachment.file as File);
      case "youtube":
        return attachment.file as string;
    }
    return "";
  }

  public showShareLink(): void {
    this.shareLinkVisible = true;
  }

  public closeShareLink(): void {
    this.shareLinkVisible = false;
  }

  public copyShareLink(): void {
    navigator.clipboard.writeText(this.shareLinkValue).then(() => {
      this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Share link copied to your clipboard' });
      this.shareLinkVisible = false;
    }).catch(() => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to copy the link' });
    });
  }

  public saveComment(): void {
    this.addComment().then((data) => {
      this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Your comment added' });
      this.myComment = "";
      this.loadComments();
    });
  }

  public addComment(): Promise<IUserPostComment> {
    const fd: CUserPostComment = new CUserPostComment().init();
    fd.content = this.myComment;
    return new Promise((resolve, reject) =>
      this.dataService.commentCreate(this.post.id, fd).subscribe({
        next: (res) =>
          [200, 201].includes(res.statusCode)
            ? resolve(res.data)
            : reject(res.statusCode),
        error: (err) => reject(err.message),
      })
    );
  }

  public sendToggleLike(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.dataService.toggleLike(this.post.id).subscribe({
        next: (res) =>
          [200, 201].includes(res.statusCode)
            ? resolve(res.data)
            : reject(res.statusCode),
        error: (err) => reject(err.message),
      })
    });
  }

  public toggleLike(): void {
    if (!this.authService.authData) {
      this.authorizeVisible = true;
      return;
    }
    this.sendToggleLike().then((data) => {
      this.like = data;
      if (data) {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'You set the post as your like.' });
      } else {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'You removed the post from your like.' });
      }
    })
  }

  public sendToggleSave(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.dataService.toggleSave(this.post.id).subscribe({
        next: (res) =>
          [200, 201].includes(res.statusCode)
            ? resolve(res.data)
            : reject(res.statusCode),
        error: (err) => reject(err.message),
      })
    });
  }

  public toggleSave(): void {
    if (!this.authService.authData) {
      this.authorizeVisible = true;
      return;
    }
    this.sendToggleSave().then((data) => {
      this.save = data;
      if (data) {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'You saved the post.' });
      } else {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'You removed the post from your gallery.' });
      }
    })
  }

  public sendToggleFollow(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.dataService.toggleFollow(this.post.user.id).subscribe({
        next: (res) =>
          [200, 201].includes(res.statusCode)
            ? resolve(res.data)
            : reject(res.statusCode),
        error: (err) => reject(err.message),
      })
    });
  }

  public toggleFollow(): void {
    if (!this.authService.authData) {
      this.authorizeVisible = true;
      return;
    }
    this.sendToggleFollow().then((data) => {
      this.follow = data;
      if (data) {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: `You followed ${this.userName}` });
      } else {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: `You unfollowed ${this.userName}` });
      }
    })
  }

  public sendToggleSubscribe(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.dataService.toggleSubscribe(this.post.user.id).subscribe({
        next: (res) =>
          [200, 201].includes(res.statusCode)
            ? resolve(res.data)
            : reject(res.statusCode),
        error: (err) => reject(err.message),
      })
    });
  }

  public toggleSubscribe(): void {
    if (!this.authService.authData) {
      this.authorizeVisible = true;
      return;
    }
    this.sendToggleSubscribe().then((data) => {
      this.subscribe = data;
      if (data) {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: `You subscribed on ${this.userName}` });
      } else {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: `You unsubscribed on ${this.userName}` });
      }
    })
  }

  public toggleBlock(): Promise<void> {
    if (!this.authService.authData) {
      this.authorizeVisible = true;
      return new Promise((resolve, reject) => {
        reject("Not authorized");
      });
    }
    return new Promise((resolve, reject) => {
      this.dataService.blockPost(this.post.id).subscribe({
        next: (res) =>
          [200, 201].includes(res.statusCode)
            ? resolve(res.data)
            : reject(res.statusCode),
        error: (err) => reject(err.message),
      })
    });
  }

  public delete(): Promise<void> {
    if (!this.authService.authData) {
      this.authorizeVisible = true;
      return new Promise((resolve, reject) => {
        reject("Not authorized");
      });
    }
    return new Promise((resolve, reject) => {
      this.dataService.deletePost(this.post.id).subscribe({
        next: (res) =>
          [200, 201].includes(res.statusCode)
            ? resolve(res.data)
            : reject(res.statusCode),
        error: (err) => reject(err.message),
      })
    });
  }
}
