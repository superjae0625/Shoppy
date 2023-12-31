import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireAdmin }) {
    const { user } = useAuthContext();

    if (!user || (requireAdmin && !user.isAdmin)) {
        //navigate to home
        return <Navigate to="/" replace />;
        //"replace" makes sure not to put current path to the history
    }

    //else
    return children;
}
