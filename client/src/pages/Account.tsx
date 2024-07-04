import { useSelector } from "react-redux";

import PageLayout from "@/layouts/PageLayout";
import UpdateAccountDetailsForm from "@/components/accountForms/UpdateAccountDetailsForm";
import UpdatePasswordForm from "@/components/accountForms/UpdatePasswordForm";
import Tabs from "@/components/Tabs";
import { RootState } from "@/store/store";
import Loader from "@/components/Loader";

export default function Account() {
  const { isAppLoading } = useSelector((state: RootState) => state.appLoading);

  const tabs = [
    { label: "Account", components: <UpdateAccountDetailsForm /> },
    { label: "Password", components: <UpdatePasswordForm /> },
  ];

  return (
    <PageLayout className="flex justify-center items-center">
      {isAppLoading ? <Loader /> : <Tabs tabs={tabs} />}
    </PageLayout>
  );
}
