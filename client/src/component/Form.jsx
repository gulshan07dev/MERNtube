import { FiAlertTriangle } from "react-icons/fi";

import Button from "./Button";

export default function Form({
  title,
  description,
  inputs,
  submitButtonLabel,
  onSubmit,
  isLoading,
  error
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="py-7 px-9 border flex flex-col gap-7"
    >
      <div className="flex flex-col gap-[2px]">
        <h1 className="text-zinc-950 text-2xl font-roboto font-[600]">
          {title}
        </h1>
        <p className="text-zinc-700 text-lg font-poppins leading-5">
          {description}
        </p>
      </div> 
      {error && (
        <div className="w-full flex gap-2 items-center border border-red-600 bg-red-50 shadow-sm rounded-sm p-2 ">
          <p className="text-red-600 text-base font-nunito w-full">{error}</p>
          <FiAlertTriangle className="text-xl text-red" />
        </div>
      )}
      {inputs}
      <Button
        label={isLoading ? "Loading..." : submitButtonLabel}
        type="submit"
        disabled={isLoading}
        className="w-fit px-8 text-base"
      />
    </form>
  );
}
