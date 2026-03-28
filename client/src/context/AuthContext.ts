import { createContext, type Dispatch, type SetStateAction } from "react";

type AuthContextT = {
  accessToken: string | null;
  setAccessToken: Dispatch<SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextT>({
  accessToken: null,
  setAccessToken: () => {},
});

export default AuthContext;
