import axios from 'axios';
import { put } from 'redux-saga/effects';

import { actionTypes } from 'store/user';
import { TLang } from 'utils/shared-types';
import { updateApiUrl, USER_PERSONAL_URL } from 'store/ApiUrls';
import { IUser } from 'pages/account/account-types';

export function* getUserPersonal(lang: TLang, user: Partial<IUser>) {
  const userPersonalUrl = updateApiUrl(USER_PERSONAL_URL, {
    lang: lang,
    userId: user.uuid
  });
  const { data: personal } = yield axios.get(userPersonalUrl);

  yield put({
    type: actionTypes.USER_PERSONAL_SAVED,
    payload: { personal }
  });
}
