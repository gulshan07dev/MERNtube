import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

interface useActionHandlerProps {
  action: any;
  isShowToastMessage?: boolean;
  toastMessages?: {
    loadingMessage?: string;
    successMessage?: string;
    errorMessage?: string;
  };
}

interface handleActionResult {
  r: any;
  isSuccess: boolean;
  error: string | null;
  resData: any;
}

interface ApiResponse {
  payload: {
    success: boolean;
    message?: string;
    errors?: Record<string, { message: string }>;
    data?: any;
  };
}

const useActionHandler = ({
  action,
  isShowToastMessage = true,
  toastMessages,
}: useActionHandlerProps) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (
    data?: string | {}
  ): Promise<handleActionResult> => {
    setIsLoading(true);
    setError(null);

    const { loadingMessage, successMessage, errorMessage } =
      toastMessages || {};
    const loadingToast =
      isShowToastMessage && loadingMessage
        ? toast.loading(loadingMessage)
        : null;

    try {
      const res: ApiResponse = await dispatch(action(data));

      if (res?.payload?.success) {
        handleSuccessToast(
          isShowToastMessage,
          successMessage,
          res.payload.message,
          loadingToast
        );

        return {
          isSuccess: true,
          error: null,
          resData: res?.payload?.data || {},
        };
      } else {
        const error = getErrorMessage(
          res?.payload?.errors,
          res?.payload?.message
        );

        handleErrorToast(isShowToastMessage, errorMessage, error, loadingToast);
        setError(error || null);

        return { isSuccess: false, error: error || null, resData: {} };
      }
    } catch (err: any) {
      const error = getErrorMessage(null, err?.message);

      handleErrorToast(isShowToastMessage, errorMessage, error, loadingToast);
      setError(error);

      return { isSuccess: false, error, resData: {} };
    } finally {
      setIsLoading(false);
    }
  };

  return { handleAction, isLoading, error };
};

const handleSuccessToast = (
  isShowToastMessage: boolean,
  successMessage?: string,
  defaultMessage?: string,
  loadingToast?: string | null
) => {
  if (isShowToastMessage && (successMessage || defaultMessage)) {
    toast.success(successMessage || defaultMessage || "Operation successful!", {
      id: loadingToast ? loadingToast : undefined,
    });
  }
};

const getErrorMessage = (
  errors: Record<string, { message: string }> | undefined | null,
  defaultMessage?: string
): string => {
  if (errors && Object.values(errors).length) {
    return Object.values(errors)[0].message;
  }
  return defaultMessage || "Something went wrong!";
};

const handleErrorToast = (
  isShowToastMessage: boolean,
  errorMessage?: string,
  defaultMessage?: string,
  loadingToast?: string | null
) => {
  const error = errorMessage || defaultMessage;
  if (isShowToastMessage && error) {
    toast.error(error, { id: loadingToast ? loadingToast : undefined });
  }
};

export default useActionHandler;
