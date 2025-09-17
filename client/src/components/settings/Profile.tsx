import { useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import AuthContext from "../../context/AuthContext";
import * as utils from "../../utils/utils";
import * as apiCalls from "../../request/apiCalls";
import "./Profile.css";
import Toggle from "../ui/Toggle";

type JwtPayloadCustomT = {
  email: string;
};

type ProfilePropsT = {
  newChat: () => void;
};

function Profile({ newChat }: ProfilePropsT) {
  const { accessToken, setAccessToken } = useContext(AuthContext);
  const decoded = accessToken && jwtDecode<JwtPayloadCustomT>(accessToken);
  const email = accessToken && jwtDecode<JwtPayloadCustomT>(accessToken).email;
  const local = decoded && utils.formatEmail(decoded.email);
  const [isDeleted, setIsDeleted] = useState(0);

  async function logout() {
    const result = await apiCalls.logout();
    if (result) setAccessToken(null);
    else throw Error(result);
  }

  async function deleteAllChats() {
    const resp = await apiCalls.deleteChat("*", email as string);
    if (resp) {
      newChat();
      setIsDeleted(1);
    }
  }

  async function deleteAccount() {
    const resp = await apiCalls.deleteAccount(email as string);
    if (resp) {
      toast.info(`Successfully deleted ${email}`);
      setAccessToken(null);
    }
  }

  return (
    <div className="profile">
      <div className="profile__row">
        <div>Name</div>
        <div>{decoded ? decoded.email.split("@")[0] : ""}</div>
      </div>
      <div className="insetLine"></div>
      <div className="profile__row">
        <div>Email address</div>
        <div>{local}</div>
      </div>
      <div className="insetLine"></div>
      <div className="profile__row">
        <div>Phone number</div>
        <div>-</div>
      </div>
      <div className="insetLine"></div>
      <div className="profile__row">
        <div className="prof-text-container">
          <div>Improve the model for everyone</div>
          <div className="prof-small-content">
            Allow your content to be used to train our models and improve our
            services. We secure your data privacy.
          </div>
        </div>
        <div>
          <Toggle />
        </div>
      </div>
      <div className="insetLine"></div>
      <div className="profile__row">
        <div>Log out of all devices</div>
        <button className="prof-logout" onClick={logout}>
          Log out
        </button>
      </div>
      <div className="insetLine"></div>
      <div className="profile__row">
        <div>Delete all chats</div>
        <button
          className="prof-del-btn"
          onClick={deleteAllChats}
          style={isDeleted === 1 ? { opacity: "0.4" } : { opacity: "1" }}
          disabled={isDeleted === 1}
        >
          {isDeleted === 1 ? "Deleted" : "Delete all"}
        </button>
      </div>
      <div className="insetLine"></div>
      <div className="profile__row">
        <div>Delete account</div>
        <button className="prof-del-btn" onClick={deleteAccount}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default Profile;
