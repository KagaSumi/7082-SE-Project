"use client";

import React from "react";
import { useAuth } from "../components/AuthContext";
import RightSidebar from "../components/RightSidebar";

export default function HomeClient() {
  const { isLoggedIn } = useAuth();
  return <RightSidebar isLoggedIn={isLoggedIn} />;
}
