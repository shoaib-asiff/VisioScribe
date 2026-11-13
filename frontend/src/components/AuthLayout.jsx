import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { axiosInstance } from "../axios/axios.js";
import { login } from "../features/authentication/authSlice.js";
import { MainLoading } from "./MainLoading.jsx";

export function AuthLayout({ children, isAuthReuired = false }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = useSelector((state) => state?.auth?.loginStatus);
  const dispatch = useDispatch();
  const isUserFetched = useRef(false);

  useEffect(() => {
    const logger = async () => {
      setIsLoading(true);
      if (!isLoggedIn) {
        try {
          const response = await axiosInstance.get(
            "/api/v1/users/current-user"
          );
          if (response?.status === 200) {
            dispatch(login({ userData: response?.data }));
            isUserFetched.current = true;
          }
        } catch (error) {
          isUserFetched.current = false;
        }
      }
      setIsLoading(false);
      if (isAuthReuired && !(isLoggedIn || isUserFetched.current)) {
        navigate("/login");
      }
    };
    logger();
  }, [isAuthReuired, isLoggedIn, navigate]);
  return isLoading ? <MainLoading /> : <>{children}</>;
}
