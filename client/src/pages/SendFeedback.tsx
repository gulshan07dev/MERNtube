import { FiSend } from "react-icons/fi";

import Layout from "@/layout/Layout";
import useForm from "@/hooks/useForm";
import Form from "@/component/CoreUI/Form";
import Input from "@/component/CoreUI/Input";
import TextAreaInput from "@/component/CoreUI/TextAreaInput";

export default function SendFeedback() {
  const { formData, handleInputChange, resetForm } = useForm({
    initialFormState: {
      name: "",
      email: "",
      query: "",
    },
  });

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Reset form fields after submission
    resetForm();
  };

  return (
    <Layout
      byDefaultSidebarHidden={true}
      className="min-h-full flex items-start justify-between lg:gap-10 gap-12 lg:px-14 lg:py-10 max-lg:flex-col p-5 pt-12 pb-20 w-full bg-[linear-gradient(to_right,#eeeeee_1px,transparent_1px),linear-gradient(to_bottom,#eeeeee_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#5e5e5e,transparent_1px),linear-gradient(to_bottom,#5e5e5e,transparent_1px)] bg-[size:50px_50px] bg-fixed before:content-[''] before:fixed before:z-0 before:h-[90vh] before:w-[12vw] max-md:before:w-[25vw] before:bg-gradient-to-tr before:from-violet-400 before:via-violet-500 before:to-violet-300 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:blur-3xl before:rotate-45 before:opacity-25 dark:before:opacity-35"
    >
      <div className="lg:w-1/2 w-full flex flex-col gap-12 items-start justify-center lg:sticky lg:top-20 h-fit">
        <p className="text-2xl max-md:text-lg font-extralight bg-gradient-to-tl from-gray-500 via-gray-600 to-gray-700 dark:from-slate-50 dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
          We value your feedback and insights into your experience with
          Merntube. If you've encountered any issues, bugs, or if there's a
          feature you believe could enhance your usage of our platform, we want
          to hear from you!
        </p>
        <p className="text-3xl max-md:text-xl font-extrabold bg-gradient-to-tr from-violet-300 via-violet-400 to-violet-500 bg-clip-text text-transparent">
          Your feedback helps us improve and tailor Merntube to better meet your
          needs. Don't hesitate to share any thoughts or suggestions you may
          have. Together, let's make Merntube even better!
        </p>
      </div>
      <div className="relative dark:static  w-full lg:w-[45%] max-lg:max-w-[600px]">
        <Form
          title="Send Feedback"
          description="Share Your Experience with Merntube!"
          inputs={
            <>
              <Input
                label="Name"
                type="text"
                value={formData?.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={formData?.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <TextAreaInput
                label="Query"
                value={formData?.query}
                rows={5}
                onChange={(e) => handleInputChange("query", e.target.value)}
              />
            </>
          }
          submitButtonLabel={"Send Feedback"}
          submitButtonIcon={<FiSend />}
          onSubmit={handleSubmit}
          isLoading={false}
        />
      </div>
    </Layout>
  );
}
