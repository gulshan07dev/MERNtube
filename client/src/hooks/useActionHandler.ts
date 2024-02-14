import { AsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";

interface useActionHandlerProps<
  T extends AsyncThunk<any, any, any> | PayloadAction<any, string, any>
> {
  action: T;
  isShowToastMessage?: boolean;
  toastMessages?: {
    loadingMessage?: string;
    successMessage?: string;
    errorMessage?: string;
  };
}

interface HandleActionResult<T> {
  isSuccess: boolean;
  error: string | null;
  resData: T;
}

const useActionHandler = <
  T extends AsyncThunk<any, any, any> | PayloadAction<any, string, any>
>({
  action,
  isShowToastMessage = true,
  toastMessages,
}: useActionHandlerProps<T>) => {
  const dispatch: AppDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (
    payload?: T extends AsyncThunk<any, infer P, any>
      ? P
      : T extends PayloadAction<any, string, infer P>
      ? P
      : undefined
  ): Promise<HandleActionResult<any>> => {
    setIsLoading(true);
    setError(null);

    const { loadingMessage, successMessage, errorMessage } =
      toastMessages || {};
    const loadingToast =
      isShowToastMessage && loadingMessage
        ? toast.loading(loadingMessage)
        : null;

    try {
      let res;
      if ("payload" in action) {
        res = { payload: payload || null };
      } else {
        res = await dispatch(action(payload));
      }

      if (res && "payload" in res && "success" in res.payload) {
        const resData = res.payload.data;
        handleSuccessToast(
          isShowToastMessage,
          successMessage,
          res.payload.message,
          loadingToast
        );
        return { isSuccess: true, error: null, resData };
      } else {
        const error = getErrorMessage(
          res?.payload?.errors,
          res?.payload?.message
        );
        handleErrorToast(isShowToastMessage, errorMessage, error, loadingToast);
        setError(error || null);
        return { isSuccess: false, error: error || null, resData: {} as any };
      }
    } catch (err: any) {
      const error = getErrorMessage(null, err?.message);
      handleErrorToast(isShowToastMessage, errorMessage, error, loadingToast);
      setError(error);
      return { isSuccess: false, error, resData: {} as any };
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
