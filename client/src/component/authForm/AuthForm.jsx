import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

import Logo from "../Logo";
import Input from "./Input";
import Button from "../Button";

export default function AuthForm({
  isLogin,
  title,
  handleSubmit,
  isLoading,
  error,
  state,
}) {
  const [authInputs, setAuthInputs] = useState({
    fullName: "",
    email: "",
    usernameOrEmail: "",
    password: "",
    avatar: "",
    coverImage: "",
  });

  const avatarRef = useRef(null);
  const coverImageRef = useRef(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    handleSubmit(authInputs);
  };

  useEffect(() => {
    if (state) {
      setAuthInputs((prev) => ({ ...prev, ...state }));
    }
  }, []);

  return (
    <div className="flex flex-col gap-3 justify-center w-[450px] max-w-[96%]">
      {/* showing error */}
      {error && (
        <div className="w-full flex gap-2 items-center border border-red-600 bg-red-50 shadow-sm rounded-sm p-2 ">
          <p className="text-red-600 text-base font-nunito w-full">{error}</p>
          <FiAlertTriangle className="text-xl text-red" />
        </div>
      )}

      <form
        onSubmit={handleFormSubmit}
        className="w-full shadow-3xl bg-white border border-slate-300 rounded-xl md:py-8 py-7 pb-12 md:px-5 px-3.5 flex flex-col gap-7"
      >
        <div className="flex flex-col gap-1 items-center mb-5">
          <Logo className="md:w-32" />
          <h1 className="text-xl font-medium text-gray-700 font-poppins">
            {title}
          </h1>
        </div>

        {!isLogin ? (
          <>
            {/* avatar and cover image */}
            <div className="w-full flex flex-col items-center -mt-7">
              <div
                className="h-24 w-full rounded-md object-cover overflow-hidden"
                role="button"
                onClick={() => coverImageRef.current.click()}
              >
                <img
                  src={
                    authInputs.coverImage
                      ? URL.createObjectURL(authInputs.coverImage)
                      : "/default-cover.png"
                  }
                  alt="avatar"
                />
                <Input
                  label="Cover Image"
                  type="file"
                  onChange={(e) =>
                    setAuthInputs((prev) => ({
                      ...prev,
                      coverImage: e.target.files[0],
                    }))
                  }
                  isOptional={true}
                  accept=".png, .jpeg, .jpg"
                  hidden={true}
                  ref={coverImageRef}
                />
              </div>

              <div
                className="h-16 w-16 rounded-full object-cover -mt-8 border-2 border-white overflow-hidden"
                role="button"
                onClick={() => avatarRef.current.click()}
              >
                <img
                  src={
                    authInputs.avatar
                      ? URL.createObjectURL(authInputs.avatar)
                      : "/default-avatar.webp"
                  }
                  alt="avatar"
                />
                <Input
                  label="Avatar"
                  type="file"
                  onChange={(e) =>
                    setAuthInputs((prev) => ({
                      ...prev,
                      avatar: e.target.files[0],
                    }))
                  }
                  isOptional={true}
                  accept=".png, .jpeg, .jpg"
                  hidden={true}
                  ref={avatarRef}
                />
              </div>
            </div>

            {/* full name */}
            <Input
              label="Full Name"
              type="text"
              value={authInputs.fullName}
              onChange={(e) =>
                setAuthInputs((prev) => ({
                  ...prev,
                  fullName: e.target.value,
                }))
              }
            />

            {/* email */}
            <Input
              label="email"
              type="email"
              value={authInputs.email}
              onChange={(e) =>
                setAuthInputs((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </>
        ) : (
          //  email or Username
          <Input
            label="Username or Email"
            type="text"
            value={authInputs.usernameOrEmail}
            onChange={(e) =>
              setAuthInputs((prev) => ({
                ...prev,
                usernameOrEmail: e.target.value,
              }))
            }
          />
        )}

        {/* password */}
        <Input
          label="Password"
          type="password"
          value={authInputs.password}
          onChange={(e) =>
            setAuthInputs((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
        />

        <div className="flex justify-between items-center mt-5">
          {/* link */}
          <button
            type="button"
            className="text-sm text-gray-600 hover:text-gray-800 font-medium font-Noto_sans"
          >
            {isLogin ? (
              <Link to="/auth/signup">Don't have an account?</Link>
            ) : (
              <Link to="/auth/login">Already have an account?</Link>
            )}
          </button>

          <Button
            label={
              isLogin
                ? isLoading
                  ? "Processing..."
                  : "Login your account"
                : isLoading
                ? "Processing..."
                : "Create your account"
            }
            type="submit"
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
}
