import React, { useReducer } from "react";
import axios from "axios";
import AuthContext from "./Context";
import AuthReducer from "./Reducer";
import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  USER_LOADED,
  LOGOUT,
  OTP_SENT,
  AUTH_ERROR,
  KEEP_LOGIN
} from "../Types";

const AuthState = props => {
  const initialState = {
    isAuth: null,
    errMsg: null,
    user: null,
    otp_sent: false,
    otp_verified: false
  };

  const serverURL = "http://localhost:5000";
  const OPTION = {
    headers: {
      "Context-Type": "application/json"
    }
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // Methods
  const register = async formData => {
    try {
      const { email, password, username, phone } = formData;
      const res = await axios.post(
        serverURL + "/api/register",
        { email, password, username, phone },
        OPTION
      );
      if (res.status === 200 || res.status === 201)
        dispatch({ type: REGISTER_SUCCESS, payload: res });
      loadUser();
    } catch (err) {
      dispatch({ type: REGISTER_FAIL, payload: err.response.data });
    }
  };

  const loadUser = async () => {
    try {
      const config = {
        headers: {
          "Context-Type": "application/json",
          withCredentials: true
        }
      };
      const res = await axios.get(serverURL + "/api/user/", config);
      console.log(res);
      if (res.status === 200)
        dispatch({ type: USER_LOADED, payload: res.data });
    } catch (err) {
      console.log(err.response);
      dispatch({ type: AUTH_ERROR, payload: err.response.data });
    }
  };

  const phoneLogin = async phone => {
    try {
      const res = await axios.post(
        serverURL + "/api/login-phone",
        { phone },
        OPTION
      );
      if (res.status === 200) dispatch({ type: OTP_SENT, payload: res.data });
    } catch (err) {
      dispatch({ type: LOGIN_FAIL, payload: err.response.data });
    }
  };

  const logout = async () => {
    dispatch({ type: LOGOUT, payload: null });
  };

  const verifyOtp = async ({ phone, otp }) => {
    try {
      const res = await axios.post(
        serverURL + "/api/verify-otp",
        { phone, otp },
        OPTION
      );
      if (res.status === 200)
        dispatch({ type: LOGIN_SUCCESS, payload: res.data });
      loadUser();
    } catch (err) {
      dispatch({ type: LOGIN_FAIL, payload: null });
    }
  };

  const keepLoggedIn = () => {
    if (localStorage.getItem("token"))
      dispatch({ type: KEEP_LOGIN, payload: null });
    else dispatch({ type: AUTH_ERROR, payload: null });
  };

  const emailLogin = async formdata => {
    try {
      const { email, password } = formdata;
      const res = await axios.post(
        serverURL + "/api/login-email",
        { email, password },
        OPTION
      );
      console.log("LOGIN", res);
      if (res.status === 200)
        dispatch({ type: LOGIN_SUCCESS, payload: res.data });
      loadUser();
    } catch (err) {
      dispatch({ type: LOGIN_FAIL, payload: err.response.data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuth: state.isAuth,
        errMsg: state.errMsg,
        user: state.user,
        otp_sent: state.otp_sent,
        otp_verified: state.otp_verified,
        register,
        keepLoggedIn,
        emailLogin,
        phoneLogin,
        loadUser,
        logout,
        verifyOtp
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
