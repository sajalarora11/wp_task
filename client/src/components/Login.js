import React, { Fragment, useState, useContext, useEffect } from "react";

import AuthContext from "../context/auth/Context";

const Login = props => {
  const authContext = useContext(AuthContext);

  const {
    emailLogin,
    errMsg,
    isAuth,
    otp_sent,
    phoneLogin,
    verifyOtp
  } = authContext;

  useEffect(() => {
    if (isAuth) props.history.push("/dashboard");
  });

  const [user, setUser] = useState({
    email: "",
    password: "",
    phone: "",
    otp: ""
  });

  const { email, password, phone, otp } = user;

  const onChange = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const verifyOTP = e => {
    e.preventDefault();
    verifyOtp({ otp, phone });
  };

  const sendOTP = e => {
    e.preventDefault();
    if (phone !== "") {
      phoneLogin(phone);
    }
    console.log("Send otp");
  };

  const loginUser = e => {
    e.preventDefault();
    if (email !== "" && password !== "") {
      emailLogin(user);
    }
  };

  return (
    <div className="card bg-light">
      <article className="card-body mx-auto" style={{ maxWidth: "400px" }}>
        <h4 className="card-title mt-3 text-center">Login</h4>
        <p className="text-center">Login to your account</p>
        <p>
          <a href="/" className="btn btn-block btn-google">
            <i className="fab fa-google"></i>   Login via Google
          </a>
        </p>

        <p className="divider-text">
          <span className="bg-light">OR</span>
        </p>

        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li className="nav-item">
            <a
              className="nav-link active"
              id="pills-email-tab"
              data-toggle="pill"
              href="#pills-email"
              role="tab"
              aria-controls="pills-email"
              aria-selected="true">
              Login via Email
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="pills-phone-tab"
              data-toggle="pill"
              href="#pills-phone"
              role="tab"
              aria-controls="pills-phone"
              aria-selected="false">
              Login via Phone
            </a>
          </li>
        </ul>

        <form className="tab-content" id="pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="pills-email"
            role="tabpanel"
            aria-labelledby="pills-email-tab">
            <div className="form-group input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="fa fa-envelope"></i>{" "}
                </span>
              </div>
              <input
                name="email"
                className="form-control"
                placeholder="Email address"
                type="email"
                value={email}
                onChange={onChange}
              />
            </div>

            <div className="form-group input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="fa fa-lock"></i>{" "}
                </span>
              </div>
              <input
                className="form-control"
                placeholder="Enter your password"
                type="password"
                name="password"
                value={password}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <button className="btn btn-primary btn-block" onClick={loginUser}>
                Login
              </button>
              <strong style={{ color: "red" }}>{errMsg}</strong>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="pills-phone"
            role="tabpanel"
            aria-labelledby="pills-phone-tab">
            {!otp_sent || otp_sent === null ? (
              <Fragment>
                <div className="form-group input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fa fa-phone"></i>{" "}
                    </span>
                  </div>
                  <input
                    className="form-control"
                    placeholder="Enter your phone number"
                    type="text"
                    name="phone"
                    value={phone}
                    onChange={onChange}
                  />
                </div>
                <div className="form-group">
                  <button
                    className="btn btn-primary btn-block"
                    onClick={sendOTP}>
                    Send OTP
                  </button>
                  <strong style={{ color: "red" }}>{errMsg}</strong>
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <div className="form-group input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="fa fa-lock"></i>{" "}
                    </span>
                  </div>
                  <input
                    name="otp"
                    value={otp}
                    className="form-control"
                    placeholder="Enter 5 digit OTP"
                    type="text"
                    onChange={onChange}
                  />
                </div>

                <div className="form-group">
                  <button
                    className="btn btn-primary btn-block"
                    onClick={verifyOTP}>
                    Submit
                  </button>
                  <strong style={{ color: "red" }}>{errMsg}</strong>
                </div>
              </Fragment>
            )}
          </div>
          <p className="text-center">
            Create a new account <a href="/">Register</a>
          </p>
        </form>
      </article>
    </div>
  );
};

export default Login;
