import { IAuthUser } from 'pages/auth/data/account-types';

export interface IUser extends IAuthUser {
  id?: string;
  fullName?: string;
  avatarUrl?: string;
  avatarKey?: string;
  wallpaperUrl?: string;
  wallpaperKey?: string;
  homeAddress?: string;
  workAddress?: string;
  owner?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userType?: string;
  isAdmin?: boolean;
}
