import { IconName, IconPrefix } from '@fortawesome/pro-duotone-svg-icons';
const menus: IMenu[] = [
  {
    id: 602,
    title: 'account.myaccount',
    iconPrefix: 'fad',
    icon: 'user-circle',
    url: '/account/home',
    appUrl: '/',
    position: 0,
    isActive: true,
    isFlex: true,
    isEssential: true,
    isProfessional: true,
    isEnterprise: true,
    isAdmin: false,
    parent: null,
    children: [
      {
        id: 603,
        title: 'account.myaccount',
        iconPrefix: 'fad',
        icon: 'user-circle',
        url: '/account/home',
        appUrl: '',
        position: 0,
        isActive: true,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      },
      {
        id: 604,
        title: 'email.inbox',
        iconPrefix: 'fad',
        icon: 'inbox',
        url: '/mail/inbox',
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
        id: 605,
        title: 'account.mydocuments',
        iconPrefix: 'fad',
        icon: 'folder-open',
        url: '/smartclass/documents',
        appUrl: 'documents',
        position: 2,
        isActive: true,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      },
      {
        id: 606,
        title: 'account.myappointments',
        iconPrefix: 'fad',
        icon: 'calendar-check',
        url: '/smartclass/myAppointments',
        appUrl: '',
        position: 3,
        isActive: true,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      },
      {
        id: 608,
        title: 'announcements',
        iconPrefix: 'fad',
        icon: 'bell',
        url: '/smartclass/myAnnouncements',
        appUrl: '',
        position: 4,
        isActive: true,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      },
      {
        id: 609,
        title: 'account.googledrive',
        iconPrefix: 'fad',
        icon: 'folder',
        url: '/smartclass/googleDrive',
        appUrl: '',
        position: 6,
        isActive: false,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      },
      {
        id: 610,
        title: 'account.googlecalendar',
        iconPrefix: 'fad',
        icon: 'calendar',
        url: '/smartclass/googleCalendar',
        appUrl: '',
        position: 7,
        isActive: false,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      },
      {
        id: 611,
        title: 'accounts',
        iconPrefix: 'fad',
        icon: 'envelope',
        url: '/smartclass/myAccounts',
        appUrl: '',
        position: 8,
        isActive: false,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      },
      {
        id: 612,
        title: 'account.filemanager',
        iconPrefix: 'fad',
        icon: 'folder-open',
        url: '/smartclass/mydocuments',
        appUrl: '',
        position: 9,
        isActive: false,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      }
    ]
  },
  {
    id: 613,
    title: 'school.management.school.management',
    iconPrefix: 'fad',
    icon: 'chalkboard',
    url: '',
    appUrl: '/',
    position: 1,
    isActive: true,
    isFlex: true,
    isEssential: true,
    isProfessional: true,
    isEnterprise: true,
    isAdmin: false,
    parent: null,
    children: [
      {
        id: 614,
        title: 'school.management.classes',
        iconPrefix: 'fad',
        icon: 'book',
        url: '/smartclass/classes',
        appUrl: 'classes',
        position: 0,
        isActive: true,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      },
      {
        id: 619,
        title: 'school.management.book_appointment',
        iconPrefix: 'fad',
        icon: 'calendar',
        url: '/smartclass/appointments',
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
        id: 615,
        title: 'school.performancesurveys',
        iconPrefix: 'fad',
        icon: 'tachometer',
        url: '/smartclass/performanceSurveys',
        appUrl: '',
        position: 2,
        isActive: false,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      },
      {
        id: 659,
        title: 'supportunits.food_lists',
        iconPrefix: 'fad',
        icon: 'utensils',
        url: '/smartclass/foodLists',
        appUrl: '',
        position: 3,
        isActive: true,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      },
      {
        id: 656,
        title: 'erp.meetings',
        iconPrefix: 'fad',
        icon: 'user-circle',
        url: '/smartclass/meetings',
        appUrl: '',
        position: 4,
        isActive: true,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      },
      {
        id: 661,
        title: 'store.store',
        iconPrefix: 'fad',
        icon: 'shopping-cart',
        url: '/store',
        appUrl: '',
        position: 5,
        isActive: true,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      },
      {
        id: 616,
        title: 'school.management.study_appointments',
        iconPrefix: 'fad',
        icon: 'calendar',
        url: '/smartclass/studyAppointment',
        appUrl: '',
        position: 6,
        isActive: false,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      },
      {
        id: 617,
        title: 'school.management.ptm_appointments',
        iconPrefix: 'fad',
        icon: 'calendar',
        url: '/smartclass/appointments',
        appUrl: '',
        position: 7,
        isActive: false,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      },
      {
        id: 618,
        title: 'school.management.scholarship_appointments',
        iconPrefix: 'fad',
        icon: 'calendar',
        url: '/smartclass/scholarshipAppointments',
        appUrl: '',
        position: 8,
        isActive: false,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      },
      {
        id: 620,
        title: 'school.management.book_scholarship_appointment',
        iconPrefix: 'fad',
        icon: 'calendar',
        url: '/smartclass/scholarshipAppointments',
        appUrl: '',
        position: 9,
        isActive: false,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      },
      {
        id: 754,
        title: 'forms.parent_forms',
        iconPrefix: 'fad',
        icon: 'user-circle',
        url: '/smartclass/parentForms',
        appUrl: '',
        position: 10,
        isActive: true,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      },
      {
        id: 777,
        title: 'supportunits.activities',
        iconPrefix: 'fad',
        icon: 'ticket',
        url: '/smartclass/activityLists',
        appUrl: '',
        position: 11,
        isActive: true,
        isFlex: true,
        isEssential: true,
        isProfessional: true,
        isEnterprise: true,
        isAdmin: false
      }
    ]
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
