import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Layout from "@/layout/Layout";
import Button from "@/component/Button";
import UpdateAccountDetailsForm from "@/component/accountForms/UpdateAccountDetailsForm";
import UpdatePasswordForm from "@/component/accountForms/UpdatePasswordForm";
import toast from "react-hot-toast";
import useApiHandler from "@/hooks/useApiHandler";
import {
  changeAccountDetails,
  changeUserPassword,
} from "@/store/slices/authSlice";

export default function Account() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [selectedTab, setSelectedTab] = useState("Account");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initialAccountDetails = {
    username: user.username,
    fullName: user.fullName,
  };
  const initialUserPassword = { oldPassword: "", newPassword: "" };

  const handleFormSubmit = async (data, actionType) => {
    if (!Object.values(data).every((field) => field?.trim(" "))) {
      return toast.error("All fields are required!");
    }

    setLoading(true);
    setError(null);

    const { isSuccess, error } = await useApiHandler(
      async () => {
        if (actionType === "account") {
          return dispatch(changeAccountDetails(data));
        } else if (actionType === "password") {
          return dispatch(changeUserPassword(data));
        }
      },
      { loadingMessage: "Updating..." }
    );

    setLoading(false);
    setError(error);
  };

  return (
    <Layout showSidebar={false} className="flex justify-center items-center">
      <div className="max-w-[500px] w-[95%] flex flex-col gap-5">
        {/* ... (Tabs and Buttons) */}
        <div className="bg-slate-100 rounded-lg p-3 flex items-center justify-center">
          <Button
            label="Account"
            className={`w-1/2 rounded-xl text-base border-none ${
              selectedTab === "Account"
                ? "bg-[#000000cb] text-white"
                : "bg-transparent text-black"
            }`}
            isLarge={false}
            disabled={loading}
            onClick={() => setSelectedTab("Account")}
          />
          <Button
            label="Password"
            className={`w-1/2 rounded-xl text-base border-none ${
              selectedTab === "Password"
                ? "bg-[#000000cb] text-white"
                : "bg-transparent text-black"
            }`}
            isLarge={false}
            disabled={loading}
            onClick={() => setSelectedTab("Password")}
          />
        </div>
        {/* form */}
        {selectedTab === "Account" ? (
          // ...account Form)
          <UpdateAccountDetailsForm
            initialAccountDetails={initialAccountDetails}
            onSubmit={(data) => handleFormSubmit(data, "account")}
            isLoading={loading}
            error={error}
          />
        ) : (
          // ...Password Form)
          <UpdatePasswordForm
            initialUserPassword={initialUserPassword}
            onSubmit={(data) => handleFormSubmit(data, "password")}
            isLoading={loading}
            error={error}
          />
        )}
      </div>
    </Layout>
  );
}
