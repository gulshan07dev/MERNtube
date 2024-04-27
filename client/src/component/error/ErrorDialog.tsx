import Button from "../CoreUI/Button";
import { FiAlertTriangle } from "react-icons/fi";

const ErrorDialog = ({
  errorMessage,
  buttonLabel,
  buttonOnClick,
  icon = <FiAlertTriangle />,
}: {
  errorMessage: string;
  buttonLabel?: string;
  buttonOnClick?: () => void;
  icon?: JSX.Element;
}) => {
  return (
    <div className="px-10 py-14 flex flex-col gap-10 justify-center items-center m-auto">
      <span className="-mt-16 text-7xl text-red-600 shadow-md rounded-full">
        {icon}
      </span>
      <p className="font-bold md:text-3xl text-2xl text-center text-black dark:text-white font-poppins -mt-5">
        {errorMessage}
      </p>
      {buttonLabel && buttonOnClick && (
        <Button
          icon={icon}
          onClick={buttonOnClick}
          className="bg-zinc-600 text-white border-none px-7 py-2.5 rounded-md text-lg font-hedvig_letters"
        >
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorDialog;
