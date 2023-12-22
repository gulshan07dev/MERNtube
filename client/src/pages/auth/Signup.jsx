import React from "react";
import Layout from "../../layout/Layout";
import AuthForm from "../../component/authForm/authForm";

export default function Signup() {
  const handleSignup = ({ fullName, email, password }) => {
    console.log("Signing up with:", fullName, email, password);
  };

  return (
    <Layout isShowNavigationBar={false} className="flex justify-center pt-24">
      <AuthForm isLogin={false} handleSubmit={handleSignup} />
    </Layout>
  );
}
