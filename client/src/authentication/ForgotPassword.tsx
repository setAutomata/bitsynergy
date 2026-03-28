import { useState } from "react";
import ResetPwd from "./ResetPassword";
import CheckUser from "./CheckUser";
import "./Authenticate.css";

function ForgotPwd() {
  const [isUser, setIsUser] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <>
      {!isUser ? (
        <CheckUser setIsUser={setIsUser} setEmail={setEmail} />
      ) : (
        <ResetPwd email={email} />
      )}
    </>
  );
}

export default ForgotPwd;
