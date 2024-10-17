import React from "react";
import { Routes, Route } from "react-router-dom";
import EmptyLayout from "@/layout/EmptyLayout";
import Login from "./login";
import Signup from "./signup";

const SignInSignUp = () => {
  return (
    <EmptyLayout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </EmptyLayout>
  );
};

export default SignInSignUp;
