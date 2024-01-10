import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Outlet, useParams, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import Layout from "./Layout";
import { getChannel } from "@/store/slices/authSlice";
import useApiHandler from "@/hooks/useApiHandler";
import Avatar from "@/component/Avatar";
import Button from "@/component/Button";
import Skeleton from "@/component/skeleton/Skeleton";

export default function ChannelLayout() {
  const dispatch = useDispatch();
  const { username } = useParams();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchChannel() {
    setLoading(true);
    setError(null);

    const { isSuccess, error, data } = await useApiHandler(
      async () => dispatch(getChannel(username)),
      false,
      {}
    );

    if (isSuccess) {
      setLoading(false);
      setChannel(data.channel);
    }

    if (error) {
      setError(error);
    }
  }

  useEffect(() => {
    fetchChannel();
  }, []);

  return (
    <Layout className="md:px-4 px-2 flex flex-col gap-6">
      {error ? (
        <div>
          <p>{error}</p>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-8">
          <div className="w-full md:h-44 h-28 rounded-2xl overflow-hidden">
            {loading ? (
              <Skeleton className="h-full w-full rounded-2xl" />
            ) : (
              <img
                src={channel?.coverImage?.url || "/default-cover.png"}
                className="w-full h-full object-cover"
                alt="coverImage"
              />
            )}
          </div>
          <div className="flex md:gap-14 gap-5">
            <Avatar
              url={channel?.avatar?.url}
              fullName={channel?.fullName}
              className="md:h-36 h-20 md:w-36 w-20"
            />
            {loading ? (
              <div className="flex flex-col md:gap-4 gap-2">
                <Skeleton className="max-w-[200px] w-64 h-6" />
                <Skeleton className="max-w-[150px] w-44 h-4" />
                <Skeleton className="max-w-[150px] w-44 h-4" />
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <h1
                  className="md:text-4xl text-xl font-bold leading-none"
                  title={channel?.fullName}
                >
                  {channel?.fullName}
                </h1>

                <p className="md:text-lg text-sm text-zinc-800 font-medium leading-none">
                  {channel?.username}
                </p>
                <p className="md:text-lg text-sm text-zinc-800 font-medium leading-none">
                  {channel?.subscriberCount}{" "}
                  {channel?.subscriberCount <= 1 ? "Subscriber" : "Subscribers"}
                  {" • "}
                  {channel?.videoCount}{" "}
                  {channel?.videoCount <= 1 ? "video" : "videos"}
                </p>
              </div>
            )}
          </div>

          {/* channel tabs */}
          <div
            className="flex gap-10 relative after:absolute after:-bottom-2 after:w-full
         after:h-[1px] after:bg-gray-300"
          >
            <Link
              to={`/c/${username}`}
              className={twMerge(
                "text-base text-gray-700 font-medium font-poppins transition-all",
                location.pathname === `/c/${username}` &&
                  "font-semibold relative after:content-[''] after:absolute after:z-[2] after:-bottom-2 after:left-0 after:w-full after:h-[1px] after:bg-black"
              )}
            >
              Home
            </Link>
            <Link
              to={`/c/${username}/videos`}
              className={twMerge(
                "text-base text-gray-700 font-medium font-poppins transition-all",
                location.pathname.includes("/videos") &&
                  "font-semibold relative after:content-[''] after:absolute after:z-[2] after:-bottom-2 after:left-0 after:w-full after:h-[1px] after:bg-black"
              )}
            >
              Videos
            </Link>
            <Link
              to={`/c/${username}/tweets`}
              className={twMerge(
                "text-base text-gray-700 font-medium font-poppins transition-all",
                location.pathname.includes("/tweets") &&
                  "font-semibold relative after:content-[''] after:absolute after:z-[2] after:-bottom-2 after:left-0 after:w-full after:h-[1px] after:bg-black"
              )}
            >
              Tweets
            </Link>
            <Link
              to={`/c/${username}/playlists`}
              className={twMerge(
                "text-base text-gray-700 font-medium font-poppins transition-all",
                location.pathname.includes("/playlists") &&
                  "font-semibold relative after:content-[''] after:absolute after:z-[2] after:-bottom-2 after:left-0 after:w-full after:h-[1px] after:bg-black"
              )}
            >
              Playlists
            </Link>
          </div>
        </div>
      )}
      {!loading && !error && <Outlet />}
    </Layout>
  );
}
