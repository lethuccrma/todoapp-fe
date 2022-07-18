import { all } from 'redux-saga/effects';
import AuthSaga from '../auth/auth.saga';

function* rootSaga() {
  yield all([AuthSaga()]);
}

export default rootSaga;
