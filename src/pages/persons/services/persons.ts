import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import objectPath from 'object-path';
import { put, takeLatest } from '@redux-saga/core/effects';
import { createSelector } from 'reselect';
import produce from 'immer';

import { IAction, TPhase } from 'store/store';
import { createPerson, deletePerson, updatePerson } from 'graphql/mutations';
import { API } from 'aws-amplify';
import { listPeople } from 'graphql/queries';

export interface IPerson {
  id?: string;
  ssnNumber?: string;
  schoolNumber?: string;
  name: string;
  secondName: string;
  lastName: string;
  birthDate: Date;
  gender: string;
  studentPicture: string;
  occupation: string;
  graduationPeriod: string;
  graduationStatus: string;
  educationStatus: string;
  maritalStatus: string;
  phoneNumber: string;
  email: string;
  linkedinUrl: string;
  twitterUrl: string;
  facebookUrl: string;
}

interface IPersonState {
  persons: IPerson[];
  phase: string;
  error?: string;
  nextToken: string;
}
type TActionAllState = IPersonState & {
  id: string;
  person: IPerson;
  personInfo: Partial<IPerson>;
};

export const actionTypes = {
  PULL_PERSONS: 'persons/PULL_PERSONS',
  SET_PERSONS: 'persons/SET_PERSONS',
  ADD_PERSON: 'persons/ADD_PERSON',
  UPDATE_PERSON: 'persons/UPDATE_PERSON',
  DELETE_PERSON: 'persons/DELETE_PERSON',
  SET_PERSON: 'persons/SET_PERSON',
  REMOVE_PERSON: 'persons/REMOVE_PERSON',
  SET_PHASE: 'persons/SET_PHASE'
};

export const initialState: IPersonState = {
  persons: [],
  phase: null,
  error: null,
  nextToken: null
};

export const personsSelector = createSelector(
  (state: IPersonState) => objectPath.get(state, ['persons', 'persons']),
  (persons: IPerson[]) => persons
);
export const personsPhaseSelector = createSelector(
  (state: IPersonState) => objectPath.get(state, ['persons', 'phase']),
  (phase: string) => phase
);

export const reducer = persistReducer(
  { storage, key: 'persons' },
  (state: IPersonState = initialState, action: IAction<TActionAllState>): IPersonState => {
    switch (action.type) {
      case actionTypes.SET_PERSONS: {
        const { persons } = action.payload;
        return { ...state, persons };
      }
      case actionTypes.SET_PERSON: {
        const { person } = action.payload;
        return produce(state, (draftState) => {
          const index = draftState.persons.findIndex((d) => d.id === person.id);
          if (index > -1) {
            draftState.persons[index] = person;
          } else {
            draftState.persons.unshift(person);
          }
        });
      }
      case actionTypes.REMOVE_PERSON: {
        const { id } = action.payload;
        const persons = { ...state }.persons.filter((d) => d.id !== id);
        return { ...state, persons };
      }
      case actionTypes.SET_PHASE: {
        const { phase, error } = action.payload;
        return { ...state, phase, error };
      }
      default:
        return state;
    }
  }
);

export const personActions = {
  pullPersons: (): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_PERSONS
  }),
  setPersons: (persons: IPerson[]): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PERSONS,
    payload: { persons }
  }),
  addPerson: (personInfo: Partial<IPerson>): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.ADD_PERSON,
    payload: { personInfo }
  }),
  updatePerson: (personInfo: Partial<IPerson>): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_PERSON,
    payload: { personInfo }
  }),
  setPerson: (person: IPerson): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PERSON,
    payload: { person }
  }),
  deletePerson: (id: string): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.DELETE_PERSON,
    payload: { id }
  }),
  removePerson: (id: string): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.REMOVE_PERSON,
    payload: { id }
  }),
  setPhase: (phase: string, error?: string): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: { phase, error }
  })
};

export function* saga() {
  yield takeLatest(actionTypes.PULL_PERSONS, function* pullPersonsSaga() {
    yield put(personActions.setPhase('loading'));

    try {
      const { data } = yield API.graphql({
        query: listPeople,
        authMode: 'AMAZON_COGNITO_USER_POOLS'
      });

      if (data) {
        const persons = data.listPeople.items;
        const nextToken = data.listPeople.nextToken;
        yield put(personActions.setPersons(persons));
        yield put(personActions.setPhase('success'));
      } else {
        yield put(personActions.setPhase('error', 'Error occurred!'));
      }
    } catch (error) {
      yield put(personActions.setPhase('error', error));
    }
  });

  yield takeLatest(
    actionTypes.ADD_PERSON,
    function* addPersonSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(personActions.setPhase('adding'));

      const { personInfo } = payload;
      try {
        const { data } = yield API.graphql({
          query: createPerson,
          variables: {
            input: {
              ssn_number: personInfo.ssnNumber,
              school_number: personInfo.schoolNumber,
              name: personInfo.name,
              second_name: personInfo.secondName,
              last_name: personInfo.lastName,
              birth_date: personInfo.birthDate,
              gender: 'MALE',
              student_picture: personInfo.studentPicture,
              occupation: personInfo.occupation,
              graduation_period: personInfo.graduationPeriod,
              graduation_status: personInfo.graduationStatus,
              education_status: personInfo.educationStatus,
              marital_status: 'SINGLE',
              phone_number: personInfo.phoneNumber,
              email: personInfo.email,
              linkedin_url: personInfo.linkedinUrl,
              twitter_url: personInfo.twitterUrl,
              facebook_url: personInfo.facebookUrl
            }
          },
          authMode: 'AMAZON_COGNITO_USER_POOLS'
        });

        if (data) {
          yield put(personActions.setPerson(data.createPerson));
          yield put(personActions.setPhase('success'));
        } else {
          yield put(personActions.setPhase('error', 'Error occurred!'));
        }
      } catch (error) {
        yield put(personActions.setPhase('error', error));
      }
    }
  );

  yield takeLatest(
    actionTypes.UPDATE_PERSON,
    function* updatePersonSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(personActions.setPhase('updating'));

      const { personInfo } = payload;
      try {
        const { data } = yield API.graphql({
          query: updatePerson,
          variables: {
            input: {
              id: personInfo.id,
              ssn_number: personInfo.ssnNumber,
              school_number: personInfo.schoolNumber,
              name: personInfo.name,
              second_name: personInfo.secondName,
              last_name: personInfo.lastName,
              birth_date: personInfo.birthDate,
              gender: personInfo.gender,
              student_picture: personInfo.studentPicture,
              occupation: personInfo.occupation,
              graduation_period: personInfo.graduationPeriod,
              graduation_status: personInfo.graduationStatus,
              education_status: personInfo.educationStatus,
              marital_status: personInfo.maritalStatus,
              phone_number: personInfo.phoneNumber,
              email: personInfo.email,
              linkedin_url: personInfo.linkedinUrl,
              twitter_url: personInfo.twitterUrl,
              facebook_url: personInfo.facebookUrl
            }
          },
          authMode: 'AMAZON_COGNITO_USER_POOLS'
        });

        if (data) {
          yield put(personActions.setPerson(data.updatePerson));
          yield put(personActions.setPhase('success'));
        } else {
          yield put(personActions.setPhase('error', 'Error occurred!'));
        }
      } catch (error) {
        yield put(personActions.setPhase('error', error));
      }
    }
  );

  yield takeLatest(
    actionTypes.DELETE_PERSON,
    function* deletePersonSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(personActions.setPhase('deleting'));

      const { id } = payload;
      try {
        const { data } = yield API.graphql({
          query: deletePerson,
          variables: { input: { id: id } },
          authMode: 'AMAZON_COGNITO_USER_POOLS'
        });

        if (data) {
          yield put(personActions.removePerson(id));
          yield put(personActions.setPhase('success'));
        } else {
          yield put(personActions.setPhase('error', 'Error occurred!'));
        }
      } catch (error) {
        yield put(personActions.setPhase('error', error));
      }
    }
  );
}
