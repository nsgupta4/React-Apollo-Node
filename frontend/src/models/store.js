import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './index';
import thunkMiddleware from 'redux-thunk';

const createStoreWithMiddleware = compose(
  applyMiddleware(
    thunkMiddleware,
  ),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

export default function configureStore() {
  const store = createStoreWithMiddleware(rootReducer);
  return store;
}