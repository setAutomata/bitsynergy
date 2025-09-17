import "./Authenticate.css";
import React, { useContext, useState, useMemo } from "react";
import { Link, useNavigate, Form } from "react-router-dom";
import * as utils from "../utils/utils";
import * as apiCall from "../request/apiCalls";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";
import Banner from "../components/Banner/Banner";
import Eye from "../assets/images/eye.svg?react";
import EyeHide from "../assets/images/eye-hide.svg?react";
import Hash from "../assets/images/hash.svg?react";
import Post from "../assets/images/post.svg?react";
import Lock from "../assets/images/lock.svg?react";
import Spinner from "../assets/images/spinner.svg?react";

const codeContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: "1",
};

function Signup() {
  const { setAccessToken } = useContext(AuthContext);
  const { colorScheme } = useContext(ThemeContext);
  const [type, setType] = useState<"password" | "text">("password");
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
    confirmPwd: "",
    code: "",
  });
  const [error, setError] = useState<User>({
    email: "",
    password: "",
    confirmPwd: "",
    code: "",
  });
  const [serverMsg, setServerMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const memoizedBanner = useMemo(
    () => <Banner message={serverMsg} setMsg={setServerMsg} />,
    [serverMsg]
  );

  function validateInput() {
    setUser((prev) => ({ ...prev, email: (user.email as string).trim() }));
    utils.validateEmail(user.email as string, setError);
    utils.validatePassword(user.password as string, setError);
    utils.validateConfirmPwd(user.password as string, setError);
    utils.validateCode(user.code as string, setError);
    if (user.password !== user.confirmPwd)
      setError((prev) => ({
        ...prev,
        confirmPwd: "Passwords did not match",
      }));
  }

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!error.email && !error.password && !error.confirmPwd)
      try {
        let registered: string | undefined = await apiCall.signup(
          user,
          setIsLoading
        );
        if (registered) setServerMsg(registered);
        try {
          const response = await apiCall.authenticate(user, setIsLoading);
          setServerMsg("Logged in successfully!");
          if (response?.data) setAccessToken(response.data.accessToken);
          return navigate("/", { replace: true });
        } catch (error: unknown) {
          if (error instanceof Error) setServerMsg(error.message);
          setAccessToken(null);
        }
      } catch (error: unknown) {
        if (error instanceof Error) setServerMsg("$" + error.message);
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

  function emptyConfirmPassword() {
    setError((prev) => ({ ...prev, confirmPwd: "" }));
  }

  function emptyCode() {
    setError((prev) => ({ ...prev, code: "" }));
  }

  function changePasswordType() {
    type === "text" ? setType("password") : setType("text");
  }

  function goToSignin() {
    navigate("/sign_in");
  }

  return (
    <div
      className={colorScheme.dark ? "auth__container" : "auth__container light"}
    >
      {memoizedBanner}
      <Form method="POST" onSubmit={handleSubmit}>
        <div className="auth__box">
          <section>
            <p>
              Only email registration is supported in your region. One
              bitSynergy account is all you need to access to all bitSynergy
              services.
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
              placeholder="Email address"
              onChange={handleInput}
              onFocus={emptyEmail}
            />
          </div>
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
              placeholder="Password"
              onChange={handleInput}
              onFocus={emptyPassword}
            />
            <button
              className="revealPassword"
              type="button"
              onClick={changePasswordType}
            >
              {type === "password" ? <Eye /> : <EyeHide />}
            </button>
          </div>
          <div className="error">{error.password}</div>
          {/* ----------------------- */}
          <div
            className="auth__input"
            style={
              error.confirmPwd
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
              name="confirmPwd"
              placeholder="Confirm Password"
              onChange={handleInput}
              onFocus={emptyConfirmPassword}
            />
            <button
              className="revealPassword"
              type="button"
              onClick={changePasswordType}
            >
              {type === "password" ? <Eye /> : <EyeHide />}
            </button>
          </div>
          <div className="error">{error.confirmPwd}</div>
          {/* ----------------------- */}
          <div className="code__container">
            <div style={codeContainerStyle}>
              <div
                className="auth__input"
                style={
                  error.code
                    ? {
                        borderColor: "var(--error-border)",
                        background: "#41000036",
                      }
                    : {}
                }
              >
                <Hash />
                <input
                  type="tel"
                  name="code"
                  maxLength={6}
                  defaultValue={1234}
                  placeholder="Code"
                  onChange={handleInput}
                  onFocus={emptyCode}
                />
              </div>
              <div className="error" style={{ padding: "0.5rem 0 0 0.5rem" }}>
                {error.code}
              </div>
            </div>
            <button type="button" className="sendCode">
              Send code
            </button>
          </div>
          {/* ----------------------- */}
          <p>
            By signing up or logging in, you consent to bitSynergy's{" "}
            <Link to="">Terms of Use</Link> and{" "}
            <Link to="">Privacy Policy.</Link>
          </p>
          {/* ----------------------- */}
          <button type="submit" className="login-btn" onClick={validateInput}>
            {isLoading && <Spinner width="20" />}
            <strong>Sign up</strong>
          </button>
          {/* ----------------------- */}
          <button type="button" className="last-login" onClick={goToSignin}>
            Log in
          </button>
        </div>
      </Form>
    </div>
  );
}

export default Signup;
