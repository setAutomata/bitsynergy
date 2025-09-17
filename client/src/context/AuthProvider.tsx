import { useState, useEffect, type ReactNode } from "react";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import AuthContext from "./AuthContext";
import * as apiCalls from "../request/apiCalls";

interface AuthProviderPropsT {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderPropsT) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const decoded: JwtPayload | undefined = accessToken
    ? jwtDecode<JwtPayload>(accessToken)
    : undefined;

  const refreshAccessToken = async () => {
    try {
      const newAccessToken = await apiCalls.refreshToken();
      setAccessToken(newAccessToken as string);
    } catch {
      setAccessToken(null);
    }
  };

  useEffect(() => {
    if (!accessToken || !decoded) return;

    const timeLeft = (decoded.exp as number) * 1000 - Date.now();

    if (timeLeft <= 60000) {
      refreshAccessToken();
    } else {
      const timeoutID = setTimeout(refreshAccessToken, timeLeft - 60000);
      return () => clearTimeout(timeoutID);
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
