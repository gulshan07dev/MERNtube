import { useState } from "react";

interface useFormProps<T> {
  initialFormState: T;
}

const useForm = <T>({ initialFormState }: useFormProps<T>) => {
  const [formData, setFormData] = useState<T>(initialFormState);

  const handleInputChange = (field: keyof T, value: T[keyof T]) => {
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
