import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import history from './history';
import moduleReducers from '../reducers';
import ApiClient from './api-client';
import clientMiddleware from './client-middleware';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const api = new ApiClient();

function configureStore(history, preLoadedState) {
  const middlewares = [
    thunkMiddleware.withExtraArgument(api),
    clientMiddleware(api),
  ];

  if (process.env.NODE_ENV !== 'production') {
    if (!window.devToolsExtension) {
      const { logger } = require('redux-logger');
      middlewares.push(logger);
    }
  }

  const enhancer = compose(
    applyMiddleware(...middlewares),
    // other store enhancers if any,
    window.devToolsExtension
      ? window.devToolsExtension({
          name: 'Medicaar',
          actionsBlacklist: ['REDUX_STORAGE_SAVE'],
          latency: 0,
        })
      : (noop) => noop,
  );

  const persistenceConfigs = {
    key: 'gmtcare', // whatever you want to keep as your key
    storage,
  };
  const persistedReducer = persistReducer(persistenceConfigs, moduleReducers);

  return createStore(persistedReducer, enhancer);
}

const store = configureStore(history);
const persistedStore = persistStore(store);

export { store, history, persistedStore };
