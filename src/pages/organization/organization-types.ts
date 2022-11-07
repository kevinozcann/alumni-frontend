export interface IGradingTerm {
  id?: number;
  title: string;
  startDate: Date;
  endDate: Date;
  season?: string;
}
export interface ISeason {
  id?: number;
  title: string;
  database?: string;
  isDefault?: boolean | 'on' | 'off';
  isActive?: boolean | 'on' | 'off';
  school?: string;
  gradingTerms?: IGradingTerm[];
}
export type TSchoolType = 'headquarters' | 'campus' | 'school';
export type TConfigKey =
  | 'address'
  | 'adminEmail'
  | 'bigLogo'
  | 'checkServerName'
  | 'cityId'
  | 'countryId'
  | 'email'
  | 'embed_form_url'
  | 'favicon'
  | 'fileServerUrl'
  | 'institutionType'
  | 'language'
  | 'loginScreenBgColor'
  | 'loginScreenBgImage'
  | 'logo'
  | 'normalLogo'
  | 'parentSelfRegistration'
  | 'phone'
  | 'picture'
  | 'realIpHeader'
  | 'saveUserLogs'
  | 'showBgColorOnMobile'
  | 'showBgColorSetting'
  | 'showBranches'
  | 'sitename'
  | 'slogan'
  | 'smallLogo'
  | 'startDate'
  | 'stateId'
  | 'studentSelfRegistration'
  | 'supportEmail'
  | 'timezone'
  | 'url'
  | 'useAutomation'
  | 'website'
  | 'zipCode';
export type TConfiguration = {
  id?: number;
  configKey: TConfigKey;
  configValue?: string;
};
export interface ISchool {
  address?: string;
  bigLogo?: string;
  ceebCode?: string;
  children?: ISchool[];
  cityId?: number;
  classLevels: string;
  countryCode?: string;
  email?: string;
  favicon?: string;
  fax?: string;
  founder?: string;
  googleLink?: string;
  googleMap?: string;
  ibCode?: string;
  id: number;
  isActive: boolean;
  menuTitle?: string;
  normalLogo?: string;
  phone1?: string;
  phone2?: string;
  picture?: string;
  principal?: string;
  representative?: string;
  seasons?: ISeason[];
  smallLogo?: string;
  stateId?: number;
  scUrl?: string;
  timezone?: string;
  title: string;
  type: TSchoolType;
  zip?: string;
  parent?: string;
  transfer?: boolean;
  config?: Record<TConfigKey, string>;
  configuration?: TConfiguration[];
  itemMargin?: number;
}
