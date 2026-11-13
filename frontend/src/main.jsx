import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import { AuthLayout } from "./components";
import {
  ChangePasswordPage,
  ChatPage,
  EmailPage,
  HistoryPage,
  HomePage,
  LoginPage,
  OTPPage,
  SignUpPage,
} from "./pages";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <AuthLayout isAuthReuired={false}>
            <HomePage />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout isAuthReuired={false}>
            <SignUpPage />
          </AuthLayout>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayout isAuthReuired={false}>
            <LoginPage />
          </AuthLayout>
        ),
      },
      {
        path: "/history",
        element: (
          <AuthLayout isAuthReuired={true}>
            <HistoryPage />
          </AuthLayout>
        ),
      },
      {
        path: "/chat/:chatId",
        element: (
          <AuthLayout isAuthReuired={false}>
            <ChatPage />
          </AuthLayout>
        ),
      },
      {
        path: "/forget-password",
        element: (
          <AuthLayout isAuthReuired={false}>
            <EmailPage />
          </AuthLayout>
        ),
      },
      {
        path: "/otp-verify",
        element: (
          <AuthLayout isAuthReuired={false}>
            <OTPPage />
          </AuthLayout>
        ),
      },
      {
        path: "/change-password",
        element: (
          <AuthLayout isAuthReuired={false}>
            <ChangePasswordPage />
          </AuthLayout>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
