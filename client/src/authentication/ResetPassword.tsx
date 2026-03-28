import "./Authenticate.css";
import { useContext, useState, useMemo } from "react";
import { useNavigate, Form } from "react-router-dom";
import * as utils from "../utils/utils";
import * as apiCall from "../request/apiCalls";
import AuthContext from "../context/AuthContext";
import Banner from "../components/Banner/Banner";
import Eye from "../assets/images/eye.svg?react";
import EyeHide from "../assets/images/eye-hide.svg?react";
import Lock from "../assets/images/lock.svg?react";
import Spinner from "../assets/images/spinner.svg?react";

function ResetPwd({ email }: { email: string }) {
  const { setAccessToken } = useContext(AuthContext);
  const [user, setUser] = useState<User>({
    email: email,
    password: "",
    confirmPwd: "",
  });
  const [type, setType] = useState<"password" | "text">("password");
  const [error, setErrorMsg] = useState<User>({ password: "", confirmPwd: "" });
  const [serverMsg, setServerMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const memoizedBanner = useMemo(
    () => <Banner message={serverMsg} setMsg={setServerMsg} />,
    [serverMsg]
  );

  function validateInput() {
    utils.validatePassword(user.password as string, setErrorMsg);
    if (user.password !== user.confirmPwd)
      setErrorMsg((prev) => ({
        ...prev,
        confirmPwd: "Passwords did not match",
      }));
  }

  async function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (serverMsg) setServerMsg("");
    if (!error.password && !error.confirmPwd) {
      try {
        const isUser = await apiCall.updatePassword(user, setIsLoading);
        if (isUser) {
          try {
            setServerMsg("Successfuly changed Password");
            const response: { data: { accessToken: string } } | undefined =
              await apiCall.authenticate(user, setIsLoading);
            if (response) setAccessToken(response.data.accessToken);
            return navigate("/", { replace: true });
          } catch (error) {
            setServerMsg(error as string);
            setAccessToken(null);
          }
        }
      } catch (error) {
        if (error instanceof Error) setServerMsg("$" + error.message);
      }
    }
  }

  function goToSignin() {
    navigate("/sign_in");
  }

  function changePasswordType() {
    type === "text" ? setType("password") : setType("text");
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    utils.handleInputState(e, setUser);
  };

  function emptyPassword() {
    setErrorMsg((prev) => ({ ...prev, password: "" }));
  }

  function emptyConfirmPassword() {
    setErrorMsg((prev) => ({ ...prev, confirmPwd: "" }));
  }

  return (
    <div className="auth__container">
      {memoizedBanner}
      <Form method="POST" onSubmit={handleSubmit}>
        <div className="auth__box">
          <section>
            <h2>Reset password</h2>
            <p
              style={{
                fontSize: "0.9rem",
                textAlign: "center",
                margin: "1rem 0.2rem",
              }}
            >
              Enter new password and Confirm Password.
            </p>
          </section>
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
              placeholder="New Password"
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
          <button type="submit" className="login-btn" onClick={validateInput}>
            {isLoading && <Spinner width="20" />}
            <strong>Reset</strong>
          </button>
          {/* ----------------------- */}
          <button type="button" className="last-login" onClick={goToSignin}>
            Back to log in
          </button>
        </div>
      </Form>
    </div>
  );
}

export default ResetPwd;
