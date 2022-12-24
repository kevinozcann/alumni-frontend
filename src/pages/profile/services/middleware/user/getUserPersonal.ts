import axios from 'axios';
import { put } from 'redux-saga/effects';

import { userActionTypes } from 'pages/profile/services/types';
import { TLang } from 'utils/shared-types';
import { updateApiUrl, USER_PERSONAL_URL } from 'store/ApiUrls';
import { IUser } from 'pages/auth/data/account-types';

export function* getUserPersonal(lang: TLang, user: Partial<IUser>) {
  const userPersonalUrl = updateApiUrl(USER_PERSONAL_URL, {
    lang: lang,
    userId: user.id
  });
  const { data: personal } = yield axios.get(userPersonalUrl);

  yield put({
    type: userActionTypes.USER_PERSONAL_SAVED,
    payload: { personal }
  });
}
