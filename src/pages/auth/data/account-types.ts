import { ISchool } from 'pages/organization/organization-types';

export type TUserZone = 'headquarters' | 'campus' | 'school' | 'teacher' | 'parent' | 'student';

export interface IUser {
  id?: string;
  sub?: string;
  name?: string;
  family_name?: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  avatarKey?: string;
  wallpaperUrl?: string;
  wallpaperKey?: string;
  owner?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userType?: string;
  isAdmin?: boolean;
  phone_number?: string;
  email_verified?: boolean;
  phone_number_verified?: boolean;
}
export interface IAuthUser {
  username?: string;
  accessToken: string;
  refreshToken: string;
  attributes: IUser;
  signInUserSession: any;
  client?: {
    endpoint: string;
    fetchOptions: any;
  };
  userConfirmed?: boolean;
  preferredMFA: string;
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
