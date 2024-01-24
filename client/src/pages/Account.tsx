import Layout from "@/layout/Layout";
import UpdateAccountDetailsForm from "@/component/accountForms/UpdateAccountDetailsForm";
import UpdatePasswordForm from "@/component/accountForms/UpdatePasswordForm";
import Tabs from "@/component/Tabs";

export default function Account() {
  const tabs = [
    { label: "Account", component: <UpdateAccountDetailsForm /> },
    { label: "Password", component: <UpdatePasswordForm /> },
  ];

  return (
    <Layout
      showSidebar={false}
      className="flex justify-center md:items-center max-md:mt-16"
    >
      <Tabs tabs={tabs} />
    </Layout>
  );
}
