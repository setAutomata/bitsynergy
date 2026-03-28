import { createContext, type Dispatch, type SetStateAction } from "react";

export type ThemeContextT = {
  colorScheme: { dark: boolean };
  setColorScheme: Dispatch<SetStateAction<{ dark: boolean }>>;
};

const ThemeContext = createContext<ThemeContextT>({
  colorScheme: { dark: true },
  setColorScheme: () => {},
});

export default ThemeContext;
