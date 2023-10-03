import { Injectable } from "@angular/core";
import { filter, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IResponse } from "src/app/model/dto/response.interface";
import { ISettings } from "src/app/model/entities/settings.interface";
import { IWords } from "src/app/model/entities/words.interface";
import { ILang } from "src/app/model/entities/lang.interface";
import { IPage } from "src/app/model/entities/page.interface";
import { Router } from "@angular/router";
import { IUserAuthData } from "src/app/model/dto/user.authdata.interface";
import { cfg } from "src/app/app.config";
import { IFiles } from "src/app/model/entities/files.interface";
import { IEmployee } from "src/app/model/entities/employee.interface";
import { CMessage } from "src/app/model/entities/message";
import { IGetList } from "src/app/model/dto/getlist.interface";
import { IArticleCat } from "src/app/model/entities/article.cat.interface";
import { IUserLogin } from "src/app/model/dto/user.login.interface";
import { IUserRegister } from "src/app/model/dto/user.register.interface";
import { IUserVerify } from "src/app/model/dto/user.verify.interface";
import { IUserEnterByEmail } from "src/app/model/dto/user.enterbyemail.interface";
import { IUserRecover } from "src/app/model/dto/user.recover.interface";
import { IUserGetLinkedinEmail } from "src/app/model/dto/user.getlinkedinemail.interface";
import { IArticle } from "src/app/model/entities/article.interface";
import { IUser } from "src/app/model/entities/user.interface";
import { IKeyValue } from "src/app/model/keyvalue.interface";
import { ISocial } from "src/app/model/entities/social.interface";
import { ICatSimple } from "src/app/model/entities/cat.simple.interface";
import { ICountrySimple } from "src/app/model/entities/country.simple.interface";
import { IAthletOut } from "src/app/model/entities/athlet.out.interface";
import { ICat } from "src/app/model/entities/cat.interface";
import { IFirmOut } from "src/app/model/entities/firm.out.interface";
import { IChat } from "src/app/model/entities/chat.interface";
import { IChatMessageCreate } from "src/app/model/dto/chat.message.create.interface";
import { IChatMessage } from "src/app/model/entities/chat.message.interface";
import { ITariff } from "src/app/model/entities/tariff.interface";
import { IPaysystem } from "src/app/model/entities/paysystem.interface";
import { IComplaintCreate } from "src/app/model/dto/complaint.create.interface";
import { IStripePaymentCreate } from "src/app/model/dto/stripe.payment.create.interface";
import { INpPaymentCreate } from "src/app/model/dto/np.payment.create.interface";
import { CUserPost } from "src/app/model/entities/user.post";
import { IUserPost } from "src/app/model/entities/user.post.interface";
import { IUserPostComment } from "src/app/model/entities/user.post.comment.interface";
import { CUserPostComment } from "src/app/model/entities/user.post.comment";

@Injectable()
export class CDataService {
    public authData: IUserAuthData = null;

    constructor (
        private http: HttpClient,
        private router: Router,
    ) {}     

    public settingsAll(): Observable<IResponse<ISettings>> {return this.sendRequest("settings/all");}   
    public settingsTest(value: string): Observable<string> {return this.sendRequest(`settings/test`, {value});}
    
    public langsAll(): Observable<IResponse<ILang[]>> {return this.sendRequest("langs/all");}     
    
    public wordsAll(): Observable<IResponse<IWords>> {return this.sendRequest(`words/all`);}

    public filesAll(): Observable<IResponse<IFiles>> {return this.sendRequest("files/all");}

    public pagesOne(slug: string): Observable<IResponse<IPage>> {return this.sendRequest(`pages/one/${slug}`);}
    public pagesMenuMain(): Observable<IResponse<IPage[]>> {return this.sendRequest("pages/menu-main");}
    public pagesMenuFoot(): Observable<IResponse<IPage[]>> {return this.sendRequest("pages/menu-foot");}

    public employeesAll(): Observable<IResponse<IEmployee[]>> {return this.sendRequest("employees/all");}

    public messagesCreate(dto: CMessage): Observable<IResponse<void>> {return this.sendRequest("messages/create", dto);}

    public articlesChunk(dto: IGetList): Observable<IResponse<IArticle[]>> {return this.sendRequest("articles/chunk", dto);}
    public articlesOne(slug: string): Observable<IResponse<IArticle>> {return this.sendRequest(`articles/one/${slug}`);}

    public articleCatsAll(): Observable<IResponse<IArticleCat[]>> {return this.sendRequest("article-cats/all");}
    public articleCatsOne(slug: string): Observable<IResponse<IArticleCat>> {return this.sendRequest(`article-cats/one/${slug}`);}

    public usersLogin(dto: IUserLogin): Observable<IResponse<IUserAuthData>> {return this.sendRequest("users/login", dto);}  
    public usersRegister(dto: IUserRegister): Observable<IResponse<IUserAuthData>> {return this.sendRequest("users/register", dto);}  
    public usersVerify(dto: IUserVerify): Observable<IResponse<void>> {return this.sendRequest("users/verify", dto);}  
    public usersEnterByEmail(dto: IUserEnterByEmail): Observable<IResponse<IUserAuthData>> {return this.sendRequest("users/enter-by-email", dto);}  
    public usersRecover(dto: IUserRecover): Observable<IResponse<void>> {return this.sendRequest("users/recover", dto);}
    public usersLinkedinEmail(dto: IUserGetLinkedinEmail): Observable<IResponse<string>> {return this.sendRequest("users/linkedin-email", dto);}
    public usersMe(): Observable<IResponse<IUser>> {return this.sendRequest(`users/me`);}
    public usersUpdateMe(fd: FormData): Observable<IResponse<void>> {return this.sendRequest("users/update-me", fd);} 
    public usersDeleteMe(password: string): Observable<IResponse<void>> {return this.sendRequest("users/delete-me", {password});}

    public countriesAll(): Observable<IResponse<IKeyValue<ICountrySimple[]>>> {return this.sendRequest("countries/all");}

    public socialsAll(): Observable<IResponse<ISocial[]>> {return this.sendRequest("socials/all");}

    public catsAllLeavs(): Observable<IResponse<IKeyValue<ICatSimple[]>>> {return this.sendRequest("cats/all-leavs");}
    public catsAll(): Observable<IResponse<ICat[]>> {return this.sendRequest("cats/all");}
    public catsMenuFoot(): Observable<IResponse<IKeyValue<ICatSimple[]>>> {return this.sendRequest("cats/menu-foot");}
    public catsOne(slug: string): Observable<IResponse<ICat>> {return this.sendRequest(`cats/one/${slug}`);}
    public createNewCat(name: string): Observable<IResponse<ICat>> {return this.sendRequest(`cats/create/${name}`);}

    public athletsChunk(dto: IGetList): Observable<IResponse<IAthletOut[]>> {return this.sendRequest("athlets/chunk", dto);}
    public athletsOne(id: number): Observable<IResponse<IAthletOut>> {return this.sendRequest(`athlets/one/${id}`);}
    public athletsFavoritesCreate(favorite_id: number): Observable<IResponse<void>> {return this.sendRequest(`athlets/favorites-create/${favorite_id}`);}
    public athletsFavoritesChunk(dto: IGetList): Observable<IResponse<IAthletOut[]>> {return this.sendRequest("athlets/favorites-chunk", dto);}
    public athletsFavoritesDelete(favorite_id: number): Observable<IResponse<void>> {return this.sendRequest(`athlets/favorites-delete/${favorite_id}`);}

    public firmsChunk(dto: IGetList): Observable<IResponse<IFirmOut[]>> {return this.sendRequest("firms/chunk", dto);}
    public firmsOne(id: number): Observable<IResponse<IFirmOut>> {return this.sendRequest(`firms/one/${id}`);}
    
    public chatsCreate(companion_id: number): Observable<IResponse<number>> {return this.sendRequest(`chats/create/${companion_id}`);}
    public chatsAll(): Observable<IResponse<IChat[]>> {return this.sendRequest("chats/all");}
    public chatsOne(id: number): Observable<IResponse<IChat>> {return this.sendRequest(`chats/one/${id}`);}
    public chatsResetUnread(id: number): Observable<IResponse<void>> {return this.sendRequest(`chats/reset-unread/${id}`);}
    public chatsDelete(id: number): Observable<IResponse<void>> {return this.sendRequest(`chats/delete/${id}`);}
    public chatsDeleteAndBan(id: number): Observable<IResponse<void>> {return this.sendRequest(`chats/delete-and-ban/${id}`);}
    public chatsUnban(banned_id: number): Observable<IResponse<void>> {return this.sendRequest(`chats/unban/${banned_id}`);}

    public chatMessagesCreate(dto: IChatMessageCreate): Observable<IResponse<void>> {return this.sendRequest("chat-messages/create", dto);}
    public chatMessagesChunk(dto: IGetList): Observable<IResponse<IChatMessage[]>> {return this.sendRequest("chat-messages/chunk", dto);}

    public tariffsAll(): Observable<IResponse<ITariff[]>> {return this.sendRequest("tariffs/all");}

    public paysystemsAll(): Observable<IResponse<IPaysystem[]>> {return this.sendRequest("paysystems/all");}

    public paymentsStripePrepare(tariff_id: number): Observable<IResponse<string>> {return this.sendRequest(`payments/stripe-prepare/${tariff_id}`);}
    public paymentsStripePay(dto: IStripePaymentCreate): Observable<IResponse<void>> {return this.sendRequest("payments/stripe-pay", dto);}
    public paymentsStripeCheck(intent_id: string): Observable<IResponse<void>> {return this.sendRequest(`payments/stripe-check/${intent_id}`);}
    public paymentsNpCurrenciesAll(): Observable<IResponse<string[]>> {return this.sendRequest("payments/np-currencies-all");}
    public paymentsNpPay(dto: INpPaymentCreate): Observable<IResponse<string>> {return this.sendRequest("payments/np-pay", dto);}

    public complaintsCreate(dto: IComplaintCreate): Observable<IResponse<void>> {return this.sendRequest("complaints/create", dto);}

    public postCreate(dto: FormData): Observable<IResponse<CUserPost>> {return this.sendRequest("posts/create", dto);}
    public postChunk(dto: IGetList): Observable<IResponse<IUserPost[]>> {return this.sendRequest("posts/chunk", dto)}
    public commentCreate(post_id: number, dto: CUserPostComment): Observable<IResponse<IUserPostComment>> {return this.sendRequest(`posts/comment/${post_id}`, dto)}
    public getComments(post_id: number): Observable<IResponse<IUserPostComment[]>> {return this.sendRequest(`posts/get-comments/${post_id}`)}
    public ifLike(post_id: number, type: string): Observable<IResponse<boolean>> {return this.sendRequest(`posts/if-like/${post_id}`, {type: type})}
    public toggleLike(post_id: number): Observable<IResponse<boolean>> {return this.sendRequest(`posts/toggle-like/${post_id}`)}
    public toggleSave(post_id: number): Observable<IResponse<boolean>> {return this.sendRequest(`posts/toggle-save/${post_id}`)}
    public toggleFollow(user_id: number): Observable<IResponse<boolean>> {return this.sendRequest(`users/toggle-follow/${user_id}`)}
    public toggleSubscribe(user_id: number): Observable<IResponse<boolean>> {return this.sendRequest(`users/toggle-subscribe/${user_id}`)}
    public ifFollow(post_id: number, type: string): Observable<IResponse<boolean>> {return this.sendRequest(`users/if-follow/${post_id}`, {type: type})}
    public deletePost(post_id: number): Observable<IResponse<void>> {return this.sendRequest(`posts/delete/${post_id}`)}
    public blockPost(post_id: number): Observable<IResponse<void>> {return this.sendRequest(`posts/block/${post_id}`)}

    private sendRequest (url: string, body: any = null): Observable<any> {          
        const headersContent = {};    
        this.authData?.token && (headersContent["token"] = this.authData.token);
        const headers = new HttpHeaders(headersContent); 
        return this.http
            .post(`${cfg.apiUrl}/${url}`, body, {headers})
            .pipe(filter(res => this.processResponse(res)));                          
    }

    private processResponse(res: any): boolean {  
        if (res.statusCode === 403) {
            // this.router.navigateByUrl(`/en/auth/logout`);
            return false;
        } 
            
        return true;        
    }
}
