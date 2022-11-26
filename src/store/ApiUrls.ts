import { TMenuType } from '../pages/admin/menu-types';
import { generateApiLegacyUrl } from '../utils/Helpers';
import { TLang } from '../utils/shared-types';

// Global Api Url
export const globalApiUrl = 'https://api.schoost.com';

// Base Url for backend api
export const SCHOOST_API_URL =
  (process.env.NODE_ENV === 'production' &&
    window &&
    window.location &&
    generateApiLegacyUrl(window.location.host, 'api')) ||
  process.env.REACT_APP_SCHOOST_API_URL;

export const backendBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://' + SCHOOST_API_URL
    : process.env.REACT_APP_SCHOOST_API_URL;
export const localeBaseUrl = `${backendBaseUrl}/{lang}`;
export const apiBaseUrl = `${backendBaseUrl}/api`;

// Backend Urls
export const CONFIGURATION_URL = localeBaseUrl + '/configuration';
export const DASHBOARD_BASIC_STATS_URL = localeBaseUrl + '/dashboard/{schoolId}/basics/stats';
export const DASHBOARD_DAILY_CASH_STATS_URL =
  localeBaseUrl + '/dashboard/{schoolId}/daily-cash/stats/{period}';
export const DASHBOARD_ENROLLMENT_STATS_URL =
  localeBaseUrl + '/dashboard/{schoolId}/enrollment/stats/{period}';
export const DASHBOARD_ENROLLMENT_OVERVIEW_URL =
  localeBaseUrl + '/dashboard/{schoolId}/enrollment/overview/{schoolId}';
export const DASHBOARD_HELPDESK_INCIDENTS_URL =
  localeBaseUrl + '/dashboard/{schoolId}/helpdesk/incidents';
export const DASHBOARD_SCHOOL_USAGE_STATS_URL = localeBaseUrl + '/dashboard/school-usage/stats';
export const FEEDS_LANG_API_URL = localeBaseUrl + '/feeds';
export const FILEMANAGER_USER_URL = localeBaseUrl + '/filemanager/users/{userId}';
export const FILEMANAGER_SCHOOL_URL = localeBaseUrl + '/filemanager/schools/{schoolId}';
export const RESET_PASSWORD_URL = localeBaseUrl + '/reset-password';
export const SCHOOL_CONFIGURATION_URL = localeBaseUrl + '/schools/{schoolId}/configuration';
export const SEARCH_URL = localeBaseUrl + '/search/{userId}/{context}';
export const SEASONS_URL = localeBaseUrl + '/seasons/copy-data';
export const MENUS_LANG_API_URL = localeBaseUrl + '/menus';
export const ONLINE_CLASSES_URL = localeBaseUrl + '/online-classes';
export const STORE_TOKEN_API_URL = localeBaseUrl + '/stores/{schoolId}/token';
export const STORE_CUSTOMER_TOKEN_URL = localeBaseUrl + '/stores/{schoolId}/customer-token';
export const USER_GENERATE_API_KEY_URL = localeBaseUrl + '/users/{userId}/generate-api-key';
export const USER_LOGIN_URL = localeBaseUrl + '/login';
export const USER_MENUS_URL = localeBaseUrl + '/users/{userId}/{schoolId}/menus';
export const USER_NOTIFICATIONS_URL = localeBaseUrl + '/users/{userId}/notifications';
export const USER_PERSONAL_URL = localeBaseUrl + '/users/{userId}/personal';
export const USER_SCHOOLS_URL = localeBaseUrl + '/users/{userId}/schools';
export const USER_STUDENTS_URL = localeBaseUrl + '/users/{userId}/students';
export const USER_TRANSFER_SCHOOLS_URL = localeBaseUrl + '/users/{userId}/transfer-schools';
export const VERIFY_EMAIL_URL = localeBaseUrl + '/verify-email';

// Api platform urls
export const ACCOUNT_CODES_API_URL = apiBaseUrl + '/account_codes';
export const CLASS_TYPES_API_URL = apiBaseUrl + '/teacher_class_types';
export const CLASSES_API_URL = apiBaseUrl + '/classses';
export const CLASS_TEACHERS_URL = apiBaseUrl + '/class_teachers';
export const COMMENTS_API_URL = apiBaseUrl + '/comments';
export const CONFIGURATIONS_API_URL = apiBaseUrl + '/configurations';
export const DATABASES_API_URL = apiBaseUrl + '/season_databases';
export const FREQUENT_MENUS_API_URL = apiBaseUrl + '/frequent_menus';
export const FEEDS_API_URL = apiBaseUrl + '/feeds';
export const FACEBOOK_USERS_URL = apiBaseUrl + '/facebook_users';
export const FILES_API_URL = apiBaseUrl + '/files';
export const INCOME_EXPENSE_API_URL = apiBaseUrl + '/income_expenses';
export const INSTALLMENTS_API_URL = apiBaseUrl + '/installments';
export const GOOGLE_USERS_URL = apiBaseUrl + '/google_users';
export const GRADE_LEVEL_API_URL = apiBaseUrl + '/grade_levels';
export const GRADING_TERMS_API_URL = apiBaseUrl + '/grading_terms';
export const LIKES_API_URL = apiBaseUrl + '/likes';
export const MAILS_API_URL = apiBaseUrl + '/email_users';
export const MENUS_API_URL = apiBaseUrl + '/menus';
export const ONLINE_CLASSES_API_URL = apiBaseUrl + '/online_classes';
export const PERSONNEL_API_URL = apiBaseUrl + '/personnels';
export const REGISTER_EMAIL_API_URL = apiBaseUrl + '/register_emails';
export const SCHOOLS_API_URL = apiBaseUrl + '/schools';
export const SCHEDULES_API_URL = apiBaseUrl + '/schedules';
export const SEASONS_API_URL = apiBaseUrl + '/seasons';
export const STUDENTS_API_URL = apiBaseUrl + '/students';
export const STUDENT_TAGS_API_URL = apiBaseUrl + '/student_tags';
export const USERS_API_URL = apiBaseUrl + '/users';
export const USERS_TYPES_API_URL = apiBaseUrl + '/user_types';

// Global Api Urls
export const GLOBAL_CITIES_URL = globalApiUrl + '/cities';
export const GLOBAL_COUNTRIES_URL = globalApiUrl + '/countries';
export const GLOBAL_LOCALES_URL = globalApiUrl + '/locales';
export const GLOBAL_MENUS_URL = globalApiUrl + '/menus';
export const GLOBAL_STATES_URL = globalApiUrl + '/states';
export const GLOBAL_UPDATES_URL = globalApiUrl + '/updates';

interface IUpdateUrlOptions {
  lang?: TLang;
  userId?: string;
  schoolId?: number;
  period?: string;
  menuType?: TMenuType;
  context?: string;
}

export const updateApiUrl = (url: string, options: IUpdateUrlOptions): string => {
  Object.keys(options).forEach((key) => {
    if (typeof key !== 'undefined') {
      url = url.replace('{' + key + '}', options[key]);
    }
  });

  return url;
};

// Logos
export const smartclassLogo = 'https://schst.in/smartclass';
export const schoostLogo = 'https://schst.in/schoost';
export const schoostFavicon = 'https://schst.in/icon';
