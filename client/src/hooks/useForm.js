import { useState } from "react";

const useForm = (initialFormState) => {
    const [formData, setFormData] = useState(initialFormState);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData(initialFormState);
    };

    return {
        formData,
        handleInputChange,
        resetForm,
    };
};

export default useForm;
