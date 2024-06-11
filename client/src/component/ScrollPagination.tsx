import { useEffect } from "react";

import { twMerge } from "tailwind-merge";
import ErrorDialog from "./error/ErrorDialog";
import Button from "./CoreUI/Button";

interface ScrollPaginationProps {
  paginationType: "infinite-scroll" | "view-more";
  loadNextPage: () => void;
  refreshHandler: () => void;
  dataLength: number;
  loading: boolean;
  error?: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  endMessage?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const ScrollPagination = ({
  paginationType = "infinite-scroll",
  loadNextPage,
  refreshHandler,
  dataLength,
  loading,
  error,
  currentPage,
  totalItems,
  totalPages,
  hasNextPage,
  endMessage,
  children,
  className,
}: ScrollPaginationProps) => {
  const handleScroll = (e: any) => {
    if (loading || currentPage >= totalPages || !hasNextPage) {
      return;
    }

    const scrollHeight = e.target.documentElement.scrollHeight;
    const currentHeight =
      e.target.documentElement.scrollTop + window.innerHeight;

    if (currentHeight + 1 >= scrollHeight) {
      loadNextPage();
    }
  };

  useEffect(() => {
    if (paginationType === "infinite-scroll") {
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [currentPage, loading, hasNextPage, totalPages]);

  return (
    <div className={twMerge("w-full flex flex-col gap-3", className)}>
      {error ? (
        <ErrorDialog
          errorMessage={error}
          buttonLabel="Try again"
          buttonOnClick={refreshHandler}
        />
      ) : (
        <>
          {children}
          {dataLength >= totalItems &&
            totalItems > 0 &&
            endMessage &&
            endMessage}
          {paginationType === "view-more" &&
            dataLength !== totalItems &&
            hasNextPage &&
            !loading && (
              <Button
                onClick={loadNextPage}
                className="mt-2 bg-slate-200 dark:bg-[#171717] rounded-full text-sm font-hedvig_letters border-slate-300 dark:border-[#202020] text-black dark:text-white"
              >
                "Load More"
              </Button>
            )}
          {loading && (
            <div className="w-full flex justify-center mb-5 max-md:mt-3">
              <div className="w-14 h-14 rounded-full bg-none border-[3px] border-t-0 border-r-0 border-violet-500 animate-spin duration-700" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScrollPagination;
