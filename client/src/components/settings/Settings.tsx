import { useEffect, useRef, useState, type RefObject } from "react";
import General from "./General";
import Profile from "./Profile";
import About from "./About";
import Close from "../../assets/images/close.svg?react";
import "./Settings.css";

type SettingsPropsT = {
  settingsDialogRef: RefObject<HTMLDialogElement | null>;
  onTab: "General" | "Profile" | "About" | undefined;
  newChat: () => void;
};

function Settings({ settingsDialogRef, onTab, newChat }: SettingsPropsT) {
  const [tab, setTab] = useState({
    General: true,
    Profile: false,
    About: false,
  });
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    selectedTab(onTab);
  }, [onTab]);

  useEffect(() => {
    document.addEventListener(
      "click",
      (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        )
          settingsDialogRef.current?.close();
      },
      true
    );
    return () => document.addEventListener("click", () => {}, true);
  }, []);

  function closeSettings() {
    settingsDialogRef.current?.close();
  }

  function selectedTab(tabName: "General" | "Profile" | "About" | undefined) {
    switch (tabName) {
      case "General":
        return setTab((prev) => ({
          ...prev,
          General: true,
          Profile: false,
          About: false,
        }));
      case "Profile":
        return setTab((prev) => ({
          ...prev,
          General: false,
          Profile: true,
          About: false,
        }));
      case "About":
        return setTab((prev) => ({
          ...prev,
          General: false,
          Profile: false,
          About: true,
        }));
    }
  }

  return (
    <dialog className="setting__dialog" ref={settingsDialogRef}>
      <section className="Settings__dialg__container" ref={containerRef}>
        <div className="settings__header">
          <h3>Settings</h3>
          <Close className="closeBtn curs-ptr" onClick={closeSettings} />
        </div>
        <div className="settings__tabs">
          <div
            className={
              tab.General ? "tab__active setting__tab" : "setting__tab"
            }
            role="button"
            onClick={() => selectedTab("General")}
          >
            General
          </div>
          <div
            className={
              tab.Profile ? "tab__active setting__tab" : "setting__tab"
            }
            role="button"
            onClick={() => selectedTab("Profile")}
          >
            Profile
          </div>
          <div
            className={tab.About ? "tab__active setting__tab" : "setting__tab"}
            role="button"
            onClick={() => selectedTab("About")}
          >
            About
          </div>
        </div>
        <main className="settings__content">
          {tab.General && <General />}
          {tab.Profile && <Profile newChat={newChat}/>}
          {tab.About && <About />}
        </main>
      </section>
    </dialog>
  );
}

export default Settings;
