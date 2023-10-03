import { CEntity } from "./_entity";

export abstract class CTranslatableEntity<T extends ITranslation> extends CEntity {
    public translations?: T[];

    public translation(lang_id: number): T {        
        return this.translations?.find(t => t.lang_id === lang_id);
    }
}

export interface ITranslation {
    lang_id: number;
}
