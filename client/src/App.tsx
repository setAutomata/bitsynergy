import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./context/AuthProvider";
import ThemeProvider from "./context/ThemeProvider";
import PrivateRoute from "./authentication/PrivateRoute";
import Layout from "./layout/Layout";
import Home from "./pages/home/Home";
import Signin from "./authentication/Signin";
import Signup from "./authentication/Signup";
import ForgotPassword from "./authentication/ForgotPassword";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      { path: "*", loader: () => redirect("/") },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "sign_in", element: <Signin /> },
      { path: "sign_up", element: <Signup /> },
      { path: "forgot_password", element: <ForgotPassword /> },
    ],
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ToastContainer />
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
