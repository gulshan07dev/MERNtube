import toast from 'react-hot-toast';

export default async function useApiHandler(apiFunction, isShowToastMessage, toastMessages) {
    const { loadingMessage, successMessage, errorMessage } = toastMessages;

    const loadingToast = isShowToastMessage ? toast.loading(loadingMessage) : null;

    try {
        const res = await apiFunction();

        if (res?.payload?.success) {
            isShowToastMessage ? toast.success(successMessage || res.payload.message,
                { id: loadingToast }) : null;

            return { isSuccess: true, error: null, resData: res?.payload?.data }
        } else {
            const error = errorMessage ||
                (Object.values(res?.payload?.errors || {})?.length
                    ? [...Object.values(res?.payload?.errors)]?.[0]?.message
                    : res?.payload?.message)

            toast.error(error, { id: loadingToast });

            return { isSuccess: false, error }
        }

    } catch (err) {
        const error = errorMessage || (err?.message ||
            "Something went wrong, try again")

        toast.error(error, { id: loadingToast });

        return { isSuccess: false, error }
    }
}
