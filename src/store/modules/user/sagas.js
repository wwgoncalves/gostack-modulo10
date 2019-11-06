import { Alert } from 'react-native';
import { takeLatest, call, put, all } from 'redux-saga/effects';

import { updateProfileSuccess, updateProfileFailure } from './actions';
import api from '~/services/api';

export function* updateProfile({ payload }) {
  const { name, email, avatar_id, ...rest } = payload.data;

  const profile = { name, email, avatar_id, ...(rest.oldPassword ? rest : {}) };

  try {
    const response = yield call(api.put, 'users', profile);

    Alert.alert('Update success', 'Profile successfully updated.');

    yield put(updateProfileSuccess(response.data));
  } catch (error) {
    Alert.alert('Update error', 'Error updating profile, check your data.');

    yield put(updateProfileFailure());
  }
}

export default all([takeLatest('@user/UPDATE_PROFILE_REQUEST', updateProfile)]);
