import { useState, useEffect, type ReactNode } from "react";
import ThemeContext from "./ThemeContext";

type ThemeProviderT = {
  children: ReactNode;
};

function ThemeProvider({ children }: ThemeProviderT) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const [colorScheme, setColorScheme] = useState({
    dark: mediaQuery.matches,
  });

  useEffect(() => {
    const handleColorSchemeChange = (e: MediaQueryListEvent) =>
      setColorScheme({ dark: e.matches });

    mediaQuery.addEventListener("change", handleColorSchemeChange);

    return () =>
      mediaQuery.removeEventListener("change", handleColorSchemeChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
