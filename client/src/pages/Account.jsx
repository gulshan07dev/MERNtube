import { useState } from "react";

import Layout from "@/layout/Layout";
import Button from "@/component/Button";
import UpdateAccountDetailsForm from "@/component/accountForms/UpdateAccountDetailsForm";
import UpdatePasswordForm from "@/component/accountForms/UpdatePasswordForm";

export default function Account() {
  const [selectedTab, setSelectedTab] = useState("Account");
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
            onClick={() => setSelectedTab("Password")}
          />
        </div>
        {/* form */}
        {selectedTab === "Account" ? (
          <UpdateAccountDetailsForm />
        ) : (
          <UpdatePasswordForm />
        )}
      </div>
    </Layout>
  );
}
