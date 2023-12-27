import toast from 'react-hot-toast'

export default async function useApiHandler(apiFunction, message) {
    const { loadingMessage, successMessage, errorMessage } = message;

    const loadingToast = toast.loading(loadingMessage);

    try {
        const res = await apiFunction();

        if (res.payload.success) {
            toast.success(successMessage || res.payload.message, { id: loadingToast });
        } else {
            toast.error(
                errorMessage ||
                (Object.values(res.payload.errors).length
                    ? [...Object.values(res.payload.errors)][0].message
                    : res.payload.message), { id: loadingToast });
        }

    } catch (error) {
        toast.error(errorMessage || (error.message || "something went wrong, try again"), { id: loadingToast });
    }
}
