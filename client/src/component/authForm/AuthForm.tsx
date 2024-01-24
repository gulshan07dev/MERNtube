import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";

import Logo from "../CoreUI/Logo";
import Input from "../CoreUI/Input";
import Button from "../CoreUI/Button";
import FileUpload from "../FileUpload";

interface AuthFormProps {
  type: AuthFormType;
  title: string;
  handleSubmit: (formData: AuthInputs) => void;
  isLoading: boolean;
  error?: string | null;
  state?: {};
}

interface AuthInputs {
  fullName?: string;
  email?: string;
  usernameOrEmail?: string;
  password?: string;
  avatar?: File;
  coverImage?: File;
}

export enum AuthFormType {
  LOGIN,
  SIGNUP,
}

export default function AuthForm({
  type,
  title,
  handleSubmit,
  isLoading,
  error,
  state,
}: AuthFormProps) {
  const [authInputs, setAuthInputs] = useState<AuthInputs>({
    fullName: "",
    email: "",
    usernameOrEmail: "",
    password: "",
    avatar: undefined,
    coverImage: undefined,
  });

  const avatarRef = useRef<HTMLInputElement | null>(null);
  const coverImageRef = useRef<HTMLInputElement | null>(null);

  const handleFormSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    handleSubmit(authInputs);
  };

  useEffect(() => {
    if (state) {
      setAuthInputs((prev) => ({ ...prev, ...state }));
    }
  }, [state]);

  return (
    <div className="flex flex-col gap-3 justify-center w-[450px] max-w-[93%]">
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

        {type === AuthFormType.SIGNUP ? (
          <>
            {/* avatar and cover image */}
            <div className="w-full flex flex-col items-center -mt-7">
              {/* <div
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
                  alt="coverImage"
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
              </div> */}

              <FileUpload 
                label="Cover Image"
                defaultImageSrc="/default-cover.png"
                accept=".png, .jpeg, .jpg"
                fileType="image"
                ref={coverImageRef}
                className="h-24 w-full rounded-md object-cover overflow-hidden"
                onChange={(file) =>
                  setAuthInputs((prev: any) => ({
                    ...prev,
                    coverImage: file,
                  }))
                }
              />

              {/* <div
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setAuthInputs((prev: any) => ({
                      ...prev,
                      avatar: e.target.files?.[0],
                    }))
                  }
                  isOptional={true}
                  accept=".png, .jpeg, .jpg"
                  hidden={true}
                  ref={avatarRef}
                /> 
              </div> */}
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
            {type === AuthFormType.LOGIN ? (
              <Link to="/auth/signup">Don't have an account?</Link>
            ) : (
              <Link to="/auth/login">Already have an account?</Link>
            )}
          </button>

          <Button
            label={
              type === AuthFormType.LOGIN
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
