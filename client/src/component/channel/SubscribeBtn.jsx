import { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import Button from "../Button";
import useApiHandler from "@/hooks/useApiHandler";
import { toggleSubscription } from "@/store/slices/subscriptionSlice";

export default function SubscribeBtn({ isSubscribed, channelId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(isSubscribed)

  const handleSubscribe = async () => {
    setLoading(true);

    const { isSuccess } = await useApiHandler(
      async () => dispatch(toggleSubscription(channelId)),
      false,
      {}
    );

    if (isSuccess) {
      setLoading(false);
      setSubscribed((prev) => !prev)
    }
  };

  return user._id !== channelId ? (
    <Button
      label={
        loading ? "subscribing..." : subscribed ? "Un subscribe" : "subscribe"
      }
      icon={FaUserPlus}
      isLarge={false}
      disabled={loading}
      className="text-base text-white bg-[#f10b64] px-4 rounded-full mt-2"
      onClick={handleSubscribe}
    />
  ) : null;
}
