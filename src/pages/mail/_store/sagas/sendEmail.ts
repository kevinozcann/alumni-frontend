import axios from 'axios';

import { MAILS_API_URL } from 'store/ApiUrls';

export function* sendEmail(
  emailId: string,
  userId: string,
  isTo: boolean,
  isCc: boolean,
  isBcc: boolean
) {
  yield axios.post(`${MAILS_API_URL}`, {
    email: emailId,
    user: userId,
    isSender: false,
    isTo: isTo,
    isCc: isCc,
    isBcc: isBcc
  });
}
