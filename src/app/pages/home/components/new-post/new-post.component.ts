import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { cfg } from 'src/app/app.config';
import { CAppService } from 'src/app/common/services/app.service';
import { CAuthService } from 'src/app/common/services/auth.service';
import { CDataService } from 'src/app/common/services/data.service';
import { CPostRepository } from 'src/app/common/services/repositories/post.repository';
import { CUploadService } from 'src/app/common/services/upload.service';
import { ILang } from 'src/app/model/entities/lang.interface';
import { ISettings } from 'src/app/model/entities/settings.interface';
import { CUserImage } from 'src/app/model/entities/user.image';
import { CUserPost } from 'src/app/model/entities/user.post';
import { CUserPostAttachment } from 'src/app/model/entities/user.post.attachment';
import { IWords } from 'src/app/model/entities/words.interface';

@Component({
  selector: 'new-post',
  templateUrl: 'new-post.component.html',
  styleUrls: ['../../../../common/styles/users.scss'],
  providers: [MessageService]
})
export class CNewPost {
  @ViewChild('textarea') textarea: ElementRef;
  @Output() private onNew: EventEmitter<string> = new EventEmitter();
  public post: CUserPost = new CUserPost().init();
  public loading: boolean = false;
  public loadingMore: boolean = false;
  private attachmentLimit: number = 5;
  public previewFile: string = null;
  public viewerActive: boolean = false;
  public previewType: string = null;
  public youtubeDialogVisible: boolean = false;
  public youtubeLink: string = "";

  constructor(
    private appService: CAppService,
    private postRepository: CPostRepository,
    private dataService: CDataService,
    private authService: CAuthService,
    private messageService: MessageService,
    private translate: TranslateService,
    private uploadService: CUploadService,
  ) { }

  get lang(): ILang {
    return this.appService.lang;
  }
  get words(): IWords {
    return this.appService.words;
  }

  get authorized(): boolean {
    return !!this.authService.authData;
  }

  get notFan(): boolean {
    return this.authService.authData && this.authService.authData.type !== "fan";
  }

  get userImg(): string {
    if (this.authService.user?.type === "athlet") {
      return this.authService.user?.athlet.img ? `${cfg.supabaseUrl}/images/users/${this.authService.user?.athlet.img_s}` : '/images/default-avatar.jpg';
    } else {
      return this.authService.user?.firm.img ? `${cfg.supabaseUrl}/images/users/${this.authService.user?.firm.img_s}` : '/images/default-avatar.jpg';
    }
  }

  adjustTextareaHeight(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  public addPost(): void {
    this.savePost().then((data) => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
      this.post.init();
      this.onNew.emit(null);
    }).catch((error) => {

    });
  }

  public async savePost(): Promise<CUserPost> {
    const fd = new FormData();
    const data = (window as any).structuredClone(this.post); // deep copy, to prevent iface reaction for some rebuild :-)

    for (let attach of data.attachment) {
      if (attach.file instanceof File) {
        fd.append('attachment', attach.file);
        attach.file = attach.file.name; // чтобы потом связать, где какое вложение
      } else {
        fd.append('attachment', attach.file);
      }
    }
    fd.append('data', JSON.stringify(data));
    return new Promise((resolve, reject) =>
      this.dataService.postCreate(fd).subscribe({
        next: (res) =>
          [200, 201].includes(res.statusCode)
            ? resolve(res.data)
            : reject(res.statusCode),
        error: (err) => reject(err.message),
      })
    );
  }

  public async loadCertificate(): Promise<void> {
    try {
      const selectedFiles = await this.uploadService.selectFiles(true, "other") as File[];
      const limit = this.attachmentLimit - this.post.attachment.length;
      const mustRemove = selectedFiles.length - limit;
      const files = mustRemove > 0 ? selectedFiles.slice(0, -mustRemove) : selectedFiles;

      for (let f of files) {
        const attachment = new CUserPostAttachment();
        attachment.type = "others";
        attachment.file = f;
        this.post.attachment.push(attachment);
      }
    } catch (err) {
    }
  }

  public async loadImages(): Promise<void> {
    try {
      const selectedFiles = await this.uploadService.selectFiles(true, "image") as File[];
      const limit = this.attachmentLimit - this.post.attachment.length;
      const mustRemove = selectedFiles.length - limit;
      const files = mustRemove > 0 ? selectedFiles.slice(0, -mustRemove) : selectedFiles;

      for (let f of files) {
        const attachment = new CUserPostAttachment();
        attachment.type = "image";
        attachment.file = f;
        this.post.attachment.push(attachment);
      }
    } catch (err) {
    }
  }

  public async loadVideo(): Promise<void> {
    try {
      const selectedFiles = await this.uploadService.selectFiles(true, "video") as File[];
      const limit = this.attachmentLimit - this.post.attachment.length;
      const mustRemove = selectedFiles.length - limit;
      const files = mustRemove > 0 ? selectedFiles.slice(0, -mustRemove) : selectedFiles;

      for (let f of files) {
        const attachment = new CUserPostAttachment();
        attachment.type = "video";
        attachment.file = f;
        this.post.attachment.push(attachment);
      }
    } catch (err) {
    }
  }

  public previewAttachment(i: number): void {
    const type = this.post.attachment[i].type;
    switch (type) {
      case "image": case "video":
        this.previewType = type === "image" ? "images" : "videos";
        this.previewFile = typeof (this.post.attachment[i].file) === "string" ?
          `${cfg.supabaseUrl}/attachment/post/${this.post.attachment[i].file}` :
          URL.createObjectURL(this.post.attachment[i].file as File);
        break;
      case "youtube":
        this.previewType = "videos";
        this.previewFile = this.post.attachment[i].file as string;
        break;
    }
    this.viewerActive = true;
  }

  public getUrl(attachment: CUserPostAttachment): string {
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

  public onDelete(i: number): void {
    this.post.attachment.splice(i, 1);
  }

  showYoutubeDialog() {
    this.youtubeDialogVisible = true;
  }

  addYoutube() {
    const attachment = new CUserPostAttachment();
    attachment.type = "youtube";
    attachment.file = this.youtubeLink;
    this.post.attachment.push(attachment);
    this.youtubeDialogVisible = false;
  }

}
