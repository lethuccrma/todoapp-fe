import { all } from 'redux-saga/effects';
import AuthSaga from '../auth/auth.saga';
import UserSaga from '../user/user.saga';

function* rootSaga() {
  yield all([AuthSaga(), UserSaga()]);
}

export default rootSaga;
