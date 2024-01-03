import toast from 'react-hot-toast';

export default async function useApiHandler(apiFunction, toastMessages) {
    const { loadingMessage, successMessage, errorMessage } = toastMessages;

    const loadingToast = toast.loading(loadingMessage);

    try {
        const res = await apiFunction();

        if (res?.payload?.success) {
            toast.success(successMessage || res.payload.message,
                { id: loadingToast });

            return { isSuccess: true, error: null }
        } else {
            const error = errorMessage ||
                (Object.values(res?.payload?.errors)?.length
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
