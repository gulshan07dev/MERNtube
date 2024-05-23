import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { abbreviateNumber } from "js-abbreviation-number";

import videoService from "@/services/videoService";
import useService from "@/hooks/useService";
import { IVideo } from "@/interfaces";
import DeleteVideoDialog from "../video/DeleteVideoDialog";
import UpdateVideoDialog from "../video/UpdateVideoDialog";
import ToggleButton from "../CoreUI/ToggleButton";
import Button from "../CoreUI/Button";
import { Link } from "react-router-dom";

export default function ChannelVideosTableRow({ video }: { video: IVideo }) {
  const [videoDetails, setVideoDetails] = useState(video);
  const [modalOpen, setModalOpen] = useState<
    "update_video_dialog" | "delete_video_dialog" | null
  >(null);
  const [isVideoDeleted, setIsVideoDeleted] = useState(false);

  const {
    isLoading: isTogglingVideoStatus,
    handler: toggleVideoPublishStatus,
  } = useService(videoService.toggleVideoPublishStatus, {
    isShowToastMessage: true,
    toastMessages: {
      loadingMessage: `toggling video status to ${!videoDetails?.isPublished}`,
    },
  });

  const handleToggleVideoPublishStatus = async () => {
    setVideoDetails((prev) => ({ ...prev, isPublished: !prev.isPublished }));
    const { success } = await toggleVideoPublishStatus(videoDetails?._id);
    if (!success) {
      setVideoDetails((prev) => ({ ...prev, isPublished: !prev.isPublished }));
    }
  };

  if (isVideoDeleted) {
    return null;
  }

  return (
    <tr className="bg-white border-b dark:bg-gray-800 whitespace-nowrap dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark_bg">
      {/* toggle video status button */}
      <td className="px-6 py-4">
        <ToggleButton
          value={videoDetails?.isPublished}
          onChange={handleToggleVideoPublishStatus}
          disabled={isTogglingVideoStatus}
          aria-label={videoDetails?.isPublished ? "Published" : "Unpublished"}
        />
      </td>
      {/* video status */}
      <td className="px-6 py-4">
        {videoDetails?.isPublished ? (
          <span className="py-1.5 px-4 rounded-full border dark:border-slate-500 text-green-500 bg-green-50 dark:bg-transparent">
            Published
          </span>
        ) : (
          <span className="py-1.5 px-4 rounded-full border dark:border-slate-500 text-red-500 bg-red-50 dark:bg-transparent">
            Un Published
          </span>
        )}
      </td>
      {/* video */}
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        <div className="flex items-center gap-2">
          <img
            src={videoDetails?.thumbnail}
            alt="Video Thumbnail"
            className="h-4 w-8"
          />
          <Link
            to={`/watch/${videoDetails?._id}`}
            className="hover:text-blue-600"
          >
            <p>{videoDetails?.title}</p>
          </Link>
        </div>
      </th>
      {/* rating - likes */}
      <td className="px-6 py-4">
        <span className="py-1.5 px-4 rounded-full border dark:border-slate-500 text-green-500 bg-green-50 dark:bg-transparent">
          {abbreviateNumber(videoDetails?.videoLikesCount || 0, 1)} likes
        </span>
      </td>
      {/* uploaded date */}
      <td className="px-6 py-4">
        {new Date(videoDetails?.createdAt).toLocaleDateString("en-GB")}
      </td>
      {/* video edit and delete button */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          <Button
            btnType="icon-btn"
            aria-label="Edit Video"
            onClick={() => setModalOpen("update_video_dialog")}
          >
            <FaEdit />
          </Button>
          <UpdateVideoDialog
            open={modalOpen === "update_video_dialog"}
            handleClose={() => setModalOpen(null)}
            video={videoDetails}
            onUpdate={(video) => {
              setVideoDetails(video);
            }}
          />

          <Button
            btnType="icon-btn"
            aria-label="Delete Video"
            onClick={() => setModalOpen("delete_video_dialog")}
          >
            <FaTrash />
          </Button>
          <DeleteVideoDialog
            open={modalOpen === "delete_video_dialog"}
            handleClose={() => setModalOpen(null)}
            videoId={videoDetails?._id}
            onDelete={(isVideoDeleted) => setIsVideoDeleted(isVideoDeleted)}
          />
        </div>
      </td>
    </tr>
  );
}
