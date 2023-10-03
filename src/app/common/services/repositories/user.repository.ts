import { Injectable } from '@angular/core';
import { CDataService } from '../data.service';
import { CUser } from 'src/app/model/entities/user';

@Injectable()
export class CUserRepository {
    constructor(private dataService: CDataService) {}    

    public loadMe(): Promise<CUser> {
        return new Promise((resolve, reject) => this.dataService
            .usersMe()
            .subscribe({
                next: res => res.statusCode === 200 ? resolve(new CUser().build(res.data)) : reject(res.statusCode), 
                error: err => reject(err.message),
            }));
    }

    public updateMe(user: CUser): Promise<number> {
        const fd = this.buildFormData(user);
        return new Promise((resolve, reject) => 
            this.dataService
                .usersUpdateMe(fd)
                .subscribe({
                    next: res => resolve(res.statusCode), 
                    error: err => reject(err.message)
                }));
    }

    public deleteMe(password: string): Promise<number> {
        return new Promise((resolve, reject) => 
            this.dataService
                .usersDeleteMe(password)
                .subscribe({
                    next: res => resolve(res.statusCode), 
                    error: err => reject(err.message)
                }));
    }

    ////////////////
    // utils
    ////////////////

    private buildFormData(x: CUser): FormData {
		const fd = new FormData();
        const data = (window as any).structuredClone(x); // deep copy, to prevent iface reaction for some rebuild :-)

		data.athlet.img instanceof File && fd.append(`athlet_img`, data.athlet.img as unknown as File);
		data.firm.img instanceof File && fd.append(`firm_img`, data.firm.img as unknown as File);
		
		for (let image of data.images) {
			if (image.url instanceof File) {
				fd.append("images", image.url);
				image.url = image.url.name; // чтобы потом связать, где какое вложение
			}
		}

		for (let video of data.videos) {
			if (video.url instanceof File) {
				fd.append("videos", video.url);
				video.url = video.url.name; // чтобы потом связать, где какое вложение
			}
		}

		for (let other of data.others) {
			if (other.url instanceof File) {
				fd.append("others", other.url);
				other.url = other.url.name; // чтобы потом связать, где какое вложение
			}
		}

        for (let reward of data.athlet.rewards) {
            if (reward.img instanceof File) {
                fd.append("rewards", reward.img);
                reward.img = reward.img.name; // чтобы потом связать, где какое вложение
            }
        }

		fd.append("data", JSON.stringify(data));
		return fd;
	}

    public ifFollow(
      user_id: number,
      type: string
    ): Promise<boolean> {
      return new Promise((resolve, reject) => {
        this.dataService.ifFollow(user_id, type).subscribe({
          next: (res) =>
            res.statusCode === 200
              ? resolve(res.data)
              : reject(res.statusCode),
          error: (err) => reject(err.message),
        })
      })
    }
}
