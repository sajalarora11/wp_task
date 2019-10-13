import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  LOGOUT,
  AUTH_ERROR,
  OTP_SENT,
  KEEP_LOGIN
} from "../Types";

export default (state, action) => {
  switch (action.type) {
    case OTP_SENT:
      return {
        ...state,
        otp_sent: true,
        errMsg: action.payload
      };

    case REGISTER_FAIL:
      return {
        ...state,
        errMsg: action.payload,
        otp_sent: false
      };

    case REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.data.token);
      return {
        ...state,
        isAuth: true,
        user: action.payload.data.user,
        token: action.payload.data.token
      };

    case LOGIN_FAIL:
      return {
        ...state,
        isAuth: false,
        errMsg: action.payload
      };

    case KEEP_LOGIN:
      return {
        ...state,
        isAuth: true
      };

    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload);
      return {
        ...state,
        isAuth: true,
        opt_verified: true
      };

    case LOGOUT:
      delete localStorage.token;
      return {
        ...state,
        isAuth: false,
        user: null,
        token: null
      };

    case USER_LOADED:
      return {
        ...state,
        isAuth: true,
        user: action.payload
      };

    case AUTH_ERROR:
      delete localStorage.getItem("token");
      return {
        ...state,
        isAuth: false
      };

    default:
      return state;
  }
};
