import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useSelector } from "react-redux";

import Button from "../CoreUI/Button";
import useActionHandler from "@/hooks/useActionHandler";
import { toggleSubscription } from "@/store/slices/subscriptionSlice";

export default function SubscribeBtn({ isSubscribed, channelId }) {
  const { user } = useSelector((state) => state.auth);
  const [subscribed, setSubscribed] = useState(isSubscribed);

  const { isLoading, handleAction } = useActionHandler(toggleSubscription);

  const handleSubscribe = async () => {
    const { isSuccess } = await handleAction(channelId);

    if (isSuccess) {
      setSubscribed((prev) => !prev);
    }
  };

  return user._id !== channelId ? (
    <Button
      label={
        isLoading ? "subscribing..." : subscribed ? "Un subscribe" : "subscribe"
      }
      icon={FaUserPlus}
      isLarge={false}
      disabled={isLoading}
      className="text-base text-white bg-[#f10b64] px-4 rounded-full mt-2"
      onClick={handleSubscribe}
    />
  ) : (
    <></>
  );
}
