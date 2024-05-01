import { useSelector } from "react-redux";

import Layout from "@/layout/Layout";
import UpdateAccountDetailsForm from "@/component/accountForms/UpdateAccountDetailsForm";
import UpdatePasswordForm from "@/component/accountForms/UpdatePasswordForm";
import Tabs from "@/component/Tabs";
import { RootState } from "@/store/store";
import Loader from "@/component/Loader";

export default function Account() {
  const { isAppLoading } = useSelector((state: RootState) => state.appLoading);

  const tabs = [
    { label: "Account", component: <UpdateAccountDetailsForm /> },
    { label: "Password", component: <UpdatePasswordForm /> },
  ];

  return (
    <Layout className="flex justify-center items-center">
      {isAppLoading ? <Loader /> : <Tabs tabs={tabs} />}
    </Layout>
  );
}
