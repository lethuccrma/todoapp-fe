import storage from 'redux-persist/lib/storage';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './root/root.reducer'
import rootSaga from './root/root.saga';

const sagaMiddleware = createSagaMiddleware();

function configStore(preloadedState: any) {
  const middlewares = [sagaMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);

  const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['auth'],
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, preloadedState, composedEnhancers);
  const persistor = persistStore(store);
  return {
    store, persistor,
  };
}

const initState = {};

const { store, persistor } = configStore(initState);

sagaMiddleware.run(rootSaga);

global.window.reduxStore = store;

export { store, persistor };
