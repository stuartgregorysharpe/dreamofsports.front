import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CDataService } from 'src/app/common/services/data.service';
import { CAppService } from 'src/app/common/services/app.service';
import { CUserPost } from 'src/app/model/entities/user.post';

@Component({
  selector: 'post-page',
  templateUrl: './post.component.html'
})
export class PostComponent {

  public showNewDialog: boolean = false;
  public post: CUserPost = new CUserPost().init();
  public isSaving: boolean = false;

  constructor(
    private dataService: CDataService,
    private appService: CAppService,
    public translate: TranslateService
  ){}

  public async savePost(): Promise<CUserPost> {
    
		const fd = new FormData();
    const data = (window as any).structuredClone(this.post); // deep copy, to prevent iface reaction for some rebuild :-)

    for (let attach of data.attachment) {
      if (attach.url instanceof File) {
        fd.append("attachment", attach.url);
        attach.url = attach.url.name; // чтобы потом связать, где какое вложение
      }
    }
		fd.append("data", JSON.stringify(data));
    return new Promise((resolve, reject) => 
        this.dataService
            .postCreate(fd)
            .subscribe({
                next: res => [200,201].includes(res.statusCode) ? resolve(res.data) : reject(res.statusCode),
                error: err => reject(err.message),
            }));
  }
}
