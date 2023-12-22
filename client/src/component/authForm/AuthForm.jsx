import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import Input from "./Input";

export default function AuthForm({ isLogin, handleSubmit }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Call the provided handleSubmit function with form data
    handleSubmit({ email, password, fullName });
  };

  return (
    <div className="w-[450px] max-w-[96%]  border border-slate-300 rounded-xl md:p-8 py-7 pb-12 px-5 flex flex-col gap-7">
      <div className="flex flex-col gap-1 items-center mb-5">
        <Logo className="md:w-32" />
        <h1 className="text-xl font-medium text-gray-700 font-poppins">
          {isLogin ? "Login account" : "Create an account"}
        </h1>
      </div>
      {!isLogin && (
        <Input
          label="Full Name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      )}

      {/* email or Username */}
      <Input
        label={isLogin ? "Username or Email" : "Email"}
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* password */}
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex justify-between items-center mt-7">
        {/* link */}
        <button className="text-sm text-gray-600 hover:text-gray-800 font-medium font-Noto_s">
          {isLogin ? (
            <Link to="/auth/signup">Don't have an account?</Link>
          ) : (
            <Link to="/auth/login">Already have an account?</Link>
          )}
        </button>

        {/* submit */}
        <button
          type="submit"
          onClick={handleFormSubmit}
          className="px-4 py-3 rounded-sm bg-[#ff1cf4] hover:opacity-60 transition-[background] text-white font-medium font-poppins"
        >
          {isLogin ? "Login your account" : "Create your account"}
        </button>
      </div>
    </div>
  );
}
