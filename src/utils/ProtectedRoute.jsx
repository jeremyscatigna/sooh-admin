import React from "react";
import { Navigate, redirect } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
const ProtectedRoute = ({ children }) => {
    const { user } = useUserAuth();

    console.log("Check user in Private: ", user);
    if (!user) {
        redirect("/signin");
    }
    return children;
};

export default ProtectedRoute;
