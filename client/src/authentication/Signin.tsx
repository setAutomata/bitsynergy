import "./Authenticate.css";
import React, { useContext, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  Form,
  type NavigateFunction,
} from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Banner from "../components/Banner/Banner";
import * as utils from "../utils/utils";
import * as apiCall from "../request/apiCalls";
import Post from "../assets/images/post.svg?react";
import Eye from "../assets/images/eye.svg?react";
import EyeHide from "../assets/images/eye-hide.svg?react";
import Lock from "../assets/images/lock.svg?react";
import Google from "../assets/images/google-logo.svg";
import Spinner from "../assets/images/spinner.svg?react";

function Signin() {
  const { setAccessToken } = useContext(AuthContext);
  const [type, setType] = useState<"password" | "text">("password");
  const [user, setUser] = useState<User>({ email: "", password: "" });
  const [error, setError] = useState<User>({ email: "", password: "" });
  const [serverMsg, setServerMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate: NavigateFunction = useNavigate();

  const memoizedBanner = useMemo(
    () => <Banner message={serverMsg} setMsg={setServerMsg} />,
    [serverMsg]
  );

  function validateInput() {
    setUser((prev) => ({ ...prev, email: (user.email as string).trim() }));
    utils.validateEmail(user.email as string, setError);
    utils.validatePassword(user.password as string, setError);
  }

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!error.email && !error.password)
      try {
        const response = await apiCall.authenticate(user, setIsLoading);
        setServerMsg("Logged in successfully!");
        if (response?.data) setAccessToken(response.data.accessToken);
        return navigate("/", { replace: true });
      } catch (error) {
        if (error instanceof Error) setServerMsg(error.message);
        setAccessToken(null);
      }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    utils.handleInputState(e, setUser);
  };

  function emptyEmail() {
    setError((prev) => ({ ...prev, email: "" }));
  }

  function emptyPassword() {
    setError((prev) => ({ ...prev, password: "" }));
  }

  function changePasswordType() {
    type === "text" ? setType("password") : setType("text");
  }

  function goToSignup() {
    navigate("/sign_up");
  }

  function goToForgot() {
    navigate("/forgot_password");
  }

  return (
    <div className="auth__container">
      {memoizedBanner}
      <Form method="POST" onSubmit={handleSubmit}>
        <div className="auth__box">
          <section>
            <p>
              Only login via email, Google, or +86 phone number login is
              supported in your region.
            </p>
          </section>
          {/* ----------------------- */}
          <div
            className="auth__input"
            style={
              error.email
                ? {
                    borderColor: "var(--error-border)",
                    background: "#41000036",
                  }
                : {}
            }
          >
            <Post />
            <input
              type="text"
              name="email"
              onChange={handleInput}
              onFocus={emptyEmail}
              placeholder="Phone number / email address"
            />
          </div>
          {/* ----------------------- */}
          <div className="error">{error.email}</div>
          {/* ----------------------- */}
          <div
            className="auth__input"
            style={
              error.password
                ? {
                    borderColor: "var(--error-border)",
                    background: "#41000036",
                  }
                : {}
            }
          >
            <Lock />
            <input
              type={type}
              name="password"
              onChange={handleInput}
              onFocus={emptyPassword}
              placeholder="Password"
            />
            <button
              className="revealPassword"
              type="button"
              onClick={changePasswordType}
            >
              {type === "password" ? <Eye /> : <EyeHide />}
            </button>
          </div>
          {/* ----------------------- */}
          <div className="error">{error.password}</div>
          {/* ----------------------- */}
          <p>
            By signing up or logging in, you consent to bitSynergy's{" "}
            <Link to="">Terms of Use</Link> and{" "}
            <Link to="">Privacy Policy.</Link>
          </p>
          {/* ----------------------- */}
          <button type="submit" className="login-btn" onClick={validateInput}>
            {isLoading && <Spinner width="20" />}
            <strong>Log in</strong>
          </button>
          {/* ----------------------- */}
          <div className="forget-signup">
            <button type="button" onClick={goToForgot}>
              Forget password?
            </button>
            <button type="button" onClick={goToSignup}>
              Sign up
            </button>
          </div>
          {/* ----------------------- */}
          <span className="OR">
            <hr />
            <p>OR</p>
          </span>
          {/* ----------------------- */}
          <button type="button" className="login-google-btn">
            <img src={Google} alt="google logo" /> Log in with Google
          </button>
        </div>
      </Form>
    </div>
  );
}

export default Signin;
