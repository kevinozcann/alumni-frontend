export type TLang = 'ar' | 'de' | 'en' | 'es' | 'fr' | 'tr' | 'zh';
export type PrimitiveType = string | number | boolean | null | undefined | Date;
export interface ILanguage {
  id: number;
  title: string;
  localTitle: string;
  shortCode: TLang;
  longCode?: string;
  icon?: string;
  svgIcon?: string;
}
export interface IPageTab {
  value: string;
  label: string;
  component?: string;
  icon?: string;
  url?: string;
  visible?: string[];
}
export interface IFile {
  id?: number;
  mimeType?: string;
  url?: string;
  name?: string;
  size?: number;
  createdBy?: string;
}
export interface ICountry {
  country: string;
  isoCode: string;
  iso3Code?: string;
  isPublished?: boolean;
  states?: IState[];
}
export interface IState {
  id: number;
  code: number | string;
  name: string;
}
export interface ICity {
  id: number;
  name: string;
}
export type TActionType =
  | 'add'
  | 'add-comment'
  | 'copy'
  | 'delete'
  | 'delete-comment'
  | 'edit'
  | 'like'
  | 'new'
  | 'pull'
  | 'show'
  | 'unlike'
  | 'update'
  | 'update-comment';
export type TLinkedAccount = 'facebook' | 'google';
