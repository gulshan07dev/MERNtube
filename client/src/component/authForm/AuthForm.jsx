import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import Input from "./Input";

export default function AuthForm({ isLogin, title, handleSubmit, isLoading }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [coverImage, setCoverImage] = useState("");
  console.log(avatar);
  const avatarRef = useRef(null);
  const coverImageRef = useRef(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    handleSubmit({
      email,
      usernameOrEmail,
      password,
      fullName,
      avatar,
      coverImage,
    });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="w-[450px] max-w-[96%] shadow-3xl bg-white border border-slate-300 rounded-xl md:p-8 py-7 pb-12 px-5 flex flex-col gap-7"
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
                  coverImage
                    ? URL.createObjectURL(coverImage)
                    : "/default-cover.png"
                }
                alt="avatar"
              />
              <Input
                label="Cover Image"
                type="file"
                onChange={(e) => setCoverImage(e.target.files[0])}
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
                  avatar ? URL.createObjectURL(avatar) : "/default-avatar.webp"
                }
                alt="avatar"
              />
              <Input
                label="Avatar"
                type="file"
                onChange={(e) => setAvatar(e.target.files[0])}
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
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          {/* email */}
          <Input
            label="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </>
      ) : (
        //  email or Username
        <Input
          label="Username or Email"
          type="text"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
        />
      )}

      {/* password */}
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex justify-between items-center mt-5">
        {/* link */}
        <button
          type="button"
          className="text-sm text-gray-600 hover:text-gray-800 font-medium font-Noto_s"
        >
          {isLogin ? (
            <Link to="/auth/signup">Don't have an account?</Link>
          ) : (
            <Link to="/auth/login">Already have an account?</Link>
          )}
        </button>

        {/* submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-3 rounded-sm bg-[#ff1cf4] hover:opacity-60 transition-[background] text-white font-medium font-poppins disabled:opacity-60"
        >
          {isLogin
            ? isLoading
              ? "Processing..."
              : "Login your account"
            : isLoading
            ? "Processing..."
            : "Create your account"}
        </button>
      </div>
    </form>
  );
}
