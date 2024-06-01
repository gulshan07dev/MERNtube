import { useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";

interface ErrorResponse {
  errors?: Record<string, { message: string }> | undefined | null;
  message: string;
  statusCode: number;
  success: boolean;
}

interface ResponseData {
  data: any;
  message: string;
  statusCode: number;
  success: boolean;
}

type ServiceHandler<TArgs extends any[]> = {
  isLoading: boolean;
  error: ErrorResponse | null;
  handler: (...args: TArgs) => Promise<{
    responseData: ResponseData | null;
    success: boolean;
    error: ErrorResponse | null;
  }>;
};

const useService = <TArgs extends any[]>(
  serviceFunction: (...args: TArgs) => Promise<AxiosResponse>,
  options?: {
    isShowToastMessage?: boolean;
    toastMessages?: {
      loadingMessage?: string;
      successMessage?: string;
      errorMessage?: string;
    };
  }
): ServiceHandler<TArgs> => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorResponse, setErrorResponse] = useState<ErrorResponse | null>(
    null
  );

  const handler = async (...args: TArgs) => {
    setIsLoading(true);
    setErrorResponse(null);

    const { loadingMessage, successMessage, errorMessage } =
      options?.toastMessages || {};
    const isShowToastMessage = options?.isShowToastMessage;
    const loadingToast =
      isShowToastMessage && loadingMessage
        ? toast.loading(loadingMessage)
        : null;

    try {
      const response = await serviceFunction(...args);
      const responseData = response.data as ResponseData;

      isShowToastMessage &&
        toast.success(
          successMessage || responseData.message || "Operation successfull",
          { id: loadingToast ? loadingToast : undefined }
        );

      return {
        responseData,
        success: true,
        error: null,
      };
    } catch (err) {
      const error = err as AxiosError;
      const responseError = error.response?.data as ErrorResponse;
      const message =
        responseError?.errors && Object.values(responseError?.errors).length
          ? Object.values(responseError?.errors)[0]?.message
          : responseError?.message || error?.message || "Something went wrong";

      setErrorResponse({
        ...responseError,
        message,
      });

      isShowToastMessage &&
        toast.error(errorMessage || message || "Something went wrong", {
          id: loadingToast ? loadingToast : undefined,
        });

      return {
        responseData: null,
        success: false,
        error: responseError,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error: errorResponse, handler };
};

export default useService;
