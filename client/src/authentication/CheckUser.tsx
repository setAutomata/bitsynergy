import "./Authenticate.css";
import {
  useState,
  useMemo,
  type ChangeEvent,
  type SetStateAction,
} from "react";
import { useNavigate, Form } from "react-router-dom";
import * as utils from "../utils/utils";
import * as apiCall from "../request/apiCalls";
import Banner from "../components/Banner/Banner";
import Post from "../assets/images/post.svg?react";
import Hash from "../assets/images/hash.svg?react";
import Spinner from "../assets/images/spinner.svg?react";

const codeContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: "1",
};

type CheckUserPropsT = {
  setIsUser: React.Dispatch<SetStateAction<boolean>>;
  setEmail: React.Dispatch<SetStateAction<string>>;
};

function CheckUser({ setIsUser, setEmail }: CheckUserPropsT) {
  const [user, setUser] = useState<User>({ email: "", code: "" });
  const [error, setError] = useState<User>({ email: "", code: "" });
  const [serverMsg, setServerMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const memoizedBanner = useMemo(
    () => <Banner message={serverMsg} setMsg={setServerMsg} />,
    [serverMsg]
  );

  function goToSignin() {
    navigate("/sign_in");
  }

  function emptyEmail() {
    setError((prev) => ({ ...prev, email: "" }));
  }

  function emptyCode() {
    setError((prev) => ({ ...prev, code: "" }));
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    utils.handleInputState(e, setUser);
  };

  function validateInput() {
    setUser((prev) => ({ ...prev, email: String(user.email).trim() }));
    utils.validateEmail(String(user.email), setError);
    utils.validateCode(String(user.code), setError);
  }

  async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (serverMsg) setServerMsg("");
    if (!error.email) {
      try {
        const isUser = await apiCall.checkUser(user, setIsLoading);
        if (isUser) {
          setEmail(String(user.email));
          setIsUser(true);
        }
      } catch (error) {
        if (error instanceof Error) setServerMsg("$" + error.message);
      }
    }
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
              Enter your phone number or email address and we will send you a
              verification code to reset your password.
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
              placeholder="Phone number / +86 phone number"
            />
          </div>
          <div className="error">{error.email}</div>
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
                  defaultValue={9999}
                  onChange={handleInput}
                  onFocus={emptyCode}
                  placeholder="Code"
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
          <button type="submit" className="login-btn" onClick={validateInput}>
            {isLoading && <Spinner width="20" />}
            <strong>Continue</strong>
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

export default CheckUser;
