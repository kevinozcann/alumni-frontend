export interface IAuthUser {
  sub?: string;
  name?: string;
  family_name?: string;
  email?: string;
  phone_number?: string;
  email_verified?: boolean;
  phone_number_verified?: boolean;
}
export interface IUserType {
  id: number;
  loginType: string;
  title: string;
  userType: string;
}

export type TLoginType = 'admin' | 'manager' | 'user' | 'anonymous';
