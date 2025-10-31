import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {

  const user = useSelector((state) => state.userReducer)
    
  if (!user?.user_profile || user?.user_profile === undefined) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return <Navigate to={{ pathname: "/map" }} />;
};

export default PublicRoute;
