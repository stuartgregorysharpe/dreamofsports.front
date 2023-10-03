import { Component, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { IKeyValue } from "src/app/model/keyvalue.interface";
import { CAppService } from "src/app/common/services/app.service";
import { CPopupComponent } from "../popup.component";
import { CAuthService } from "src/app/common/services/auth.service";
import { IUserRegister } from "src/app/model/dto/user.register.interface";
import { IUserVerify } from "src/app/model/dto/user.verify.interface";
import { CGoogleService } from "src/app/common/services/google.service";
import { CLinkedinService } from "src/app/common/services/linkedin.service";
import { TUserType } from "src/app/model/dto/user.authdata.interface";
import { CAuthGuard } from "src/app/common/services/guards/auth.guard";
import { TranslateService } from "@ngx-translate/core";
import { types } from "util";

@Component({
    selector: "popup-register",
    templateUrl: "popup-register.component.html",
    styleUrls: [
        "../popup.component.scss",
        "../../../styles/forms.scss",
    ],
    encapsulation: ViewEncapsulation.None,
})
export class CPopupRegisterComponent extends CPopupComponent implements OnChanges {

    // public type: TUserType = "athlet";
    public type: any = this.appService.userType[0];
    public email: string = "";
    public code: string = "";
    public codeSent: boolean = false;
    public codeSending: boolean = false;
    public password: string = "";
    public password2: string = "";
    public errors: IKeyValue<string> = {};
    public formSending: boolean = false;
    public firstName: string = "";
    public lastName: string = "";
    public phoneNumber: string = "";
    public countryCodes: any[];
    public countryCode: any;

    constructor(
        protected appService: CAppService,
        protected authService: CAuthService,
        protected authGuard: CAuthGuard,
        protected googleService: CGoogleService,
        protected linkedinService: CLinkedinService,
        protected router: Router,
        public translate: TranslateService,
    ) {
        super(appService);
        this.countryCodes = [{ name: "Afghanistan(+93)", code: "+93" },
        { name: "Albania(+355)", code: "+355" },
        { name: "Algeria(+213)", code: "+213" },
        { name: "Andorra(+376)", code: "+376" },
        { name: "Angola(+244)", code: "+244" },
        { name: "Antarctica(+672)", code: "+672" },
        { name: "Argentina(+54)", code: "+54" },
        { name: "Armenia(+374)", code: "+374" },
        { name: "Aruba(+297)", code: "+297" },
        { name: "Australia(+61)", code: "+61" },
        { name: "Austria(+43)", code: "+43" },
        { name: "Azerbaijan(+994)", code: "+994" },
        { name: "Bahrain(+973)", code: "+973" },
        { name: "Bangladesh(+880)", code: "+880" },
        { name: "Belarus(+375)", code: "+375" },
        { name: "Belgium(+32)", code: "+32" },
        { name: "Belize(+501)", code: "+501" },
        { name: "Benin(+229)", code: "+229" },
        { name: "Bhutan(+975)", code: "+975" },
        { name: "Bolivia(+591)", code: "+591" },
        { name: "Botswana(+267)", code: "+267" },
        { name: "Brazil(+55)", code: "+55" },
        { name: "British Indian Ocean Territory(+246)", code: "+246" },
        { name: "Brunei(+673)", code: "+673" },
        { name: "Bulgaria(+359)", code: "+359" },
        { name: "Burkina Faso(+226)", code: "+226" },
        { name: "Burundi(+257)", code: "+257" },
        { name: "Cambodia(+855)", code: "+855" },
        { name: "Cameroon(+237)", code: "+237" },
        { name: "Canada(+1)", code: "+1" },
        { name: "Cape Verde(+238)", code: "+238" },
        { name: "Central African Republic(+236)", code: "+236" },
        { name: "Chad(+235)", code: "+235" },
        { name: "Chile(+56)", code: "+56" },
        { name: "China(+86)", code: "+86" },
        { name: "Christmas Island(+61)", code: "+61" },
        { name: "Cocos Islands(+61)", code: "+61" },
        { name: "Colombia(+57)", code: "+57" },
        { name: "Comoros(+269)", code: "+269" },
        { name: "Cook Islands(+682)", code: "+682" },
        { name: "Costa Rica(+506)", code: "+506" },
        { name: "Croatia(+385)", code: "+385" },
        { name: "Cuba(+53)", code: "+53" },
        { name: "Curacao(+599)", code: "+599" },
        { name: "Cyprus(+357)", code: "+357" },
        { name: "Czech Republic(+420)", code: "+420" },
        { name: "Democratic Republic of the Congo(+243)", code: "+243" },
        { name: "Denmark(+45)", code: "+45" },
        { name: "Djibouti(+253)", code: "+253" },
        { name: "East Timor(+670)", code: "+670" },
        { name: "Ecuador(+593)", code: "+593" },
        { name: "Egypt(+20)", code: "+20" },
        { name: "El Salvador(+503)", code: "+503" },
        { name: "Equatorial Guinea(+240)", code: "+240" },
        { name: "Eritrea(+291)", code: "+291" },
        { name: "Estonia(+372)", code: "+372" },
        { name: "Ethiopia(+251)", code: "+251" },
        { name: "Falkland Islands(+500)", code: "+500" },
        { name: "Faroe Islands(+298)", code: "+298" },
        { name: "Fiji(+679)", code: "+679" },
        { name: "Finland(+358)", code: "+358" },
        { name: "France(+33)", code: "+33" },
        { name: "French Polynesia(+689)", code: "+689" },
        { name: "Gabon(+241)", code: "+241" },
        { name: "Gambia(+220)", code: "+220" },
        { name: "Georgia(+995)", code: "+995" },
        { name: "Germany(+49)", code: "+49" },
        { name: "Ghana(+233)", code: "+233" },
        { name: "Gibraltar(+350)", code: "+350" },
        { name: "Greece(+30)", code: "+30" },
        { name: "Greenland(+299)", code: "+299" },
        { name: "Guatemala(+502)", code: "+502" },
        { name: "Guinea(+224)", code: "+224" },
        { name: "Guinea-Bissau(+245)", code: "+245" },
        { name: "Guyana(+592)", code: "+592" },
        { name: "Haiti(+509)", code: "+509" },
        { name: "Honduras(+504)", code: "+504" },
        { name: "Hong Kong(+852)", code: "+852" },
        { name: "Hungary(+36)", code: "+36" },
        { name: "Iceland(+354)", code: "+354" },
        { name: "India(+91)", code: "+91" },
        { name: "Indonesia(+62)", code: "+62" },
        { name: "Iran(+98)", code: "+98" },
        { name: "Iraq(+964)", code: "+964" },
        { name: "Ireland(+353)", code: "+353" },
        { name: "Israel(+972)", code: "+972" },
        { name: "Italy(+39)", code: "+39" },
        { name: "Ivory Coast(+225)", code: "+225" },
        { name: "Japan(+81)", code: "+81" },
        { name: "Jordan(+962)", code: "+962" },
        { name: "Kazakhstan(+7)", code: "+7" },
        { name: "Kenya(+254)", code: "+254" },
        { name: "Kiribati(+686)", code: "+686" },
        { name: "Kosovo(+383)", code: "+383" },
        { name: "Kuwait(+965)", code: "+965" },
        { name: "Kyrgyzstan(+996)", code: "+996" },
        { name: "Laos(+856)", code: "+856" },
        { name: "Latvia(+371)", code: "+371" },
        { name: "Lebanon(+961)", code: "+961" },
        { name: "Lesotho(+266)", code: "+266" },
        { name: "Liberia(+231)", code: "+231" },
        { name: "Libya(+218)", code: "+218" },
        { name: "Liechtenstein(+423)", code: "+423" },
        { name: "Lithuania(+370)", code: "+370" },
        { name: "Luxembourg(+352)", code: "+352" },
        { name: "Macau(+853)", code: "+853" },
        { name: "Macedonia(+389)", code: "+389" },
        { name: "Madagascar(+261)", code: "+261" },
        { name: "Malawi(+265)", code: "+265" },
        { name: "Malaysia(+60)", code: "+60" },
        { name: "Maldives(+960)", code: "+960" },
        { name: "Mali(+223)", code: "+223" },
        { name: "Malta(+356)", code: "+356" },
        { name: "Marshall Islands(+692)", code: "+692" },
        { name: "Mauritania(+222)", code: "+222" },
        { name: "Mauritius(+230)", code: "+230" },
        { name: "Mayotte(+262)", code: "+262" },
        { name: "Mexico(+52)", code: "+52" },
        { name: "Micronesia(+691)", code: "+691" },
        { name: "Moldova(+373)", code: "+373" },
        { name: "Monaco(+377)", code: "+377" },
        { name: "Mongolia(+976)", code: "+976" },
        { name: "Montenegro(+382)", code: "+382" },
        { name: "Morocco(+212)", code: "+212" },
        { name: "Mozambique(+258)", code: "+258" },
        { name: "Myanmar(+95)", code: "+95" },
        { name: "Namibia(+264)", code: "+264" },
        { name: "Nauru(+674)", code: "+674" },
        { name: "Nepal(+977)", code: "+977" },
        { name: "Netherlands(+31)", code: "+31" },
        { name: "Netherlands Antilles(+599)", code: "+599" },
        { name: "New Caledonia(+687)", code: "+687" },
        { name: "New Zealand(+64)", code: "+64" },
        { name: "Nicaragua(+505)", code: "+505" },
        { name: "Niger(+227)", code: "+227" },
        { name: "Nigeria(+234)", code: "+234" },
        { name: "Niue(+683)", code: "+683" },
        { name: "North Korea(+850)", code: "+850" },
        { name: "Norway(+47)", code: "+47" },
        { name: "Oman(+968)", code: "+968" },
        { name: "Pakistan(+92)", code: "+92" },
        { name: "Palau(+680)", code: "+680" },
        { name: "Palestine(+970)", code: "+970" },
        { name: "Panama(+507)", code: "+507" },
        { name: "Papua New Guinea(+675)", code: "+675" },
        { name: "Paraguay(+595)", code: "+595" },
        { name: "Peru(+51)", code: "+51" },
        { name: "Philippines(+63)", code: "+63" },
        { name: "Pitcairn(+64)", code: "+64" },
        { name: "Poland(+48)", code: "+48" },
        { name: "Portugal(+351)", code: "+351" },
        { name: "Qatar(+974)", code: "+974" },
        { name: "Republic of the Congo(+242)", code: "+242" },
        { name: "Reunion(+262)", code: "+262" },
        { name: "Romania(+40)", code: "+40" },
        { name: "Russia(+7)", code: "+7" },
        { name: "Rwanda(+250)", code: "+250" },
        { name: "Saint Barthelemy(+590)", code: "+590" },
        { name: "Saint Helena(+290)", code: "+290" },
        { name: "Saint Martin(+590)", code: "+590" },
        { name: "Saint Pierre and Miquelon(+508)", code: "+508" },
        { name: "Samoa(+685)", code: "+685" },
        { name: "San Marino(+378)", code: "+378" },
        { name: "Sao Tome and Principe(+239)", code: "+239" },
        { name: "Saudi Arabia(+966)", code: "+966" },
        { name: "Senegal(+221)", code: "+221" },
        { name: "Serbia(+381)", code: "+381" },
        { name: "Seychelles(+248)", code: "+248" },
        { name: "Sierra Leone(+232)", code: "+232" },
        { name: "Singapore(+65)", code: "+65" },
        { name: "Slovakia(+421)", code: "+421" },
        { name: "Slovenia(+386)", code: "+386" },
        { name: "Solomon Islands(+677)", code: "+677" },
        { name: "Somalia(+252)", code: "+252" },
        { name: "South Africa(+27)", code: "+27" },
        { name: "South Korea(+82)", code: "+82" },
        { name: "South Sudan(+211)", code: "+211" },
        { name: "Spain(+34)", code: "+34" },
        { name: "Sri Lanka(+94)", code: "+94" },
        { name: "Sudan(+249)", code: "+249" },
        { name: "Suriname(+597)", code: "+597" },
        { name: "Svalbard and Jan Mayen(+47)", code: "+47" },
        { name: "Swaziland(+268)", code: "+268" },
        { name: "Sweden(+46)", code: "+46" },
        { name: "Switzerland(+41)", code: "+41" },
        { name: "Syria(+963)", code: "+963" },
        { name: "Taiwan(+886)", code: "+886" },
        { name: "Tajikistan(+992)", code: "+992" },
        { name: "Tanzania(+255)", code: "+255" },
        { name: "Thailand(+66)", code: "+66" },
        { name: "Togo(+228)", code: "+228" },
        { name: "Tokelau(+690)", code: "+690" },
        { name: "Tonga(+676)", code: "+676" },
        { name: "Tunisia(+216)", code: "+216" },
        { name: "Turkey(+90)", code: "+90" },
        { name: "Turkmenistan(+993)", code: "+993" },
        { name: "Tuvalu(+688)", code: "+688" },
        { name: "Uganda(+256)", code: "+256" },
        { name: "Ukraine(+380)", code: "+380" },
        { name: "United Arab Emirates(+971)", code: "+971" },
        { name: "United Kingdom(+44)", code: "+44" },
        { name: "United States(+1)", code: "+1" },
        { name: "Uruguay(+598)", code: "+598" },
        { name: "Uzbekistan(+998)", code: "+998" },
        { name: "Vanuatu(+678)", code: "+678" },
        { name: "Vatican(+379)", code: "+379" },
        { name: "Venezuela(+58)", code: "+58" },
        { name: "Vietnam(+84)", code: "+84" },
        { name: "Wallis and Futuna(+681)", code: "+681" },
        { name: "Western Sahara(+212)", code: "+212" },
        { name: "Yemen(+967)", code: "+967" },
        { name: "Zambia(+260)", code: "+260" },
        { name: "Zimbabwe(+263)", code: "+263" }]
    }

    get types(): any[] { return this.appService.userType }

    public ngOnChanges(changes: SimpleChanges): void {
        !this.active && this.reset();
    }

    protected reset(): void {
        this.password = "";
        this.password2 = "";
        this.code = "";
        this.errors = {};
    }

    public async onLogin(): Promise<void> {
        this.onClose();
        await this.appService.pause(500);
        this.appService.popupLoginActive = true;
    }

    public async onSubmit(): Promise<void> {
        try {
            if (!this.validateForm()) return;
            this.formSending = true;
            const dto: IUserRegister = { lang_id: this.lang.id, type: this.type.type, sub_type: this.type.sub_type, email: this.email, code: this.code, password: this.password, firstName: this.firstName, lastName: this.lastName, phoneNumber: `${this.countryCode.code} ${this.phoneNumber}` };
            const statusCode = await this.authService.register(dto);
            this.formSending = false;

            if (statusCode === 201) {
                this.onClose();
                const url = this.authGuard.getBlockedUrl() || `/${this.lang.slug}/account`;
                this.router.navigateByUrl(url);
                return;
            }

            if (statusCode === 409) {
                this.errors["email"] = "email-exists";
                return;
            }

            if (statusCode === 401) {
                this.errors["code"] = "code-invalid";
                return;
            }

            this.onClose();
            this.appService.notifyError(this.words['errors']?.['unexpected']?.[this.lang.slug]);
        } catch (err) {
            this.appService.notifyError(err);
            this.formSending = false;
        }
    }

    public async onSendCode(): Promise<void> {
        try {
            if (!this.validateEmail()) return;
            this.codeSending = true;
            const dto: IUserVerify = { email: this.email, lang_id: this.lang.id };
            await this.authService.verify(dto);
            this.codeSending = false;
            this.codeSent = true;
            await this.appService.pause(3000);
            this.codeSent = false;
        } catch (err) {
            this.appService.notifyError(err);
            this.codeSending = false;
        }
    }

    public onEnterWithGoogle(): void {
        this.googleService.signIn(this.type);
    }

    public onEnterWithLinkedin(): void {
        this.linkedinService.signIn(this.type);
    }

    protected validateForm(): boolean {
        let error = false;

        if (!this.appService.validateEmail(this.email)) {
            this.errors["email"] = "email";
            error = true;
        } else {
            this.errors["email"] = null;
        }

        if (!this.code) {
            this.errors["code"] = "required";
            error = true;
        } else {
            this.errors["code"] = null;
        }

        if (this.password.length < 6) {
            this.errors["password"] = "password";
            error = true;
        } else {
            this.errors["password"] = null;
        }

        if (this.password2 !== this.password) {
            this.errors["password2"] = "password2";
            error = true;
        } else {
            this.errors["password2"] = null;
        }

        return !error;
    }

    protected validateEmail(): boolean {
        let error = false;

        if (!this.appService.validateEmail(this.email)) {
            this.errors["email"] = "email";
            error = true;
        } else {
            this.errors["email"] = null;
        }

        return !error;
    }
}