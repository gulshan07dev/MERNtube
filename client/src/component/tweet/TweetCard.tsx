import TimeAgo from "react-timeago";
import { IoIosThumbsUp, IoIosChatbubbles } from "react-icons/io";

import { Tweet } from "@/store/slices/tweetSlice";

const TweetCard = ({ data }: { data: Tweet }) => {
  return (
    <div className="lg:w-[75%] w-[95%] border border-slate-300 lg:p-5 p-3">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-gray-500">
          <TimeAgo date={data.createdAt} />
        </p>
      </div>

      {/* Content */}
      <div className="bg-gray-100 p-3 rounded-lg mb-3">
        <p className="text-lg text-gray-800 font-poppins font-medium">
          {data?.content}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-center">
        {/* Like Button */}
        <button className="flex items-center space-x-1 text-gray-600 text-lg hover:text-blue-500 transition-all rounded-full px-3 py-1 hover:bg-slate-100">
          <span className="text-xl">
            <IoIosThumbsUp />
          </span>
          <span>{5}</span>
        </button>

        {/* Comment Button */}
        <button className="flex items-center space-x-1 text-gray-600 text-lg hover:text-blue-500 transition-all rounded-full px-3 py-1 hover:bg-slate-100">
          <span className="text-xl">
            <IoIosChatbubbles />
          </span>
          <span>Comment</span>
        </button>
      </div>
    </div>
  );
};

export default TweetCard;
