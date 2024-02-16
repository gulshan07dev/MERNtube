import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Logo from "../CoreUI/Logo";
import Input from "../CoreUI/Input";
import Button from "../CoreUI/Button";
import FileUpload from "../FileUpload";
import ErrorMessage from "../error/ErrorMessage";
import Devider from "../Divider";

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
      {error && <ErrorMessage errorMessage={error} />}

      <form
        onSubmit={handleFormSubmit}
        className="w-full shadow-3xl bg-white dark:bg-[#121212] border border-slate-300 dark:border-[#252525] rounded-xl md:py-8 py-7 pb-12 md:px-5 px-3.5 flex flex-col gap-7"
      >
        <div className="flex flex-col gap-1 items-center mb-5">
          <Logo className="md:w-32" />
          <h1 className="text-xl font-medium text-gray-700 dark:text-white font-hedvig_letters">
            {title}
          </h1>
        </div>

        {type === AuthFormType.SIGNUP ? (
          <>
            {/* avatar and cover image */}
            <div className="w-full flex flex-col items-center -mt-7">
              <FileUpload
                label="Cover Image"
                defaultImageSrc="/default-cover.png"
                accept=".png, .jpeg, .jpg"
                fileType="image"
                ref={coverImageRef}
                className="h-24 w-full rounded-md object-cover border-2 border-dashed border-blue-500 overflow-hidden"
                onChange={(file) =>
                  setAuthInputs((prev: any) => ({
                    ...prev,
                    coverImage: file,
                  }))
                }
              />
              <FileUpload
                label="Avatar"
                defaultImageSrc="/default-avatar.webp"
                accept=".png, .jpeg, .jpg"
                fileType="image"
                ref={avatarRef}
                className="h-16 w-16 rounded-full object-cover -mt-8 border-2 border-white overflow-hidden"
                onChange={(file) =>
                  setAuthInputs((prev: any) => ({
                    ...prev,
                    avatar: file,
                  }))
                }
              />
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

        <div className="flex justify-between items-center md:gap-4 gap-2 mt-5">
          {/* link */}

          <button
            type="button"
            className="w-1/2 text-sm max-sm:text-[13.5px] text-gray-600 hover:text-gray-800 font-medium font-Noto_sans"
          >
            {type === AuthFormType.LOGIN ? (
              <Link to="/auth/signup">Don't have an account?</Link>
            ) : (
              <Link to="/auth/login">Already have an account?</Link>
            )}
          </button>

          <Devider type="vertical" className="bg-zinc-300" />

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
            className="rounded-md md:w-[45%] w-1/2 max-sm:text-[13px]"
          />
        </div>
      </form>
    </div>
  );
}
