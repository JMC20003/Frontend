import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthProtected = ({ children }) => {

  const user = useSelector((state) => state.userReducer)
  
  if (!user?.user_profile || user?.user_profile === undefined) {
    return <Navigate to={{ pathname: "/" }} />;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default AuthProtected;
