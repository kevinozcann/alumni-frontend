import { IconName, IconPrefix } from '@fortawesome/pro-duotone-svg-icons';

export type TMenuType = 'headquarters' | 'campus' | 'school' | 'teacher' | 'parent' | 'student';
export type TMenuAction = 'add' | 'edit' | 'delete';

export interface IMenu {
  id: number;
  globalId?: number;
  title: string;
  url: string;
  appUrl: string;
  type: TMenuType;
  position: number;
  isActive: boolean;
  isAdmin: boolean;
  iconPrefix?: IconPrefix;
  icon?: IconName;
  starred?: boolean;
  translated?: boolean;
  parent?: string | null;
  school?: string;
  children?: IMenu[] | null;
}

export type TMenuList = {
  [menutype in TMenuType]: IMenu[];
};

export interface IBreadcrumb {
  url: string;
  title: string;
  original?: boolean;
}

export interface IUserMenu {
  id: number;
  title: string;
  url: string;
  iconPrefix: IconPrefix;
  icon: IconName;
  breadcrumb?: IBreadcrumb[];
  children: IUserMenu[] | null;
}

export interface IFrequentMenu {
  id: number;
  menu: IMenu;
  count: number;
  menuId: number;
}

export interface IFlatMenu {
  id: number;
  globalId: number;
  title: string;
  url: string;
  iconPrefix?: IconPrefix;
  icon?: IconName;
}
