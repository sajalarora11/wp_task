import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../context/auth/Context";

const Register = props => {
  const authContext = useContext(AuthContext);

  const { register, isAuth, errMsg } = authContext;

  useEffect(() => {
    console.log(isAuth);
    if (isAuth) props.history.push("/dashboard");
  });

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    phone: ""
  });

  const [emailError, emailErrorState] = useState("");
  const [usernameError, usernameErrorState] = useState("");
  const [phoneError, phoneErrorState] = useState("");
  const [pass1Error, pass1ErrorState] = useState("");
  const [pass2Error, pass2ErrorState] = useState("");

  const { username, email, password, password2, phone } = user;

  const onChange = event => {
    emailErrorState("");
    usernameErrorState("");
    phoneErrorState("");
    pass1ErrorState("");
    pass2ErrorState("");
    setUser({
      ...user,
      [event.target.name]: event.target.value
    });
  };

  const sendOTP = event => {
    event.preventDefault();
    if (username.length < 6)
      usernameErrorState("Username must be between 6 and 18");
    else usernameErrorState("");
    if (email.length < 5 || !email.includes("@"))
      emailErrorState("Invalid Email");
    else emailErrorState("");
    if (phone.length !== 10)
      phoneErrorState("Phone number must be exactly of 10 digits");
    else phoneErrorState("");
    if (password.length < 8 || password.length > 18)
      pass1ErrorState("Password should be within 8 to 18 charachters");
    else pass1ErrorState("");
    if (password2.length !== password.length)
      pass2ErrorState("Passwords doesn't match");
    else pass2ErrorState("");
    if (
      usernameError === "" &&
      emailError === "" &&
      phoneError === "" &&
      pass1Error === "" &&
      pass2Error === ""
    ) {
      register(user);
    }
  };

  return (
    <div className="card bg-light">
      <article className="card-body mx-auto" style={{ maxWidth: "400px" }}>
        <h4 className="card-title mt-3 text-center">Create Account</h4>
        <p className="text-center">Get started with your free account</p>
        <p>
          <a href="/" className="btn btn-block btn-google">
            <i className="fab fa-google"></i>   Login via Google
          </a>
        </p>
        <p className="divider-text">
          <span className="bg-light">OR</span>
        </p>
        <strong style={{ color: "red" }}>{errMsg}</strong>
        <form onSubmit={sendOTP}>
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fa fa-user"></i>{" "}
              </span>
            </div>
            <input
              name="username"
              value={username}
              className="form-control"
              placeholder="Username"
              type="text"
              onChange={onChange}
            />
          </div>
          <strong style={{ color: "red" }}>{usernameError}</strong>

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
          <strong style={{ color: "red" }}>{emailError}</strong>

          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fa fa-phone"></i>{" "}
              </span>
            </div>

            <input
              name="phone"
              className="form-control"
              placeholder="Phone number"
              type="text"
              value={phone}
              onChange={onChange}
            />
          </div>
          <strong style={{ color: "red" }}>{phoneError}</strong>

          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fa fa-lock"></i>{" "}
              </span>
            </div>
            <input
              className="form-control"
              placeholder="Create password"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
            />
          </div>
          <strong style={{ color: "red" }}>{pass1Error}</strong>

          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fa fa-lock"></i>{" "}
              </span>
            </div>
            <input
              className="form-control"
              placeholder="Repeat password"
              type="password"
              name="password2"
              value={password2}
              onChange={onChange}
            />
          </div>
          <strong style={{ color: "red" }}>{pass2Error}</strong>

          <div className="form-group">
            <button type="submit" className="btn btn-primary btn-block">
              Create Account{" "}
            </button>
          </div>
          <p className="text-center">
            Have an account? <Link to="/login">Log In</Link>
          </p>
        </form>
      </article>
    </div>
  );
};

export default Register;
