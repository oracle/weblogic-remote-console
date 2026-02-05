export type TipCategoryId = "productivity" | "personalization" | "whereis" | "accessibility" | "connectivity" | "security" | "other" | string;
export interface TipSchemaCategory {
    id: TipCategoryId;
}
export interface TipSchema {
    categories: TipSchemaCategory[];
}
export interface TipConfigEntry {
    id?: string;
    category: TipCategoryId;
    visible: boolean;
}
export interface TipsYaml {
    schema?: TipSchema;
    tips?: TipConfigEntry[];
}
export interface Tip {
    id: string;
    category: TipCategoryId;
    visible: boolean;
}
declare class TipsStore {
    private initialized;
    private schema;
    private tips;
    private init;
    getById(id: string): Tip | undefined;
    getAll(): Tip[];
    getAllVisible(): Tip[];
    getCategories(): TipCategoryId[];
    getAllCategories(): TipSchemaCategory[];
}
declare const TipsManager: TipsStore;
export default TipsManager;
export { TipsManager };
