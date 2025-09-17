import "./Authenticate.css";
import { useContext, useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import * as apiCall from "../request/apiCalls";
import Fan from "../assets/images/spinner.svg?react";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { accessToken, setAccessToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRefreshToken = async () => {
      try {
        if (!accessToken && !sessionStorage.getItem("reloading")) {
          const newAccessToken = await apiCall.refreshToken();
          if (newAccessToken) {
            setAccessToken(newAccessToken as string);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log("Token refresh failed:", error);
      } finally {
        setLoading(false);
      }
    };

    getRefreshToken();
  }, [accessToken]);

  if (loading)
    return (
      <div className="pending">
        <Fan height="4rem" width="4rem" />
      </div>
    );

  return accessToken ? children : <Navigate to="/sign_in" replace />;
}
