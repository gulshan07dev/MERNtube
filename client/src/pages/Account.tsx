import { useSelector } from "react-redux";

import Layout from "@/layout/Layout";
import UpdateAccountDetailsForm from "@/component/accountForms/UpdateAccountDetailsForm";
import UpdatePasswordForm from "@/component/accountForms/UpdatePasswordForm";
import Tabs from "@/component/Tabs";
import { RootState } from "@/store/store";
import Loader from "@/component/Loader";

export default function Account() {
  const { user: appLoading } = useSelector(
    (state: RootState) => state.appLoading
  );

  const tabs = [
    { label: "Account", component: <UpdateAccountDetailsForm /> },
    { label: "Password", component: <UpdatePasswordForm /> },
  ];

  return appLoading ? (
    <Loader />
  ) : (
    <Layout className="flex justify-center md:items-center max-md:mt-16">
      <Tabs tabs={tabs} />
    </Layout>
  );
}
