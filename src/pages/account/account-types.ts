import { ISchool } from 'pages/organization/organization-types';

export type TUserZone = 'headquarters' | 'campus' | 'school' | 'teacher' | 'parent' | 'student';

export interface IUserAttributes {
  sub: string;
  email_verified: boolean;
  name: string;
  phone_number_verified: boolean;
  phone_number: string;
  family_name: string;
  email: string;
  'custom:wallpaper': string;
  'custom:picture': string;
}
export interface IUser {
  accessToken: string;
  adClassCode?: string;
  adStdCode?: string;
  attributes: IUserAttributes;
  authenticationFlowType?: string;
  client?: {
    endpoint: string;
    fetchOptions: any;
  };
  createdAt?: string;
  email?: string;
  expiresAt?: string;
  facebookUser?: string;
  feeds?: string[];
  firebaseId?: string;
  fullName: string;
  googleUser?: string;
  id: number;
  isMe: boolean;
  keyPrefix?: string;
  lastName: string;
  ldapUid?: string;
  likes?: string[];
  lmsUserId?: string;
  locale?: string;
  loginType?: TLoginType;
  name: string;
  newspaper?: string;
  picture?: string;
  preferredMFA: string;
  refreshToken?: string;
  roles?: string[];
  signInUserSession: any;
  schoolId: number;
  school: Partial<ISchool>;
  schools: ISchool[];
  session: any;
  stdIds?: string[];
  superAdmin?: string;
  userConfirmed?: boolean;
  userDataKey?: string;
  username?: string;
  userSub?: string;
  userType: IUserType;
  userTypeTitle: string;
  userZone: TUserZone;
  uuid?: string;
  wallpaper?: string;
}
export interface IUserType {
  id: number;
  loginType: string;
  title: string;
  userType: string;
}
export interface IPersonal {
  id: number;
  phone?: string;
  homeAddress?: string;
  workAddress?: string;
}

export type TLoginType = 'admin' | 'manager' | 'teacher' | 'parent' | 'student' | 'anonymous';
