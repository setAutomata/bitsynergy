import "./Options.css";
import { useState, useContext, useEffect, useRef, type RefObject } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import * as apiCalls from "../../request/apiCalls";
import AuthContext from "../../context/AuthContext";
import Settings from "../../assets/images/settings.svg?react";
import SettingDialog from "../settings/Settings";
import Contact from "../views/Contact";
import Logout from "../../assets/images/logout.svg?react";
import ContactUs from "../../assets/images/contactus.svg?react";

type OptionsPropsT = {
  profileOptRef: RefObject<HTMLDivElement | null>;
  sidePanel: { open: boolean };
  newChat: () => void;
};

type TabOptionT = "General" | "Profile" | "About";

function Options({ profileOptRef, sidePanel, newChat }: OptionsPropsT) {
  const { accessToken, setAccessToken } = useContext(AuthContext);
  const local =
    accessToken &&
    jwtDecode<JwtPayloadCustomT>(accessToken).email.split("@")[0];
  const [hovered, setHovered] = useState(0);
  const [openTab, setOpenTab] = useState<TabOptionT>();
  const contactRef = useRef<HTMLDivElement>(null);
  const settingsDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const closeSettingsDialog = (e: MouseEvent) => {
      if (
        profileOptRef.current &&
        !profileOptRef.current.contains(e.target as Node)
      ) {
        profileOptRef.current.style.display = "none";
        setHovered(0);
      }
    };

    document.addEventListener(
      "click",
      closeSettingsDialog as unknown as EventListener,
      true
    );

    return () =>
      document.removeEventListener(
        "click",
        closeSettingsDialog as unknown as EventListener,
        true
      );
  }, []);

  function openSettings(isOpen: TabOptionT) {
    setOpenTab(isOpen);
    settingsDialogRef.current?.showModal();
  }

  async function logout() {
    const result = await apiCalls.logout();
    if (result) {
      setAccessToken(null);
      toast.info("You've been logged out!");
    } else return toast.error(result);
  }

  return (
    <div
      className="profileOptions"
      ref={profileOptRef}
      style={sidePanel.open ? { marginBottom: "1.7rem" } : {}}
    >
      <div
        className="option"
        style={
          hovered === 1
            ? {
                justifyContent: "center",
                padding: "0",
                background: "var(--floating-menu-hover)",
              }
            : { justifyContent: "center", padding: "0" }
        }
        onMouseOver={() => setHovered(1)}
        onClick={() => openSettings("Profile")}
      >
        {local}
      </div>

      <div
        className="option"
        onMouseOver={() => setHovered(2)}
        style={
          hovered === 2 ? { background: "var(--floating-menu-hover)" } : {}
        }
        onClick={() => openSettings("General")}
      >
        <Settings width="23" /> Settings
      </div>

      <div
        className="option"
        onMouseOver={() => setHovered(3)}
        onClick={() => {
          if (contactRef.current) contactRef.current.style.display = "flex";
        }}
        style={
          hovered === 3 ? { background: "var(--floating-menu-hover)" } : {}
        }
      >
        <ContactUs width="23" />
        Contact us
      </div>
      
      <div
        className="option"
        onMouseOver={() => setHovered(4)}
        onClick={logout}
        style={
          hovered === 4 ? { background: "var(--floating-menu-hover)" } : {}
        }
      >
        <Logout width="23" />
        Log out
      </div>

      <Contact contactRef={contactRef} />
      <SettingDialog
        settingsDialogRef={settingsDialogRef}
        onTab={openTab}
        newChat={newChat}
      />
    </div>
  );
}

export default Options;
