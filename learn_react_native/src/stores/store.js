import { createStore, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';  // Import redux-thunk for handling async actions
import { thunk } from 'redux-thunk';
// import { composeWithDevTools } from 'redux-devtools-extension'; // Optional: For debugging with Redux DevTools
import rootReducer from './reducers'; // Import the root reducer

const store = createStore(
  rootReducer,
  applyMiddleware(thunk) // Apply middleware and enable Redux DevTools
);

export default store;
