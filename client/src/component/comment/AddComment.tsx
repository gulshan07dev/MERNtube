import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import commentService from "@/services/commentService";
import useService from "@/hooks/useService";
import { ITweetComment, IVideoComment } from "@/interfaces";
import { RootState } from "@/store/store";
import Avatar from "../CoreUI/Avatar";
import Button from "../CoreUI/Button";
import useForm from "@/hooks/useForm";
import AutoExpandingTextarea from "../CoreUI/AutoExpandingTextarea";

interface AddCommentProps {
  contentId: string;
  type: "tweet" | "video";
  setComments: React.Dispatch<
    React.SetStateAction<(IVideoComment | ITweetComment)[]>
  >;
}

const AddComment: React.FC<AddCommentProps> = ({
  contentId,
  type,
  setComments,
}) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state?.auth);

  const { formData, handleInputChange, resetForm } = useForm({
    initialFormState: { content: "" },
  });

  const { isLoading: isAddingCommentToVideo, handler: addCommentToVideo } =
    useService(commentService.addCommentToVideo, {
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Adding comment..." },
    });

  const { isLoading: isAddingCommentToTweet, handler: addCommentToTweet } =
    useService(commentService.addCommentToTweet, {
      isShowToastMessage: true,
      toastMessages: { loadingMessage: "Adding comment" },
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (type === "video") {
      const { success, responseData } = await addCommentToVideo({
        videoId: contentId,
        data: formData,
      });
      if (success) {
        resetForm();
        setComments((prevComments) => [
          { ...responseData?.data?.comment },
          ...prevComments,
        ]);
      }
    }

    if (type === "tweet") {
      const { success, responseData } = await addCommentToTweet({
        tweetId: contentId,
        data: formData,
      });
      if (success) {
        resetForm();
        setComments((prevComments) => [
          { ...responseData?.data?.comment },
          ...prevComments,
        ]);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1">
      <div
        className={twMerge(
          "group flex items-center focus-within:items-start gap-3 py-1.5",
          formData?.content?.length && ["items-start"]
        )}
      >
        <Avatar
          url={user?.avatar}
          fullName={user?.fullName}
          onClick={() => navigate(`/c/${user?.username}`)}
          className={twMerge(
            "h-6 w-6 group-focus-within:h-10 group-focus-within:w-10",
            formData?.content?.length && ["h-10 w-10"]
          )}
        />
        <AutoExpandingTextarea
          name="content"
          placeholder="Type your comment..."
          autoComplete="off"
          value={formData.content}
          onChange={(e) => handleInputChange("content", e.target.value)}
          className="peer flex-grow pb-2 border-t-0 border-l-0 border-r-0 border-b border-slate-200 dark:border-slate-500 placeholder-slate-600 dark:placeholder-slate-400 text-gray-700 dark:text-white text-sm font-roboto focus:border-b-black dark:focus:border-b-white transition-[border] duration-100"
        />
      </div>
      {formData?.content?.length > 0 && (
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            onClick={resetForm}
            isLarge={false}
            className="py-1.5 px-6 text-[15px] rounded-full bg-[#212121] hover:bg-[#505050]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLarge={false}
            className={"py-1.5 px-6 text-[15px] rounded-full"}
            disabled={
              type === "video" ? isAddingCommentToVideo : isAddingCommentToTweet
            }
          >
            {(
              type === "video" ? isAddingCommentToVideo : isAddingCommentToTweet
            )
              ? "Adding comment..."
              : "Comment"}
          </Button>
        </div>
      )}
    </form>
  );
};

export default AddComment;
