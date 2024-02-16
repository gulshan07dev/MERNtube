import Button from "./Button";
import ErrorMessage from "../error/ErrorMessage";

interface FormProps {
  title: string;
  description: string;
  inputs: React.ReactNode;
  submitButtonLabel: string;
  submitButtonIcon?: React.ReactElement;
  isSubmitButtonPositionLeft?: boolean;
  isButtonDisabled?: boolean;
  onSubmit: () => void;
  isLoading: boolean | undefined;
  error?: string | null;
}

export default function Form({
  title,
  description,
  inputs,
  submitButtonLabel,
  submitButtonIcon,
  isSubmitButtonPositionLeft = true,
  isButtonDisabled,
  onSubmit,
  isLoading,
  error,
}: FormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="py-7 md:px-9 px-4 border border-zinc-300 dark:border-[#181818] bg-slate-50 dark:bg-[#171717] flex flex-col gap-7"
    >
      <div className="flex flex-col gap-[2px]">
        <h1 className="text-zinc-950 dark:text-white text-2xl font-roboto font-[600]">
          {title}
        </h1>
        <p className="text-zinc-700 dark:text-slate-400 text-lg font-poppins leading-5">
          {description}
        </p>
      </div>
      {error && <ErrorMessage errorMessage={error} />}
      {inputs}
      <Button
        label={isLoading ? "Loading..." : submitButtonLabel}
        type="submit"
        icon={submitButtonIcon}
        disabled={isButtonDisabled}
        className={`w-fit px-8 text-base ${
          isSubmitButtonPositionLeft ? "self-start" : "self-end"
        }`}
      />
    </form>
  );
}
