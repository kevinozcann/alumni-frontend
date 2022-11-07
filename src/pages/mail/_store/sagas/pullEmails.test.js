import mockAxios from 'jest-mock-axios';

// import { MAILS_API_URL } from 'store/ApiUrls';

// import { emails } from './_mocks/emails';
import { pullEMails } from './pullEMails';
import { actionTypes } from '../actionTypes';

describe('Pull EMails Saga', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('when API call is successful', () => {
    test('should return emails', () => {
      const user = { id: 'simsek' };
      // const pullEmailsUrl = `${MAILS_API_URL}.json?user=${user.id}&order%5Bemail.sentAt%5D=desc`;

      const gen = pullEMails({ payload: { user } });

      // Test set phase
      const setPhase = gen.next().value;
      expect(setPhase.payload.action.type).toEqual(actionTypes.UPDATE_PHASE);

      // Test api return
      // mockAxios.get.mockResolvedValueOnce({ status: 200, data: emails });
      // const apiCall = gen.next().value;
      // gen.next();
      // expect(mockAxios.get).toHaveBeenCalledWith(pullEmailsUrl);
      // expect(apiCall.payload.action.type).toEqual('mails/UPDATE_PHASE');
      // expect(mock.history.get[0].url).toEqual(pullEmailsUrl);
    });
  });
});
