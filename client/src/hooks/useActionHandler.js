import { useState } from "react";
import { useDispatch } from "react-redux";
import useApiHandler from "@/helper/apiHandler";

const useActionHandler = (action, options = {}) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAction = async (data) => {
        setIsLoading(true);

        const { isSuccess, error, resData } = await useApiHandler(
            async () => dispatch(action(data)),
            Boolean(options?.loadingMessage),
            { loadingMessage: options?.loadingMessage }
        );

        setError(error);
        setIsLoading(false);
 
        return { isSuccess, error, resData };
    };

    return { handleAction, isLoading, error };
};

export default useActionHandler;
