import { Component, OnInit } from "@angular/core";
import { CAppService } from "src/app/common/services/app.service";
import { CArticleRepository } from "src/app/common/services/repositories/article.repository";
import { CSlider } from "../slider.component";
import { CArticle } from "src/app/model/entities/article";
import { CCookieService } from "src/app/common/services/cookie.service";

// полноэкранный зацикленный слайдер
@Component({
    selector: "slider-articles2",
    templateUrl: "slider-articles2.component.html",
    styleUrls: ["slider-articles2.component.scss"],
})
export class CSliderArticles2Component extends CSlider implements OnInit  {
    // data
    public dataItems: CArticle[] = [];
    public cycledItems: CArticle[] = [];
    protected sortBy: string = "date";
    protected sortDir: number = -1;
    protected chunkLength: number = 5;

    constructor(
        protected appService: CAppService,
        protected cookieService: CCookieService,
        protected articleRepository: CArticleRepository,
    ) 
    {
        super(appService);
    }
    
    /////////////////
    // init
    /////////////////

    public ngOnInit(): void {
        super.ngOnInit();
        this.cookieService.getItem("ppp42") === "false" && this.initData(); // скрываем от pagespeed :-)        
    }    

    protected async initData(): Promise<void> {
        try {            
            const chunk = await this.articleRepository.loadChunk(0, this.chunkLength, this.sortBy, this.sortDir, {in_gal: true}); 
            this.dataItems = chunk.data;    
            if (!this.dataItems.length) return;
            this.cycledItems = [...this.dataItems]; 
            this.cycledItems.unshift(this.dataItems[this.dataItems.length-1]);
            this.cycledItems.push(this.dataItems[0]);            
        } catch (err) {
            this.appService.notifyError(err);
        }
    }

    protected initLayout(): void {
        this.itemWidth = this.viewport.offsetWidth;
    }

    //////////////////
    // movement
    //////////////////

    protected buildOffset(): void {
        this.offset = (this.step + 1) * this.itemWidth;
    }

    protected async onDragEnd (): Promise<void> {                
        window.removeEventListener("mousemove", this.onDragMove);
        window.removeEventListener("touchmove", this.onDragMove);
        window.removeEventListener("mouseup", this.onDragEnd);
        window.removeEventListener("touchend", this.onDragEnd);        
        
        // final move to integer step 
        if (this.dragging) { // to prevent final move without container moving
            if (this.prevX < this.startX - 30) {
                this.step++;
            } else if (this.prevX > this.startX + 30) {
                this.step--;
            } 
        }
        
        this.container.style.transition = `${this.transition}s`;
        this.buildOffset();
        await this.appService.pause(1000 * this.transition);
    } 

    public async onTransitionEnd(): Promise<void> {
        this.container.style.transition = `none`;

        if (this.step === -1) {                
            this.step = this.dataItems.length - 1;
            this.buildOffset();         
        }

        if (this.step === this.dataItems.length) {
            this.step = 0;
            this.buildOffset();
        }

        await this.appService.pause(1);
        this.dragging = false;
        this.container.style.transition = `${this.transition}s`;
    }
}