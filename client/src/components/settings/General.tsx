import "./General.css";
import { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";

function General() {
  const { setColorScheme } = useContext(ThemeContext);

  function handleThemeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value === "system")
      setColorScheme({
        dark: window.matchMedia("(prefers-color-scheme: dark)").matches,
      });
    else setColorScheme({ dark: value === "dark" });
  }

  return (
    <div className="general">
      <div className="__top">
        <div>Language</div>
        <div className="select-container">
          <select className="general__option" defaultValue="System">
            <option value="System">System</option>
            <option value="French">French</option>
            <option value="English">English</option>
          </select>
        </div>
      </div>

      <div className="insetLine"></div>

      <div className="__bottom">
        <div>Theme</div>
        <div className="select-container">
          <select
            className="general__option"
            defaultValue="system"
            onChange={handleThemeChange}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default General;
