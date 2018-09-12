import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';
import {reducer as toastrReducer} from 'react-redux-toastr';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore'
import modalsReducer from '../../features/modals/modalReducer';
import authReducer from '../../features/auth/authReducer';
import asyncReducer from '../../features/async/asyncReducer';
import driverReducer from '../../features/driver/driverReducer';
import subscriptionReducer from '../../features/subscription/subscriptionReducer';

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  form: FormReducer,
  modals: modalsReducer,
  auth: authReducer,
  async: asyncReducer,
  driver: driverReducer,
  subscription: subscriptionReducer,
  toastr: toastrReducer
})

export default rootReducer
