import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  ADMIN_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  isAdmin: null
};

export default function (state = initialState, action) {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case ADMIN_LOADED:
    case USER_LOADED:  
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
        isAdmin: payload.isAdmin
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        isAdmin: payload.isAdmin
      };
    case LOGOUT:
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
      localStorage.removeItem('token');
      return {
         ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        isAdmin: false
      };
    default:
      return state;
  }
}