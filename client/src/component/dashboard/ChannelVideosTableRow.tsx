import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { abbreviateNumber } from "js-abbreviation-number";
 
import VideoService from "@/services/videoService";
import useService from "@/hooks/useService";
import { Video } from "@/store/slices/videoSlice";
import DeleteVideoDialog from "../video/DeleteVideoDialog";
import UpdateVideoDialog from "../video/UpdateVideoDialog";
import ToggleButton from "../CoreUI/ToggleButton";
import Button from "../CoreUI/Button";

export default function ChannelVideosTableRow({ video }: { video: Video }) {
  const [videoDetails, setVideoDetails] = useState(video);
  const [isUpdateVideoDialogOpen, setIsUpdateVideoDialogOpen] = useState(false);
  const [isDeleteVideoDialogOpen, setIsDeleteVideoDialogOpen] = useState(false);
  const [isVideoDeleted, setIsVideoDeleted] = useState(false);

  const {
    isLoading: isTogglingVideoStatus,
    handler: toggleVideoPublishStatus,
  } = useService(VideoService.toggleVideoPublishStatus, {
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
          <p>{videoDetails?.title}</p>
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
            onClick={() => setIsUpdateVideoDialogOpen(true)}
          >
            <FaEdit />
          </Button>
          <UpdateVideoDialog
            open={isUpdateVideoDialogOpen}
            handleClose={() => setIsUpdateVideoDialogOpen(false)}
            video={videoDetails}
            onUpdate={(video) => {
              setVideoDetails(video);
            }}
          />

          <Button
            btnType="icon-btn"
            aria-label="Delete Video"
            onClick={() => setIsDeleteVideoDialogOpen(true)}
          >
            <FaTrash />
          </Button>
          <DeleteVideoDialog
            open={isDeleteVideoDialogOpen}
            handleClose={() => setIsDeleteVideoDialogOpen(false)}
            videoId={videoDetails?._id}
            onDelete={(isVideoDeleted) => setIsVideoDeleted(isVideoDeleted)}
          />
        </div>
      </td>
    </tr>
  );
}
