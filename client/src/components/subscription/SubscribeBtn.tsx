import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { FaChartBar, FaUserPlus } from "react-icons/fa";

import subscriptionService from "@/services/subscriptionService";
import useService from "@/hooks/useService";
import { RootState } from "@/store/store";
import Button from "../CoreUI/Button";

export default function SubscriptionButton({
  channelId,
  isSubscribed,
  onSubscribeToggle,
  className = "",
}: {
  isSubscribed: boolean;
  channelId: string;
  onSubscribeToggle?: () => void;
  className?: string;
}) {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [subscribed, setSubscribed] = useState(isSubscribed);

  const { isLoading, handler: toggleSubscription } = useService(
    subscriptionService.toggleSubscription
  );

  const handleSubscribe = async () => {
    const { success } = await toggleSubscription(channelId);

    if (success) { 
      if (onSubscribeToggle) {
        onSubscribeToggle();
      }
      setSubscribed((prev) => !prev);
    }
  };

  return user?._id !== channelId ? (
    <Button
      icon={<FaUserPlus />}
      isLarge={false}
      disabled={isLoading}
      className={twMerge(
        "text-base max-sm:text-sm text-white bg-[#f10b64] px-4 rounded-full",
        className
      )}
      onClick={handleSubscribe}
    >
      {isLoading
        ? subscribed
          ? "Unsubscribing"
          : "Subscribing"
        : subscribed
        ? "Unsubscribe"
        : "Subscribe"}
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
