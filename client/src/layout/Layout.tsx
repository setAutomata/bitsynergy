import "./Layout.css";
import { useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import ThemeContext from "../context/ThemeContext";
import Logo from "../assets/images/logo.svg?react";

function Layout() {
  const { colorScheme } = useContext(ThemeContext);

  return (
    <div className={colorScheme.dark ? "layout" : "layout light"}>
      <div className="layout__main">
        <Logo width="15rem" color="var(--accentColor)" />
        <Outlet />
      </div>
      <footer>
        <Link to="https://google.com">123456789 · Contact us</Link>
      </footer>
    </div>
  );
}

export default Layout;
