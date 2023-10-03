import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CAppService } from './app.service';
import { CCookieService } from './cookie.service';
import { CDataService } from './data.service';
import { CCacheInterceptor } from './interceptors/cache.interceptor';
import { CLangRepository } from './repositories/lang.repository';
import { CPageRepository } from './repositories/page.repository';
import { CSettingRepository } from './repositories/setting.repository';
import { CWordRepository } from './repositories/word.repository';
import { CFileRepository } from './repositories/file.repository';
import { CEmployeeRepository } from './repositories/employee.repository';
import { CMessageRepository } from './repositories/message.repository';
import { CArticleRepository } from './repositories/article.repository';
import { CArticleCatRepository } from './repositories/article.cat.repository';
import { CAuthService } from './auth.service';
import { CAuthGuard } from './guards/auth.guard';
import { CGoogleService } from './google.service';
import { CLinkedinService } from './linkedin.service';
import { CUserRepository } from './repositories/user.repository';
import { CUploadService } from './upload.service';
import { CCountryRepository } from './repositories/country.repository';
import { CSocialRepository } from './repositories/social.repository';
import { CCatRepository } from './repositories/cat.repository';
import { CAthletRepository } from './repositories/athlet.repository';
import { CAthletsFilterService } from './athlets-filter.service';
import { CFirmRepository } from './repositories/firm.repository';
import { CChatRepository } from './repositories/chat.repository';
import { CChatMessageRepository } from './repositories/chat.message.repository';
import { CSocketService } from './socket.service';
import { CAudioService } from './audio.service';
import { CTariffRepository } from './repositories/tariff.repository';
import { CPaysystemRepository } from './repositories/paysystem.repository';
import { CPaymentRepository } from './repositories/payment.repository';
import { CComplaintRepository } from './repositories/complaint.repository';
import { CPostRepository } from './repositories/post.repository';

@NgModule({
    declarations: [],
    exports: [],
    providers: [        
        {provide: HTTP_INTERCEPTORS, useClass: CCacheInterceptor, multi: true},
        // services
        CAppService,
        CDataService,
        CCookieService,
        CAuthService,        
        CGoogleService,
        CLinkedinService,
        CUploadService,
        CAthletsFilterService,
        CSocketService,
        CAudioService,
        // guards
        CAuthGuard,
        // repo
        CSettingRepository,       
        CLangRepository,      
        CWordRepository,  
        CPageRepository,
        CFileRepository,
        CEmployeeRepository,
        CMessageRepository,
        CArticleRepository,
        CArticleCatRepository,
        CUserRepository,
        CCountryRepository,
        CSocialRepository,
        CCatRepository,
        CAthletRepository,
        CFirmRepository,
        CChatRepository,
        CChatMessageRepository,
        CTariffRepository,
        CPaysystemRepository,
        CPaymentRepository,
        CComplaintRepository,
        CPostRepository,
    ],
})
export class CServicesModule {}
