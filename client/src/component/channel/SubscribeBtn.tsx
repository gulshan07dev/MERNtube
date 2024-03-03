import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useSelector } from "react-redux";

import Button from "../CoreUI/Button";
import useActionHandler from "@/hooks/useActionHandler";
import { toggleSubscription } from "@/store/slices/subscriptionSlice";

import { RootState } from "@/store/store";

export default function SubscribeBtn({
  isSubscribed,
  channelId,
}: {
  isSubscribed: boolean;
  channelId: string;
}) {
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
      icon={FaUserPlus}
      isLarge={false}
      disabled={isLoading}
      className="text-base text-white bg-[#f10b64] px-4 rounded-full mt-2"
      onClick={handleSubscribe}
    >
      {isLoading ? "subscribing..." : subscribed ? "Un subscribe" : "subscribe"}
    </Button>
  ) : (
    <></>
  );
}
