import { IconName, IconPrefix } from '@fortawesome/pro-duotone-svg-icons';
const menus: IMenu[] = [
  {
    id: 1,
    title: 'account.myaccount',
    iconPrefix: 'fad',
    icon: 'user-circle',
    url: '/account/home',
    appUrl: '',
    position: 1,
    isActive: true,
    isFlex: true,
    isEssential: true,
    isProfessional: true,
    isEnterprise: true,
    isAdmin: false
  },
  {
    id: 2,
    title: 'email.inbox',
    iconPrefix: 'fad',
    icon: 'inbox',
    url: '/mail/inbox',
    appUrl: '',
    position: 2,
    isActive: true,
    isFlex: true,
    isEssential: true,
    isProfessional: true,
    isEnterprise: true,
    isAdmin: false
  },
  {
    id: 3,
    title: 'school.students',
    iconPrefix: 'fad',
    icon: 'users',
    url: '/persons',
    appUrl: 'classes',
    position: 3,
    isActive: true,
    isFlex: true,
    isEssential: true,
    isProfessional: true,
    isEnterprise: true,
    isAdmin: false
  }
];
export interface IMenu {
  id: number;
  globalId?: number;
  title: string;
  url: string;
  appUrl: string;
  position: number;
  isActive: boolean;
  isFlex: true;
  isEssential: true;
  isProfessional: true;
  isEnterprise: true;
  isAdmin: boolean;
  iconPrefix?: IconPrefix;
  icon?: IconName;
  starred?: boolean;
  translated?: boolean;
  parent?: IMenu;
  school?: string;
  children?: IMenu[];
}
export default menus;
