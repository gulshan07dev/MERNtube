import { useState } from "react";
import { useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import { FaChartBar, FaUserPlus } from "react-icons/fa";

import Button from "../CoreUI/Button";
import useActionHandler from "@/hooks/useActionHandler";
import { toggleSubscription } from "@/store/slices/subscriptionSlice";

import { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";

export default function SubscribeBtn({
  isSubscribed,
  channelId,
  className = "",
}: {
  isSubscribed: boolean;
  channelId: string;
  className?: string;
}) {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [subscribed, setSubscribed] = useState(isSubscribed);

  const { isLoading, handleAction } = useActionHandler({
    action: toggleSubscription,
    isShowToastMessage: false,
  });

  const handleSubscribe = async () => {
    const { isSuccess } = await handleAction(channelId);

    if (isSuccess) {
      setSubscribed((prev) => !prev);
    }
  };

  return user?._id !== channelId ? (
    <Button
      icon={<FaUserPlus />}
      isLarge={false}
      disabled={isLoading}
      className={twMerge(
        "text-base text-white bg-[#f10b64] px-4 rounded-full",
        className
      )}
      onClick={handleSubscribe}
    >
      {isLoading ? "subscribing..." : subscribed ? "Un subscribe" : "subscribe"}
    </Button>
  ) : (
    <Button
      className="rounded-full text-[15px] font-roboto py-2"
      isGradientBg
      icon={<FaChartBar size={20} />}
      onClick={() => navigate("/dashboard")}
    >
      Dashboard
    </Button>
  );
}
