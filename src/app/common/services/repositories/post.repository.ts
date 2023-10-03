import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { CUserPost } from 'src/app/model/entities/user.post';
import { IUserPost } from 'src/app/model/entities/user.post.interface';
import { CChunk } from 'src/app/model/dto/chunk';
import { IGetList } from 'src/app/model/dto/getlist.interface';
import { IUserPostComment } from 'src/app/model/entities/user.post.comment.interface';

@Injectable()
export class CPostRepository {
  constructor(private dataService: CDataService) { }

  public create(post: CUserPost): Promise<CUserPost> {
    const fd = new FormData();
    const data = (window as any).structuredClone(post); // deep copy, to prevent iface reaction for some rebuild :-)

    for (let field in data) {
      if (data[field] instanceof File) {
        fd.append(field, data[field] as unknown as File);
      }
    }

    fd.append('data', JSON.stringify(data));

    return new Promise((resolve, reject) =>
      this.dataService.postCreate(fd).subscribe({
        next: (res) =>
          res.statusCode === 201
            ? resolve(new CUserPost().build(res.data))
            : reject(res.error),
        error: (err) => reject(err.message),
      })
    );
  }

  public loadChunk(
    part: number = 0,
    chunkLength: number = 10
  ): Promise<CChunk<IUserPost>> {
    const dto: IGetList = { from: part * chunkLength, q: chunkLength, sortBy: "created_at", sortDir: 0 };
    return new Promise((resolve, reject) =>
      this.dataService.postChunk(dto).subscribe({
        next: (res) =>
          res.statusCode === 200
            ? resolve(
              new CChunk<IUserPost>(
                res.data,
                res.elementsQuantity,
                res.pagesQuantity
              )
            )
            : reject(res.statusCode),
        error: (err) => reject(err.message),
      })
    );
  }

  public loadComments(
    post_id: number
  ): Promise<IUserPostComment[]> {
    return new Promise((resolve, reject) =>
      this.dataService.getComments(post_id).subscribe({
        next: (res) =>
          res.statusCode === 200
            ? resolve(res.data)
            : reject(res.statusCode),
        error: (err) => reject(err.message),
      })
    );
  }

  public like(
    post_id: number,
    type: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.dataService.ifLike(post_id, type).subscribe({
        next: (res) =>
          res.statusCode === 200
            ? resolve(res.data)
            : reject(res.statusCode),
        error: (err) => reject(err.message),
      })
    })
  }
}
